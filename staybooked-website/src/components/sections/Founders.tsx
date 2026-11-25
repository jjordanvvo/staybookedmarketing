import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { FOUNDERS, type Founder } from '@/lib/founders'
import { FOUNDER_PHOTOS } from '@/lib/founderPhotos'

export type { Founder }

/**
 * Founders — the five people who run every account, faces first. A compact
 * row of headshots with name and title; the full bios live on /team.
 */
export default function Founders() {
  return (
    <section className="section section-offwhite" id="founders">
      <div className="wrap">
        <Reveal amount={0.4}>
          <RevealItem as="h2" className="title">We make it happen.</RevealItem>
          <RevealItem as="p" className="body why-body">
            No account managers and no ticket queue. You work directly with the founders who build
            and run your system.
          </RevealItem>
        </Reveal>
        <Reveal as="ul" className="fr-row" amount={0.2}>
          {FOUNDERS.map((f) => (
            <RevealItem as="li" className="fr-card" key={f.name}>
              <Link to="/team" className="fr-link">
                <span className="fr-photo">
                  {f.photo && FOUNDER_PHOTOS[f.photo] ? (
                    <img src={FOUNDER_PHOTOS[f.photo]} alt="" loading="lazy" />
                  ) : (
                    <span className="founder-monogram" aria-hidden="true">{f.initials}</span>
                  )}
                </span>
                <span className="fr-name">{f.name}</span>
                <span className="fr-title">{f.title}</span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
        <Reveal amount={0.5}>
          <RevealItem as="p" className="fr-more">
            <Link to="/team">Read their bios and contact details</Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
