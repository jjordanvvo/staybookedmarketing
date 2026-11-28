import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { SPEED_EVIDENCE } from '@/lib/evidence'

/**
 * Why speed wins — a stickman calls a business, it rings out, he gets
 * impatient and hangs up. Eyes only (no mouth): expression comes from the
 * eyes, a brow line, and head and body movement. Beside him, the phone he's
 * calling counts up, then shows "No answer". The sourced research sits under
 * it as missed-call notifications. One shared 8-second loop drives it all.
 */

const LOOP = 8
// Loop beats as fractions of LOOP
const T = { ring: 0, glance: 0.3, annoyed: 0.52, hangup: 0.74, slump: 0.82, end: 1 }

function useLoopPhase(live: boolean) {
  const [phase, setPhase] = useState(0.6)
  useEffect(() => {
    if (!live) return
    const start = performance.now()
    const id = window.setInterval(() => setPhase(((performance.now() - start) / 1000 / LOOP) % 1), 100)
    return () => window.clearInterval(id)
  }, [live])
  return phase
}

const loopT = (times: number[]) => ({ duration: LOOP, repeat: Infinity, times, ease: 'easeInOut' as const })

function Stickman({ live }: { live: boolean }) {
  const a = (values: Record<string, (number | string)[]>, times: number[]) =>
    live ? { animate: values, transition: loopT(times) } : {}
  const box = { transformBox: 'fill-box' as const }

  return (
    <svg className="sm-svg" viewBox="100 40 230 390" role="img" aria-label="A stick figure calls a business. Nobody answers, and he gets frustrated and hangs up.">
      {/* ring waves by the phone */}
      <motion.g {...a({ opacity: [1, 1, 1, 0, 0, 0] }, [0, 0.3, 0.7, 0.74, 0.9, 1])}>
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M ${292 + i * 14} 70 q ${12 + i * 4} 28 0 56`}
            className="sm-wave"
            animate={live ? { opacity: [0, 1, 0] } : { opacity: 0.6 }}
            transition={live ? { duration: 1.1, repeat: Infinity, delay: i * 0.18 } : undefined}
          />
        ))}
      </motion.g>

      {/* whole body: slight bob, then a frustrated jolt, then a slump */}
      <motion.g
        style={{ ...box, transformOrigin: '50% 100%' }}
        {...a({ y: [0, -3, 0, 0, 2, 0, 6, 6, 0], rotate: [0, 0, 0, -1.5, 1.5, -1, 0, 2, 0] }, [0, 0.12, 0.25, 0.55, 0.6, 0.66, 0.84, 0.94, 1])}
      >
        {/* legs; the right foot taps while he waits */}
        <path d="M200 300 L165 412" className="sm-line" />
        <motion.path
          d="M200 300 L238 410"
          className="sm-line"
          style={{ ...box, transformOrigin: '0% 0%' }}
          {...a({ rotate: [0, 0, -7, 0, -7, 0, -7, 0, 0] }, [0, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 1])}
        />
        {/* body */}
        <path d="M200 158 L200 300" className="sm-line" />
        {/* left arm: hangs, then goes to the hip in annoyance */}
        <motion.path
          className="sm-line"
          {...(live
            ? {
                animate: { d: ['M200 196 L162 252 L150 300', 'M200 196 L162 252 L150 300', 'M200 196 L160 236 L192 262', 'M200 196 L160 236 L192 262', 'M200 196 L162 252 L150 300'] },
                transition: loopT([0, 0.5, 0.56, 0.86, 1]),
              }
            : { d: 'M200 196 L160 236 L192 262' })}
        />
        {/* right arm holding the phone to his head, lowered at hang-up */}
        <motion.g
          style={{ transformOrigin: '200px 196px' }}
          {...a({ rotate: [0, 0, 0, 62, 62, 0] }, [0, 0.5, T.hangup - 0.02, T.hangup + 0.04, 0.95, 1])}
        >
          <path d="M200 196 L254 214 L248 140" className="sm-line" />
          <rect x="236" y="96" width="26" height="46" rx="6" className="sm-phone" />
        </motion.g>

        {/* head: tilts while waiting, shakes when annoyed */}
        <motion.g
          style={{ transformOrigin: '200px 150px' }}
          {...a({ rotate: [0, 0, 6, 6, -6, 6, -6, 0, -4, 0] }, [0, 0.28, 0.33, 0.5, 0.56, 0.6, 0.64, 0.7, 0.86, 1])}
        >
          <circle cx="200" cy="110" r="46" className="sm-head" />
          {/* eyes: open, glance sideways, narrow, then a tired half-blink */}
          {[183, 217].map((cx) => (
            <motion.ellipse
              key={cx}
              cx={cx}
              cy="108"
              rx="6"
              className="sm-eye"
              {...(live
                ? {
                    animate: {
                      ry: [8, 8, 0.6, 8, 8, 8, 3, 3, 4.5, 8],
                      cx: [cx, cx, cx, cx, cx + 6, cx + 6, cx, cx, cx, cx],
                    },
                    transition: loopT([0, 0.15, 0.17, 0.19, 0.32, 0.48, 0.55, 0.8, 0.88, 1]),
                  }
                : { ry: 3.5 })}
            />
          ))}
          {/* brow lines appear when he gets annoyed (inner ends down) */}
          {[
            { d: 'M172 92 L192 99', o: '192px 99px' },
            { d: 'M228 92 L208 99', o: '208px 99px' },
          ].map((b, i) => (
            <motion.path
              key={i}
              d={b.d}
              className="sm-brow"
              style={{ transformOrigin: b.o }}
              {...(live
                ? { animate: { opacity: [0, 0, 1, 1, 0, 0] }, transition: loopT([0, T.annoyed, T.annoyed + 0.03, T.slump, T.slump + 0.04, 1]) }
                : { opacity: 1 })}
            />
          ))}
        </motion.g>
      </motion.g>

      {/* frustration puffs at hang-up */}
      <motion.g {...a({ opacity: [0, 0, 1, 0, 0], y: [0, 0, -6, -16, -16] }, [0, T.hangup, T.hangup + 0.04, T.hangup + 0.14, 1])}>
        <path d="M128 70 l-10 -12 M140 58 l-4 -16 M152 64 l6 -14" className="sm-puff" />
      </motion.g>
    </svg>
  )
}

function CallScreen({ phase, live }: { phase: number; live: boolean }) {
  const ringing = !live || phase < T.hangup
  const secs = live ? Math.min(29, Math.floor((phase / T.hangup) * 29)) : 29
  return (
    <div className="sm-call" aria-hidden="true">
      <span className="sm-call-label">{ringing ? 'Calling…' : 'Call ended'}</span>
      <span className="sm-call-name">Local business</span>
      <span className={`sm-call-status${ringing ? '' : ' is-missed'}`}>
        {ringing ? `0:${String(secs).padStart(2, '0')}` : 'No answer'}
      </span>
      <span className={`sm-call-btn${ringing ? '' : ' is-off'}`} />
    </div>
  )
}

export default function SpeedEvidence() {
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.25 })
  const reduce = useReducedMotion()
  const live = inView && !reduce
  const phase = useLoopPhase(live)

  return (
    <section className="sm" id="evidence">
      <div className="sm-inner">
        <div className="sm-copy">
          <Reveal amount={0.2}>
          <RevealItem as="h2" className="title">Most businesses answer too slowly. Yours won't.</RevealItem>
          <RevealItem as="p" className="body sm-lede">
            When nobody picks up, the customer doesn't wait. They call the next business on the list.
            Our system replies to every new lead within minutes, day or night.
          </RevealItem>
          </Reveal>
        </div>
        <div className="sm-stage" ref={stageRef}>
          <Stickman live={live} />
          <CallScreen phase={phase} live={live} />
        </div>
        <Reveal as="ul" className="sm-notes" amount={0.2}>
            {SPEED_EVIDENCE.map((s) => (
              <RevealItem as="li" className="sm-note" key={s.figure}>
                <span className="sm-note-fig">{s.figure}</span>
                <span className="sm-note-text">
                  {s.text}{' '}
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.source}</a>
                </span>
              </RevealItem>
            ))}
          </Reveal>
      </div>
    </section>
  )
}
