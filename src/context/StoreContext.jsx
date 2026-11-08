/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, COUPONS, EXPRESS_FEE, FREE_SHIPPING_MIN, PRODUCTS, SEED_ORDERS, SEED_USERS, SHIPPING_FEE } from '../data/products'

const StoreContext = createContext(null)

// State that survives page reloads (front-end only, stored in the browser).
function usePersistent(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable */
    }
  }, [key, value])
  return [value, setValue]
}

export function StoreProvider({ children }) {
  const [products, setProducts] = usePersistent('ss_products_v1', PRODUCTS)
  const [categories, setCategories] = usePersistent('ss_categories_v1', CATEGORIES)
  const [cart, setCart] = usePersistent('ss_cart_v1', [])
  const [wishlist, setWishlist] = usePersistent('ss_wishlist_v1', [])
  const [users, setUsers] = usePersistent('ss_users_v1', SEED_USERS)
  const [user, setUser] = usePersistent('ss_user_v1', null)
  const [orders, setOrders] = usePersistent('ss_orders_v1', SEED_ORDERS)
  const [coupon, setCoupon] = usePersistent('ss_coupon_v1', null)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  const toast = useCallback((message, type = 'success') => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const getProduct = useCallback((id) => products.find((p) => p.id === Number(id)), [products])

  // ----- Cart -----
  const addToCart = useCallback(
    (product, { size, color, qty = 1 }) => {
      const key = `${product.id}-${size}-${color}`
      setCart((c) => {
        const existing = c.find((i) => i.key === key)
        if (existing) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i))
        return [...c, { key, id: product.id, size, color, qty }]
      })
      setCartOpen(true)
      toast(`${product.name} added to your bag`)
    },
    [setCart, toast],
  )
  const updateQty = (key, qty) => setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, 10)) } : i)))
  const removeFromCart = (key) => setCart((c) => c.filter((i) => i.key !== key))
  const clearCart = () => {
    setCart([])
    setCoupon(null)
  }

  const cartItems = useMemo(
    () =>
      cart
        .map((i) => {
          const p = products.find((x) => x.id === i.id)
          return p ? { ...i, product: p, lineTotal: p.price * i.qty } : null
        })
        .filter(Boolean),
    [cart, products],
  )
  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0)
  const subtotal = cartItems.reduce((n, i) => n + i.lineTotal, 0)
  const discount = coupon ? Math.round(subtotal * COUPONS[coupon]) : 0
  const shippingFor = (method = 'standard') => {
    if (subtotal === 0) return 0
    if (method === 'express') return EXPRESS_FEE
    return subtotal - discount >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE
  }

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase()
    if (COUPONS[c]) {
      setCoupon(c)
      toast(`Coupon ${c} applied: ${COUPONS[c] * 100}% off`)
      return true
    }
    toast('That coupon code is not valid', 'error')
    return false
  }

  // ----- Wishlist -----
  const toggleWishlist = (product) => {
    setWishlist((w) => {
      if (w.includes(product.id)) {
        toast(`Removed from wishlist`, 'info')
        return w.filter((x) => x !== product.id)
      }
      toast(`${product.name} saved to wishlist`)
      return [...w, product.id]
    })
  }

  // ----- Accounts -----
  const login = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password)
    if (!found) return { error: 'Incorrect email or password.' }
    setUser({ name: found.name, email: found.email, phone: found.phone, role: found.role })
    toast(`Welcome back, ${found.name.split(' ')[0]}!`)
    return { user: found }
  }
  const register = ({ name, email, phone, password }) => {
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return { error: 'An account with this email already exists.' }
    const nu = { name, email: email.trim(), phone, password, role: 'customer', joined: new Date().toISOString().slice(0, 10) }
    setUsers((u) => [...u, nu])
    setUser({ name: nu.name, email: nu.email, phone: nu.phone, role: nu.role })
    toast(`Welcome to StepStyle, ${name.split(' ')[0]}!`)
    return { user: nu }
  }
  const logout = () => {
    setUser(null)
    toast('You have been signed out', 'info')
  }

  // ----- Orders -----
  const placeOrder = ({ customer, address, payment, shippingMethod }) => {
    const shipping = shippingFor(shippingMethod)
    const id = `SS-${10429 + orders.filter((o) => !SEED_ORDERS.some((s) => s.id === o.id)).length}`
    const order = {
      id,
      date: new Date().toISOString(),
      status: 'Processing',
      customer,
      address,
      payment,
      shippingMethod,
      userEmail: user?.email || customer.email,
      items: cartItems.map((i) => ({ id: i.id, name: i.product.name, size: i.size, color: i.color, qty: i.qty, price: i.product.price, photo: i.product.photo })),
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
    }
    setOrders((o) => [order, ...o])
    setProducts((ps) => ps.map((p) => {
      const bought = cartItems.filter((i) => i.id === p.id).reduce((n, i) => n + i.qty, 0)
      return bought ? { ...p, stock: Math.max(0, p.stock - bought) } : p
    }))
    clearCart()
    return order
  }
  const updateOrderStatus = (id, status) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)))

  // ----- Admin: products & categories -----
  const saveProduct = (product) => {
    setProducts((ps) => {
      if (product.id && ps.some((p) => p.id === product.id)) return ps.map((p) => (p.id === product.id ? { ...p, ...product } : p))
      const id = Math.max(0, ...ps.map((p) => p.id)) + 1
      return [{ ...product, id, createdAt: Date.now(), reviews: 0, rating: 5, soldOutSizes: [] }, ...ps]
    })
  }
  const deleteProduct = (id) => setProducts((ps) => ps.filter((p) => p.id !== id))
  const setStock = (id, stock) => setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)))

  const saveCategory = (cat, originalSlug) => {
    setCategories((cs) => (originalSlug ? cs.map((c) => (c.slug === originalSlug ? cat : c)) : [...cs, cat]))
  }
  const deleteCategory = (slug) => setCategories((cs) => cs.filter((c) => c.slug !== slug))

  const resetDemoData = () => {
    setProducts(PRODUCTS)
    setCategories(CATEGORIES)
    setOrders(SEED_ORDERS)
    setUsers(SEED_USERS)
    toast('Demo data restored', 'info')
  }

  const value = {
    products, categories, getProduct,
    cart, cartItems, cartCount, subtotal, discount, coupon, applyCoupon, removeCoupon: () => setCoupon(null), shippingFor,
    addToCart, updateQty, removeFromCart, clearCart, cartOpen, setCartOpen,
    wishlist, toggleWishlist,
    users, user, login, register, logout,
    orders, placeOrder, updateOrderStatus,
    saveProduct, deleteProduct, setStock, saveCategory, deleteCategory, resetDemoData,
    quickView, setQuickView,
    toasts, toast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
