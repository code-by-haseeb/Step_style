import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, imageUrl } from '../data/products'
import { ProductCard } from '../components/Product'
import { Breadcrumbs, Img } from '../components/ui'
import { ArrowRight, CheckIcon, HeartIcon } from '../components/Icons'

export function OrderSuccess() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)
  if (!order) return <NotFound />
  return (
    <div className="container page-pad narrow">
      <div className="success">
        <span className="success-icon"><CheckIcon size={36} /></span>
        <span className="eyebrow">Order confirmed</span>
        <h1>Thank you, {order.customer.name.split(' ')[0]}!</h1>
        <p>
          Your order <strong>#{order.id}</strong> has been placed. A confirmation has been sent to <strong>{order.customer.email}</strong>.
        </p>
      </div>
      <div className="card-box">
        <div className="order-meta">
          <div><span>Order number</span><strong>{order.id}</strong></div>
          <div><span>Date</span><strong>{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
          <div><span>Payment</span><strong>{order.payment}</strong></div>
          <div><span>Total</span><strong className="text-gold">{formatPrice(order.total)}</strong></div>
        </div>
        <div className="order-items">
          {order.items.map((i) => (
            <div className="summary-item" key={`${i.id}-${i.size}-${i.color}`}>
              <span className="summary-thumb"><Img src={imageUrl(i.photo, 160)} alt="" /><em>{i.qty}</em></span>
              <div>
                <strong>{i.name}</strong>
                <span className="muted small">EU {i.size} · {i.color}</span>
              </div>
              <span>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="order-address">
          <h4>Delivering to</h4>
          <p>
            {order.customer.name} · {order.customer.phone}
            <br />
            {order.address.line}, {order.address.city}, {order.address.province} {order.address.postal}
          </p>
          {order.payment === 'Bank Transfer' && (
            <p className="pay-note">
              Bank: Meezan Bank · Account title: StepStyle Shoes · IBAN: PK00 MEZN 0000 1234 5678 9012. Please use <strong>{order.id}</strong> as the reference.
            </p>
          )}
        </div>
      </div>
      <div className="success-actions">
        <Link to="/account" className="btn btn-outline">View my orders</Link>
        <Link to="/shop" className="btn btn-gold">Continue shopping <ArrowRight size={18} /></Link>
      </div>
    </div>
  )
}

export function Wishlist() {
  const { wishlist, products } = useStore()
  const items = products.filter((p) => wishlist.includes(p.id))
  return (
    <div className="container page-pad">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <h1 className="page-title">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty empty-lg">
          <span className="empty-icon"><HeartIcon size={34} /></span>
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any style to save it here for later.</p>
          <Link to="/shop" className="btn btn-gold btn-lg">Discover shoes</Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export function NotFound() {
  return (
    <div className="container page-pad">
      <div className="empty empty-lg">
        <span className="big-404">404</span>
        <h2>This page took a wrong step</h2>
        <p>The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn btn-gold btn-lg">Back to home</Link>
      </div>
    </div>
  )
}
