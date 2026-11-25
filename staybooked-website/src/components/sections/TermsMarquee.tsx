/**
 * TermsMarquee — the guarantee and the pricing terms, moved up from their old
 * full sections into one looping strip right under the hero. CSS-only loop
 * (two identical tracks sliding left); pauses on hover; reduced motion shows
 * a static, wrapping list instead.
 */
export const TERMS = [
  { strong: '90-day guarantee', rest: "If we don't hit the goal we set together, we work free until we do" },
  { strong: 'No startup fee', rest: 'You pay for the program, not the setup' },
  { strong: 'Quoted in one call', rest: 'A real number after a free 15-minute strategy call' },
  { strong: 'Month to month', rest: 'Or sign on longer, your choice' },
  { strong: 'Your data stays yours', rest: 'Ad accounts, audiences and leads go with you' },
  { strong: 'Ad spend never touches us', rest: 'The platforms bill you directly' },
]

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
