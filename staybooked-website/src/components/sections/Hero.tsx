import type { MouseEvent } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'
import logo from '@/assets/logo.png'
import { EASE } from '@/components/ui/Reveal'

// Cursor parallax only makes sense with a real pointer (decided once at load).
const FINE_POINTER =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Hero — cinematic logo intro.
 * 1. The mark settles in with a slow scale-and-blur entrance (global easing).
 * 2. A barely-perceptible idle breath keeps it alive (CSS keyframes on the img).
 * 3. On desktop, the mark drifts a few pixels toward the cursor via lazy
 *    springs — disabled on touch devices and under prefers-reduced-motion.
 */
export default function Hero() {
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

  return (
    <header className="hero" id="hero" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        className="hero-motion"
        style={{ x, y }}
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.045, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: EASE }}
      >
        <img className="hero-logo" src={logo} alt="Stay Booked Marketing" />
      </motion.div>
    </header>
  )
}
