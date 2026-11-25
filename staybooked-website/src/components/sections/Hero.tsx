import type { MouseEvent } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'
import GlassMark from '@/components/ui/GlassMark'
import { EASE } from '@/components/ui/Reveal'
import AnimatedLabel from '@/components/ui/AnimatedLabel'
import { useIsMobile } from '@/hooks/useIsMobile'

// Cursor parallax only makes sense with a real pointer (decided once at load).
const FINE_POINTER =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

type HeroProps = {
  /** False while the intro title card is still up — the entrance holds until
   *  the curtains start lifting. */
  revealed?: boolean
  /** Whether this page load opened with the intro. */
  intro?: boolean
}

/**
 * Hero — the offer first. The headline, the one-line promise, the booking
 * button and the phone number all sit in the first screen; the glass SBM mark
 * is the brand accent beside them on desktop (phones get text only, so the
 * nav logo is the one logo on screen).
 */
export default function Hero({ revealed = true, intro = false }: HeroProps) {
  const reduce = useReducedMotion()
  const mobile = useIsMobile(900)

  // Lazy, heavy springs — the glass drifts a few pixels toward the cursor.
  const x = useSpring(0, { stiffness: 40, damping: 18, mass: 1 })
  const y = useSpring(0, { stiffness: 40, damping: 18, mass: 1 })
  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!FINE_POINTER || reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    y.set(((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const show = reduce || revealed
  const enter = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay: (intro ? 0.3 : 0) + delay },
  })

  return (
    <header className="hero" id="hero" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="hero-cred" {...enter(0)}>
            Founded by Stanford and Penn graduates
          </motion.p>
          <motion.h1 className="hero-title" {...enter(0.08)}>
            We turn your ads into booked customers.
          </motion.h1>
          <motion.p className="hero-pitch-line" {...enter(0.18)}>
            We run your ads, reply to every new lead within minutes, and book them onto your calendar.
          </motion.p>
          <motion.div className="hero-ctas" {...enter(0.28)}>
            <a className="contact-book-btn hero-pitch-btn anim-btn" href="/book">
              <AnimatedLabel>Book a Free Strategy Call</AnimatedLabel>
            </a>
            <a className="hero-phone" href="tel:+18134805818">
              or call (813) 480-5818
            </a>
          </motion.div>
        </div>
        {!mobile && (
          <motion.div
            className="hero-motion"
            style={{ x, y }}
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
            animate={show ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : undefined}
            transition={{ duration: 1.4, ease: EASE, delay: intro ? 0.2 : 0 }}
          >
            <GlassMark background="#CFB48E" text="SBM." textColor="#141414" size={34} />
          </motion.div>
        )}
      </div>
    </header>
  )
}
