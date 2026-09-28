import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { EASE } from '@/components/ui/Reveal'

/**
 * Intro — short, clean opening title pop for the landing page.
 *
 * Per Kolby's Sept 28, 2026 direction: no calendar beat. "STAY BOOKED."
 * letters rise through line masks right away, the tan brand period
 * spring-pops with a ripple ring, a light sweep passes across the landed
 * title, and the brand line settles below. Then the curtain exits and the
 * hero settles in beneath (choreographed via onReveal). Short and simple —
 * done in under two seconds.
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
const TITLE_AT = 0.35 // letters rise almost immediately — no calendar beat
const LETTER_STAGGER = 0.03 // tight stagger — the title reads as one mass
const DOT_AT = 1.05 // brand period pop
const RING_AT = 1.17 // ripple ring around the period
const SWEEP_AT = 1.45 // light sweep passes across the landed title
const TAG_AT = 1.55 // serif brand line
const EXIT_AT = 2.4 // curtains begin — short and simple

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
  hidden: { y: '118%', filter: 'blur(5px)' },
  show: (delay: number) => ({
    y: '0%',
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 150, damping: 17, mass: 0.9, delay },
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

// Sun-glow behind the headline — blooms in as the letters begin to rise.
const glowV: Variants = {
  hidden: { opacity: 0, scale: 0.74 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.7, ease: EASE, delay: TITLE_AT - 0.55 },
  },
}

// One-shot light sweep across the landed title — reads as light passing over
// the type, the "advanced" flourish that closes the sequence.
const sweepV: Variants = {
  hidden: { x: '-170%', opacity: 0 },
  show: {
    x: '330%',
    opacity: [0, 1, 1, 0],
    transition: { duration: 1.15, ease: 'easeInOut', delay: SWEEP_AT, times: [0, 0.18, 0.82, 1] },
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
      {/* Curtain 2 — cream-to-tan gradient; its bottom edge equals the hero tile
          exactly, so the lift reads as the hero arriving. */}
      <motion.div
        className="intro-panel intro-panel-tan"
        initial={false}
        animate={exiting ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.26 }}
        onAnimationComplete={() => {
          if (exiting) setDone(true)
        }}
      />

      {/* Curtain 1 — the warm dawn card itself. */}
      <motion.div
        className="intro-panel intro-panel-cream"
        initial={false}
        animate={exiting ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      >
        {/* Sun-glow — blooms behind the headline as it lands. */}
        <motion.div className="intro-glow" variants={glowV} initial="hidden" animate={seq} />

        <motion.div
          className="intro-stage"
          animate={exiting ? { opacity: 0, y: -30, filter: 'blur(10px)' } : {}}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <motion.span className="intro-label intro-label-top" variants={labelV} custom={0.15} initial="hidden" animate={seq}>
            Lead generation for local businesses
          </motion.span>

          {/* The masked headline, period pop, and brand line. */}
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
            <motion.div className="intro-sweep" variants={sweepV} initial="hidden" animate={seq} aria-hidden="true" />
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
