import { Link } from 'react-router-dom'
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

export default function Navbar({ revealed = true, delay = 0 }: NavbarProps) {
  const reduce = useReducedMotion()
  return (
    <motion.nav
      className="nav"
      aria-label="Main navigation"
      initial={reduce ? false : { y: -18, opacity: 0 }}
      animate={reduce || revealed ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      <div className="nav-left">
        <a href="#hero" className="nav-logo-link" aria-label="Stay Booked Marketing home">
          <img className="nav-logo" src={logo} alt="Stay Booked Marketing" />
        </a>
        <span className="nav-wordmark">staybookedmarketing.com</span>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          {/* Internal route to the practices landing page (client-side, no new tab).
              Stays visible on mobile, where the anchor links are hidden. */}
          <li className="nav-practices"><Link to="/free-call">For Practices</Link></li>
          <li><a href="#founders">Founders</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        {/* The nav CTA goes straight to the booking calendar — same link as
            every other Book a Call button on the site. */}
        <a className="nav-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a Call</a>
      </div>
    </motion.nav>
  )
}
