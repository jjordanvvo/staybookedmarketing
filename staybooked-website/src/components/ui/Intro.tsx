import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { EASE } from '@/components/ui/Reveal'

/**
 * Intro — cinematic opening title sequence for the landing page.
 *
 * An ink-black title card (with the site's paper grain) runs a four-beat
 * sequence, then exits as a double curtain — the ink panel lifts first and a
 * warm-tan panel follows a beat later. The tan matches the hero's background
 * exactly, so the second curtain "becomes" the hero: a match-cut, not a wipe.
 *
 *   1. Small tracked location label + filmic progress line.
 *   2. Three stamped beats — 01 ADVERTISE / 02 QUALIFY / 03 BOOK.
 *   3. "STAY BOOKED." rises letter-by-letter through line masks; the tan
 *      brand period spring-pops with a ripple ring; the brand line settles
 *      underneath in serif italic.
 *   4. Curtain exit, hero settles in beneath (choreographed via onReveal).
 *
 * Plays once per full page load (router navigation back to "/" never replays
 * it), never under prefers-reduced-motion, and is skippable at any moment via
 * click / Esc / Enter / Space or the Skip button. Scroll is locked while the
 * card is up.
 */

const REDUCE =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Consumed on the first Home mount of this page load — later mounts (router
// back-navigation) skip straight to the settled page.
let consumed = false

/** Should this page load open with the intro? Decided once, in Home. */
export function claimIntro(): boolean {
  return typeof window !== 'undefined' && !REDUCE && !consumed
}

/** Called from Home's mount effect so remounts never replay the sequence. */
export function consumeIntro() {
  consumed = true
}

/* ---- Timeline (seconds, relative to "armed" = fonts ready) ---- */
const STAMP_START = 0.55
const STAMP_GAP = 0.5
const STAMP_DUR = 0.62
const TITLE_AT = 2.05 // first letter rises
const LETTER_STAGGER = 0.045
const DOT_AT = 2.62 // brand period pop
const RING_AT = 2.74 // ripple ring around the period
const TAG_AT = 2.85 // serif brand line
const EXIT_AT = 3.95 // curtains begin

const STAMPS = [
  { n: '01', w: 'ADVERTISE' },
  { n: '02', w: 'QUALIFY' },
  { n: '03', w: 'BOOK' },
]
const WORDS = ['STAY', 'BOOKED']

/* ---- Variants ---- */
const labelV: Variants = {
  hidden: { opacity: 0, y: 8, letterSpacing: '0.6em' },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    letterSpacing: '0.34em',
    transition: { duration: 1.1, ease: EASE, delay },
  }),
}

// Each headline letter rises out of its own overflow mask on a snappy spring.
const letterV: Variants = {
  hidden: { y: '118%' },
  show: (delay: number) => ({
    y: '0%',
    transition: { type: 'spring', stiffness: 120, damping: 16, mass: 0.95, delay },
  }),
}

const dotV: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 13, delay: DOT_AT },
  },
}

const ringV: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  show: {
    scale: [0.4, 1.6, 2.6],
    opacity: [0, 0.65, 0],
    transition: { duration: 0.9, ease: 'easeOut', delay: RING_AT, times: [0, 0.3, 1] },
  },
}

const tagV: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE, delay: TAG_AT },
  },
}

const skipV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE, delay: 1.3 } },
}

export default function Intro({ onReveal }: { onReveal: () => void }) {
  const [armed, setArmed] = useState(false) // fonts ready → sequence starts
  const [exiting, setExiting] = useState(false) // curtains lifting
  const [done, setDone] = useState(false) // overlay fully gone
  const revealedRef = useRef(false)

  // Hold the sequence (briefly) until the display font is ready so the big
  // type never swaps mid-animation. The text is already in the DOM, hidden,
  // which is what triggers the font request in the first place.
  useEffect(() => {
    let on = true
    let t = 0
    document.fonts?.load?.('800 96px Archivo').catch(() => {})
    Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => {
        t = window.setTimeout(r, 900)
      }),
    ]).then(() => {
      if (on) setArmed(true)
    })
    return () => {
      on = false
      clearTimeout(t)
    }
  }, [])

  // The sequence runs itself; one timer hands off to the curtain exit.
  useEffect(() => {
    if (!armed) return
    const t = window.setTimeout(() => setExiting(true), EXIT_AT * 1000)
    return () => clearTimeout(t)
  }, [armed])

  // Skippable at any moment.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setExiting(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // The moment the curtains start, Home mounts the page sections and cues the
  // hero + navbar entrances so everything lands as the reveal happens.
  useEffect(() => {
    if (exiting && !revealedRef.current) {
      revealedRef.current = true
      onReveal()
    }
  }, [exiting, onReveal])

  // Scroll stays locked while the card is up.
  useEffect(() => {
    if (done) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [done])

  if (done) return null

  const seq = armed ? 'show' : 'hidden'
  let letterIndex = 0

  return (
    <div className="intro" role="presentation" onClick={() => setExiting(true)}>
      {/* Curtain 2 — warm tan, identical to the hero background: the match-cut. */}
      <motion.div
        className="intro-panel intro-panel-tan"
        initial={false}
        animate={exiting ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.26 }}
        onAnimationComplete={() => {
          if (exiting) setDone(true)
        }}
      />

      {/* Curtain 1 — the ink title card itself. */}
      <motion.div
        className="intro-panel intro-panel-ink"
        initial={false}
        animate={exiting ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      >
        <motion.div
          className="intro-stage"
          animate={exiting ? { opacity: 0, y: -30, filter: 'blur(10px)' } : {}}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <motion.span className="intro-label intro-label-top" variants={labelV} custom={0.15} initial="hidden" animate={seq}>
            Based in California
          </motion.span>

          {/* Beat 2 — the three stamped process words, film-leader style. */}
          <div className="intro-stamps" aria-hidden="true">
            {STAMPS.map(({ n, w }, i) => (
              <motion.div
                key={w}
                className="intro-stamp-row"
                initial={{ opacity: 0 }}
                animate={
                  armed
                    ? {
                        opacity: [0, 1, 1, 0],
                        y: [14, 0, 0, -10],
                        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'],
                      }
                    : { opacity: 0 }
                }
                transition={{
                  duration: STAMP_DUR,
                  times: [0, 0.22, 0.8, 1],
                  ease: EASE,
                  delay: STAMP_START + i * STAMP_GAP,
                }}
              >
                <span className="intro-kicker">{n}</span>
                <span className="intro-stamp">{w}</span>
              </motion.div>
            ))}
          </div>

          {/* Beat 3 — the masked headline, period pop, and brand line. */}
          <div className="intro-titlewrap">
            <h1 className="intro-title" aria-label="Stay Booked.">
              {WORDS.map((word, wi) => (
                <span className="intro-word" key={word} aria-hidden="true">
                  {word.split('').map((ch) => {
                    const delay = TITLE_AT + letterIndex++ * LETTER_STAGGER
                    return (
                      <span className="intro-mask" key={`${ch}-${letterIndex}`}>
                        <motion.span className="intro-letter" variants={letterV} custom={delay} initial="hidden" animate={seq}>
                          {ch}
                        </motion.span>
                      </span>
                    )
                  })}
                  {wi === WORDS.length - 1 && (
                    <span className="intro-dotwrap">
                      <motion.span className="intro-dot" variants={dotV} initial="hidden" animate={seq}>
                        .
                      </motion.span>
                      <motion.span className="intro-ring" variants={ringV} initial="hidden" animate={seq} />
                    </span>
                  )}
                </span>
              ))}
            </h1>
            <motion.p className="intro-tagline" variants={tagV} initial="hidden" animate={seq}>
              We don&rsquo;t chase leads. We book them.
            </motion.p>
          </div>

          <motion.span className="intro-label intro-label-bottom" variants={labelV} custom={0.3} initial="hidden" animate={seq}>
            staybookedmarketing.com
          </motion.span>

          <motion.button
            type="button"
            className="intro-skip"
            variants={skipV}
            initial="hidden"
            animate={seq}
            onClick={() => setExiting(true)}
          >
            Skip
          </motion.button>
        </motion.div>

        {/* Filmic progress line running the length of the sequence. */}
        <motion.div
          className="intro-progress"
          initial={{ scaleX: 0 }}
          animate={armed ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: EXIT_AT - 0.15, ease: 'linear', delay: 0.1 }}
        />
      </motion.div>
    </div>
  )
}
