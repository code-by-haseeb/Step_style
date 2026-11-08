import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, FREE_SHIPPING_MIN, imageUrl } from '../data/products'
import { Breadcrumbs, Img } from '../components/ui'
import { ArrowRight, BagIcon, MinusIcon, PlusIcon, ShieldIcon, TagIcon, TrashIcon, TruckIcon } from '../components/Icons'
import { ProductCard } from '../components/Product'

export function OrderSummary({ shippingMethod = 'standard', children }) {
  const { cartItems, subtotal, discount, coupon, shippingFor, removeCoupon } = useStore()
  const shipping = shippingFor(shippingMethod)
  return (
    <div className="summary">
      <h3>Order Summary</h3>
      {children}
      <div className="row-between">
        <span>Subtotal ({cartItems.reduce((n, i) => n + i.qty, 0)} items)</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="row-between text-gold">
          <span>
            Discount ({coupon}){' '}
            <button className="link-muted small" onClick={removeCoupon}>
              remove
            </button>
          </span>
          <span>−{formatPrice(discount)}</span>
        </div>
      )}
      <div className="row-between">
        <span>Delivery</span>
        <span>{shipping === 0 ? <strong className="text-green">Free</strong> : formatPrice(shipping)}</span>
      </div>
      <div className="row-between summary-total">
        <span>Total</span>
        <strong>{formatPrice(subtotal - discount + shipping)}</strong>
      </div>
      <p className="muted small">Prices include all applicable taxes.</p>
    </div>
  )
}

export default function Cart() {
  const { cartItems, subtotal, updateQty, removeFromCart, applyCoupon, coupon, products } = useStore()
  const [code, setCode] = useState('')
  const remaining = Math.max(0, FREE_SHIPPING_MIN - subtotal)

  if (cartItems.length === 0) {
    return (
      <div className="container page-pad">
        <div className="empty empty-lg">
          <span className="empty-icon"><BagIcon size={36} /></span>
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything yet. Let's find your next favourite pair.</p>
          <Link to="/shop" className="btn btn-gold btn-lg">Start shopping <ArrowRight size={18} /></Link>
        </div>
        <h3 className="mt-40">Popular right now</h3>
        <div className="product-grid mt-24">
          {products.filter((p) => p.isBestseller).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="container page-pad">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shopping Bag' }]} />
      <h1 className="page-title">Shopping Bag</h1>
      <div className="cart-layout">
        <div>
          <div className="ship-progress ship-progress-card">
            <p>
              <TruckIcon size={18} />{' '}
              {remaining > 0 ? <>You're <strong>{formatPrice(remaining)}</strong> away from free delivery</> : <>Congrats! Your order ships <strong>free</strong></>}
            </p>
            <div className="bar"><span style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100)}%` }} /></div>
          </div>
          <div className="cart-table">
            <div className="cart-head">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {cartItems.map((i) => (
              <div className="cart-row" key={i.key}>
                <div className="cart-prod">
                  <Link to={`/product/${i.id}`}><Img src={imageUrl(i.product.photo, 240)} alt={i.product.name} /></Link>
                  <div>
                    <span className="pcard-brand">{i.product.brand}</span>
                    <Link to={`/product/${i.id}`} className="cart-name">{i.product.name}</Link>
                    <span className="muted small">Size: EU {i.size} · Colour: {i.color}</span>
                    <button className="link-muted small cart-remove" onClick={() => removeFromCart(i.key)}>
                      <TrashIcon size={14} /> Remove
                    </button>
                  </div>
                </div>
                <span className="cart-price" data-label="Price">{formatPrice(i.product.price)}</span>
                <div className="qty" data-label="Qty">
                  <button onClick={() => updateQty(i.key, i.qty - 1)} aria-label="Decrease"><MinusIcon size={16} /></button>
                  <span>{i.qty}</span>
                  <button onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase"><PlusIcon size={16} /></button>
                </div>
                <strong className="cart-total" data-label="Total">{formatPrice(i.lineTotal)}</strong>
              </div>
            ))}
          </div>
          <Link to="/shop" className="link-gold mt-24 inline-block">← Continue shopping</Link>
        </div>

        <aside className="cart-side">
          <OrderSummary>
            <form
              className="coupon"
              onSubmit={(e) => {
                e.preventDefault()
                if (applyCoupon(code)) setCode('')
              }}
            >
              <TagIcon size={18} />
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={coupon ? `${coupon} applied` : 'Coupon code (try STEP10)'} aria-label="Coupon code" />
              <button className="btn btn-dark btn-sm">Apply</button>
            </form>
          </OrderSummary>
          <Link to="/checkout" className="btn btn-gold btn-block btn-lg">
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
          <p className="secure-note"><ShieldIcon size={16} /> Secure, encrypted checkout</p>
        </aside>
      </div>
    </div>
  )
}
