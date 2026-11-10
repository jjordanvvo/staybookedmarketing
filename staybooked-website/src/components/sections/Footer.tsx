import { Link } from 'react-router-dom'
import Mark from '@/components/q/Mark'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from '@/lib/content'
import { NICHES } from '@/lib/niches'

/** Quiet footer. The industry links live here, small, for people who look
 *  and for search engines, instead of taking over the page. */
export default function Footer() {
  return (
    <footer className="q-foot">
      <div className="q-wrap q-foot-grid">
        <div className="q-foot-brand">
          <Mark />
          <p>We don't chase leads. We book them.</p>
        </div>

        <div className="q-foot-col">
          <p className="q-foot-head">Reach us</p>
          <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <Link to="/book">Book a call</Link>
        </div>

        <div className="q-foot-col">
          <p className="q-foot-head">Company</p>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/team">Team</Link>
          <a href="/growth-calculator/">Growth calculator</a>
          <a href="https://www.linkedin.com/company/staybookedmarketing" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/staybookedmarketing" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>

        <div className="q-foot-col q-foot-ind">
          <p className="q-foot-head">Industries</p>
          {NICHES.map((n) => (
            <Link key={n.id} to={`/niches/${n.id}`}>{n.name}</Link>
          ))}
        </div>
      </div>

      <div className="q-wrap q-foot-base">
        <span>© {new Date().getFullYear()} Stay Booked Marketing LLC</span>
        <span>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  )
}
