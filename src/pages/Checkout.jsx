import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { EXPRESS_FEE, formatPrice, imageUrl } from '../data/products'
import { Img } from '../components/ui'
import { BankIcon, CardIcon, CashIcon, ShieldIcon, WalletIcon, CheckIcon } from '../components/Icons'
import { OrderSummary } from './Cart'

const PROVINCES = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Kashmir']
const PAYMENTS = [
  { id: 'Cash on Delivery', icon: CashIcon, note: 'Pay in cash when your order arrives' },
  { id: 'Credit / Debit Card', icon: CardIcon, note: 'Visa, Mastercard, UnionPay' },
  { id: 'JazzCash / Easypaisa', icon: WalletIcon, note: 'Pay instantly from your mobile wallet' },
  { id: 'Bank Transfer', icon: BankIcon, note: 'Details shared after you place the order' },
]

function Field({ label, error, children, full }) {
  return (
    <label className={`field ${full ? 'field-full' : ''} ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      {children}
      {error && <em className="field-error">{error}</em>}
    </label>
  )
}

export default function Checkout() {
  const { cartItems, user, placeOrder, subtotal, discount, shippingFor } = useStore()
  const navigate = useNavigate()
  const [f, setF] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    line: '', city: '', province: 'Punjab', postal: '', notes: '',
    shippingMethod: 'standard', payment: PAYMENTS[0].id,
    cardName: '', cardNumber: '', cardExp: '', cardCvc: '', wallet: '',
  })
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)

  if (cartItems.length === 0 && !placing) return <Navigate to="/cart" replace />

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (f.name.trim().length < 3) e.name = 'Please enter your full name'
    if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Enter a valid email'
    if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number'
    if (f.line.trim().length < 5) e.line = 'Enter your street address'
    if (!f.city.trim()) e.city = 'Enter your city'
    if (f.payment === 'Credit / Debit Card') {
      if (!f.cardName.trim()) e.cardName = 'Name on card is required'
      if (f.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a 16-digit card number'
      if (!/^\d{2}\/\d{2}$/.test(f.cardExp)) e.cardExp = 'Use MM/YY'
      if (!/^\d{3,4}$/.test(f.cardCvc)) e.cardCvc = '3–4 digits'
    }
    if (f.payment === 'JazzCash / Easypaisa' && f.wallet.replace(/\D/g, '').length < 10) e.wallet = 'Enter your wallet mobile number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) {
      document.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setPlacing(true)
    setTimeout(() => {
      const order = placeOrder({
        customer: { name: f.name, email: f.email, phone: f.phone },
        address: { line: f.line, city: f.city, province: f.province, postal: f.postal, notes: f.notes },
        payment: f.payment,
        shippingMethod: f.shippingMethod,
      })
      navigate(`/order-success/${order.id}`, { replace: true })
    }, 1200)
  }

  const total = subtotal - discount + shippingFor(f.shippingMethod)

  return (
    <div className="checkout-page">
      <div className="container page-pad">
        <div className="steps">
          <span className="is-done"><CheckIcon size={14} /> Bag</span>
          <i />
          <span className="is-active">2 Details & Payment</span>
          <i />
          <span>3 Confirmation</span>
        </div>
        <h1 className="page-title">Checkout</h1>
        {!user && (
          <p className="checkout-login">
            Have an account? <Link to="/account?next=/checkout" className="link-gold">Sign in</Link> for faster checkout and order tracking.
          </p>
        )}

        <form className="checkout-layout" onSubmit={submit} noValidate>
          <div className="checkout-main">
            <section className="card-box">
              <h3><span className="step-num">1</span> Contact information</h3>
              <div className="form-grid">
                <Field label="Full name" error={errors.name} full>
                  <input value={f.name} onChange={set('name')} autoComplete="name" placeholder="e.g. Ali Khan" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" value={f.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="03XX XXXXXXX" />
                </Field>
              </div>
            </section>

            <section className="card-box">
              <h3><span className="step-num">2</span> Delivery address</h3>
              <div className="form-grid">
                <Field label="Street address" error={errors.line} full>
                  <input value={f.line} onChange={set('line')} autoComplete="street-address" placeholder="House no., street, area" />
                </Field>
                <Field label="City" error={errors.city}>
                  <input value={f.city} onChange={set('city')} autoComplete="address-level2" placeholder="e.g. Lahore" />
                </Field>
                <Field label="Province">
                  <select value={f.province} onChange={set('province')}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Postal code (optional)">
                  <input value={f.postal} onChange={set('postal')} autoComplete="postal-code" placeholder="54000" />
                </Field>
                <Field label="Delivery notes (optional)">
                  <input value={f.notes} onChange={set('notes')} placeholder="Landmark, preferred time..." />
                </Field>
              </div>
              <div className="ship-methods">
                {[
                  ['standard', 'Standard delivery', '3–5 working days', shippingFor('standard') === 0 ? 'Free' : formatPrice(shippingFor('standard'))],
                  ['express', 'Express delivery', '1–2 working days', formatPrice(EXPRESS_FEE)],
                ].map(([id, t, s, price]) => (
                  <label key={id} className={`radio-card ${f.shippingMethod === id ? 'is-active' : ''}`}>
                    <input type="radio" name="ship" checked={f.shippingMethod === id} onChange={() => setF((x) => ({ ...x, shippingMethod: id }))} />
                    <div>
                      <strong>{t}</strong>
                      <span>{s}</span>
                    </div>
                    <em>{price}</em>
                  </label>
                ))}
              </div>
            </section>

            <section className="card-box">
              <h3><span className="step-num">3</span> Payment method</h3>
              <div className="pay-methods">
                {PAYMENTS.map(({ id, icon: Icon, note }) => (
                  <label key={id} className={`radio-card ${f.payment === id ? 'is-active' : ''}`}>
                    <input type="radio" name="pay" checked={f.payment === id} onChange={() => setF((x) => ({ ...x, payment: id }))} />
                    <span className="pay-icon"><Icon size={22} /></span>
                    <div>
                      <strong>{id}</strong>
                      <span>{note}</span>
                    </div>
                  </label>
                ))}
              </div>
              {f.payment === 'Credit / Debit Card' && (
                <div className="form-grid pay-extra">
                  <Field label="Name on card" error={errors.cardName} full>
                    <input value={f.cardName} onChange={set('cardName')} autoComplete="cc-name" />
                  </Field>
                  <Field label="Card number" error={errors.cardNumber} full>
                    <input
                      value={f.cardNumber}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      onChange={(e) => setF((x) => ({ ...x, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
                    />
                  </Field>
                  <Field label="Expiry" error={errors.cardExp}>
                    <input
                      value={f.cardExp}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setF((x) => ({ ...x, cardExp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }))
                      }}
                    />
                  </Field>
                  <Field label="CVC" error={errors.cardCvc}>
                    <input value={f.cardCvc} inputMode="numeric" autoComplete="cc-csc" placeholder="123" onChange={(e) => setF((x) => ({ ...x, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                  </Field>
                </div>
              )}
              {f.payment === 'JazzCash / Easypaisa' && (
                <div className="form-grid pay-extra">
                  <Field label="Wallet mobile number" error={errors.wallet} full>
                    <input value={f.wallet} onChange={set('wallet')} placeholder="03XX XXXXXXX" />
                  </Field>
                </div>
              )}
              {f.payment === 'Bank Transfer' && (
                <p className="pay-note">Our bank details will appear on the confirmation page. Orders are dispatched once payment is received.</p>
              )}
              {f.payment === 'Cash on Delivery' && <p className="pay-note">Please keep the exact amount ready. Our rider will hand over your order after payment.</p>}
            </section>
          </div>

          <aside className="checkout-side">
            <OrderSummary shippingMethod={f.shippingMethod}>
              <div className="summary-items">
                {cartItems.map((i) => (
                  <div className="summary-item" key={i.key}>
                    <span className="summary-thumb">
                      <Img src={imageUrl(i.product.photo, 160)} alt="" />
                      <em>{i.qty}</em>
                    </span>
                    <div>
                      <strong>{i.product.name}</strong>
                      <span className="muted small">EU {i.size} · {i.color}</span>
                    </div>
                    <span>{formatPrice(i.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </OrderSummary>
            <button className="btn btn-gold btn-block btn-lg" disabled={placing}>
              {placing ? <span className="spinner" /> : `Place Order · ${formatPrice(total)}`}
            </button>
            <p className="secure-note"><ShieldIcon size={16} /> Your information is encrypted and secure</p>
          </aside>
        </form>
      </div>
    </div>
  )
}
