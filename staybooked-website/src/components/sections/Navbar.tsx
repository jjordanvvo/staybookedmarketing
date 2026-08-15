import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import logo from '@/assets/logo-nav.webp'
import { EASE } from '@/components/ui/Reveal'
import { BOOKING_URL } from '@/lib/booking'

type NavbarProps = {
  /** Held offscreen until the intro curtains start lifting. */
  revealed?: boolean
  /** Entrance delay in seconds (longer after the intro so the hero lands first). */
  delay?: number
}

// Section anchors on the home page. Off "/" they route to /#id and the
// ScrollToTop handler in App.tsx finishes the scroll once the section mounts.
const ANCHORS = [
  { label: 'Founders', id: 'founders' },
  { label: 'Services', id: 'services' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
]

/**
 * The one site-wide navigation bar — identical on every page. Desktop shows
 * the full link row; mobile collapses to logo + Book a Call + hamburger, with
 * the links in a drop-down sheet under the bar (grid 0fr → 1fr collapse,
 * Escape and link-tap both close it).
 */
export default function Navbar({ revealed = true, delay = 0 }: NavbarProps) {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Leaving the page always retires the menu.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const anchor = (a: (typeof ANCHORS)[number]) =>
    onHome ? (
      <a href={`#${a.id}`} onClick={close}>{a.label}</a>
    ) : (
      <Link to={`/#${a.id}`} onClick={close}>{a.label}</Link>
    )

  return (
    <motion.nav
      className="nav"
      aria-label="Main navigation"
      initial={reduce ? false : { y: -18, opacity: 0 }}
      animate={reduce || revealed ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      <div className="nav-left">
        {onHome ? (
          <a href="#hero" className="nav-logo-link" aria-label="Stay Booked Marketing home">
            <img className="nav-logo" src={logo} alt="Stay Booked Marketing" />
          </a>
        ) : (
          <Link to="/" className="nav-logo-link" aria-label="Stay Booked Marketing home">
            <img className="nav-logo" src={logo} alt="Stay Booked Marketing" />
          </Link>
        )}
        <span className="nav-wordmark">staybookedmarketing.com</span>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/free-call">For Practices</Link></li>
          {ANCHORS.map((a) => (
            <li key={a.id}>{anchor(a)}</li>
          ))}
        </ul>
        {/* The nav CTA goes straight to the booking calendar — same link as
            every other Book a Call button on the site. */}
        <a className="nav-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a Call</a>
        <button
          type="button"
          className={`nav-burger${open ? ' nav-burger-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drop-down sheet — lives inside the fixed nav so it tracks it */}
      <div id="nav-menu" className={`nav-menu${open ? ' nav-menu-open' : ''}`}>
        <ul className="nav-menu-inner">
          <li><Link to="/free-call" onClick={close}>For Practices</Link></li>
          {ANCHORS.map((a) => (
            <li key={a.id}>{anchor(a)}</li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}
