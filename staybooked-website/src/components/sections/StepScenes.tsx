import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * Small looping scenes that sit beside each How it works step. Each loop only
 * runs while it's on screen, and reduced motion shows the finished state.
 * Copy inside the scenes is illustrative UI, not client data.
 */

const LOOP = 7 // seconds per cycle, shared so the three scenes feel related

function useLive() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  return { ref, live: inView && !reduce, reduce }
}

/** 01 Advertise — ad cards rise through a feed; one gets tapped and becomes a lead. */
export function AdScene() {
  const { ref, live, reduce } = useLive()
  const loop = { duration: LOOP, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <div className="sc sc-ad" ref={ref} aria-hidden="true">
      <div className="sc-phone">
        <motion.div
          className="sc-feed"
          animate={live ? { y: [0, 0, -132, -132, 0] } : { y: reduce ? -132 : 0 }}
          transition={live ? { ...loop, times: [0, 0.18, 0.38, 0.92, 1] } : undefined}
        >
          <div className="sc-post"><span className="sc-line w70" /><span className="sc-line w40" /><span className="sc-img" /></div>
          <div className="sc-post sc-post-ad">
            <span className="sc-sponsored">Sponsored</span>
            <span className="sc-ad-title">Need it handled this week?</span>
            <span className="sc-img sc-img-tan" />
            <motion.span
              className="sc-ad-btn"
              animate={live ? { scale: [1, 1, 0.92, 1, 1] } : undefined}
              transition={live ? { ...loop, times: [0, 0.48, 0.52, 0.56, 1] } : undefined}
            >
              Get a quote
            </motion.span>
          </div>
          <div className="sc-post"><span className="sc-line w60" /><span className="sc-img" /></div>
        </motion.div>
        <motion.span
          className="sc-tap"
          animate={live ? { opacity: [0, 0, 1, 0, 0], scale: [0.4, 0.4, 1, 1.6, 1.6] } : { opacity: 0 }}
          transition={live ? { ...loop, times: [0, 0.47, 0.52, 0.62, 1] } : undefined}
        />
      </div>
      <motion.span
        className="sc-chip"
        animate={live ? { opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -6] } : { opacity: reduce ? 1 : 0 }}
        transition={live ? { ...loop, times: [0, 0.55, 0.62, 0.9, 1] } : undefined}
      >
        + New lead
      </motion.span>
    </div>
  )
}

const CHAT = [
  { who: 'lead', text: 'Hi, do you have anything open this week?', at: 0.08 },
  { who: 'typing', text: '', at: 0.2 },
  { who: 'us', text: 'We do! Thursday 10am or Friday 2pm?', at: 0.32 },
  { who: 'lead', text: 'Thursday works.', at: 0.5 },
  { who: 'us', text: "You're booked. See you Thursday at 10.", at: 0.64 },
]

/** 02 Qualify — the lead texts, the system replies within minutes and books. */
export function ChatScene() {
  const { ref, live, reduce } = useLive()
  return (
    <div className="sc sc-chat" ref={ref} aria-hidden="true">
      <div className="sc-chat-head">
        <span className="sc-avatar" />
        <span>New lead</span>
        <span className="sc-reply-time">Replied in 2 min</span>
      </div>
      <div className="sc-chat-body">
        {CHAT.map((m, i) => {
          const hide = m.who === 'typing'
          return (
            <motion.div
              key={i}
              className={`sc-bubble sc-${m.who}`}
              animate={
                live
                  ? hide
                    ? { opacity: [0, 0, 1, 1, 0, 0], height: [0, 0, 28, 28, 0, 0] }
                    : { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] }
                  : { opacity: reduce && !hide ? 1 : 0, height: hide ? 0 : 'auto' }
              }
              transition={
                live
                  ? {
                      duration: LOOP,
                      repeat: Infinity,
                      times: hide ? [0, m.at, m.at + 0.02, m.at + 0.1, m.at + 0.12, 1] : [0, m.at, m.at + 0.04, 0.94, 1],
                    }
                  : undefined
              }
            >
              {hide ? (
                <span className="sc-dots"><i /><i /><i /></span>
              ) : (
                m.text
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
// Slots that fill over the loop, as [day, row]
const FILL: [number, number][] = [[0, 1], [2, 0], [1, 2], [4, 1], [3, 0], [2, 3], [0, 3], [4, 2]]

/** 03 Book — appointments land on the week one by one. */
export function CalendarScene() {
  const { ref, live, reduce } = useLive()
  return (
    <div className="sc sc-cal" ref={ref} aria-hidden="true">
      <div className="sc-cal-head">
        {DAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="sc-cal-grid">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="sc-cell" style={{ gridColumn: (i % 5) + 1, gridRow: Math.floor(i / 5) + 1 }} />
        ))}
        {FILL.map(([d, r], i) => {
          const at = 0.06 + i * 0.09
          return (
            <motion.span
              key={i}
              className={`sc-appt${d === 3 && r === 0 ? ' sc-appt-hot' : ''}`}
              style={{ gridColumn: d + 1, gridRow: r + 1 }}
              animate={live ? { opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1, 1, 1] } : { opacity: reduce ? 1 : 0 }}
              transition={live ? { duration: LOOP, repeat: Infinity, times: [0, at, at + 0.04, 0.93, 1], ease: 'backOut' } : undefined}
            />
          )
        })}
      </div>
      <motion.div
        className="sc-toast"
        animate={live ? { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] } : { opacity: reduce ? 1 : 0 }}
        transition={live ? { duration: LOOP, repeat: Infinity, times: [0, 0.42, 0.47, 0.9, 1] } : undefined}
      >
        Booked: Thursday, 10:00
      </motion.div>
    </div>
  )
}
