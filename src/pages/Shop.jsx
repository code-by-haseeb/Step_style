import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { BRANDS, formatPrice, imageUrl } from '../data/products'
import { ProductCard } from '../components/Product'
import { Breadcrumbs, Img } from '../components/ui'
import { CloseIcon, FilterIcon, SearchIcon } from '../components/Icons'

const ALL_SIZES = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
const PRICE_MAX = 25000

export default function Shop() {
  const { products, categories } = useStore()
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const q = params.get('q') || ''
  const sort = params.get('sort') || 'featured'
  const onSale = params.get('sale') === '1'
  const brands = params.getAll('brand')
  const sizes = params.getAll('size').map(Number)
  const cats = category ? [category] : params.getAll('cat')
  const minPrice = Number(params.get('min') || 0)
  const maxPrice = Number(params.get('max') || PRICE_MAX)

  const update = (fn) => {
    const next = new URLSearchParams(params)
    fn(next)
    setParams(next, { replace: true })
  }
  const toggle = (key, value) =>
    update((n) => {
      const vals = n.getAll(key)
      n.delete(key)
      const s = String(value)
      ;(vals.includes(s) ? vals.filter((v) => v !== s) : [...vals, s]).forEach((v) => n.append(key, v))
    })
  const set = (key, value) => update((n) => (value === '' || value === null ? n.delete(key) : n.set(key, value)))

  const results = (() => {
    const term = q.trim().toLowerCase()
    let list = products.filter((p) => {
      if (term && !`${p.name} ${p.brand} ${p.categories.join(' ')} ${p.colors.map((c) => c.name).join(' ')}`.toLowerCase().includes(term)) return false
      if (cats.length && !cats.some((c) => p.categories.includes(c))) return false
      if (brands.length && !brands.includes(p.brand)) return false
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s) && !(p.soldOutSizes || []).includes(s))) return false
      if (p.price < minPrice || p.price > maxPrice) return false
      if (onSale && !p.oldPrice) return false
      return true
    })
    const sorters = {
      featured: (a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating,
      newest: (a, b) => b.createdAt - a.createdAt,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    }
    return [...list].sort(sorters[sort] || sorters.featured)
  })()

  const current = categories.find((c) => c.slug === category)
  const activeChips = [
    ...(q ? [{ label: `“${q}”`, clear: () => set('q', '') }] : []),
    ...(!category ? cats.map((c) => ({ label: categories.find((x) => x.slug === c)?.name || c, clear: () => toggle('cat', c) })) : []),
    ...brands.map((b) => ({ label: b, clear: () => toggle('brand', b) })),
    ...sizes.map((s) => ({ label: `EU ${s}`, clear: () => toggle('size', s) })),
    ...(minPrice > 0 || maxPrice < PRICE_MAX ? [{ label: `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`, clear: () => update((n) => { n.delete('min'); n.delete('max') }) }] : []),
    ...(onSale ? [{ label: 'On sale', clear: () => set('sale', '') }] : []),
  ]

  const Filters = (
    <div className="filters">
      <div className="filter-search">
        <SearchIcon size={18} />
        <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search by name..." aria-label="Search by name" />
      </div>

      {!category && (
        <details open className="filter-block">
          <summary>Category</summary>
          {categories.map((c) => (
            <label key={c.slug} className="check">
              <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => toggle('cat', c.slug)} />
              <span>{c.name}</span>
              <em>{products.filter((p) => p.categories.includes(c.slug)).length}</em>
            </label>
          ))}
        </details>
      )}

      <details open className="filter-block">
        <summary>Price</summary>
        <div className="price-inputs">
          <label>
            Min
            <input type="number" min="0" step="500" value={minPrice || ''} placeholder="0" onChange={(e) => set('min', e.target.value)} />
          </label>
          <label>
            Max
            <input type="number" min="0" step="500" value={maxPrice === PRICE_MAX ? '' : maxPrice} placeholder={PRICE_MAX} onChange={(e) => set('max', e.target.value)} />
          </label>
        </div>
        <input type="range" className="range" min="2000" max={PRICE_MAX} step="500" value={maxPrice} onChange={(e) => set('max', e.target.value)} aria-label="Maximum price" />
        <div className="row-between small muted">
          <span>Up to</span>
          <strong>{formatPrice(maxPrice)}</strong>
        </div>
        <label className="check mt-12">
          <input type="checkbox" checked={onSale} onChange={() => set('sale', onSale ? '' : '1')} />
          <span>On sale only</span>
        </label>
      </details>

      <details open className="filter-block">
        <summary>Brand</summary>
        {BRANDS.map((b) => (
          <label key={b} className="check">
            <input type="checkbox" checked={brands.includes(b)} onChange={() => toggle('brand', b)} />
            <span>{b}</span>
            <em>{products.filter((p) => p.brand === b).length}</em>
          </label>
        ))}
      </details>

      <details open className="filter-block">
        <summary>Size (EU)</summary>
        <div className="size-filter">
          {ALL_SIZES.map((s) => (
            <button key={s} className={`size ${sizes.includes(s) ? 'is-active' : ''}`} onClick={() => toggle('size', s)}>
              {s}
            </button>
          ))}
        </div>
      </details>
    </div>
  )

  return (
    <div className="shop-page">
      <div className={`page-banner ${current ? 'has-img' : ''}`}>
        {current && <Img src={imageUrl(current.photo, 1600)} alt="" className="page-banner-img" />}
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: current ? '/shop' : undefined }, ...(current ? [{ label: current.name }] : [])]} />
          <h1>{current ? current.name : q ? `Results for “${q}”` : 'Shop All Shoes'}</h1>
          <p>{current ? current.blurb : 'Premium footwear for every step — explore our full collection.'}</p>
        </div>
      </div>

      <div className="container shop-layout">
        <aside className="shop-side">{Filters}</aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <button className="btn btn-outline btn-sm only-tablet" onClick={() => setFiltersOpen(true)}>
              <FilterIcon size={16} /> Filters {activeChips.length > 0 && `(${activeChips.length})`}
            </button>
            <span className="muted">
              Showing <strong>{results.length}</strong> {results.length === 1 ? 'style' : 'styles'}
            </span>
            <label className="sort">
              Sort by
              <select value={sort} onChange={(e) => set('sort', e.target.value)}>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="chips">
              {activeChips.map((c) => (
                <button key={c.label} className="chip" onClick={c.clear}>
                  {c.label} <CloseIcon size={12} />
                </button>
              ))}
              <button className="link-gold small" onClick={() => setParams({}, { replace: true })}>
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="empty">
              <h3>No shoes match your filters</h3>
              <p>Try removing a filter or searching for something else.</p>
              <button className="btn btn-dark" onClick={() => setParams({}, { replace: true })}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="product-grid product-grid-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`drawer-backdrop ${filtersOpen ? 'is-open' : ''}`} onClick={() => setFiltersOpen(false)} />
      <aside className={`filter-drawer ${filtersOpen ? 'is-open' : ''}`}>
        <div className="drawer-head">
          <h3>Filters</h3>
          <button className="icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>
        <div className="drawer-body">{Filters}</div>
        <div className="drawer-foot">
          <button className="btn btn-gold btn-block" onClick={() => setFiltersOpen(false)}>
            Show {results.length} results
          </button>
        </div>
      </aside>
    </div>
  )
}
