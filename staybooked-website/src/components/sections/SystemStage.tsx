import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'

/**
 * SystemStage — the site's persistent graphic figure.
 *
 * One object, pinned for a whole flow segment. Per Kolby's Sept 28, 2026
 * directive, NOTHING inside a view is scroll-animated anymore: every view
 * renders fully settled (no counters, no card slides, no line stamping,
 * no cell pops, no ambient loops). The only remaining change is the single
 * crossfade between the segment's two views.
 *
 * Segment A: THE WEEK board (settled, 24 booked) crossfades once into
 *           THE SYSTEM diagram (settled: ads catch > we qualify > it books).
 * Segment B: THE LEDGER receipt (settled, fully stamped) crossfades once
 *           into THE STAMP, the fully booked card with the booking CTA.
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

/* Segment-A crossfade window (the only remaining scrub). */
const W = {
  weekOut: [0.44, 0.52],
  sysIn: [0.46, 0.54],
}

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

/* ---------------- the System view (segment A) ---------------- */

function SystemView() {
  return (
    <div className="st-view st-system">
      <Badge no="02" label="The System" />
      <div className="sys-chain">
        <div className="sys-node">
          <span className="sys-glyph sys-glyph-ads" aria-hidden="true" />
          <div>
            <p className="sys-node-title">Ads catch</p>
            <p className="sys-node-sub">the right local customers</p>
          </div>
        </div>
        <span className="sys-link" aria-hidden="true" />
        <div className="sys-node">
          <span className="sys-glyph sys-glyph-filter" aria-hidden="true" />
          <div>
            <p className="sys-node-title">We qualify</p>
            <p className="sys-node-sub">every single lead, automatically</p>
          </div>
        </div>
        <span className="sys-link" aria-hidden="true" />
        <div className="sys-node sys-node-cal">
          <div className="sys-minical" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <i key={i} className="sys-minical-block" />
            ))}
          </div>
          <div>
            <p className="sys-node-title">It books</p>
            <p className="sys-node-sub">ready customers, straight on your calendar</p>
          </div>
        </div>
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

/* ---------------- the Stamp view (segment B) ---------------- */

function StampView() {
  return (
    <div className="st-view st-stamp">
      <Badge no="04" label="The Stamp" />
      <div className="stamp-card">
        <div className="wk-board stamp-board">
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
        <p className="stamp-word">Stay Booked.</p>
        <div>
          <a className="stamp-cta" href="/book">
            Book a Call
          </a>
        </div>
      </div>
    </div>
  )
}

/* ---------------- the stage ---------------- */

export default function SystemStage({ p, variant }: { p: MotionValue<number>; variant: 'A' | 'B' }) {
  const reduce = useReducedMotion()

  // View crossfades — the only scroll-driven change left.
  const weekOp = useTransform(p, [W.weekOut[0], W.weekOut[1]], [1, 0])
  const sysOp = useTransform(p, [W.sysIn[0], W.sysIn[1]], [0, 1])
  const ledgerOp = useTransform(p, [0.48, 0.55], [1, 0])
  const stampOp = useTransform(p, [0.52, 0.6], [0, 1])

  if (reduce) {
    return (
      <div className="stage">
        {variant === 'A' ? <SystemView /> : <StampView />}
      </div>
    )
  }

  return (
    <div className="stage">
      {variant === 'A' ? (
        <>
          <motion.div className="st-layer" style={{ opacity: weekOp }}>
            <WeekView />
          </motion.div>
          <motion.div className="st-layer" style={{ opacity: sysOp }}>
            <SystemView />
          </motion.div>
        </>
      ) : (
        <>
          <motion.div className="st-layer" style={{ opacity: ledgerOp }}>
            <LedgerView />
          </motion.div>
          <motion.div className="st-layer" style={{ opacity: stampOp }}>
            <StampView />
          </motion.div>
        </>
      )}
    </div>
  )
}
