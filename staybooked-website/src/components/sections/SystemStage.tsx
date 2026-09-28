import type { MotionValue } from 'framer-motion'

/**
 * SystemStage — the site's persistent graphic figure.
 *
 * One object, pinned for a whole flow segment. Per Kolby's Sept 28, 2026
 * directive there is NO scroll-driven change of any kind: no counters, no
 * card slides, no line stamping, no cell pops, no ambient loops, and no
 * morph between views. The figure is one static graphic per segment.
 *
 * Segment A: THE WEEK board (settled, 24 booked).
 * Segment B: THE LEDGER receipt (settled, fully stamped).
 *
 * All copy mirrors the real sections (pricing, what's included) — no
 * invented facts.
 */

/* ---------------- shared helpers ---------------- */

function Badge({ no, label }: { no: string; label: string }) {
  return (
    <p className="st-badge">
      <span className="st-badge-no">{no}</span>
      {label}
    </p>
  )
}

/* ---------------- the Week view (segment A) ---------------- */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const OPEN_SLOTS = new Set(['2-4', '5-2', '6-1', '4-3'])

type CellData = { key: string; bookable: boolean; bookIndex: number }
const CELLS: CellData[] = []
{
  let bi = 0
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 7; c++) {
      const key = `${c}-${r}`
      const bookable = !OPEN_SLOTS.has(key)
      CELLS.push({ key, bookable, bookIndex: bi })
      if (bookable) bi++
    }
  }
}
const BOOKABLE = 24

function WeekView() {
  return (
    <div className="st-view st-week">
      <Badge no="01" label="The Week" />
      <div className="wk-count">
        <span className="wk-num wk-num-tan">{BOOKABLE}</span>
      </div>
      <div className="wk-unitwrap">
        <p className="wk-unit">appointments booked</p>
      </div>
      <div className="wk-board">
        {DAYS.map((d) => (
          <span key={d} className="wk-day">
            {d}
          </span>
        ))}
        {CELLS.map((data) => (
          <span key={data.key} className="wk-cell">
            {data.bookable ? (
              <span className={`wk-booked wk-shade-${data.bookIndex % 3}`} aria-hidden="true" />
            ) : (
              <span className="wk-open" aria-hidden="true" />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------- the Ledger view (segment B) ---------------- */

const LINES = [
  { item: 'Campaign creation', price: 'included' },
  { item: 'Ad management', price: 'included' },
  { item: 'Lead follow-up + qualification', price: 'included' },
  { item: 'Booking, end to end', price: 'included' },
  { item: 'Startup fee', price: '$0' },
]

function LedgerView() {
  return (
    <div className="st-view st-ledger">
      <Badge no="03" label="The Ledger" />
      <div className="ledger-card">
        <p className="ledger-head">Stay Booked Marketing</p>
        <p className="ledger-sub">monthly</p>
        <div className="ledger-lines">
          {LINES.map((l) => (
            <div key={l.item} className="ledger-line">
              <span className="ledger-item">{l.item}</span>
              <span className="ledger-dots" aria-hidden="true" />
              <span className="ledger-price">{l.price}</span>
            </div>
          ))}
        </div>
        <div className="ledger-total">
          <span>Total</span>
          <span className="ledger-dots" aria-hidden="true" />
          <span className="ledger-total-price">$2,000/mo</span>
        </div>
        <p className="ledger-foot">+ ad spend, billed by the platforms. Always yours.</p>
      </div>
    </div>
  )
}

/* ---------------- the stage ---------------- */

export default function SystemStage({ variant }: { p?: MotionValue<number>; variant: 'A' | 'B' }) {
  // One fully static graphic per segment. No crossfade, no morph, no
  // scroll-driven change of any kind (Kolby, Sept 28, 2026: the figure
  // changing during scroll was the animation he wanted gone, full stop).
  return (
    <div className="stage">
      {variant === 'A' ? <WeekView /> : <LedgerView />}
    </div>
  )
}
