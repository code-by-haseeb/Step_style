/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, gallery, imageUrl } from '../data/products'
import { Img, Modal, Rating } from './ui'
import { BagIcon, EyeIcon, HeartIcon, MinusIcon, PlusIcon, TrashIcon, CloseIcon, TruckIcon } from './Icons'
import { FREE_SHIPPING_MIN } from '../data/products'

export const discountPct = (p) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0)

export function PriceTag({ product, large }) {
  const pct = discountPct(product)
  return (
    <div className={`price ${large ? 'price-lg' : ''}`}>
      <span className="price-now">{formatPrice(product.price)}</span>
      {product.oldPrice && <span className="price-old">{formatPrice(product.oldPrice)}</span>}
      {pct > 0 && large && <span className="price-save">Save {pct}%</span>}
    </div>
  )
}

export function ProductCard({ product }) {
  const { wishlist, toggleWishlist, setQuickView } = useStore()
  const pct = discountPct(product)
  const liked = wishlist.includes(product.id)
  const imgs = gallery(product, 600)
  return (
    <article className="pcard">
      <div className="pcard-media">
        <Link to={`/product/${product.id}`} className="pcard-imgs" aria-label={product.name}>
          <Img src={imgs[0]} alt={product.name} className="pcard-img" />
          {imgs[1] && <Img src={imgs[1]} alt="" className="pcard-img pcard-img-alt" />}
        </Link>
        <div className="pcard-badges">
          {pct > 0 && <span className="badge badge-sale">-{pct}%</span>}
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isBestseller && <span className="badge badge-best">Bestseller</span>}
          {product.stock === 0 && <span className="badge badge-out">Sold out</span>}
        </div>
        <button className={`pcard-like ${liked ? 'is-liked' : ''}`} onClick={() => toggleWishlist(product)} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}>
          <HeartIcon size={18} />
        </button>
        <div className="pcard-actions">
          <button className="btn btn-gold btn-sm" onClick={() => setQuickView(product)} disabled={product.stock === 0}>
            <BagIcon size={16} /> Quick add
          </button>
          <Link to={`/product/${product.id}`} className="btn btn-light btn-sm btn-icon" aria-label="View details">
            <EyeIcon size={16} />
          </Link>
        </div>
      </div>
      <div className="pcard-body">
        <span className="pcard-brand">{product.brand}</span>
        <h3 className="pcard-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <Rating value={product.rating} count={product.reviews} size={13} />
        <PriceTag product={product} />
        <div className="pcard-meta">
          <div className="swatches-mini">
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} style={{ background: c.hex }} />
            ))}
          </div>
          <span className="pcard-sizes">
            EU {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
          </span>
        </div>
      </div>
    </article>
  )
}

// Size + colour + quantity selector shared by product page and quick view.
export function ProductOptions({ product, onAdded, showBuyNow = true }) {
  const { addToCart } = useStore()
  const navigate = useNavigate()
  const [color, setColor] = useState(product.colors[0]?.name)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const soldOut = product.soldOutSizes || []
  const outOfStock = product.stock === 0

  const add = (buyNow) => {
    if (!size) {
      setError('Please select your size')
      return
    }
    addToCart(product, { size, color, qty })
    onAdded?.()
    if (buyNow) navigate('/checkout')
  }

  return (
    <div className="options">
      <div className="opt-group">
        <div className="opt-label">
          Colour: <strong>{color}</strong>
        </div>
        <div className="swatches">
          {product.colors.map((c) => (
            <button key={c.name} className={`swatch ${color === c.name ? 'is-active' : ''}`} style={{ '--sw': c.hex }} onClick={() => setColor(c.name)} aria-label={c.name} title={c.name} />
          ))}
        </div>
      </div>
      <div className="opt-group">
        <div className="opt-label">
          Size (EU): <strong>{size || 'Select'}</strong>
        </div>
        <div className="sizes">
          {product.sizes.map((s) => (
            <button
              key={s}
              className={`size ${size === s ? 'is-active' : ''}`}
              disabled={soldOut.includes(s) || outOfStock}
              onClick={() => {
                setSize(s)
                setError('')
              }}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p className="field-error">{error}</p>}
      </div>
      <div className="opt-row">
        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <MinusIcon size={16} />
          </button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">
            <PlusIcon size={16} />
          </button>
        </div>
        <button className="btn btn-dark btn-grow" onClick={() => add(false)} disabled={outOfStock}>
          <BagIcon size={18} /> {outOfStock ? 'Out of stock' : 'Add to Cart'}
        </button>
      </div>
      {showBuyNow && !outOfStock && (
        <button className="btn btn-gold btn-block" onClick={() => add(true)}>
          Buy it now
        </button>
      )}
      {product.stock > 0 && product.stock <= 10 && <p className="low-stock">Hurry! Only {product.stock} pairs left in stock</p>}
    </div>
  )
}

export function QuickView() {
  const { quickView, setQuickView } = useStore()
  const p = quickView
  return (
    <Modal open={!!p} onClose={() => setQuickView(null)} wide>
      {p && (
        <div className="qv">
          <div className="qv-img">
            <Img src={imageUrl(p.photo, 700)} alt={p.name} />
          </div>
          <div className="qv-info">
            <span className="pcard-brand">{p.brand}</span>
            <h2>{p.name}</h2>
            <Rating value={p.rating} count={p.reviews} />
            <PriceTag product={p} large />
            <ProductOptions key={p.id} product={p} onAdded={() => setQuickView(null)} showBuyNow={false} />
            <Link to={`/product/${p.id}`} className="link-gold" onClick={() => setQuickView(null)}>
              View full details →
            </Link>
          </div>
        </div>
      )}
    </Modal>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, subtotal, updateQty, removeFromCart } = useStore()
  const remaining = Math.max(0, FREE_SHIPPING_MIN - subtotal)
  const close = () => setCartOpen(false)
  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'is-open' : ''}`} onClick={close} />
      <aside className={`drawer ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <h3>Your Bag ({cartItems.length})</h3>
          <button className="icon-btn" onClick={close} aria-label="Close bag">
            <CloseIcon />
          </button>
        </div>
        {cartItems.length > 0 && (
          <div className="ship-progress">
            <p>
              <TruckIcon size={16} />{' '}
              {remaining > 0 ? (
                <>
                  Add <strong>{formatPrice(remaining)}</strong> more for free delivery
                </>
              ) : (
                <>You've unlocked <strong>free delivery</strong></>
              )}
            </p>
            <div className="bar">
              <span style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100)}%` }} />
            </div>
          </div>
        )}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-mini">
              <p>Your bag is empty.</p>
              <Link to="/shop" className="btn btn-dark" onClick={close}>
                Start shopping
              </Link>
            </div>
          ) : (
            cartItems.map((i) => (
              <div className="mini-item" key={i.key}>
                <Img src={imageUrl(i.product.photo, 200)} alt={i.product.name} />
                <div className="mini-info">
                  <Link to={`/product/${i.id}`} onClick={close}>
                    {i.product.name}
                  </Link>
                  <span className="muted">
                    Size {i.size} · {i.color}
                  </span>
                  <div className="mini-row">
                    <div className="qty qty-sm">
                      <button onClick={() => updateQty(i.key, i.qty - 1)} aria-label="Decrease">
                        <MinusIcon size={14} />
                      </button>
                      <span>{i.qty}</span>
                      <button onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase">
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <strong>{formatPrice(i.lineTotal)}</strong>
                  </div>
                </div>
                <button className="icon-btn mini-remove" onClick={() => removeFromCart(i.key)} aria-label="Remove">
                  <TrashIcon size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="drawer-foot">
            <div className="row-between">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <p className="muted small">Shipping and discounts calculated at checkout.</p>
            <Link to="/checkout" className="btn btn-gold btn-block" onClick={close}>
              Checkout
            </Link>
            <Link to="/cart" className="btn btn-outline btn-block" onClick={close}>
              View bag
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
