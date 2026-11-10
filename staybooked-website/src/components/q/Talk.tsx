import { Link } from 'react-router-dom'
import { FOUNDERS } from '@/lib/founders'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/content'
import { PHOTOS } from './Portraits'
import ContactForm from './ContactForm'
import Arrow from './Arrow'
import Fade from './Fade'

/** The close: a person, a phone number, a fallback form. */
export default function Talk() {
  return (
    <section className="q-sec q-talk" id="contact">
      <div className="q-wrap q-talk-grid">
        <Fade className="q-talk-main">
          <p className="q-kicker">Talk to us</p>
          <h2 className="q-h2">Tell us what you're building.</h2>
          <a className="q-bigphone" href={PHONE_TEL}>{PHONE_DISPLAY}</a>
          <p className="q-talk-note">
            Campaign, website, product launch or something we haven't heard of yet. A call is the
            fastest way to figure it out, and you'll be talking to a founder.
          </p>
          <Link className="q-link" to="/book">Rather pick a time? Book a call <Arrow /></Link>

          <div className="q-faces">
            <ul>
              {FOUNDERS.map((f) => (
                <li key={f.name}>
                  <img src={f.photo ? PHOTOS[f.photo] : undefined} alt={f.name} loading="lazy" />
                </li>
              ))}
            </ul>
            <p>
              Five founders, running every account personally.{' '}
              <Link to="/team">Meet them</Link>
            </p>
          </div>
        </Fade>

        <Fade className="q-talk-form" delay={0.1}>
          <p className="q-kicker">Or leave a note</p>
          <ContactForm />
        </Fade>
      </div>
    </section>
  )
}
