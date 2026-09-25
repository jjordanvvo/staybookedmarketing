import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'

/**
 * SystemStage — the site's persistent graphic figure.
 *
 * One object, pinned for a whole flow segment, that morphs through the
 * story as you scroll. Like the traveling figure on the reference sites,
 * it is ALWAYS alive: scrubbed states while you move, ambient loops
 * (pulses, sweeps, breath) when you pause. It never pauses YOU.
 *
 * Segment A: THE WEEK board assembles, leaks (13 missed), fills (24 booked),
 *           then crossfades into THE SYSTEM diagram, whose lead pulses
 *           travel from ads to qualification to a calendar that books itself.
 * Segment B: THE LEDGER receipt stamps its line items and sweeps its total,
 *           then folds into THE STAMP, the fully booked card with the
 *           booking CTA breathing on it.
 *
 * All copy mirrors the real sections (pricing, what's included) — no
 * invented facts. Pure scroll scrub + ambient CSS loops, transform-only.
 */

/* ---------------- shared helpers ---------------- */

/** Linear window of a scrub: 0 before `from`, 1 after `to`. */
const win = (p: MotionValue<number>, from: number, to: number) =>
  useTransform(p, [from, to], [0, 1], { clamp: true })

function Badge({ lit, no, label }: { lit: MotionValue<number>; no: string; label: string }) {
  // MotionValue<number> isn't assignable to the `Opacity` style type, so
  // drive it through a transform that returns the union-framed value.
  const op = useTransform(lit, (v) => v as 0 | 1 | `${number}`)
  return (
    <motion.p className="st-badge" style={{ opacity: op }}>
      <span className="st-badge-no">{no}</span>
      {label}
    </motion.p>
  )
}

/* ---------------- the Week view (segment A) ---------------- */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const OPEN_SLOTS = new Set(['2-4', '5-2', '6-1', '4-3'])

type CellData = { key: string; bookable: boolean; bookIndex: number; missed: boolean; missIndex: number }
const CELLS: CellData[] = []
{
  let bi = 0
  let mi = 0
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 7; c++) {
      const key = `${c}-${r}`
      const bookable = !OPEN_SLOTS.has(key)
      const missed = bookable && (bi * 7) % 24 < 13
      CELLS.push({ key, bookable, bookIndex: bi, missed, missIndex: mi })
      if (missed) mi++
      if (bookable) bi++
    }
  }
}
const BOOKABLE = 24
const MISSED_N = 13

/* Segment-A scrub windows */
const W = {
  assemble: [0.0, 0.06],
  act1: [0.06, 0.22],
  flip: [0.24, 0.38],
  weekOut: [0.44, 0.52],
  sysIn: [0.46, 0.54],
}

function WeekCell({ p, data }: { p: MotionValue<number>; data: CellData }) {
  const flipT = 0.24 + (data.bookIndex / BOOKABLE) * 0.13
  const fIn = win(p, flipT, flipT + 0.04)
  const mStart = 0.06 + (data.missIndex / MISSED_N) * 0.12
  const mIn = win(p, mStart, mStart + 0.05)
  const mOut = win(p, flipT - 0.04, flipT)
  const mOp = useTransform([mIn, mOut], (v: number[]) => v[0] * v[1])
  const mScale = useTransform(mIn, (v) => 0.55 + 0.45 * v)
  const bScale = useTransform(fIn, (v) => 0.45 + 0.55 * v)
  const shellIn = win(p, W.assemble[0], W.assemble[1])

  return (
    <motion.span className="wk-cell" style={{ opacity: shellIn }}>
      {data.missed && (
        <motion.span className="wk-missed" aria-hidden="true" style={{ opacity: mOp, scale: mScale }}>
          <i className="wk-missed-dot" />
        </motion.span>
      )}
      {data.bookable ? (
        <motion.span
          className={`wk-booked wk-shade-${data.bookIndex % 3}`}
          aria-hidden="true"
          style={{ opacity: fIn, scale: bScale }}
        />
      ) : (
        <span className="wk-open" aria-hidden="true" />
      )}
    </motion.span>
  )
}

function WeekView({ p }: { p: MotionValue<number> }) {
  const missedN = useTransform(p, [W.act1[0], W.act1[1]], [0, MISSED_N], { clamp: true })
  const missedNum = useTransform(missedN, (v) => String(Math.round(v)))
  const bookedN = useTransform(p, [W.flip[0], W.flip[1]], [0, BOOKABLE], { clamp: true })
  const bookedNum = useTransform(bookedN, (v) => String(Math.round(v)))
  const missedOp = useTransform(p, [0.2, 0.24], [1, 0])
  const bookedOp = useTransform(p, [0.22, 0.26], [0, 1])
  const washOp = useTransform(p, [0.22, 0.34], [0, 1])

  return (
    <div className="st-view st-week">
      <motion.div className="wk-wash" data-wash aria-hidden="true" style={{ opacity: washOp }} />
      <Badge lit={win(p, 0.0, 0.03)} no="01" label="The Week" />
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
      <div className="wk-board">
        {DAYS.map((d) => (
          <span key={d} className="wk-day">
            {d}
          </span>
        ))}
        {CELLS.map((data) => (
          <WeekCell key={data.key} p={p} data={data} />
        ))}
      </div>
    </div>
  )
}

/* ---------------- the System view (segment A) ---------------- */

function SystemView({ p }: { p: MotionValue<number> }) {
  const card1 = win(p, 0.5, 0.56)
  const card2 = win(p, 0.55, 0.61)
  const card3 = win(p, 0.6, 0.66)
  return (
    <div className="st-view st-system">
      <Badge lit={win(p, 0.48, 0.54)} no="02" label="The System" />
      <div className="sys-chain">
        <motion.div className="sys-node" style={{ opacity: card1, y: useTransform(card1, (v) => (1 - v) * 18) }}>
          <span className="sys-glyph sys-glyph-ads" aria-hidden="true" />
          <div>
            <p className="sys-node-title">Ads catch</p>
            <p className="sys-node-sub">the right local customers</p>
          </div>
        </motion.div>
        <span className="sys-link" aria-hidden="true">
          <i className="sys-pulse sys-pulse-1" />
          <i className="sys-pulse sys-pulse-2" />
        </span>
        <motion.div className="sys-node" style={{ opacity: card2, y: useTransform(card2, (v) => (1 - v) * 18) }}>
          <span className="sys-glyph sys-glyph-filter" aria-hidden="true" />
          <div>
            <p className="sys-node-title">We qualify</p>
            <p className="sys-node-sub">every single lead, automatically</p>
          </div>
        </motion.div>
        <span className="sys-link" aria-hidden="true">
          <i className="sys-pulse sys-pulse-1" />
          <i className="sys-pulse sys-pulse-2" />
        </span>
        <motion.div className="sys-node sys-node-cal" style={{ opacity: card3, y: useTransform(card3, (v) => (1 - v) * 18) }}>
          <div className="sys-minical" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <i key={i} className="sys-minical-block" style={{ animationDelay: `${i * 0.55}s` }} />
            ))}
          </div>
          <div>
            <p className="sys-node-title">It books</p>
            <p className="sys-node-sub">ready customers, straight on your calendar</p>
          </div>
        </motion.div>
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

function LedgerView({ p }: { p: MotionValue<number> }) {
  const headIn = win(p, 0.0, 0.05)
  const totalIn = win(p, 0.38, 0.44)
  const footIn = win(p, 0.42, 0.47)
  return (
    <div className="st-view st-ledger">
      <Badge lit={headIn} no="03" label="The Ledger" />
      <motion.div className="ledger-card" style={{ opacity: headIn, y: useTransform(headIn, (v) => (1 - v) * 16) }}>
        <p className="ledger-head">Stay Booked Marketing</p>
        <p className="ledger-sub">monthly</p>
        <div className="ledger-lines">
          {LINES.map((l, i) => {
            const from = 0.06 + i * 0.06
            const lit = win(p, from, from + 0.05)
            return (
              <motion.div key={l.item} className="ledger-line" style={{ opacity: lit }}>
                <span className="ledger-item">{l.item}</span>
                <span className="ledger-dots" aria-hidden="true" />
                <span className="ledger-price">{l.price}</span>
              </motion.div>
            )
          })}
        </div>
        <motion.div className="ledger-total" style={{ opacity: totalIn }}>
          <span>Total</span>
          <span className="ledger-dots" aria-hidden="true" />
          <span className="ledger-total-price">$2,000/mo</span>
          <i className="ledger-sweep" aria-hidden="true" />
        </motion.div>
        <motion.p className="ledger-foot" style={{ opacity: footIn }}>
          + ad spend, billed by the platforms. Always yours.
        </motion.p>
      </motion.div>
    </div>
  )
}

/* ---------------- the Stamp view (segment B) ---------------- */

function StampView({ p }: { p: MotionValue<number> }) {
  const inA = win(p, 0.52, 0.6)
  const ctaIn = win(p, 0.6, 0.68)
  return (
    <div className="st-view st-stamp">
      <Badge lit={inA} no="04" label="The Stamp" />
      <motion.div className="stamp-card" style={{ opacity: inA, scale: useTransform(inA, (v) => 0.92 + 0.08 * v) }}>
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
        <motion.div style={{ opacity: ctaIn }}>
          <a className="stamp-cta" href="/book">
            Book a Call
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ---------------- the stage ---------------- */

export default function SystemStage({ p, variant }: { p: MotionValue<number>; variant: 'A' | 'B' }) {
  const reduce = useReducedMotion()

  // Reduced motion: a real MotionValue pinned at 1 so every internal
  // transform resolves to the settled end state of the segment's story.
  const done = useMotionValue(reduce ? 1 : 0)
  if (reduce) {
    return (
      <div className="stage">
        {variant === 'A' ? <SystemView p={done} /> : <StampView p={done} />}
      </div>
    )
  }

  // View crossfades.
  const weekOp = useTransform(p, [W.weekOut[0], W.weekOut[1]], [1, 0])
  const weekScale = useTransform(p, [W.weekOut[0], W.weekOut[1]], [1, 0.94])
  const sysOp = useTransform(p, [W.sysIn[0], W.sysIn[1]], [0, 1])
  const ledgerOp = useTransform(p, [0.48, 0.55], [1, 0])
  const ledgerScale = useTransform(p, [0.48, 0.55], [1, 0.94])
  const stampOp = useTransform(p, [0.52, 0.6], [0, 1])
  const driftY = useTransform(p, [0, 1], [26, -26])

  return (
    <motion.div className="stage" style={{ y: driftY }}>
      {variant === 'A' ? (
        <>
          <motion.div className="st-layer" style={{ opacity: weekOp, scale: weekScale }}>
            <WeekView p={p} />
          </motion.div>
          <motion.div className="st-layer" style={{ opacity: sysOp }}>
            <SystemView p={p} />
          </motion.div>
        </>
      ) : (
        <>
          <motion.div className="st-layer" style={{ opacity: ledgerOp, scale: ledgerScale }}>
            <LedgerView p={p} />
          </motion.div>
          <motion.div className="st-layer" style={{ opacity: stampOp }}>
            <StampView p={p} />
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
