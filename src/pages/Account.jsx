/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, imageUrl } from '../data/products'
import { Img } from '../components/ui'
import { BoxIcon, ChevronDown, HeartIcon, LogoutIcon, UserIcon, GridIcon } from '../components/Icons'

export const STATUS_CLASS = { Processing: 'st-processing', Shipped: 'st-shipped', Delivered: 'st-delivered', Cancelled: 'st-cancelled', Pending: 'st-processing' }

function AuthForms() {
  const { login, register } = useStore()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'login') {
      const r = login(f.email, f.password)
      if (r.error) return setError(r.error)
      navigate(params.get('next') || (r.user.role === 'admin' ? '/admin' : '/account'))
    } else {
      if (f.name.trim().length < 3) return setError('Please enter your full name.')
      if (!/\S+@\S+\.\S+/.test(f.email)) return setError('Please enter a valid email.')
      if (f.password.length < 6) return setError('Password must be at least 6 characters.')
      if (f.password !== f.confirm) return setError('Passwords do not match.')
      const r = register(f)
      if (r.error) return setError(r.error)
      if (params.get('next')) navigate(params.get('next'))
    }
  }

  return (
    <div className="auth">
      <div className="auth-visual">
        <Img src={imageUrl('1460353581641-37baddab0fa2', 1000)} alt="" />
        <div>
          <span className="eyebrow">StepStyle Club</span>
          <h2>Members walk ahead.</h2>
          <p>Track orders, save favourites, check out faster and get early access to exclusive drops.</p>
        </div>
      </div>
      <div className="auth-card">
        <div className="tabs auth-tabs">
          <button className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login'); setError('') }}>Sign in</button>
          <button className={mode === 'register' ? 'is-active' : ''} onClick={() => { setMode('register'); setError('') }}>Create account</button>
        </div>
        <form onSubmit={submit} className="auth-form">
          <h1>{mode === 'login' ? 'Welcome back' : 'Join StepStyle'}</h1>
          <p className="muted">{mode === 'login' ? 'Sign in to your account to continue.' : 'Create an account in less than a minute.'}</p>
          {mode === 'register' && (
            <>
              <label className="field"><span>Full name</span><input value={f.name} onChange={set('name')} autoComplete="name" /></label>
              <label className="field"><span>Phone</span><input value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="03XX XXXXXXX" /></label>
            </>
          )}
          <label className="field"><span>Email</span><input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
          <label className="field"><span>Password</span><input type="password" value={f.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
          {mode === 'register' && (
            <label className="field"><span>Confirm password</span><input type="password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" /></label>
          )}
          {mode === 'login' && (
            <div className="row-between small">
              <label className="check"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
              <a href="#" className="link-gold" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-dark btn-block btn-lg">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
          <div className="demo-hint">
            <strong>Demo accounts</strong>
            <span>Customer: hamza@example.com / demo123</span>
            <span>Admin: admin@stepstyle.com / admin123</span>
          </div>
        </form>
      </div>
    </div>
  )
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`order-card ${open ? 'is-open' : ''}`}>
      <button className="order-card-head" onClick={() => setOpen((o) => !o)}>
        <div><span>Order</span><strong>#{order.id}</strong></div>
        <div><span>Placed</span><strong>{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
        <div><span>Total</span><strong>{formatPrice(order.total)}</strong></div>
        <span className={`status ${STATUS_CLASS[order.status]}`}>{order.status}</span>
        <ChevronDown size={18} className="order-chev" />
      </button>
      {open && (
        <div className="order-card-body">
          <div className="tracker">
            {['Processing', 'Shipped', 'Delivered'].map((s, i) => {
              const idx = ['Processing', 'Shipped', 'Delivered'].indexOf(order.status)
              return <span key={s} className={order.status !== 'Cancelled' && i <= idx ? 'is-done' : ''}>{s}</span>
            })}
          </div>
          {order.items.map((i) => (
            <div className="summary-item" key={`${i.id}-${i.size}-${i.color}`}>
              <span className="summary-thumb"><Img src={imageUrl(i.photo, 160)} alt="" /><em>{i.qty}</em></span>
              <div>
                <Link to={`/product/${i.id}`}><strong>{i.name}</strong></Link>
                <span className="muted small">EU {i.size} · {i.color}</span>
              </div>
              <span>{formatPrice(i.price * i.qty)}</span>
            </div>
          ))}
          <p className="muted small">
            {order.payment} · Ship to {order.address.line}, {order.address.city}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Account() {
  const { user, orders, logout, wishlist } = useStore()
  const [tab, setTab] = useState('orders')
  if (!user) return <div className="container page-pad"><AuthForms /></div>

  const mine = orders.filter((o) => (o.userEmail || o.customer.email) === user.email)
  const spent = mine.filter((o) => o.status !== 'Cancelled').reduce((n, o) => n + o.total, 0)

  return (
    <div className="container page-pad">
      <div className="account">
        <aside className="account-side">
          <div className="account-user">
            <span className="avatar avatar-lg">{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
            <strong>{user.name}</strong>
            <span className="muted small">{user.email}</span>
          </div>
          <nav>
            <button className={tab === 'orders' ? 'is-active' : ''} onClick={() => setTab('orders')}><BoxIcon size={18} /> Order history</button>
            <button className={tab === 'profile' ? 'is-active' : ''} onClick={() => setTab('profile')}><UserIcon size={18} /> Profile</button>
            <Link to="/wishlist"><HeartIcon size={18} /> Wishlist ({wishlist.length})</Link>
            {user.role === 'admin' && <Link to="/admin"><GridIcon size={18} /> Admin dashboard</Link>}
            <button onClick={logout}><LogoutIcon size={18} /> Sign out</button>
          </nav>
        </aside>
        <div className="account-main">
          <h1 className="page-title">Hello, {user.name.split(' ')[0]}</h1>
          <div className="mini-stats">
            <div><strong>{mine.length}</strong><span>Orders</span></div>
            <div><strong>{formatPrice(spent)}</strong><span>Total spent</span></div>
            <div><strong>{wishlist.length}</strong><span>Saved items</span></div>
          </div>
          {tab === 'orders' ? (
            <>
              <h3>Order history</h3>
              {mine.length === 0 ? (
                <div className="empty">
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/shop" className="btn btn-gold">Start shopping</Link>
                </div>
              ) : (
                mine.map((o) => <OrderCard key={o.id} order={o} />)
              )}
            </>
          ) : (
            <div className="card-box">
              <h3>Profile details</h3>
              <dl className="profile-list">
                <dt>Name</dt><dd>{user.name}</dd>
                <dt>Email</dt><dd>{user.email}</dd>
                <dt>Phone</dt><dd>{user.phone || '—'}</dd>
                <dt>Membership</dt><dd><span className="badge badge-best">Gold member</span></dd>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
