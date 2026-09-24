import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE, Reveal, RevealItem } from '@/components/ui/Reveal'
import { NICHES, SPEED_STATS } from '@/lib/niches'
import { BOOKING_URL } from '@/lib/booking'

/**
 * NICHE EXPLORER — the interactive graph. Pick your niche; the demand curve
 * morphs to that market's seasonality with a spring, the stat cards flip to
 * the one-pager's details, and the speed-to-lead counters re-run. Everything
 * on screen is the same story the sales one-pager tells, just alive.
 *
 * The curve is an illustrative seasonal pattern (labeled as such), not client
 * data. Reduced-motion visitors get the same section with instant swaps.
 */

const W = 640
const H = 300
const PAD_X = 16
const PAD_Y = 34
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const xAt = (i: number) => PAD_X + (i * (W - 2 * PAD_X)) / (MONTHS.length - 1)
const yAt = (v: number) => H - PAD_Y - (v / 100) * (H - 2 * PAD_Y)

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
  const reduce = useReducedMotion()
  const niche = NICHES.find((n) => n.id === activeId) ?? NICHES[0]
  // Under reduced motion the curve swaps instantly instead of flowing.
  const spring = reduce
    ? ({ duration: 0 } as const)
    : ({ type: 'spring', stiffness: 55, damping: 16 } as const)

  return (
    <section className="section section-deep nx-section" id="explorer">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">The numbers</RevealItem>
          <RevealItem as="h2" className="title">See what booked looks like.</RevealItem>
          <RevealItem as="p" className="body why-body">
            Pick your niche. Every system is tuned to how your market books, month by month.
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
                    <p className="nx-chart-sub">When your market books, month by month</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <svg className="nx-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Illustrative monthly demand pattern for ${niche.name}`}>
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

                {/* area + line morph to the active niche */}
                <motion.path
                  fill="url(#nx-area)"
                  initial={false}
                  animate={{ d: areaD(niche.demand) }}
                  transition={spring}
                />
                <motion.path
                  className="nx-line"
                  initial={false}
                  animate={{ d: curveD(niche.demand) }}
                  transition={spring}
                />

                {/* month points + hover bubbles */}
                {MONTHS.map((m, i) => (
                  <g key={m}>
                    <motion.circle
                      className="nx-dot"
                      r={hover === i ? 6 : 3.5}
                      initial={false}
                      animate={{ cy: yAt(niche.demand[i]), cx: xAt(i) }}
                      transition={spring}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                    />
                    {hover === i && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <rect className="nx-bubble-box" x={xAt(i) - 44} y={yAt(niche.demand[i]) - 42} width="88" height="30" rx="15" />
                        <text className="nx-bubble-text" x={xAt(i)} y={yAt(niche.demand[i]) - 22} textAnchor="middle">
                          {MONTHS[i]} · {niche.demand[i]}
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
              <p className="nx-note">Illustrative seasonal demand pattern for {niche.name.toLowerCase()}.</p>
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
