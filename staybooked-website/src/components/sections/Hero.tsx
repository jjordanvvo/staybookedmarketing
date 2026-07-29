import type { MouseEvent } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'
import logo from '@/assets/logo.webp'
import { EASE } from '@/components/ui/Reveal'

// Cursor parallax only makes sense with a real pointer (decided once at load).
const FINE_POINTER =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

type HeroProps = {
  /** False while the intro title card is still up — the entrance holds until
   *  the curtains start lifting, so the logo settles in mid-reveal. */
  revealed?: boolean
  /** Whether this page load opened with the intro (pushes the idle breath back
   *  so it never runs during the entrance). */
  intro?: boolean
}

/**
 * Hero — cinematic logo intro.
 * 1. The mark settles in with a slow scale-and-blur entrance (global easing),
 *    cued by the intro curtain when the title sequence plays.
 * 2. A barely-perceptible idle breath keeps it alive (CSS keyframes on the img).
 * 3. On desktop, the mark drifts a few pixels toward the cursor via lazy
 *    springs — disabled on touch devices and under prefers-reduced-motion.
 */
export default function Hero({ revealed = true, intro = false }: HeroProps) {
  const reduce = useReducedMotion()

  // Lazy, heavy springs — the drift trails the cursor rather than tracking it.
  const x = useSpring(0, { stiffness: 40, damping: 18, mass: 1 })
  const y = useSpring(0, { stiffness: 40, damping: 18, mass: 1 })

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!FINE_POINTER || reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width - 0.5) * 12) // max ±6px drift
    y.set(((e.clientY - r.top) / r.height - 0.5) * 10) // max ±5px drift
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const show = reduce || revealed

  return (
    <header className="hero" id="hero" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        className="hero-motion"
        style={{ x, y }}
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.045, filter: 'blur(14px)' }}
        animate={show ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay: intro ? 0.35 : 0 }}
      >
        <img
          className="hero-logo"
          src={logo}
          alt="Stay Booked Marketing"
          style={intro ? { animationDelay: '6.5s' } : undefined}
        />
      </motion.div>
    </header>
  )
}
