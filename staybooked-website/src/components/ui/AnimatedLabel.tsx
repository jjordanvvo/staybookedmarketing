import type { ReactNode } from 'react'

const ARROW =
  'M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z'

/** Inner markup for an `.anim-btn` CTA: the label plus the two arrows and
 *  the fill circle its hover animation moves. Styles live in index.css. */
export default function AnimatedLabel({ children }: { children: ReactNode }) {
  return (
    <>
      <svg className="ab-arr ab-arr-2" viewBox="0 0 24 24" aria-hidden="true">
        <path d={ARROW} />
      </svg>
      <span className="ab-text">{children}</span>
      <span className="ab-circle" aria-hidden="true" />
      <svg className="ab-arr ab-arr-1" viewBox="0 0 24 24" aria-hidden="true">
        <path d={ARROW} />
      </svg>
    </>
  )
}
