import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { StarIcon, CloseIcon, CheckIcon, WhatsAppIcon } from './Icons'
import { useStore } from '../context/StoreContext'
import { WHATSAPP_NUMBER } from '../data/products'

const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#efece6"/><text x="200" y="210" text-anchor="middle" font-family="Georgia" font-size="28" fill="#b8955a">StepStyle</text></svg>')

// Image with a graceful fade-in and a branded fallback if the URL fails.
export function Img({ src, alt = '', className = '', ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      className={`img-fade ${loaded ? 'is-loaded' : ''} ${className}`}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      {...props}
    />
  )
}

export function Rating({ value, count, size = 14 }) {
  return (
    <span className="rating" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} size={size} fill={Math.max(0, Math.min(1, value - i + 1)).toFixed(1)} />
      ))}
      {count !== undefined && <span className="rating-count">({count})</span>}
    </span>
  )
}

export function Modal({ open, onClose, children, wide, title }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          {title && <h3>{title}</h3>}
          <button className="icon-btn modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-dot">{t.type === 'success' ? <CheckIcon size={14} /> : '!'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi StepStyle! I need help with an order.')}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon size={28} />
      <span className="wa-label">Chat with us</span>
    </a>
  )
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// Fades/slides elements in as they scroll into view.
export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [el, setEl] = useState(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [el])
  return (
    <Tag ref={setEl} className={`reveal ${shown ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

export function SectionHead({ eyebrow, title, sub, action }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> :<span aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <span className="crumb-sep">/</span>}
        </span>
      ))}
    </nav>
  )
}
