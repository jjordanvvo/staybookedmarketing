import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { NICHES } from '@/lib/niches'

const Arrow = () => (
  <svg className="wh-arrow" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16.17 11 10.8 5.64l1.42-1.42L20 12l-7.78 7.78-1.42-1.42L16.17 13H4v-2z" fill="currentColor" />
  </svg>
)

/**
 * Who we work with: every industry we serve, out in the open near the top of
 * the page instead of tucked inside the FAQ. One tile per niche (name and who
 * it's for), each opening that niche's page; Medical goes to the dedicated
 * healthcare page and carries the compliance-first badge. The last tile is
 * the catch-all call to action, which also squares the grid off at 12.
 */
export default function Industries() {
  return (
    <section className="wh" id="industries">
      <div className="wrap">
        <Reveal className="wh-head">
          <RevealItem as="p" className="label">Who we work with</RevealItem>
          <RevealItem as="h2" className="title">Built for businesses that run on bookings.</RevealItem>
          <RevealItem as="p" className="body wh-lede">
            If your customers book appointments, reserve tables or ask for quotes, we build the
            system that keeps your calendar full.
          </RevealItem>
        </Reveal>

        <Reveal as="ul" className="wh-grid" amount={0.1} stagger={0.04}>
          {NICHES.map((n) => {
            const isMedical = n.id === 'medical'
            return (
              <RevealItem as="li" className="wh-tile" key={n.id}>
                <Link className="wh-link" to={n.to ?? `/niches/${n.id}`}>
                  {isMedical && <span className="wh-badge">Compliance-first</span>}
                  <span className="wh-name">{n.name}</span>
                  <span className="wh-ex">{n.examples}</span>
                  <Arrow />
                </Link>
              </RevealItem>
            )
          })}
          <RevealItem as="li" className="wh-tile wh-tile-cta">
            <a className="wh-link" href="/book">
              <span className="wh-name">Don't see yours?</span>
              <span className="wh-ex">If you run on appointments or quotes, it'll work. Ask us on a free 15-minute call.</span>
              <Arrow />
            </a>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
