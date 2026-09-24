import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'

/**
 * WeekScene — the pinned two-act centerpiece of the page.
 *
 * A tall scroll track (300vh) pins one stage: a week board, seven day
 * columns of slots. The scroll position IS the story:
 *
 *   ACT I — THE LEAKS. Ink-dark "missed" markers stamp across the week
 *   while the counter climbs to 13 leads slipped away. The week stays
 *   mostly empty, dashed slots gaping — what a week without a system
 *   feels like from the inside.
 *
 *   ACT II — THE FILL. A warm dawn washes the stage, and every cell flips:
 *   missed markers turn into tan booked events one by one, the remaining
 *   dashed slots fill, and the counter re-counts the same week at 24
 *   appointments on the books. The visual language is the intro's calendar
 *   (tan blocks, event spines, dashed availability) grown to full size —
 *   so the site opens on the promise and this scene proves it.
 *
 * Scrubbed purely by scroll progress — no keyframes, no timers: the reader
 * owns the pace, forward and back. Honors prefers-reduced-motion with the
 * settled "booked" end state.
 */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ROWS = 4
// The slots that stay open even in a booked week (col-row, 1-indexed) —
// the same honest gaps the intro's calendar has.
const OPEN_SLOTS = new Set(['2-4', '5-2', '6-1', '4-3'])

type CellData = { key: string; bookable: boolean; bookIndex: number; missed: boolean; missIndex: number }
const CELLS: CellData[] = []
{
  let bi = 0
  let mi = 0
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= DAYS.length; c++) {
      const key = `${c}-${r}`
      const bookable = !OPEN_SLOTS.has(key)
      // A scattered ~13 of the 24 bookable cells leak in Act I.
      const missed = bookable && (bi * 7) % 24 < 13
      CELLS.push({ key, bookable, bookIndex: bi, missed, missIndex: mi })
      if (missed) mi++
      if (bookable) bi++
    }
  }
}
const BOOKABLE = CELLS.filter((c) => c.bookable).length // 24
const MISSED_N = CELLS.filter((c) => c.missed).length // 13

/* Flip windows (scroll progress p, 0-1 across the pinned track) */
const ACT1 = { from: 0.04, to: 0.42 } // missed markers stamp in
const ACT2_FROM = 0.5
const FLIP_SPAN = 0.34 // booked flips stagger across [0.5, 0.84]

const flipStart = (i: number) => ACT2_FROM + (i / BOOKABLE) * FLIP_SPAN

/* One board cell: a missed-ink layer and/or a booked-tan layer, each tied
   to its own little window of the scroll progress. */
function Cell({ p, data }: { p: MotionValue<number>; data: CellData }) {
  const flip = flipStart(data.bookIndex)
  const fIn = useTransform(p, [flip, flip + 0.06], [0, 1])

  // Missed marker: stamps in during Act I, dissolves as its flip arrives.
  const mStart = ACT1.from + (data.missIndex / MISSED_N) * (ACT1.to - ACT1.from - 0.08)
  const mIn = useTransform(p, [mStart, mStart + 0.06], [0, 1])
  const mOut = useTransform(p, [flip - 0.05, flip], [1, 0])
  const mOp = useTransform([mIn, mOut], (v: number[]) => v[0] * v[1])
  const mScale = useTransform(mIn, (v) => 0.55 + 0.45 * v)

  // Booked event: springy pop as the dawn reaches it.
  const bScale = useTransform(fIn, (v) => 0.45 + 0.55 * v)
  const bOp = fIn

  return (
    <span className="wk-cell" key={undefined}>
      {data.missed && (
        <motion.span className="wk-missed" aria-hidden="true" style={{ opacity: mOp, scale: mScale }}>
          <i className="wk-missed-dot" />
        </motion.span>
      )}
      {data.bookable ? (
        <motion.span
          className={`wk-booked wk-shade-${data.bookIndex % 3}`}
          aria-hidden="true"
          style={{ opacity: bOp, scale: bScale }}
        />
      ) : (
        // Open slots keep their dashed honesty all scene long; at the very
        // end a quiet tan dot marks them — next week's leads already calling.
        <OpenSlot p={p} />
      )}
    </span>
  )
}

function OpenSlot({ p }: { p: MotionValue<number> }) {
  const dotOp = useTransform(p, [0.9, 0.97], [0, 1])
  return (
    <>
      <span className="wk-open" aria-hidden="true" />
      <motion.span className="wk-open-dot" aria-hidden="true" style={{ opacity: dotOp }} />
    </>
  )
}

export default function WeekScene() {
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  const p = reduce ? ({ get: () => 1, isStatic: true } as unknown as MotionValue<number>) : scrollYProgress

  // Act I counter: leads slipped away.
  const missedN = useTransform(p, [ACT1.from, ACT1.to], [0, MISSED_N], { clamp: true })
  const missedNum = useTransform(missedN, (v) => String(Math.round(v)))
  const missedOp = useTransform(p, [0.42, 0.5], [1, 0])

  // Act II counter: appointments on the books.
  const bookedN = useTransform(p, [ACT2_FROM, 0.92], [0, BOOKABLE], { clamp: true })
  const bookedNum = useTransform(bookedN, (v) => String(Math.round(v)))
  const bookedOp = useTransform(p, [0.47, 0.55], [0, 1])

  // Labels + dawn wash + closing line.
  const act1Op = useTransform(p, [0.36, 0.46], [1, 0])
  const act2Op = useTransform(p, [0.5, 0.6], [0, 1])
  const washOp = useTransform(p, [0.44, 0.72], [0, 1])
  const endOp = useTransform(p, [0.9, 0.99], [0, 1])

  return (
    <section className="wk" ref={trackRef} id="week">
      <div className="wk-sticky">
        <motion.div className="wk-wash" aria-hidden="true" style={{ opacity: washOp }} />
        <div className="wk-stage">
          <div className="wk-left">
            <p className="wk-chapter">
              <span className="wk-chapter-no">01</span>The Week
            </p>
            <div className="wk-count">
              <motion.span className="wk-num wk-num-ink" style={{ opacity: missedOp }}>
                {missedNum}
              </motion.span>
              <motion.span className="wk-num wk-num-tan" style={{ opacity: bookedOp }}>
                {bookedNum}
              </motion.span>
            </div>
            <div className="wk-unitwrap">
              <motion.p className="wk-unit" style={{ opacity: missedOp }}>
                leads slipped away
              </motion.p>
              <motion.p className="wk-unit" style={{ opacity: bookedOp }}>
                appointments booked
              </motion.p>
            </div>
            <motion.p className="wk-act wk-act-1" style={{ opacity: act1Op }}>
              Every call that rings out, every form nobody answers — a week
              quietly coming apart.
            </motion.p>
            <motion.p className="wk-act wk-act-2" style={{ opacity: act2Op }}>
              The same week on a Stay Booked system: ads catch, automation
              qualifies, the calendar fills.
            </motion.p>
          </div>
          <div className="wk-boardwrap">
            <div className="wk-board" aria-label="A week's calendar filling up">
              {DAYS.map((d) => (
                <span key={d} className="wk-day">
                  {d}
                </span>
              ))}
              {CELLS.map((data) => (
                <Cell key={data.key} p={p} data={data} />
              ))}
            </div>
            <motion.p className="wk-endline" style={{ opacity: endOp }}>
              This is staying booked.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
