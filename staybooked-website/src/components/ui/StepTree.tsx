import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { NEXT_STEPS } from '@/lib/nextSteps'
import { EASE } from '@/components/ui/Reveal'

/**
 * StepTree — the four "what happens next" steps as a small tree. As the
 * section scrolls in, roots spread, the trunk grows up from the ground and
 * each branch reaches out to its step, lowest (01) to the crown (04), leafing
 * out as it lands. Growth only moves forward: scroll back up and the tree
 * stays grown. Every step is a button: hover, focus or tap one and it lights
 * up and its detail opens in the card under the tree. Echoes the hero tree.
 */

// viewBox 0 0 400 430
const ROOTS = ['M200 428 C 186 430, 168 432, 150 428', 'M200 428 C 216 431, 232 433, 252 430', 'M200 428 C 194 432, 186 436, 176 438']
const TRUNK_LOW = 'M200 430 C 198 392, 205 344, 201 292'
const TRUNK_HIGH = 'M201 292 C 197 240, 199 186, 203 136 C 206 100, 205 80, 204 58'

type Leaf = { x: number; y: number; r: number; alt?: boolean }
const BRANCHES: { d: string; twig: string; node: { x: number; y: number }; side: 'l' | 'r'; leaves: Leaf[] }[] = [
  {
    d: 'M200 372 C 172 368, 142 360, 114 340',
    twig: 'M152 362 C 148 352, 148 344, 152 334',
    node: { x: 114, y: 340 },
    side: 'l',
    leaves: [{ x: 152, y: 334, r: -100 }, { x: 150, y: 346, r: -160, alt: true }, { x: 176, y: 366, r: 110 }],
  },
  {
    d: 'M201 296 C 228 292, 258 280, 288 258',
    twig: 'M254 284 C 258 274, 264 268, 272 264',
    node: { x: 288, y: 258 },
    side: 'r',
    leaves: [{ x: 272, y: 264, r: -40 }, { x: 260, y: 276, r: -110, alt: true }, { x: 230, y: 292, r: 80 }],
  },
  {
    d: 'M200 208 C 172 204, 144 192, 118 168',
    twig: 'M154 198 C 150 188, 152 180, 158 172',
    node: { x: 118, y: 168 },
    side: 'l',
    leaves: [{ x: 158, y: 172, r: -80 }, { x: 150, y: 186, r: -150, alt: true }, { x: 178, y: 206, r: 100 }],
  },
  {
    d: 'M203 128 C 228 120, 254 104, 280 78',
    twig: 'M248 110 C 250 100, 256 92, 264 88',
    node: { x: 280, y: 78 },
    side: 'r',
    leaves: [{ x: 264, y: 88, r: -50 }, { x: 250, y: 104, r: -120, alt: true }, { x: 226, y: 122, r: 70 }],
  },
]
const CROWN: Leaf[] = [
  { x: 204, y: 58, r: -90 },
  { x: 204, y: 62, r: -140, alt: true },
  { x: 204, y: 62, r: -40 },
  { x: 202, y: 80, r: -170 },
  { x: 206, y: 84, r: -10, alt: true },
]
const LEAF = 'M0 0 C 6 -7, 17 -7, 24 0 C 17 7, 6 7, 0 0 Z'

// each branch grows in its own slice of the (forward-only) scroll progress
const SLICES = [
  [0.2, 0.38],
  [0.36, 0.54],
  [0.52, 0.7],
  [0.68, 0.86],
] as const

function Stroke({ d, cls, g, from, to, still }: { d: string; cls: string; g: MotionValue<number>; from: number; to: number; still: boolean }) {
  const len = useTransform(g, [from, to], [0, 1])
  return <motion.path d={d} className={cls} style={{ pathLength: still ? 1 : len }} />
}

function Leaves({ leaves, g, at, still }: { leaves: Leaf[]; g: MotionValue<number>; at: number; still: boolean }) {
  const k = useTransform(g, [at - 0.04, at + 0.06], [0, 1])
  return (
    <motion.g style={still ? undefined : { opacity: k }}>
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
          <motion.path
            d={LEAF}
            className={`tree-leaf${l.alt ? ' is-alt' : ''}`}
            style={still ? undefined : { scale: k, animationDelay: `${(l.x + l.y) % 7 * -0.6}s` }}
          />
        </g>
      ))}
    </motion.g>
  )
}

export default function StepTree() {
  const ref = useRef<HTMLDivElement>(null)
  const still = !!useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.6 })

  // forward-only growth
  const g = useMotionValue(still ? 1 : 0)
  const [grown, setGrown] = useState(still ? 4 : 0)
  useMotionValueEvent(p, 'change', (v) => {
    if (still || v <= g.get()) return
    g.set(v)
    const n = SLICES.filter((s) => v >= s[1] - 0.03).length
    setGrown((x) => (n > x ? n : x))
  })

  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(false)
  // until someone picks a step, the card follows the growth
  useEffect(() => {
    if (!touched && grown > 0) setActive(grown - 1)
  }, [grown, touched])

  const pick = (i: number) => {
    setTouched(true)
    setActive(i)
  }
  const step = NEXT_STEPS[active]

  return (
    <div className="tree" ref={ref}>
      <div className="tree-stage">
        <svg className="tree-svg" viewBox="0 0 400 430" aria-hidden="true">
          <line x1="40" y1="429" x2="360" y2="429" className="tree-ground" />
          {ROOTS.map((d, i) => (
            <Stroke key={d} d={d} cls="tree-root" g={g} from={0.02 + i * 0.02} to={0.14 + i * 0.02} still={still} />
          ))}
          <Stroke d={TRUNK_LOW} cls="tree-trunk" g={g} from={0.04} to={0.32} still={still} />
          <Stroke d={TRUNK_HIGH} cls="tree-trunk-up" g={g} from={0.28} to={0.74} still={still} />
          {BRANCHES.map((b, i) => (
            <g key={i}>
              <Stroke d={b.d} cls="tree-branch" g={g} from={SLICES[i][0]} to={SLICES[i][1]} still={still} />
              <Stroke d={b.twig} cls="tree-twig" g={g} from={SLICES[i][1] - 0.08} to={SLICES[i][1] + 0.02} still={still} />
              <Leaves leaves={b.leaves} g={g} at={SLICES[i][1]} still={still} />
            </g>
          ))}
          <Leaves leaves={CROWN} g={g} at={0.9} still={still} />
        </svg>

        <ol className="tree-nodes">
          {NEXT_STEPS.map((s, i) => {
            const b = BRANCHES[i]
            return (
              <li
                key={s.name}
                className={`tree-node tree-${b.side}${i < grown ? ' is-grown' : ''}${active === i ? ' is-active' : ''}`}
                style={{ left: `${(b.node.x / 400) * 100}%`, top: `${(b.node.y / 430) * 100}%` }}
              >
                <button
                  type="button"
                  className="tree-btn"
                  aria-pressed={active === i}
                  aria-controls="tree-card"
                  aria-label={`Step ${i + 1}: ${s.name}`}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                >
                  <span className="tree-dot">{String(i + 1).padStart(2, '0')}</span>
                  <span className="tree-name">{s.short}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="tree-card" id="tree-card" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={still ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={still ? undefined : { opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="tree-card-num">Step {String(active + 1).padStart(2, '0')} of 04</span>
            <b className="tree-card-name">{step.name}</b>
            <p className="tree-card-desc">{step.desc}</p>
          </motion.div>
        </AnimatePresence>
        <div className="tree-pips" aria-hidden="true">
          {NEXT_STEPS.map((s, i) => (
            <i key={s.name} className={i === active ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}
