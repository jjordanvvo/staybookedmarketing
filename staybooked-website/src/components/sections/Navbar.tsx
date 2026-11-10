import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Mark from '@/components/q/Mark'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/content'

type NavbarProps = {
  /** Kept for older pages that still pass these; the bar no longer animates in. */
  revealed?: boolean
  delay?: number
}

const LINKS = [
  { label: 'What we do', to: '/#what' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Team', to: '/team' },
]

/**
 * The site bar. Three links, the phone number and one button. On phones it is
 * just the letters, a Call link and Menu; the menu opens a full sheet.
 * The bar sits transparent over the top of the page and gains a solid
 * ground once you scroll.
 */
export default function Navbar(_props: NavbarProps) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('q-lock', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <nav className={`q-nav${solid ? ' is-solid' : ''}${open ? ' is-open' : ''}`} aria-label="Main navigation">
        <Link to="/" className="q-nav-home" aria-label="Stay Booked Marketing home">
          <Mark />
        </Link>

        <ul className="q-nav-links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={pathname === l.to ? 'is-here' : undefined}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="q-nav-end">
          <a className="q-nav-phone" href={PHONE_TEL}>{PHONE_DISPLAY}</a>
          <Link className="q-nav-book" to="/book">Book a call</Link>
          <a className="q-nav-call" href={PHONE_TEL}>Call</a>
          <button
            type="button"
            className="q-nav-menu"
            aria-expanded={open}
            aria-controls="q-sheet"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <div id="q-sheet" className={`q-sheet${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <ul>
          {[{ label: 'Home', to: '/' }, ...LINKS, { label: 'Book a call', to: '/book' }].map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <a className="q-sheet-phone" href={PHONE_TEL} tabIndex={open ? 0 : -1}>{PHONE_DISPLAY}</a>
      </div>
    </>
  )
}
