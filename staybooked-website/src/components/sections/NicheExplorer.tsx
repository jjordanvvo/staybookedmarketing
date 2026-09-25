import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE, Reveal, RevealItem } from '@/components/ui/Reveal'
import { NICHES, SPEED_STATS } from '@/lib/niches'
import { useIsMobile } from '@/hooks/useIsMobile'
import { BOOKING_URL } from '@/lib/booking'

/**
 * NICHE EXPLORER — the interactive comparison graph. Pick your niche and both
 * curves start at the SAME point — where the business is today — then diverge
 * across an illustrative 12 months:
 *
 *   WITH Stay Booked (tan): the same seasonal demand compounds, because every
 *   inquiry is qualified and booked within 5 minutes instead of leaking away.
 *   WITHOUT a system (grey, dashed): business as usual, slowly drifting down
 *   as slow follow-up and competitors take their cut.
 *
 * Both curves morph with a spring on every niche switch, the legend toggles
 * each series on and off, the stat cards flip to the one-pager's details, and
 * the speed-to-lead counters re-run (the 100x / 21x stats ARE the comparison:
 * our 5-minute AI contact vs. a reply 30 minutes later).
 *
 * The curves are illustrative (labeled as such), not client data or a promise.
 * The y-scale is dynamic per niche, so the divergence always fills the chart.
 * Reduced-motion visitors get the same section with instant swaps.
 */

const W = 640
const H = 300
const PAD_X = 16
const PAD_Y = 34
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const xAt = (i: number) => PAD_X + (i * (W - 2 * PAD_X)) / (MONTHS.length - 1)
const yAt = (v: number, max: number) => H - PAD_Y - (v / max) * (H - 2 * PAD_Y)

/** WITH Stay Booked: the seasonal demand shape (0-100) with a compounding
 *  capture factor — 1.0x at month one, 1.75x by month twelve. */
function withCurve(vals: number[]): number[] {
  return vals.map((v, i) => Math.round(v * (1 + (0.75 * i) / (MONTHS.length - 1))))
}

/** WITHOUT a system: the same seasonal shape at the same starting point, with
 *  a leak factor — 1.0x at month one, 0.9x by month twelve. By construction
 *  the with-line ends at exactly 1.9x the without-line. */
function withoutCurve(vals: number[]): number[] {
  return vals.map((v, i) =>
    Math.round(v * (1 - (0.1 * i) / (MONTHS.length - 1)))
  )
}

/** Smooth cubic-bezier curve through all 12 points (same command count
 *  every time, so framer-motion can morph d values directly). */
function curveD(vals: number[], max: number): string {
  let d = `M ${xAt(0)} ${yAt(vals[0], max)}`
  for (let i = 0; i < vals.length - 1; i++) {
    const y1 = yAt(vals[i], max)
    const y2 = yAt(vals[i + 1], max)
    const c1x = xAt(i) + (xAt(i + 1) - xAt(i)) / 3
    const c2x = xAt(i + 1) - (xAt(i + 1) - xAt(i)) / 3
    d += ` C ${c1x} ${y1 + (y2 - y1) / 3}, ${c2x} ${y2 - (y2 - y1) / 3}, ${xAt(i + 1)} ${y2}`
  }
  return d
}

/** The gradient area under the with-curve, closed to the baseline. */
function areaD(vals: number[], max: number): string {
  return `${curveD(vals, max)} L ${xAt(vals.length - 1)} ${H - PAD_Y} L ${xAt(0)} ${H - PAD_Y} Z`
}

/** Count-up that re-runs whenever `trigger` changes. */
function useCountUp(target: number, trigger: unknown, dur = 700): number {
  const [val, setVal] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, trigger, dur])
  return val
}

function StatCounter({ value, suffix, label, trigger }: { value: number; suffix: string; label: string; trigger: unknown }) {
  const counted = useCountUp(value, trigger)
  const shown = counted
  return (
    <div className="nx-stat">
      <span className="nx-stat-value">
        {shown}
        {suffix}
      </span>
      <span className="nx-stat-label">{label}</span>
    </div>
  )
}

/**
 * GuaranteeBlock — "Performance guarantee" as a title with a short line.
 * On mobile the detail is collapsed behind a Learn more toggle; on desktop
 * the full sentence stays visible as before.
 */
function GuaranteeBlock({ text }: { text: string }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  if (!isMobile) {
    return (
      <>
        <p className="nx-side-label">Performance guarantee</p>
        <p className="nx-side-text">{text}</p>
      </>
    )
  }

  return (
    <div className="nx-guarantee">
      <p className="nx-side-label">Performance guarantee</p>
      <p className="nx-side-text">No results, no retainer — it pauses until we deliver.</p>
      <button type="button" className="nx-learnmore" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? 'Show less' : 'Learn more'}
      </button>
      {open && <p className="nx-side-text nx-guarantee-detail">{text}</p>}
    </div>
  )
}

export default function NicheExplorer() {
  const [activeId, setActiveId] = useState(NICHES[0].id)
  const [hover, setHover] = useState<number | null>(null)
  const [showWith, setShowWith] = useState(true)
  const [showWithout, setShowWithout] = useState(true)
  const reduce = useReducedMotion()
  const niche = NICHES.find((n) => n.id === activeId) ?? NICHES[0]
  // Under reduced motion the curve swaps instantly instead of flowing.
  const spring = reduce
    ? ({ duration: 0 } as const)
    : ({ type: 'spring', stiffness: 55, damping: 16 } as const)

  const withVals = withCurve(niche.demand)
  const withoutVals = withoutCurve(niche.demand)
  const maxV = Math.max(...withVals) * 1.06

  return (
    <section className="section section-deep nx-section" id="explorer">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">The comparison</RevealItem>
          <RevealItem as="h2" className="title">Both lines start where you are today.</RevealItem>
          <RevealItem as="p" className="body why-body">
            Pick your niche. The grey line is business as usual: bookings quietly leaking
            to slow follow-up and competitors. The tan line is the same demand with Stay
            Booked — every inquiry qualified and booked within 5 minutes, compounding
            month after month.
          </RevealItem>
        </Reveal>

        <Reveal className="nx-board" amount={0.2}>
          {/* Niche selector */}
          <div className="nx-chips" role="tablist" aria-label="Choose your niche">
            {NICHES.map((n) => {
              const active = n.id === activeId
              return (
                <button
                  key={n.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`nx-chip${active ? ' nx-chip-active' : ''}`}
                  onClick={() => setActiveId(n.id)}
                >
                  {n.name}
                </button>
              )
            })}
          </div>

          <div className="nx-grid">
            {/* The morphing before/after chart */}
            <div className="nx-chartcard">
              <div className="nx-chart-head">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={niche.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <p className="nx-chart-title">{niche.name}</p>
                    <p className="nx-chart-sub">Bookings over 12 months, with and without the system</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="nx-legend">
                <button
                  type="button"
                  className={`nx-legend-chip${showWithout ? '' : ' nx-legend-off'}`}
                  onClick={() => setShowWithout((v) => !v)}
                  aria-pressed={showWithout}
                >
                  <span className="nx-legend-swatch nx-legend-swatch-without" aria-hidden="true" />
                  Without a system
                </button>
                <button
                  type="button"
                  className={`nx-legend-chip${showWith ? '' : ' nx-legend-off'}`}
                  onClick={() => setShowWith((v) => !v)}
                  aria-pressed={showWith}
                >
                  <span className="nx-legend-swatch nx-legend-swatch-with" aria-hidden="true" />
                  With Stay Booked
                </button>
              </div>

              <svg className="nx-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Illustrative 12-month booking trajectory for ${niche.name}: with Stay Booked versus without a system`}>
                <defs>
                  <linearGradient id="nx-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CFB48E" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#CFB48E" stopOpacity="0.04" />
                  </linearGradient>
                </defs>

                {/* gridlines (relative to the niche's own scale) */}
                {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                  <line key={f} className="nx-gridline" x1={PAD_X} x2={W - PAD_X} y1={yAt(maxV * f, maxV)} y2={yAt(maxV * f, maxV)} />
                ))}

                {/* WITHOUT — grey dashed: same start, slow leak */}
                <motion.path
                  className="nx-line nx-line-without"
                  style={{ opacity: showWithout ? 1 : 0 }}
                  initial={false}
                  animate={{ d: curveD(withoutVals, maxV) }}
                  transition={spring}
                />

                {/* WITH — the captured demand: gradient area + line */}
                <motion.path
                  fill="url(#nx-area)"
                  style={{ opacity: showWith ? 1 : 0 }}
                  initial={false}
                  animate={{ d: areaD(withVals, maxV) }}
                  transition={spring}
                />
                <motion.path
                  className="nx-line"
                  style={{ opacity: showWith ? 1 : 0 }}
                  initial={false}
                  animate={{ d: curveD(withVals, maxV) }}
                  transition={spring}
                />

                {/* end-state labels — the result, stated plainly */}
                {showWith && (
                  <motion.text
                    className="nx-endlabel nx-endlabel-with"
                    x={W - PAD_X - 4}
                    textAnchor="end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: yAt(withVals[withVals.length - 1], maxV) - 14 }}
                    transition={spring}
                  >
                    1.9x business as usual by month 12
                  </motion.text>
                )}
                {showWithout && (
                  <motion.text
                    className="nx-endlabel nx-endlabel-without"
                    x={W - PAD_X - 4}
                    textAnchor="end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: yAt(withoutVals[withoutVals.length - 1], maxV) + 22 }}
                    transition={spring}
                  >
                    1 in 10 bookings still leaks
                  </motion.text>
                )}

                {/* month points + hover bubbles (both series) */}
                {MONTHS.map((m, i) => (
                  <g key={m}>
                    {showWithout && (
                      <motion.circle
                        className="nx-dot nx-dot-without"
                        r={hover === i ? 5 : 3}
                        initial={false}
                        animate={{ cy: yAt(withoutVals[i], maxV), cx: xAt(i) }}
                        transition={spring}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                      />
                    )}
                    {showWith && (
                      <motion.circle
                        className="nx-dot"
                        r={hover === i ? 6 : 3.5}
                        initial={false}
                        animate={{ cy: yAt(withVals[i], maxV), cx: xAt(i) }}
                        transition={spring}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                      />
                    )}
                    {hover === i && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <rect className="nx-bubble-box" x={xAt(i) - 74} y={Math.min(yAt(withVals[i], maxV), yAt(withoutVals[i], maxV)) - 46} width="148" height="32" rx="16" />
                        <text className="nx-bubble-text" x={xAt(i)} y={Math.min(yAt(withVals[i], maxV), yAt(withoutVals[i], maxV)) - 25} textAnchor="middle">
                          {MONTHS[i]}: {withoutVals[i]} → {withVals[i]}
                        </text>
                      </motion.g>
                    )}
                  </g>
                ))}
              </svg>

              <div className="nx-months">
                {MONTHS.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <p className="nx-note">
                Illustrative trajectory for {niche.name.toLowerCase()}, not a promise: both lines
                start at the same point, and with us the same demand compounds while
                business as usual leaks. Actual results vary by niche and budget.
              </p>
            </div>

            {/* The one-pager details, animated per niche */}
            <div className="nx-side">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={niche.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="nx-side-inner"
                >
                  <p className="nx-side-label">What we book</p>
                  <div className="nx-books">
                    {niche.books.map((b) => (
                      <span className="nx-book" key={b}>{b}</span>
                    ))}
                  </div>

                  <p className="nx-side-label">The system is tuned around</p>
                  <p className="nx-side-text">{niche.tuned}.</p>

                  <p className="nx-side-label">Your AI books in real time and reports to</p>
                  <p className="nx-side-text">{niche.handoff}.</p>

                  <GuaranteeBlock text={`If we haven't delivered ${niche.guarantee} by the end of the guarantee window, your retainer pauses until we do.`} />
                </motion.div>
              </AnimatePresence>

              <div className="nx-stats">
                {SPEED_STATS.map((s) => (
                  <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} trigger={activeId} />
                ))}
              </div>

              <div className="nx-invest">
                <div className="nx-invest-row">
                  <span className="nx-invest-label">Ad spend</span>
                  <div className="nx-invest-barwrap">
                    <motion.div
                      className="nx-invest-bar nx-invest-bar-spend"
                      initial={false}
                      animate={{ width: `${(1500 / 2000) * 100}%` }}
                      transition={spring}
                    />
                  </div>
                  <span className="nx-invest-amt">~$1,500/mo</span>
                </div>
                <div className="nx-invest-row">
                  <span className="nx-invest-label">Retainer</span>
                  <div className="nx-invest-barwrap">
                    <motion.div
                      className="nx-invest-bar nx-invest-bar-retainer"
                      initial={false}
                      animate={{ width: '100%' }}
                      transition={spring}
                    />
                  </div>
                  <span className="nx-invest-amt">~$2,000/mo</span>
                </div>
                <p className="nx-invest-note">
                  No startup fee. No long-term contract. Ad spend goes to the platforms, not us.
                  Retainer varies by {niche.varies}.
                </p>
              </div>

              <a className="contact-book-btn nx-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Book a Free Strategy Call
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
