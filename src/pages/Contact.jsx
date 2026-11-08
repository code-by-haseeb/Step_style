import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { WHATSAPP_NUMBER } from '../data/products'
import { Breadcrumbs, Reveal } from '../components/ui'
import { ChevronDown, ClockIcon, HeadsetIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/Icons'

const FAQS = [
  ['How long does delivery take?', 'Standard delivery takes 3–5 working days across Pakistan. Express delivery arrives in 1–2 working days in major cities. Orders over Rs. 10,000 ship free.'],
  ['Do you offer cash on delivery?', 'Yes. Cash on delivery is available nationwide. You can also pay by card, JazzCash, Easypaisa or bank transfer.'],
  ['What is your exchange & return policy?', 'Unworn shoes in their original box can be exchanged or returned within 30 days of delivery. Simply message us on WhatsApp or email support with your order number.'],
  ['How do I find my size?', 'Every product page has a size guide with EU, UK and US sizes plus foot length in cm. If you are between sizes, we recommend going half a size up — or ask our team on WhatsApp.'],
  ['How can I track my order?', 'Sign in to your account and open Order history to see live status. You will also receive an SMS with the courier tracking number once your order ships.'],
]

export default function Contact() {
  const { toast } = useStore()
  const { hash } = useLocation()
  const [open, setOpen] = useState(0)
  const [f, setF] = useState({ name: '', email: '', subject: 'Order enquiry', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [hash])

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    if (!f.name || !/\S+@\S+\.\S+/.test(f.email) || f.message.length < 10) return toast('Please fill in your name, a valid email and a message', 'error')
    setSent(true)
    toast('Message sent! We will reply within 24 hours.')
    setF({ name: '', email: '', subject: 'Order enquiry', message: '' })
  }

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi StepStyle! I have a question.')}`

  return (
    <div>
      <div className="page-banner">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <h1>We're Here to Help</h1>
          <p>Questions about sizing, orders or styling? Our team replies fast — usually within minutes on WhatsApp.</p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="contact-cards">
          {[
            [PhoneIcon, 'Call us', '+92 300 123 4567', 'Mon–Sat, 10am – 8pm', 'tel:+923001234567'],
            [WhatsAppIcon, 'WhatsApp', 'Chat with an expert', 'Typically replies in 5 mins', waLink],
            [MailIcon, 'Email', 'support@stepstyle.pk', 'Reply within 24 hours', 'mailto:support@stepstyle.pk'],
            [PinIcon, 'Flagship store', '45 MM Alam Road', 'Gulberg III, Lahore', 'https://maps.google.com/?q=MM+Alam+Road+Lahore'],
          ].map(([Icon, t, l1, l2, href], i) => (
            <Reveal key={t} delay={i * 70}>
              <a className="contact-card" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span className="perk-icon"><Icon size={22} /></span>
                <h4>{t}</h4>
                <strong>{l1}</strong>
                <span className="muted small">{l2}</span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="contact-layout">
          <div className="card-box">
            <h3>Send us a message</h3>
            {sent && <p className="form-success">Thanks! Your message has been received. Our support team will get back to you shortly.</p>}
            <form className="form-grid" onSubmit={submit}>
              <label className="field"><span>Your name</span><input value={f.name} onChange={set('name')} /></label>
              <label className="field"><span>Email</span><input type="email" value={f.email} onChange={set('email')} /></label>
              <label className="field field-full">
                <span>Subject</span>
                <select value={f.subject} onChange={set('subject')}>
                  <option>Order enquiry</option>
                  <option>Size & fit help</option>
                  <option>Returns & exchanges</option>
                  <option>Wholesale / partnerships</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="field field-full"><span>Message</span><textarea rows="5" value={f.message} onChange={set('message')} placeholder="How can we help?" /></label>
              <button className="btn btn-dark btn-lg">Send message</button>
            </form>
          </div>

          <div className="support-side">
            <div className="wa-card">
              <WhatsAppIcon size={40} />
              <h3>Instant help on WhatsApp</h3>
              <p>Send us a photo of a style you like or ask about sizing — our footwear experts are online 7 days a week.</p>
              <a className="btn btn-wa btn-lg" href={waLink} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={20} /> Chat on WhatsApp
              </a>
            </div>
            <div className="card-box hours">
              <h4><ClockIcon size={18} /> Store & support hours</h4>
              <div className="row-between"><span>Monday – Friday</span><strong>10:00 – 21:00</strong></div>
              <div className="row-between"><span>Saturday</span><strong>11:00 – 22:00</strong></div>
              <div className="row-between"><span>Sunday</span><strong>13:00 – 21:00</strong></div>
              <p className="muted small"><HeadsetIcon size={14} /> WhatsApp support is available daily until midnight.</p>
            </div>
          </div>
        </div>

        <div className="map">
          <iframe title="StepStyle flagship store location" src="https://maps.google.com/maps?q=MM%20Alam%20Road%20Gulberg%20Lahore&z=15&output=embed" loading="lazy" />
        </div>

        <section id="faq" className="faq">
          <span className="eyebrow">Customer support</span>
          <h2>Frequently Asked Questions</h2>
          {FAQS.map(([q, a], i) => (
            <div key={q} className={`faq-item ${open === i ? 'is-open' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {q} <ChevronDown size={18} />
              </button>
              <div className="faq-a"><p>{a}</p></div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
