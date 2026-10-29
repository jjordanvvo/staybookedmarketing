import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/components/ui/Reveal'
import AnimatedLabel from '@/components/ui/AnimatedLabel'
import {
  DAY_HOURS,
  DAY_START,
  HERO_WEEK,
  WEEK_DAYS,
  WEEK_LENGTH,
  clock,
  slotAt,
  weekClock,
  type HeroAppt,
} from '@/lib/heroWeek'

type HeroProps = {
  /** False while the intro title card is still up — the entrance holds until
   *  the curtains start lifting. */
  revealed?: boolean
  /** Whether this page load opened with the intro (delays the entrance so it
   *  lands with the curtain lift). */
  intro?: boolean
}

/** Where the week rests after the opening play-through (Thursday, 11 am). */
const REST = 33
const HOUR_LABELS = Array.from({ length: DAY_HOURS }, (_, i) => DAY_START + i)

const clamp = (v: number) => Math.min(WEEK_LENGTH, Math.max(0, v))
/** Snap to 15 minutes so the readout never shows 11:07. */
const snap = (v: number) => Math.round(v * 4) / 4

function latestBooking(t: number): HeroAppt | undefined {
  let latest: HeroAppt | undefined
  for (const a of HERO_WEEK) {
    if (a.bookedAt <= t && (!latest || a.bookedAt > latest.bookedAt)) latest = a
  }
  return latest
}

/**
 * Hero — the client's week, filling up.
 * The planner is a Mon–Sat appointment book. Pointing at any moment in it
 * moves "now" there: every lead that came in before that moment has been
 * answered and booked into its slot, and the hours already gone shade over.
 * On load the week plays forward once to Thursday morning, then the pointer
 * (or a drag on touch, or the arrow keys) takes over.
 */
export default function Hero({ revealed = true, intro = false }: HeroProps) {
  const reduce = useReducedMotion()
  const show = reduce || revealed
  const [t, setT] = useState(reduce ? REST : 0)
  const [hover, setHover] = useState<HeroAppt | null>(null)
  const touched = useRef(false)

  // The one orchestrated moment: the week plays from Monday 8 am to Thursday
  // morning as the hero lands. Any interaction cancels it.
  useEffect(() => {
    if (!show || reduce || touched.current) return
    const run = animate(0, REST, {
      duration: 2.8,
      ease: EASE,
      delay: intro ? 1.1 : 0.5,
      onUpdate: (v) => {
        if (!touched.current) setT(v)
      },
    })
    return () => run.stop()
  }, [show, reduce, intro])

  const take = () => {
    touched.current = true
  }

  const onPoint = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.min(0.9999, Math.max(0, (e.clientX - r.left) / r.width))
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    take()
    setT(snap(Math.floor(x * WEEK_DAYS.length) * DAY_HOURS + y * DAY_HOURS))
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = {
      ArrowDown: 0.5, ArrowUp: -0.5, ArrowRight: DAY_HOURS, ArrowLeft: -DAY_HOURS,
    }
    let next: number | undefined
    if (e.key in step) next = t + step[e.key]
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = WEEK_LENGTH
    if (next === undefined) return
    e.preventDefault()
    take()
    setT(clamp(snap(next)))
  }

  const now = snap(t)
  const nowDay = Math.min(Math.floor(now / DAY_HOURS), WEEK_DAYS.length - 1)
  const nowFrac = (now - nowDay * DAY_HOURS) / DAY_HOURS
  const booked = HERO_WEEK.filter((a) => a.bookedAt <= now)
  const latest = latestBooking(now)
  const nowText = weekClock(now)
  const flipTag = nowDay >= WEEK_DAYS.length - 2

  return (
    <header className="hero" id="hero">
      <motion.div
        className="hero-copy"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.1, ease: EASE, delay: intro ? 0.45 : 0.05 }}
      >
        <p className="hero-title">
          <span>Stay</span> <span>booked.</span>
        </p>
        <p className="hero-pitch-line">
          We run your ads, follow up with every lead in minutes, and book the appointments onto your calendar.
        </p>
        <a className="contact-book-btn hero-pitch-btn anim-btn" href="/book">
          <AnimatedLabel>Book a Free Strategy Call</AnimatedLabel>
        </a>
        {/* Readout for whatever moment the planner is pointing at. Decorative
            for screen readers: the slider's value text carries the summary. */}
        <div className="hero-latest" aria-hidden="true">
          {latest && (
            <motion.div
              key={latest.who + latest.title}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="hero-latest-main">
                {latest.who} from {latest.city} booked a {latest.title.toLowerCase()} for{' '}
                {weekClock(slotAt(latest), true)}.
              </p>
              <p className="hero-latest-trail">
                Came in from {latest.source} {weekClock(latest.bookedAt)}. We replied in {latest.reply} min.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.figure
        className="planner"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.3, ease: EASE, delay: intro ? 0.6 : 0.15 }}
      >
        <div className="planner-head">
          <span>This week</span>
          <span className="planner-count">
            <strong>{booked.length}</strong> booked
          </span>
        </div>

        <div className="planner-days" aria-hidden="true">
          {WEEK_DAYS.map((d, i) => (
            <span key={d} className={i < nowDay ? 'is-past' : i === nowDay ? 'is-now' : undefined}>
              {d}
            </span>
          ))}
        </div>

        <div className="planner-body">
          <div className="planner-hours" aria-hidden="true">
            {HOUR_LABELS.map((h) => (
              <span key={h}>{clock(h).replace(':00', '')}</span>
            ))}
          </div>

          <div
            className="planner-grid"
            role="slider"
            tabIndex={0}
            aria-label="Move through the example week"
            aria-valuemin={0}
            aria-valuemax={WEEK_LENGTH}
            aria-valuenow={now}
            aria-valuetext={`${weekClock(now, true)}, ${booked.length} appointments booked`}
            onPointerMove={onPoint}
            onPointerDown={onPoint}
            onKeyDown={onKey}
          >
            {WEEK_DAYS.map((d, day) => (
              <div className="planner-col" key={d} aria-hidden="true">
                {/* Hours already gone this week */}
                <div
                  className="planner-past"
                  style={{ height: `${day < nowDay ? 100 : day === nowDay ? nowFrac * 100 : 0}%` }}
                />
                {HERO_WEEK.filter((a) => a.day === day).map((a) => {
                  if (a.bookedAt > now) return null
                  const start = slotAt(a)
                  const done = start + a.dur <= now
                  const flip = day >= WEEK_DAYS.length - 2
                  return (
                    <motion.div
                      key={a.who + a.title}
                      className={`planner-appt${done ? ' is-done' : ''}`}
                      style={{
                        top: `${((a.start - DAY_START) / DAY_HOURS) * 100}%`,
                        height: `${(a.dur / DAY_HOURS) * 100}%`,
                      }}
                      initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
                      animate={{ clipPath: 'inset(0 0 0% 0)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      onPointerEnter={() => setHover(a)}
                      onPointerLeave={() => setHover((h) => (h === a ? null : h))}
                    >
                      <span className="planner-appt-title">{a.title}</span>
                      <span className="planner-appt-who">{a.who}, {a.city}</span>
                      {hover === a && (
                        <span className={`planner-tip${flip ? ' is-flip' : ''}`}>
                          <strong>{a.title}</strong>
                          <span>{a.who}, {a.city}</span>
                          <span>
                            Came in from {a.source} {weekClock(a.bookedAt)}. Replied in {a.reply} min.
                            Booked for {weekClock(start)}.
                          </span>
                        </span>
                      )}
                    </motion.div>
                  )
                })}
                {day === nowDay && (
                  <div className="planner-now" style={{ top: `${nowFrac * 100}%` }} />
                )}
              </div>
            ))}
            {/* Lives on the grid, not in the day column, so it sits above the
                next day's appointments. Flips left on Fri/Sat. */}
            <span
              className={`planner-now-tag${flipTag ? ' is-flip' : ''}`}
              style={{
                top: `${nowFrac * 100}%`,
                left: `${((flipTag ? nowDay : nowDay + 1) / WEEK_DAYS.length) * 100}%`,
              }}
              aria-hidden="true"
            >
              {nowText}
            </span>
          </div>
        </div>

        <figcaption className="planner-caption">
          An example week. Move across it to go forward in time and watch it fill.
        </figcaption>
      </motion.figure>
    </header>
  )
}
