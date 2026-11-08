import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, imageUrl, WHATSAPP_NUMBER } from '../data/products'
import { BagIcon, ChevronDown, CloseIcon, FacebookIcon, HeartIcon, InstagramIcon, MailIcon, MenuIcon, PhoneIcon, PinIcon, SearchIcon, UserIcon, YoutubeIcon, TwitterIcon, CardIcon, ShieldIcon } from './Icons'
import { CartDrawer, QuickView } from './Product'
import { Img, WhatsAppFloat } from './ui'

export function Logo({ light }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="StepStyle Shoes home">
      <span className="logo-mark">S</span>
      <span className="logo-text">
        STEPSTYLE<small>SHOES</small>
      </span>
    </Link>
  )
}

function SearchOverlay({ open, onClose }) {
  const { products } = useStore()
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])
  const results = q.trim().length > 1 ? products.filter((p) => `${p.name} ${p.brand} ${p.categories.join(' ')}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : []
  const submit = (e) => {
    e.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    onClose()
    setQ('')
  }
  return (
    <div className={`search-overlay ${open ? 'is-open' : ''}`} onMouseDown={onClose}>
      <div className="search-panel" onMouseDown={(e) => e.stopPropagation()}>
        <form onSubmit={submit} className="search-form">
          <SearchIcon size={22} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for sneakers, heels, oxfords..." aria-label="Search products" />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>
        {results.length > 0 ? (
          <div className="search-results">
            {results.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} onClick={onClose} className="search-hit">
                <Img src={imageUrl(p.photo, 160)} alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.brand}</span>
                </div>
                <span className="search-price">{formatPrice(p.price)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="search-popular">
            <span>Popular:</span>
            {['Sneakers', 'Heels', 'Oxford', 'Running', 'Sandals', 'Boots'].map((t) => (
              <button key={t} onClick={() => setQ(t)}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Header() {
  const { cartCount, wishlist, setCartOpen, user, categories } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <div className="announce">
        <div className="announce-track">
          <span>Free delivery on orders over Rs. 10,000</span>
          <span>✦</span>
          <span>Use code STEP10 for 10% off your first order</span>
          <span>✦</span>
          <span>Easy 30-day exchanges</span>
          <span>✦</span>
          <span>Cash on delivery nationwide</span>
        </div>
      </div>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <button className="icon-btn only-mobile" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <Logo light />
          <nav className="nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <div className="nav-drop">
              <NavLink to="/shop">
                Shop <ChevronDown size={14} />
              </NavLink>
              <div className="mega">
                <div className="mega-cols">
                  <div>
                    <h4>Categories</h4>
                    {categories.map((c) => (
                      <Link key={c.slug} to={`/shop/${c.slug}`}>
                        {c.name}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <h4>Featured</h4>
                    <Link to="/shop?sort=newest">New Arrivals</Link>
                    <Link to="/shop?sort=rating">Bestsellers</Link>
                    <Link to="/shop?sale=1">On Sale</Link>
                    <Link to="/shop">Shop All</Link>
                  </div>
                </div>
                <Link to="/shop/formal" className="mega-promo">
                  <Img src={imageUrl('1533867617858-e7b97e060509', 500)} alt="" />
                  <span>
                    <small>The Atelier Edit</small>Handmade Formals
                  </span>
                </Link>
              </div>
            </div>
            <NavLink to="/shop/men">Men</NavLink>
            <NavLink to="/shop/women">Women</NavLink>
            <NavLink to="/shop/kids">Kids</NavLink>
            <NavLink to="/shop/sneakers">Sneakers</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <div className="header-icons">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <SearchIcon />
            </button>
            <Link to="/account" className="icon-btn hide-xs" aria-label="Account" title={user ? user.name : 'Sign in'}>
              <UserIcon />
            </Link>
            <Link to="/wishlist" className="icon-btn hide-xs" aria-label="Wishlist">
              <HeartIcon />
              {wishlist.length > 0 && <span className="count">{wishlist.length}</span>}
            </Link>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Open bag">
              <BagIcon />
              {cartCount > 0 && <span className="count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <div className="drawer-head">
          <Logo light />
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop" end>
            Shop All
          </NavLink>
          {categories.map((c) => (
            <NavLink key={c.slug} to={`/shop/${c.slug}`}>
              {c.name}
            </NavLink>
          ))}
          <NavLink to="/wishlist">Wishlist</NavLink>
          <NavLink to="/account">{user ? 'My Account' : 'Sign in / Register'}</NavLink>
          <NavLink to="/contact">Contact & Support</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin Dashboard</NavLink>}
        </nav>
      </aside>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function Footer() {
  const { categories, toast } = useStore()
  const [email, setEmail] = useState('')
  return (
    <footer className="footer">
      <div className="container">
        <div className="newsletter">
          <div>
            <span className="eyebrow">The StepStyle Club</span>
            <h3>Get early access to drops & members-only offers</h3>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!/\S+@\S+\.\S+/.test(email)) return toast('Please enter a valid email', 'error')
              toast('You are subscribed. Welcome to the club!')
              setEmail('')
            }}
          >
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" />
            <button className="btn btn-gold">Subscribe</button>
          </form>
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>Premium footwear crafted for every step of your journey. Designed with passion, delivered with care across Pakistan.</p>
            <div className="socials">
              <a href="#" aria-label="Instagram"><InstagramIcon size={18} /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon size={18} /></a>
              <a href="#" aria-label="X"><TwitterIcon size={16} /></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon size={18} /></a>
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            {categories.slice(0, 7).map((c) => (
              <Link key={c.slug} to={`/shop/${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h4>Help</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/contact#faq">FAQs</Link>
            <Link to="/contact#faq">Shipping & Delivery</Link>
            <Link to="/contact#faq">Returns & Exchanges</Link>
            <Link to="/account">Track Order</Link>
          </div>
          <div>
            <h4>Get in touch</h4>
            <p className="f-line"><PinIcon size={16} /> 45 MM Alam Road, Gulberg III, Lahore</p>
            <p className="f-line"><PhoneIcon size={16} /> +92 300 123 4567</p>
            <p className="f-line"><MailIcon size={16} /> support@stepstyle.pk</p>
            <a className="btn btn-outline-gold btn-sm" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              WhatsApp us
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} StepStyle Shoes. All rights reserved.</span>
          <span className="pay-icons">
            <ShieldIcon size={16} /> Secure checkout
            <span className="pay-chip">VISA</span>
            <span className="pay-chip">Mastercard</span>
            <span className="pay-chip">JazzCash</span>
            <span className="pay-chip">COD</span>
            <CardIcon size={16} />
          </span>
        </div>
      </div>
    </footer>
  )
}

export default function StoreLayout() {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <QuickView />
      <WhatsAppFloat />
    </>
  )
}
