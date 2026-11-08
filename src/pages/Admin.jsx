import { useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { BRANDS, formatPrice, imageUrl } from '../data/products'
import { Img, Modal } from '../components/ui'
import { Logo } from '../components/Layout'
import { STATUS_CLASS } from './Account'
import { BoxIcon, ClipboardIcon, EditIcon, EyeIcon, GridIcon, HomeIcon, LayersIcon, LogoutIcon, MenuIcon, MinusIcon, PlusIcon, SearchIcon, TagIcon, TrashIcon, UsersIcon } from '../components/Icons'

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled']
const LOW_STOCK = 10
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/* ---------------- Layout ---------------- */
export function AdminLayout() {
  const { user, logout } = useStore()
  const [open, setOpen] = useState(false)
  if (!user || user.role !== 'admin') return <Navigate to="/account?next=/admin" replace />
  const links = [
    ['/admin', 'Dashboard', GridIcon, true],
    ['/admin/products', 'Products', BoxIcon],
    ['/admin/categories', 'Categories', LayersIcon],
    ['/admin/orders', 'Orders', ClipboardIcon],
    ['/admin/customers', 'Customers', UsersIcon],
    ['/admin/inventory', 'Inventory', TagIcon],
  ]
  return (
    <div className="admin">
      <aside className={`admin-side ${open ? 'is-open' : ''}`}>
        <Logo light />
        <span className="admin-tag">Admin Panel</span>
        <nav>
          {links.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <Link to="/"><HomeIcon size={18} /> View store</Link>
          <button onClick={logout}><LogoutIcon size={18} /> Sign out</button>
        </div>
      </aside>
      <div className={`drawer-backdrop admin-backdrop ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <div className="admin-main">
        <header className="admin-top">
          <button className="icon-btn admin-menu" onClick={() => setOpen(true)} aria-label="Open admin menu"><MenuIcon /></button>
          <div>
            <span className="muted small">Welcome back</span>
            <strong>{user.name}</strong>
          </div>
          <span className="avatar">{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function PageHead({ title, sub, children }) {
  return (
    <div className="admin-head">
      <div>
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      <div className="admin-head-actions">{children}</div>
    </div>
  )
}

/* ---------------- Dashboard ---------------- */
export function AdminDashboard() {
  const { orders, products, users } = useStore()
  const valid = useMemo(() => orders.filter((o) => o.status !== 'Cancelled'), [orders])
  const revenue = valid.reduce((n, o) => n + o.total, 0)
  const lowStock = products.filter((p) => p.stock <= LOW_STOCK)

  // Revenue for the last 7 days.
  const days = useMemo(() => {
    const out = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toDateString()
      const total = valid.filter((o) => new Date(o.date).toDateString() === key).reduce((n, o) => n + o.total, 0)
      out.push({ label: d.toLocaleDateString('en-GB', { weekday: 'short' }), total })
    }
    return out
  }, [valid])
  const maxDay = Math.max(1, ...days.map((d) => d.total))

  const top = useMemo(() => {
    const counts = {}
    valid.forEach((o) => o.items.forEach((i) => (counts[i.id] = (counts[i.id] || 0) + i.qty)))
    return products.map((p) => ({ ...p, sold: counts[p.id] || 0 })).sort((a, b) => b.sold - a.sold || b.reviews - a.reviews).slice(0, 5)
  }, [valid, products])

  const stats = [
    ['Total revenue', formatPrice(revenue), `${valid.length} paid orders`, TagIcon],
    ['Orders', orders.length, `${orders.filter((o) => o.status === 'Processing').length} awaiting dispatch`, ClipboardIcon],
    ['Customers', users.filter((u) => u.role !== 'admin').length, 'Registered accounts', UsersIcon],
    ['Products', products.length, `${lowStock.length} low on stock`, BoxIcon],
  ]

  return (
    <>
      <PageHead title="Dashboard" sub="Overview of your store performance" />
      <div className="stat-grid">
        {stats.map(([label, value, sub, Icon]) => (
          <div className="stat" key={label}>
            <span className="stat-icon"><Icon size={20} /></span>
            <span className="muted small">{label}</span>
            <strong>{value}</strong>
            <span className="small muted">{sub}</span>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Revenue · last 7 days</h3><span className="muted small">{formatPrice(days.reduce((n, d) => n + d.total, 0))}</span></div>
          <div className="bars" role="img" aria-label="Revenue by day for the last 7 days">
            {days.map((d) => (
              <div className="bar-col" key={d.label} title={`${d.label}: ${formatPrice(d.total)}`}>
                <span className="bar-val">{d.total ? `${Math.round(d.total / 1000)}k` : ''}</span>
                <div className="bar-fill" style={{ height: `${(d.total / maxDay) * 100}%` }} />
                <span className="bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Top products</h3><Link to="/admin/products" className="link-gold small">All products</Link></div>
          {top.map((p) => (
            <div className="list-row" key={p.id}>
              <Img src={imageUrl(p.photo, 120)} alt="" />
              <div><strong>{p.name}</strong><span className="muted small">{p.brand}</span></div>
              <span className="small">{p.sold} sold</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-grid-2 admin-grid-wide">
        <div className="panel">
          <div className="panel-head"><h3>Recent orders</h3><Link to="/admin/orders" className="link-gold small">View all</Link></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{o.customer.name}</td>
                    <td>{fmtDate(o.date)}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td><span className={`status ${STATUS_CLASS[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Low stock alerts</h3><Link to="/admin/inventory" className="link-gold small">Inventory</Link></div>
          {lowStock.length === 0 && <p className="muted small">All products are well stocked.</p>}
          {lowStock.slice(0, 6).map((p) => (
            <div className="list-row" key={p.id}>
              <Img src={imageUrl(p.photo, 120)} alt="" />
              <div><strong>{p.name}</strong><span className="muted small">{p.brand}</span></div>
              <span className={`stock-pill ${p.stock === 0 ? 'is-out' : 'is-low'}`}>{p.stock} left</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---------------- Products ---------------- */
const EMPTY_PRODUCT = { name: '', brand: BRANDS[0], categories: [], gender: 'unisex', price: '', oldPrice: '', stock: 20, photo: '', sizesText: '38, 39, 40, 41, 42, 43', colorsText: 'Black:#111111, White:#f4f4f2', description: '', isNew: true, isBestseller: false }

function ProductForm({ initial, onSave, onCancel }) {
  const { categories } = useStore()
  const [f, setF] = useState(() =>
    initial
      ? { ...initial, oldPrice: initial.oldPrice || '', sizesText: initial.sizes.join(', '), colorsText: initial.colors.map((c) => `${c.name}:${c.hex}`).join(', ') }
      : EMPTY_PRODUCT,
  )
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const toggleCat = (slug) => setF((x) => ({ ...x, categories: x.categories.includes(slug) ? x.categories.filter((c) => c !== slug) : [...x.categories, slug] }))

  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setErr('Name is required')
    if (!(Number(f.price) > 0)) return setErr('Enter a valid price')
    if (f.categories.length === 0) return setErr('Choose at least one category')
    const sizes = f.sizesText.split(',').map((s) => Number(s.trim())).filter(Boolean)
    const colors = f.colorsText.split(',').map((c) => {
      const [name, hex] = c.split(':').map((s) => s.trim())
      return { name: name || 'Default', hex: hex || '#111111' }
    })
    if (!sizes.length) return setErr('Add at least one size')
    const rest = { ...f }
    delete rest.sizesText
    delete rest.colorsText
    onSave({
      ...rest,
      price: Number(f.price),
      oldPrice: Number(f.oldPrice) > Number(f.price) ? Number(f.oldPrice) : null,
      stock: Number(f.stock) || 0,
      sizes,
      colors,
      description: f.description || 'A premium new style from StepStyle, crafted for comfort and made to stand out.',
      features: initial?.features || ['Premium materials', 'Cushioned footbed', 'Durable outsole', 'Quality checked'],
      soldOutSizes: initial?.soldOutSizes || [],
    })
  }

  return (
    <form className="form-grid admin-form" onSubmit={submit}>
      <div className="admin-form-preview field-full">
        <Img src={imageUrl(f.photo, 300) || imageUrl('1600269452121-4f2416e55c28', 300)} alt="" />
        <label className="field">
          <span>Image (Unsplash photo id or full image URL)</span>
          <input value={f.photo} onChange={set('photo')} placeholder="https://... or 1542291026-7eec264c27ff" />
        </label>
      </div>
      <label className="field field-full"><span>Product name</span><input value={f.name} onChange={set('name')} /></label>
      <label className="field">
        <span>Brand</span>
        <select value={f.brand} onChange={set('brand')}>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select>
      </label>
      <label className="field">
        <span>Fit</span>
        <select value={f.gender} onChange={set('gender')}>
          <option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option><option value="kids">Kids</option>
        </select>
      </label>
      <label className="field"><span>Price (Rs.)</span><input type="number" value={f.price} onChange={set('price')} /></label>
      <label className="field"><span>Compare-at price (optional)</span><input type="number" value={f.oldPrice} onChange={set('oldPrice')} /></label>
      <label className="field"><span>Stock</span><input type="number" value={f.stock} onChange={set('stock')} /></label>
      <label className="field"><span>Sizes (comma separated)</span><input value={f.sizesText} onChange={set('sizesText')} /></label>
      <label className="field field-full"><span>Colours (Name:#hex, ...)</span><input value={f.colorsText} onChange={set('colorsText')} /></label>
      <div className="field field-full">
        <span>Categories</span>
        <div className="cat-checks">
          {categories.map((c) => (
            <label key={c.slug} className={`chip-check ${f.categories.includes(c.slug) ? 'is-active' : ''}`}>
              <input type="checkbox" checked={f.categories.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      <label className="field field-full"><span>Description</span><textarea rows="3" value={f.description} onChange={set('description')} /></label>
      <label className="check"><input type="checkbox" checked={f.isNew} onChange={set('isNew')} /> <span>Mark as new arrival</span></label>
      <label className="check"><input type="checkbox" checked={f.isBestseller} onChange={set('isBestseller')} /> <span>Mark as bestseller</span></label>
      {err && <p className="form-error field-full">{err}</p>}
      <div className="field-full modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn btn-gold">{initial ? 'Save changes' : 'Add product'}</button>
      </div>
    </form>
  )
}

export function AdminProducts() {
  const { products, categories, saveProduct, deleteProduct, toast } = useStore()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [editing, setEditing] = useState(null) // product, 'new' or null
  const [confirm, setConfirm] = useState(null)
  const list = products.filter((p) => (!cat || p.categories.includes(cat)) && `${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <PageHead title="Products" sub={`${products.length} products in your catalog`}>
        <button className="btn btn-gold" onClick={() => setEditing('new')}><PlusIcon size={18} /> Add product</button>
      </PageHead>
      <div className="panel">
        <div className="admin-filters">
          <div className="filter-search"><SearchIcon size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." /></div>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th className="ta-r">Actions</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="td-prod">
                      <Img src={imageUrl(p.photo, 120)} alt="" />
                      <div><strong>{p.name}</strong><span className="muted small">{p.brand}</span></div>
                    </div>
                  </td>
                  <td className="small">{p.categories.map((c) => categories.find((x) => x.slug === c)?.name || c).join(', ')}</td>
                  <td>
                    {formatPrice(p.price)}
                    {p.oldPrice && <div className="muted small strike">{formatPrice(p.oldPrice)}</div>}
                  </td>
                  <td><span className={`stock-pill ${p.stock === 0 ? 'is-out' : p.stock <= LOW_STOCK ? 'is-low' : ''}`}>{p.stock}</span></td>
                  <td>{p.rating} ★</td>
                  <td className="ta-r nowrap">
                    <Link to={`/product/${p.id}`} className="icon-btn" title="View in store"><EyeIcon size={17} /></Link>
                    <button className="icon-btn" onClick={() => setEditing(p)} title="Edit"><EditIcon size={17} /></button>
                    <button className="icon-btn danger" onClick={() => setConfirm(p)} title="Delete"><TrashIcon size={17} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="muted center pad">No products found.</p>}
        </div>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add product' : 'Edit product'} wide>
        {editing && (
          <ProductForm
            initial={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onSave={(p) => {
              saveProduct(p)
              toast(editing === 'new' ? 'Product added' : 'Product updated')
              setEditing(null)
            }}
          />
        )}
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete product?">
        <p>Are you sure you want to delete <strong>{confirm?.name}</strong>? This cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={() => setConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteProduct(confirm.id); toast('Product deleted', 'info'); setConfirm(null) }}>Delete</button>
        </div>
      </Modal>
    </>
  )
}

/* ---------------- Categories ---------------- */
export function AdminCategories() {
  const { categories, products, saveCategory, deleteCategory, toast } = useStore()
  const [editing, setEditing] = useState(null)
  const [f, setF] = useState({ name: '', slug: '', photo: '', blurb: '' })
  const openEdit = (c) => {
    setEditing(c || 'new')
    setF(c ? { ...c } : { name: '', slug: '', photo: '', blurb: '' })
  }
  const save = (e) => {
    e.preventDefault()
    if (!f.name.trim()) return toast('Category name is required', 'error')
    const slug = f.slug.trim() || f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (editing === 'new' && categories.some((c) => c.slug === slug)) return toast('A category with this slug exists', 'error')
    saveCategory({ ...f, slug, photo: f.photo || '1549298916-b41d501d3772' }, editing === 'new' ? null : editing.slug)
    toast(editing === 'new' ? 'Category added' : 'Category updated')
    setEditing(null)
  }
  return (
    <>
      <PageHead title="Categories" sub="Organise how customers browse your store">
        <button className="btn btn-gold" onClick={() => openEdit(null)}><PlusIcon size={18} /> Add category</button>
      </PageHead>
      <div className="admin-cats">
        {categories.map((c) => {
          const count = products.filter((p) => p.categories.includes(c.slug)).length
          return (
            <div className="admin-cat" key={c.slug}>
              <Img src={imageUrl(c.photo, 500)} alt="" />
              <div className="admin-cat-body">
                <div>
                  <strong>{c.name}</strong>
                  <span className="muted small">/{c.slug} · {count} products</span>
                </div>
                <div className="nowrap">
                  <button className="icon-btn" onClick={() => openEdit(c)} title="Edit"><EditIcon size={17} /></button>
                  <button
                    className="icon-btn danger"
                    title="Delete"
                    onClick={() => {
                      if (count > 0) return toast(`Move or delete the ${count} products in this category first`, 'error')
                      deleteCategory(c.slug)
                      toast('Category deleted', 'info')
                    }}
                  >
                    <TrashIcon size={17} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add category' : 'Edit category'}>
        <form className="form-grid" onSubmit={save}>
          <label className="field field-full"><span>Name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label className="field field-full"><span>Slug (URL)</span><input value={f.slug} disabled={editing !== 'new'} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="auto from name" /></label>
          <label className="field field-full"><span>Image (Unsplash id or URL)</span><input value={f.photo} onChange={(e) => setF({ ...f, photo: e.target.value })} /></label>
          <label className="field field-full"><span>Short description</span><input value={f.blurb} onChange={(e) => setF({ ...f, blurb: e.target.value })} /></label>
          <div className="field-full modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn btn-gold">Save</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

/* ---------------- Orders ---------------- */
export function AdminOrders() {
  const { orders, updateOrderStatus, toast } = useStore()
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  const [view, setView] = useState(null)
  const list = orders.filter((o) => (filter === 'All' || o.status === filter) && `${o.id} ${o.customer.name} ${o.customer.email}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHead title="Orders" sub={`${orders.length} orders total`} />
      <div className="panel">
        <div className="admin-filters">
          <div className="filter-search"><SearchIcon size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order # or customer..." /></div>
          <div className="seg">
            {['All', ...STATUSES].map((s) => (
              <button key={s} className={filter === s ? 'is-active' : ''} onClick={() => setFilter(s)}>
                {s} <em>{s === 'All' ? orders.length : orders.filter((o) => o.status === s).length}</em>
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td>{o.customer.name}<div className="muted small">{o.address.city}</div></td>
                  <td className="nowrap">{fmtDate(o.date)}</td>
                  <td>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                  <td className="small">{o.payment}</td>
                  <td className="nowrap">{formatPrice(o.total)}</td>
                  <td>
                    <select
                      className={`status-select ${STATUS_CLASS[o.status]}`}
                      value={o.status}
                      onChange={(e) => {
                        updateOrderStatus(o.id, e.target.value)
                        toast(`Order ${o.id} marked ${e.target.value}`)
                      }}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button className="icon-btn" onClick={() => setView(o)} title="View order"><EyeIcon size={17} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="muted center pad">No orders found.</p>}
        </div>
      </div>
      <Modal open={!!view} onClose={() => setView(null)} title={view ? `Order ${view.id}` : ''}>
        {view && (
          <div className="order-detail">
            <div className="order-meta">
              <div><span>Status</span><strong className={`status ${STATUS_CLASS[view.status]}`}>{view.status}</strong></div>
              <div><span>Date</span><strong>{fmtDate(view.date)}</strong></div>
              <div><span>Payment</span><strong>{view.payment}</strong></div>
            </div>
            {view.items.map((i) => (
              <div className="summary-item" key={`${i.id}-${i.size}-${i.color}`}>
                <span className="summary-thumb"><Img src={imageUrl(i.photo, 160)} alt="" /><em>{i.qty}</em></span>
                <div><strong>{i.name}</strong><span className="muted small">EU {i.size} · {i.color}</span></div>
                <span>{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="row-between"><span>Subtotal</span><span>{formatPrice(view.subtotal)}</span></div>
            {view.discount > 0 && <div className="row-between"><span>Discount</span><span>−{formatPrice(view.discount)}</span></div>}
            <div className="row-between"><span>Delivery</span><span>{view.shipping ? formatPrice(view.shipping) : 'Free'}</span></div>
            <div className="row-between summary-total"><span>Total</span><strong>{formatPrice(view.total)}</strong></div>
            <h4>Customer</h4>
            <p className="small">
              {view.customer.name} · {view.customer.email} · {view.customer.phone}
              <br />
              {view.address.line}, {view.address.city}, {view.address.province} {view.address.postal}
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}

/* ---------------- Customers ---------------- */
export function AdminCustomers() {
  const { users, orders } = useStore()
  const [q, setQ] = useState('')
  // Customers = registered users + guest checkouts.
  const customers = useMemo(() => {
    const map = new Map()
    users.filter((u) => u.role !== 'admin').forEach((u) => map.set(u.email, { name: u.name, email: u.email, phone: u.phone, joined: u.joined, guest: false, orders: 0, spent: 0 }))
    orders.forEach((o) => {
      const email = o.userEmail || o.customer.email
      if (!map.has(email)) map.set(email, { name: o.customer.name, email, phone: o.customer.phone, joined: o.date.slice(0, 10), guest: true, orders: 0, spent: 0 })
      const c = map.get(email)
      c.orders += 1
      if (o.status !== 'Cancelled') c.spent += o.total
      c.last = !c.last || o.date > c.last ? o.date : c.last
    })
    return [...map.values()].sort((a, b) => b.spent - a.spent)
  }, [users, orders])
  const list = customers.filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHead title="Customers" sub={`${customers.length} customers`} />
      <div className="panel">
        <div className="admin-filters">
          <div className="filter-search"><SearchIcon size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers..." /></div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Customer</th><th>Phone</th><th>Joined</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.email}>
                  <td>
                    <div className="td-prod">
                      <span className="avatar">{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                      <div><strong>{c.name}</strong><span className="muted small">{c.email}{c.guest && ' · guest'}</span></div>
                    </div>
                  </td>
                  <td className="nowrap">{c.phone || '—'}</td>
                  <td className="nowrap">{fmtDate(c.joined)}</td>
                  <td>{c.orders}</td>
                  <td className="nowrap">{formatPrice(c.spent)}</td>
                  <td className="nowrap">{c.last ? fmtDate(c.last) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* ---------------- Inventory ---------------- */
export function AdminInventory() {
  const { products, setStock, resetDemoData } = useStore()
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const list = products
    .filter((p) => (filter === 'low' ? p.stock > 0 && p.stock <= LOW_STOCK : filter === 'out' ? p.stock === 0 : true))
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.stock - b.stock)
  const totalUnits = products.reduce((n, p) => n + p.stock, 0)
  const value = products.reduce((n, p) => n + p.stock * p.price, 0)
  return (
    <>
      <PageHead title="Inventory" sub="Track and adjust stock levels">
        <button className="btn btn-outline btn-sm" onClick={resetDemoData}>Reset demo data</button>
      </PageHead>
      <div className="stat-grid stat-grid-3">
        <div className="stat"><span className="muted small">Units in stock</span><strong>{totalUnits.toLocaleString()}</strong></div>
        <div className="stat"><span className="muted small">Inventory value</span><strong>{formatPrice(value)}</strong></div>
        <div className="stat"><span className="muted small">Low / out of stock</span><strong>{products.filter((p) => p.stock <= LOW_STOCK).length} / {products.filter((p) => p.stock === 0).length}</strong></div>
      </div>
      <div className="panel">
        <div className="admin-filters">
          <div className="filter-search"><SearchIcon size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." /></div>
          <div className="seg">
            {[['all', 'All'], ['low', 'Low stock'], ['out', 'Out of stock']].map(([k, l]) => (
              <button key={k} className={filter === k ? 'is-active' : ''} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Product</th><th>Sizes</th><th>Status</th><th>Stock level</th><th className="ta-r">Adjust</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="td-prod">
                      <Img src={imageUrl(p.photo, 120)} alt="" />
                      <div><strong>{p.name}</strong><span className="muted small">SKU SS-{String(p.id).padStart(4, '0')}</span></div>
                    </div>
                  </td>
                  <td className="small">EU {p.sizes[0]}–{p.sizes[p.sizes.length - 1]}</td>
                  <td><span className={`stock-pill ${p.stock === 0 ? 'is-out' : p.stock <= LOW_STOCK ? 'is-low' : 'is-ok'}`}>{p.stock === 0 ? 'Out of stock' : p.stock <= LOW_STOCK ? 'Low stock' : 'In stock'}</span></td>
                  <td>
                    <div className="stock-meter"><span style={{ width: `${Math.min(100, (p.stock / 60) * 100)}%` }} className={p.stock <= LOW_STOCK ? 'is-low' : ''} /></div>
                  </td>
                  <td className="ta-r">
                    <div className="qty qty-sm stock-adjust">
                      <button onClick={() => setStock(p.id, p.stock - 1)} aria-label="Decrease stock"><MinusIcon size={14} /></button>
                      <input type="number" value={p.stock} onChange={(e) => setStock(p.id, Number(e.target.value) || 0)} aria-label="Stock" />
                      <button onClick={() => setStock(p.id, p.stock + 1)} aria-label="Increase stock"><PlusIcon size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="muted center pad">Nothing here.</p>}
        </div>
      </div>
    </>
  )
}
