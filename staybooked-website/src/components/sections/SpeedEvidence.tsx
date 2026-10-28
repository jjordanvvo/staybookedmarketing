import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { SPEED_EVIDENCE } from '@/lib/evidence'

/**
 * Why speed wins — sourced 2026 research on lead response, in the same
 * editorial number style as the free-call page. Every figure links to its
 * source (see src/lib/evidence.ts).
 */
export default function SpeedEvidence() {
  return (
    <section className="section section-light lp-proof" id="evidence">
      <Reveal className="wrap" amount={0.35}>
        <RevealItem as="p" className="label">Why speed wins</RevealItem>
        <RevealItem as="h2" className="title">Most businesses answer too slowly. Yours won't.</RevealItem>
      </Reveal>
      <Reveal as="div" className="wrap lp-stat-rows" amount={0.2}>
        {SPEED_EVIDENCE.map((s) => (
          <RevealItem as="article" className="lp-stat-row" key={s.figure}>
            <span className="lp-stat-figure" aria-hidden="true">{s.figure}</span>
            <div>
              <p className="lp-stat-text">{s.text}</p>
              <p className="lp-stat-source">
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.source}</a>
              </p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
      <Reveal className="wrap" amount={0.5}>
        <RevealItem as="p" className="body lp-proof-close">
          Our system replies to every new lead within minutes, day or night, so you're the business that answers first.
        </RevealItem>
      </Reveal>
    </section>
  )
}
