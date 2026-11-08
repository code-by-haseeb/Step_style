import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import StoreLayout from './components/Layout'
import { ScrollToTop, Toasts } from './components/ui'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import Contact from './pages/Contact'
import { NotFound, OrderSuccess, Wishlist } from './pages/Misc'
import { AdminCategories, AdminCustomers, AdminDashboard, AdminInventory, AdminLayout, AdminOrders, AdminProducts } from './pages/Admin'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<StoreLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:category" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:id" element={<OrderSuccess />} />
            <Route path="account" element={<Account />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="inventory" element={<AdminInventory />} />
          </Route>
        </Routes>
        <Toasts />
      </BrowserRouter>
    </StoreProvider>
  )
}
