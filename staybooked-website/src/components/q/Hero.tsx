import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { PHONE_DISPLAY, PHONE_TEL, TAGLINE } from '@/lib/content'
import Mark from './Mark'
import Arrow from './Arrow'

const LINES = [
  { head: 'Campaigns', tail: 'built around how you sell' },
  { head: 'Follow-up', tail: 'that answers in minutes' },
  { head: 'Custom builds', tail: 'sites, apps, software, launches' },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const reduce = useReducedMotion()
  const enter = (d: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay: d } }

  return (
    <header className="q-hero" id="top">
      <Mark className="q-hero-ghost" />

      <div className="q-wrap q-hero-inner">
        <motion.ul className="q-hero-index" {...enter(0.05)}>
          {LINES.map((l) => (
            <li key={l.head}>
              <span>{l.head}</span>
              <em>{l.tail}</em>
            </li>
          ))}
        </motion.ul>

        <h1 className="q-hero-title">
          <motion.span {...enter(0.15)}>{TAGLINE[0]}</motion.span>
          <motion.span className="q-tan" {...enter(0.3)}>{TAGLINE[1]}</motion.span>
        </h1>

        <motion.div className="q-hero-foot" {...enter(0.5)}>
          <p className="q-hero-sub">
            Custom campaigns, fast follow-up and the builds behind them, shaped around your
            business. Appointments, orders, walk-ins or a launch, we bring in the customers.
          </p>
          <div className="q-hero-actions">
            <a className="q-btn" href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
            <Link className="q-link" to="/book">or book a 15-minute call <Arrow /></Link>
          </div>
        </motion.div>

        <motion.p className="q-hero-credit" {...enter(0.7)}>
          Founded by Stanford graduates
        </motion.p>
      </div>
    </header>
  )
}
