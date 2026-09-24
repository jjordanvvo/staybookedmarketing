import { useRef, type ReactNode } from 'react'
import { useScroll } from 'framer-motion'
import SystemStage from '@/components/sections/SystemStage'

/**
 * FlowSegment — the site's two-act architecture.
 *
 * A tall two-column grid: the left column pins one persistent graphic
 * centerpiece (SystemStage) for the entire segment while the right column
 * carries the real content scrolling past it. The reader is never paused
 * or held: content always moves, and the figure morphs through its states
 * in lockstep with where you are in the story.
 *
 * Segment A: the Week fills up, then becomes the System diagram
 *           (beside the how-it-works and services chapters).
 * Segment B: the Ledger totals up, then becomes the final booked Stamp
 *           (beside pricing and FAQ, closing before contact).
 */
export default function FlowSegment({
  variant,
  children,
}: {
  variant: 'A' | 'B'
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <div className={`flow flow-${variant}`} ref={ref}>
      <div className="flow-stagewrap" aria-hidden="true">
        <div className="flow-sticky">
          <SystemStage p={scrollYProgress} variant={variant} />
        </div>
      </div>
      <div className="flow-content">{children}</div>
    </div>
  )
}
