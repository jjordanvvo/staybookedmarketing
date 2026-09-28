import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { EASE } from '@/components/ui/Reveal'

/**
 * Intro — cinematic opening title sequence for the landing page.
 *
 * A warm dawn title card (soft cream light, editorial hairline frame, the
 * site's paper grain) runs a four-beat sequence, then exits as a double
 * curtain: the cream panel lifts first, a cream-to-tan gradient panel follows,
 * and its bottom edge equals the hero tile exactly, so the second curtain
 * "becomes" the hero: a match-cut, not a wipe.
 *
 *   1. Small tracked location label + filmic progress line.
 *   2. The promise, visualized: a spiral-bound paper calendar card (rings,
 *      month header, today badge, weekday/date chips, time labels) fills up
 *      slot by slot with booked-appointment events while a counter ticks up
 *      "24 appointments booked this week". A few dashed slots stay open,
 *      the way a real week looks.
 *   3. Clean handoff, no middle beat: as the last blocks settle, the
 *      calendar blooms away WHILE "STAY BOOKED." letters rise through line
 *      masks in its place — the two motions overlap, so the calendar hands
 *      the stage straight to the type with nothing in between. The tan
 *      brand period spring-pops with a ripple ring, a light sweep passes
 *      across the landed title, and the brand line settles below.
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

/* ---- The week that fills up ---- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DATE_START = 21 // the real week: Mon Sep 21 - Sun Sep 27, 2026
const TODAY_COL = 2 // Wed Sep 23
const TIMES = ['9 AM', '11 AM', '1 PM', '3 PM']
const ROWS = 4
// The slots that stay open, "col-row" 1-indexed — a real calendar has gaps.
const OPEN_SLOTS = new Set(['2-4', '5-2', '6-1', '4-3'])

type Slot = { key: string; shade: 'a' | 'b' | 'c' }
const FILLED: Slot[] = []
for (let r = 1; r <= ROWS; r++) {
  for (let c = 1; c <= DAYS.length; c++) {
    if (!OPEN_SLOTS.has(`${c}-${r}`)) {
      FILLED.push({ key: `${c}-${r}`, shade: (['a', 'b', 'c'] as const)[(r + c) % 3] })
    }
  }
}
const FILL_COUNT = FILLED.length // 24

/* ---- Timeline (seconds, relative to "armed" = fonts ready) ---- */
const CAL_START = 0.5 // day headers + first block land
const CELL_STAG = 0.055 // calm but tight — the week fills in ~1.8s
const COUNTER_HOLD = 0.3 // counter line fades in as the fills begin
const CAL_BLOOM_AT = 1.85 // fills done + counter hits 24 → bloom immediately
const CAL_OUT_AT = 2.35 // calendar fades out under the rising title
const TITLE_AT = 1.85 // letters rise the SAME instant the bloom starts
const LETTER_STAGGER = 0.03 // tighter stagger — the title reads as one mass
const DOT_AT = 2.55 // brand period pop
const RING_AT = 2.67 // ripple ring around the period
const SWEEP_AT = 2.95 // light sweep passes across the landed title
const TAG_AT = 3.05 // serif brand line
const EXIT_AT = 4.55 // curtains begin

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

// Day headers fade in as one row.
const dayV: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: (delay: number) => ({
    opacity: 0.85,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
}

// Each booked slot stamps in with a snappy spring pop.
const cellV: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  show: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 17, delay },
  }),
}

const counterV: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
}

// The whole calendar: rises in as the fills begin, holds while the week books
// up, then blooms away (scale + blur) the instant the fills finish — no dead
// air before the arrow/title chain takes over.
const CAL_LAND = 0.32 // seconds from CAL_START to fully landed
const CAL_DUR = CAL_OUT_AT - (CAL_START - 0.15)
const calV: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.96, filter: 'blur(8px)' },
  show: {
    opacity: [0, 1, 1, 0],
    y: [26, 0, 0, -18],
    scale: [0.96, 1, 1, 1.07],
    filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(14px)'],
    transition: {
      duration: CAL_DUR,
      times: [
        0,
        CAL_LAND / CAL_DUR,
        (CAL_BLOOM_AT - (CAL_START - 0.15)) / CAL_DUR,
        1,
      ],
      ease: EASE,
      delay: CAL_START - 0.15,
    },
  },
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
  const [count, setCount] = useState(0) // appointments booked this week
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

  // Counter ticks up in lockstep with the booking blocks stamping in.
  useEffect(() => {
    if (!armed) return
    let n = 0
    let interval = 0
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        n += 1
        setCount(n)
        if (n >= FILL_COUNT) window.clearInterval(interval)
      }, CELL_STAG * 1000)
    }, CAL_START * 1000)
    return () => {
      clearTimeout(start)
      window.clearInterval(interval)
    }
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
        {/* Sun-glow — blooms behind the calendar and headline as they land. */}
        <motion.div className="intro-glow" variants={glowV} initial="hidden" animate={seq} />

        <motion.div
          className="intro-stage"
          animate={exiting ? { opacity: 0, y: -30, filter: 'blur(10px)' } : {}}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <motion.span className="intro-label intro-label-top" variants={labelV} custom={0.15} initial="hidden" animate={seq}>
            Lead generation for local businesses
          </motion.span>

          {/* Beat 2 — the week books up: a real calendar, filling in. */}
          <motion.div className="intro-calwrap" aria-hidden="true" variants={calV} initial="hidden" animate={seq}>
            <div className="cal-card">
              <span className="cal-ring cal-ring-l" />
              <span className="cal-ring cal-ring-r" />
              <div className="cal-head">
                <span className="cal-badge">23</span>
                <span className="cal-month">September 2026</span>
              </div>
              <div className="cal-board">
                <span className="cal-corner" />
                {DAYS.map((d, i) => (
                  <motion.span
                    key={d + i}
                    className={`cal-day${i === TODAY_COL ? ' cal-day-today' : ''}`}
                    variants={dayV}
                    custom={CAL_START + i * 0.04}
                  >
                    {d}
                    <em className="cal-date">{DATE_START + i}</em>
                  </motion.span>
                ))}
                {TIMES.map((t, r) => (
                  <Fragment key={t}>
                    <span className="cal-time">{t}</span>
                    {DAYS.map((_, ci) => {
                      const col = ci + 1
                      const row = r + 1
                      const key = `${col}-${row}`
                      if (OPEN_SLOTS.has(key)) {
                        return (
                          <motion.span
                            key={key}
                            className="cal-slot cal-slot-open"
                            variants={dayV}
                            custom={CAL_START + 0.1}
                          />
                        )
                      }
                      const fillIndex = FILLED.findIndex((f) => f.key === key)
                      const slot = FILLED[fillIndex]
                      return (
                        <motion.span
                          key={key}
                          className={`cal-slot cal-slot-booked cal-slot-${slot.shade}`}
                          variants={cellV}
                          custom={CAL_START + fillIndex * CELL_STAG}
                        />
                      )
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
            <motion.p className="cal-count" variants={counterV} custom={CAL_START + COUNTER_HOLD}>
              <span className="cal-count-num">{count}</span> appointments booked this week
            </motion.p>
          </motion.div>

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
