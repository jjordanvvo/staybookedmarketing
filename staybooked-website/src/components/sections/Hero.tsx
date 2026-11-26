import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { EASE } from '@/components/ui/Reveal'
import AnimatedLabel from '@/components/ui/AnimatedLabel'
import TreeShader from '@/components/ui/TreeShader'
import { HERO_TREE_SRC } from '@/lib/heroTree'

type HeroProps = {
  /** False while the intro title card is still up. */
  revealed?: boolean
  /** Whether this page load opened with the intro. */
  intro?: boolean
}

/**
 * Hero — the offer on the left, the growth tree on the right. The tree is a
 * shader (TreeShader): it sways, pulses light up its branches and bends
 * around the cursor. Scrolling away lifts the tree slightly slower than the
 * copy, so the hero hands off to the page instead of ending at a hard edge.
 */
export default function Hero({ revealed = true, intro = false }: HeroProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const treeY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90])
  const treeScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06])

  const show = reduce || revealed
  const enter = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay: (intro ? 0.3 : 0) + delay },
  })

  return (
    <header className="hero" id="hero" ref={ref}>
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-cred" {...enter(0)}>
            Founded by Stanford and Penn graduates
          </motion.p>
          <motion.h1 className="hero-title" {...enter(0.08)}>
            StayBooked makes growing your business look easy.
          </motion.h1>
          <motion.div className="hero-ctas" {...enter(0.18)}>
            <a className="contact-book-btn hero-pitch-btn anim-btn" href="/book">
              <AnimatedLabel>Book a Free Strategy Call</AnimatedLabel>
            </a>
            <a className="hero-phone" href="tel:+18134805818">
              or call (813) 480-5818
            </a>
          </motion.div>
          <motion.p className="hero-pitch-line" {...enter(0.28)}>
            We run your ads, reply to every new lead within minutes, and book them straight onto your calendar.
          </motion.p>
        </div>
        <motion.div
          className="hero-tree"
          style={{ y: treeY, scale: treeScale }}
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          animate={show ? { opacity: 1, filter: 'blur(0px)' } : undefined}
          transition={{ duration: 1.4, ease: EASE, delay: intro ? 0.2 : 0 }}
        >
          <TreeShader src={HERO_TREE_SRC} className="hero-tree-canvas" />
        </motion.div>
      </div>
    </header>
  )
}
