/**
 * TermsMarquee — the guarantee and the pricing terms, moved up from their old
 * full sections into one looping strip right under the hero. CSS-only loop
 * (two identical tracks sliding left); pauses on hover; reduced motion shows
 * a static, wrapping list instead.
 */
import { TERMS } from '@/lib/terms'

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="tm-track" aria-hidden={hidden || undefined}>
      {TERMS.map((t) => (
        <li key={t.strong} className="tm-item">
          <strong>{t.strong}</strong>
          <span>{t.rest}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TermsMarquee() {
  return (
    <section className="tm" id="terms" aria-label="Our guarantee and pricing terms">
      <div className="tm-rail">
        <Track />
        <Track hidden />
      </div>
    </section>
  )
}
