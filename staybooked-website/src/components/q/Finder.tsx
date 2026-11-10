import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { findNiche, FINDER_EXAMPLES } from '@/lib/finder'
import { GOALS, PHONE_DISPLAY, PHONE_TEL } from '@/lib/content'
import Arrow from './Arrow'
import Fade from './Fade'

/** "roofing company" -> "your roofing company"; empty -> "your business". */
function asYours(raw: string) {
  const t = raw.trim().replace(/^(a|an|the|my|our)\s+/i, '').slice(0, 60)
  return t ? `your ${t}` : 'your business'
}

/**
 * Find your business. Works for any business: the visitor names what they
 * run and picks what they need, and the answer is written from the goal,
 * not from a fixed list of industries. If what they typed matches one of
 * our industry pages, that page is offered too.
 */
export default function Finder() {
  const [q, setQ] = useState('')
  const [goal, setGoal] = useState<string | null>(null)
  const [ex, setEx] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const niche = useMemo(() => findNiche(q), [q])
  const picked = GOALS.find((g) => g.id === goal)

  useEffect(() => {
    if (q) return
    const t = window.setInterval(() => setEx((i) => (i + 1) % FINDER_EXAMPLES.length), 2600)
    return () => window.clearInterval(t)
  }, [q])

  return (
    <section className="q-sec q-finder" id="find">
      <div className="q-wrap">
        <Fade className="q-sec-head">
          <p className="q-kicker">Find your business</p>
        </Fade>

        <Fade>
          <label className="q-finder-line" onClick={() => input.current?.focus()}>
            <span>I run</span>
            <input
              ref={input}
              type="text"
              value={q}
              maxLength={60}
              onChange={(e) => setQ(e.target.value)}
              placeholder={FINDER_EXAMPLES[ex]}
              aria-label="What kind of business do you run?"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
        </Fade>

        <Fade className="q-goals" delay={0.05}>
          <span className="q-goals-lead">and I need</span>
          <span className="q-goals-list" role="radiogroup" aria-label="What do you need?">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={goal === g.id}
                className={goal === g.id ? 'is-on' : undefined}
                onClick={() => setGoal(goal === g.id ? null : g.id)}
              >
                {g.label}
              </button>
            ))}
          </span>
        </Fade>

        <div className="q-finder-out" aria-live="polite">
          <AnimatePresence mode="wait">
            {picked && (
              <motion.div
                key={picked.id}
                className="q-finder-hit"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="q-finder-sum">{picked.answer.replace(/\{biz\}/g, asYours(q))}</p>
                <div className="q-finder-actions">
                  <a className="q-btn" href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
                  {niche ? (
                    <Link className="q-link" to={`/niches/${niche.id}`}>How we work with {niche.name.toLowerCase()} <Arrow /></Link>
                  ) : (
                    <Link className="q-link" to="/book">Book a 15-minute call <Arrow /></Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
