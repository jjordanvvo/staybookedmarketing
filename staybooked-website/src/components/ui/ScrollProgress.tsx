import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * ScrollProgress — a 2px tan hairline across the very top of the viewport,
 * filling left to right as you travel the page. The quiet HUD tell of a
 * crafted scroll experience; matches the filmic progress line in the intro.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
    restDelta: 0.001,
  })

  if (reduce) return null
  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0 50%' }}
    />
  )
}
