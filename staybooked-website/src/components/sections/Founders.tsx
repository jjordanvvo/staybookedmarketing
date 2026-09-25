import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import type { Founder } from '@/lib/founders'

export type { Founder }


/**
 * Our Founders — five founder cards in a two-column grid (single compact
 * column on mobile; the odd fifth card centers itself across both columns).
 * Founder photos fill the square slots via object-fit: cover
 * (see .founder-photo); cards are data-driven so all five stay identical.
 * Two founders are named Jordan, so cards always show full names.
 */



export default function Founders() {
  return (
    <section className="section section-offwhite" id="founders">
      <div className="wrap">
        <Reveal amount={0.4}>
          <RevealItem as="p" className="label">Meet the founders</RevealItem>
          <RevealItem as="h2" className="title">Our Founders</RevealItem>
          <RevealItem as="p" className="body why-body">
            Five founders running every account hands-on. No account managers, no ticket systems.
          </RevealItem>
          <RevealItem as="div" className="founders-cta" delay={0.15}>
            <Link className="contact-book-btn" to="/team">Meet our team</Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
