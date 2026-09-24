import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE, Reveal, RevealItem } from '@/components/ui/Reveal'
import { NICHES, SPEED_STATS } from '@/lib/niches'
import { BOOKING_URL } from '@/lib/booking'

/**
 * NICHE EXPLORER — the interactive comparison graph. Pick your niche and the
 * same market renders twice: what bookings look like WITHOUT a system (grey,
 * dashed, leaking demand to slow follow-up and missed inquiries) versus WITH
 * Stay Booked (tan, higher, smooth — the captured version of the same
 * demand). Both curves morph with a spring on every niche switch, the legend
 * toggles each series on and off, the stat cards flip to the one-pager's
 * details, and the speed-to-lead counters re-run (the 100x / 21x stats ARE
 * the comparison: our 5-minute AI contact vs. a reply 30 minutes later).
 *
 * The curves are illustrative seasonal patterns (labeled as such), not client
 * data. Reduced-motion visitors get the same section with instant swaps.
 */

const W = 640
const H = 300
const PAD_X = 16
const PAD_Y = 34
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const xAt = (i: number) => PAD_X + (i * (W - 2 * PAD_X)) / (MONTHS.length - 1)
const yAt = (v: number) => H - PAD_Y - (v / 100) * (H - 2 * PAD_Y)

/** The "without us" version of a niche's demand: the same market, but a
 *  portion of every month's bookings leaks to slow replies, missed calls,
 *  and competitors. Deterministic wobble so it never looks mechanical. */
function without(vals: number[]): number[] {
  return vals.map((v, i) =>
    Math.max(8, Math.round(v * (0.52 + 0.09 * Math.sin(i * 1.9 + 2))))
  )
}

/** Smooth cubic-bezier curve through all 12 points (same command count
 *  every time, so framer-motion can morph d values directly). */
function curveD(vals: number[]): string {
  let d = `M ${xAt(0)} ${yAt(vals[0])}`
  for (let i = 0; i < vals.length - 1; i++) {
    const y1 = yAt(vals[i])
    const y2 = yAt(vals[i + 1])
    const c1x = xAt(i) + (xAt(i + 1) - xAt(i)) / 3
    const c2x = xAt(i + 1) - (xAt(i + 1) - xAt(i)) / 3
    d += ` C ${c1x} ${y1 + (y2 - y1) / 3}, ${c2x} ${y2 - (y2 - y1) / 3}, ${xAt(i + 1)} ${y2}`
  }
  return d
}

/** The gradient area under the curve, closed to the baseline. */
function areaD(vals: number[]): string {
  return `${curveD(vals)} L ${xAt(vals.length - 1)} ${H - PAD_Y} L ${xAt(0)} ${H - PAD_Y} Z`
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

export default function NicheExplorer() {
  const [activeId, setActiveId] = useState(NICHES[0].id)
  const [hover, setHover] = useState<number | null>(null)
  const [showWith, setShowWith] = useState(true)
  const [showWithout, setShowWithout] = useState(true)
  const reduce = useReducedMotion()
  const niche = NICHES.find((n) => n.id === activeId) ?? NICHES[0]
  const withoutVals = without(niche.demand)
  // Under reduced motion the curve swaps instantly instead of flowing.
  const spring = reduce
    ? ({ duration: 0 } as const)
    : ({ type: 'spring', stiffness: 55, damping: 16 } as const)

  return (
    <section className="section section-deep nx-section" id="explorer">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">The comparison</RevealItem>
          <RevealItem as="h2" className="title">Same market. Two very different calendars.</RevealItem>
          <RevealItem as="p" className="body why-body">
            Pick your niche. The grey line is your market without a system: demand that slow
            follow-up and missed inquiries quietly leak away. The tan line is the same demand
            with Stay Booked, qualified and booked within 5 minutes.
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
            {/* The morphing demand curve */}
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
                    <p className="nx-chart-sub">With Stay Booked vs. without a system</p>
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

              <svg className="nx-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Illustrative comparison for ${niche.name}: bookings without a system versus with Stay Booked`}>
                <defs>
                  <linearGradient id="nx-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CFB48E" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#CFB48E" stopOpacity="0.04" />
                  </linearGradient>
                </defs>

                {/* gridlines */}
                {[0, 25, 50, 75, 100].map((g) => (
                  <line key={g} className="nx-gridline" x1={PAD_X} x2={W - PAD_X} y1={yAt(g)} y2={yAt(g)} />
                ))}

                {/* WITHOUT — grey dashed leak of the same demand */}
                <motion.path
                  className="nx-line nx-line-without"
                  style={{ opacity: showWithout ? 1 : 0 }}
                  initial={false}
                  animate={{ d: curveD(withoutVals) }}
                  transition={spring}
                />

                {/* WITH — the captured demand: gradient area + line */}
                <motion.path
                  fill="url(#nx-area)"
                  style={{ opacity: showWith ? 1 : 0 }}
                  initial={false}
                  animate={{ d: areaD(niche.demand) }}
                  transition={spring}
                />
                <motion.path
                  className="nx-line"
                  style={{ opacity: showWith ? 1 : 0 }}
                  initial={false}
                  animate={{ d: curveD(niche.demand) }}
                  transition={spring}
                />

                {/* month points + hover bubbles (both series) */}
                {MONTHS.map((m, i) => (
                  <g key={m}>
                    {showWithout && (
                      <motion.circle
                        className="nx-dot nx-dot-without"
                        r={hover === i ? 5 : 3}
                        initial={false}
                        animate={{ cy: yAt(withoutVals[i]), cx: xAt(i) }}
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
                        animate={{ cy: yAt(niche.demand[i]), cx: xAt(i) }}
                        transition={spring}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(null)}
                      />
                    )}
                    {hover === i && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <rect className="nx-bubble-box" x={xAt(i) - 72} y={yAt(niche.demand[i]) - 46} width="144" height="32" rx="16" />
                        <text className="nx-bubble-text" x={xAt(i)} y={yAt(niche.demand[i]) - 25} textAnchor="middle">
                          {MONTHS[i]}: {withoutVals[i]} → {niche.demand[i]}
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
                Illustrative comparison for {niche.name.toLowerCase()}: the same seasonal demand,
                with and without 5-minute AI follow-up and booking.
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

                  <p className="nx-side-label">Performance guarantee</p>
                  <p className="nx-side-text">
                    If we haven&apos;t delivered {niche.guarantee} by the end of the guarantee
                    window, your retainer pauses until we do.
                  </p>
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
