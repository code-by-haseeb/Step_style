import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { BRANDS, imageUrl, TESTIMONIALS, formatPrice } from '../data/products'
import { ProductCard, discountPct } from '../components/Product'
import { Img, Rating, Reveal, SectionHead } from '../components/ui'
import { ArrowRight, ChevronLeft, ChevronRight, HeadsetIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons'

const SLIDES = [
  { photo: '1529810313688-44ea1c2d81d3', eyebrow: 'Autumn / Winter 2026', title: ['Step Into', 'Timeless Style'], text: 'Premium footwear crafted with obsessive detail. Discover the new season collection made for city streets and beyond.', cta: '/shop', cta2: { to: '/shop?sort=newest', label: 'New Arrivals' } },
  { photo: '1614252235316-8c857d38b5f4', eyebrow: 'The Atelier Edit', title: ['Handcrafted', 'Leather Classics'], text: 'Full-grain leather oxfords, derbies and monk straps finished by hand. Refinement for every occasion.', cta: '/shop/formal', cta2: { to: '/shop/men', label: "Shop Men's" } },
  { photo: '1597248881519-db089d3744a5', eyebrow: 'Limited Drop', title: ['Golden Hour', 'Sneakers'], text: 'Bold colourways and icon silhouettes. Up to 25% off selected sneakers for a limited time only.', cta: '/shop/sneakers', cta2: { to: '/shop?sale=1', label: 'View Offers' } },
]

function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6500)
    return () => clearInterval(t)
  }, [i])
  const go = (d) => setI((x) => (x + d + SLIDES.length) % SLIDES.length)
  return (
    <section className="hero">
      {SLIDES.map((s, idx) => (
        <div key={s.photo} className={`hero-slide ${idx === i ? 'is-active' : ''}`} aria-hidden={idx !== i}>
          <img className="hero-bg" src={`https://images.unsplash.com/photo-${s.photo}?auto=format&fit=crop&w=2000&q=80`} alt="" />
          <div className="hero-shade" />
          <div className="container hero-content">
            <span className="eyebrow">{s.eyebrow}</span>
            <h1>
              {s.title[0]}
              <br />
              <em>{s.title[1]}</em>
            </h1>
            <p>{s.text}</p>
            <div className="hero-ctas">
              <Link to={s.cta} className="btn btn-gold btn-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to={s.cta2.to} className="btn btn-ghost-light btn-lg">
                {s.cta2.label}
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="container hero-bottom">
        <div className="hero-stats">
          <div><strong>50K+</strong><span>Happy customers</span></div>
          <div><strong>4.8★</strong><span>Average rating</span></div>
          <div><strong>120+</strong><span>Premium styles</span></div>
        </div>
        <div className="hero-nav">
          <button onClick={() => go(-1)} aria-label="Previous slide"><ChevronLeft /></button>
          <div className="hero-dots">
            {SLIDES.map((_, idx) => (
              <button key={idx} className={idx === i ? 'is-active' : ''} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next slide"><ChevronRight /></button>
        </div>
      </div>
    </section>
  )
}

function Perks() {
  const perks = [
    [TruckIcon, 'Free Delivery', 'On orders over Rs. 10,000'],
    [ReturnIcon, 'Easy Exchanges', '30-day hassle-free returns'],
    [ShieldIcon, 'Secure Payment', 'Cards, wallets & COD'],
    [HeadsetIcon, 'Expert Support', 'Help via WhatsApp 7 days'],
  ]
  return (
    <section className="perks">
      <div className="container perks-grid">
        {perks.map(([Icon, t, s]) => (
          <div className="perk" key={t}>
            <span className="perk-icon"><Icon size={24} /></span>
            <div>
              <strong>{t}</strong>
              <span>{s}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Categories() {
  const { categories, products } = useStore()
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Curated for you" title="Shop by Category" sub="From boardroom to running track — find the perfect pair." action={<Link to="/shop" className="link-gold">View all <ArrowRight size={16} /></Link>} />
        <div className="cat-grid">
          {categories.map((c, idx) => (
            <Reveal key={c.slug} delay={idx * 60} className={`cat-card ${idx === 0 ? 'cat-tall' : ''}`}>
              <Link to={`/shop/${c.slug}`}>
                <Img src={imageUrl(c.photo, 700)} alt={c.name} />
                <div className="cat-info">
                  <span>{products.filter((p) => p.categories.includes(c.slug)).length} styles</span>
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                  <span className="cat-cta">Shop now <ArrowRight size={14} /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Trending() {
  const { products } = useStore()
  const [tab, setTab] = useState('new')
  const list = useMemo(() => {
    if (tab === 'new') return [...products].filter((p) => p.isNew).slice(0, 8)
    if (tab === 'best') return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8)
    return [...products].filter((p) => p.oldPrice).sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 8)
  }, [products, tab])
  return (
    <section className="section section-cream">
      <div className="container">
        <SectionHead eyebrow="This season" title="Trending Now" />
        <div className="tabs">
          {[['new', 'New Arrivals'], ['best', 'Bestsellers'], ['sale', 'On Sale']].map(([k, l]) => (
            <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="product-grid" key={tab}>
          {list.map((p, idx) => (
            <Reveal key={p.id} delay={idx * 50}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <div className="center mt-40">
          <Link to="/shop" className="btn btn-dark btn-lg">
            Explore the collection <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Banners() {
  return (
    <section className="section">
      <div className="container banners">
        <Reveal className="banner banner-dark">
          <Img src={imageUrl('1533867617858-e7b97e060509', 1000)} alt="" />
          <div className="banner-text">
            <span className="eyebrow">Gentlemen's Collection</span>
            <h3>Crafted for the Boardroom</h3>
            <p>Italian-inspired leather formals, built to last a lifetime.</p>
            <Link to="/shop/formal" className="btn btn-gold">Shop Formal</Link>
          </div>
        </Reveal>
        <Reveal className="banner" delay={120}>
          <Img src={imageUrl('1535043934128-cf0b28d52f95', 1000)} alt="" />
          <div className="banner-text">
            <span className="eyebrow">Her Edit</span>
            <h3>Grace in Every Step</h3>
            <p>Heels, boots and flats designed to make an entrance.</p>
            <Link to="/shop/women" className="btn btn-gold">Shop Women</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function useCountdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const end = new Date()
  end.setHours(23, 59, 59, 0)
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7))
  const diff = Math.max(0, end - now)
  return [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60]
}

function DealOfWeek() {
  const { getProduct } = useStore()
  const p = getProduct(15)
  const [d, h, m, s] = useCountdown()
  if (!p) return null
  return (
    <section className="deal">
      <div className="container deal-inner">
        <Reveal className="deal-img">
          <Img src={imageUrl(p.photo, 900)} alt={p.name} />
          <span className="deal-badge">-{discountPct(p)}%</span>
        </Reveal>
        <Reveal className="deal-text" delay={100}>
          <span className="eyebrow">Deal of the Week</span>
          <h2>{p.name}</h2>
          <Rating value={p.rating} count={p.reviews} />
          <p>A gold-standard icon. Premium tumbled leather, a cushioned Air-style midsole and a colourway made to turn heads. Limited pairs available at this price.</p>
          <div className="deal-price">
            <strong>{formatPrice(p.price)}</strong>
            <span>{formatPrice(p.oldPrice)}</span>
          </div>
          <div className="countdown">
            {[[d, 'Days'], [h, 'Hours'], [m, 'Mins'], [s, 'Secs']].map(([v, l]) => (
              <div key={l}>
                <strong>{String(v).padStart(2, '0')}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <Link to={`/product/${p.id}`} className="btn btn-gold btn-lg">
            Grab the deal <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function Brands() {
  return (
    <section className="brands">
      <div className="brands-track">
        {[...BRANDS, ...BRANDS].map((b, i) => (
          <span key={i}>{b}</span>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section section-cream">
      <div className="container">
        <SectionHead eyebrow="Loved by thousands" title="What Our Customers Say" />
        <div className="testi-grid">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 100} className="testi">
              <Rating value={5} />
              <p>“{t.text}”</p>
              <div className="testi-who">
                <span className="avatar">{t.avatar}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>Verified buyer · {t.city}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Lookbook() {
  const shots = ['1556906781-9a412961c28c', '1460353581641-37baddab0fa2', '1514989940723-e8e51635b782', '1512374382149-233c42b6a83b', '1586525198428-225f6f12cff5', '1516478177764-9fe5bd7e9717']
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="#StepInStyle" title="Styled by Our Community" sub="Tag @stepstyle.pk to be featured" />
      </div>
      <div className="lookbook">
        {shots.map((s) => (
          <a key={s} href="#" className="look" aria-label="View on Instagram">
            <Img src={imageUrl(s, 500)} alt="" />
          </a>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Perks />
      <Categories />
      <Trending />
      <Banners />
      <DealOfWeek />
      <Brands />
      <Testimonials />
      <Lookbook />
    </>
  )
}
