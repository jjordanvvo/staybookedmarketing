import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * CountUp — animates a stat from 0 to its final value the first time it
 * scrolls into view (site's existing scroll trigger via useInView, once).
 * `peak` makes a value tick up and settle back down (used for the 0 stat).
 * Honors prefers-reduced-motion by rendering the final value instantly.
 */
function CountUp({
  to,
  suffix = '',
  delayMs = 0,
  peak,
}: {
  to: number
  suffix?: string
  delayMs?: number
  peak?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(to)
      return
    }
    const duration = 1200
    let rafId = 0
    let startTime = 0

    const tick = (now: number) => {
      if (!startTime) startTime = now
      const elapsed = now - startTime - delayMs
      if (elapsed < 0) {
        rafId = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(elapsed / duration, 1)
      let current: number
      if (peak !== undefined) {
        // Smooth up-and-back so a "0" still feels alive, landing exactly on `to`.
        current = peak * Math.sin(t * Math.PI) + to * t
      } else {
        current = easeOutExpo(t) * to
      }
      setN(Math.round(current))
      if (t < 1) rafId = requestAnimationFrame(tick)
      else setN(to)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [inView, to, delayMs, peak, reduce])

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

export default function WhyUs() {
  return (
    <section className="section section-light" id="why">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Why Stay Booked</RevealItem>
          <RevealItem as="h2" className="title">Results first. No long contracts.</RevealItem>
          <RevealItem as="p" className="body why-body">We work month to month because we earn your business every month. Most clients see results in the first 30 days.</RevealItem>
        </Reveal>

        {/* Stats enter with the global stagger; the count-ups fire in the same
            left-to-right order (existing delayMs), so each number lands and
            starts counting just after its neighbor. */}
        <Reveal className="stats-band" amount={0.3}>
          <RevealItem className="stat">
            <div className="stat-num"><CountUp to={5} suffix="+" delayMs={0} /></div>
            <div className="stat-label">Active Clients</div>
          </RevealItem>
          <RevealItem className="stat">
            <div className="stat-num"><CountUp to={30} delayMs={160} /></div>
            <div className="stat-label">Days to Results</div>
          </RevealItem>
          <RevealItem className="stat">
            <div className="stat-num"><CountUp to={0} peak={9} delayMs={320} /></div>
            <div className="stat-label">Long Term Contracts</div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
