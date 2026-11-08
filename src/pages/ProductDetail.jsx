import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { gallery, SAMPLE_REVIEWS, WHATSAPP_NUMBER } from '../data/products'
import { PriceTag, ProductCard, ProductOptions, discountPct } from '../components/Product'
import { Breadcrumbs, Img, Modal, Rating, SectionHead } from '../components/ui'
import { CheckIcon, HeartIcon, ReturnIcon, RulerIcon, ShieldIcon, TruckIcon, WhatsAppIcon } from '../components/Icons'

function Gallery({ product }) {
  const imgs = gallery(product, 1100)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(null)
  return (
    <div className="gallery">
      <div className="gallery-thumbs">
        {imgs.map((src, i) => (
          <button key={src} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}>
            <Img src={src.replace('w=1100&h=1100', 'w=200&h=200')} alt="" />
          </button>
        ))}
      </div>
      <div
        className="gallery-main"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          setZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Img key={imgs[active]} src={imgs[active]} alt={product.name} style={zoom ? { transform: 'scale(1.8)', transformOrigin: zoom } : undefined} />
        {discountPct(product) > 0 && <span className="badge badge-sale gallery-badge">-{discountPct(product)}%</span>}
      </div>
    </div>
  )
}

const SIZE_CHART = [
  [35, 2.5, 5, 22.5], [36, 3.5, 6, 23], [37, 4, 6.5, 23.5], [38, 5, 7.5, 24], [39, 6, 8.5, 25], [40, 6.5, 9, 25.5],
  [41, 7.5, 10, 26], [42, 8, 10.5, 26.5], [43, 9, 11.5, 27.5], [44, 9.5, 12, 28], [45, 10.5, 13, 29],
]

export default function ProductDetail() {
  const { id } = useParams()
  const { getProduct, products, categories, wishlist, toggleWishlist } = useStore()
  const product = getProduct(id)
  const [tab, setTab] = useState('desc')
  const [sizeGuide, setSizeGuide] = useState(false)

  if (!product) {
    return (
      <div className="container empty page-pad">
        <h2>Product not found</h2>
        <p>This style may have sold out or been removed.</p>
        <Link to="/shop" className="btn btn-dark">Back to shop</Link>
      </div>
    )
  }

  const cat = categories.find((c) => c.slug === product.categories[0])
  const related = products.filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c))).slice(0, 4)
  const liked = wishlist.includes(product.id)

  return (
    <div className="pdp">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, ...(cat ? [{ label: cat.name, to: `/shop/${cat.slug}` }] : []), { label: product.name }]} />
        <div className="pdp-grid">
          <Gallery product={product} />

          <div className="pdp-info">
            <div className="row-between">
              <span className="pcard-brand">{product.brand}</span>
              {product.isNew && <span className="badge badge-new">New Arrival</span>}
            </div>
            <h1>{product.name}</h1>
            <div className="pdp-rating">
              <Rating value={product.rating} />
              <a href="#reviews" onClick={() => setTab('reviews')}>
                {product.rating} · {product.reviews} reviews
              </a>
            </div>
            <PriceTag product={product} large />
            <p className="pdp-short">{product.description.split('. ')[0]}.</p>

            <button className="link-gold size-guide-btn" onClick={() => setSizeGuide(true)}>
              <RulerIcon size={18} /> Size guide
            </button>

            <ProductOptions key={product.id} product={product} />

            <div className="pdp-secondary">
              <button className={`btn btn-outline ${liked ? 'is-liked' : ''}`} onClick={() => toggleWishlist(product)}>
                <HeartIcon size={18} /> {liked ? 'Saved' : 'Add to wishlist'}
              </button>
              <a className="btn btn-outline" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in the ${product.name}.`)}`} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} /> Ask on WhatsApp
              </a>
            </div>

            <ul className="pdp-perks">
              <li><TruckIcon size={20} /> <span><strong>Free delivery</strong> on orders over Rs. 10,000 · 2–4 working days</span></li>
              <li><ReturnIcon size={20} /> <span><strong>30-day exchanges</strong> — unworn pairs in original box</span></li>
              <li><ShieldIcon size={20} /> <span><strong>Authentic & quality checked</strong> before dispatch</span></li>
            </ul>
          </div>
        </div>

        <div className="pdp-tabs" id="reviews">
          <div className="tabs tabs-left">
            {[['desc', 'Description'], ['details', 'Details & Care'], ['reviews', `Reviews (${product.reviews})`]].map(([k, l]) => (
              <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>
                {l}
              </button>
            ))}
          </div>
          <div className="tab-panel">
            {tab === 'desc' && (
              <div className="prose">
                <p>{product.description}</p>
                <p>Every pair of {product.brand} shoes is inspected by our quality team and shipped in a signature StepStyle box with a dust bag — ready to gift or keep.</p>
              </div>
            )}
            {tab === 'details' && (
              <div className="details-grid">
                <ul className="feature-list">
                  {(product.features || []).map((f) => (
                    <li key={f}><CheckIcon size={16} /> {f}</li>
                  ))}
                </ul>
                <div>
                  <h4>Care instructions</h4>
                  <p className="muted">Wipe clean with a soft, damp cloth. Air dry away from direct heat. Use shoe trees to retain shape and condition leather every few months.</p>
                  <h4>Available sizes</h4>
                  <p className="muted">EU {product.sizes.join(', ')}</p>
                </div>
              </div>
            )}
            {tab === 'reviews' && (
              <div className="reviews">
                <div className="review-summary">
                  <strong>{product.rating}</strong>
                  <Rating value={product.rating} size={18} />
                  <span className="muted">Based on {product.reviews} reviews</span>
                  {[5, 4, 3, 2, 1].map((n) => {
                    const pct = n === 5 ? 72 : n === 4 ? 19 : n === 3 ? 6 : n === 2 ? 2 : 1
                    return (
                      <div className="review-bar" key={n}>
                        <span>{n}★</span>
                        <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                        <span>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
                <div className="review-list">
                  {SAMPLE_REVIEWS.map((r) => (
                    <div className="review" key={r.name}>
                      <div className="row-between">
                        <Rating value={r.rating} />
                        <span className="muted small">{r.date}</span>
                      </div>
                      <h4>{r.title}</h4>
                      <p>{r.text}</p>
                      <span className="small"><strong>{r.name}</strong> · <span className="verified">Verified purchase</span></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="section-sm">
            <SectionHead eyebrow="Complete the look" title="You May Also Like" />
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Modal open={sizeGuide} onClose={() => setSizeGuide(false)} title="Size Guide">
        <p className="muted small">Measure your foot from heel to longest toe and match it to the foot length below. If you are between sizes, we recommend sizing up.</p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>EU</th><th>UK</th><th>US</th><th>Foot length (cm)</th></tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((r) => (
                <tr key={r[0]}>{r.map((v, i) => <td key={i}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}
