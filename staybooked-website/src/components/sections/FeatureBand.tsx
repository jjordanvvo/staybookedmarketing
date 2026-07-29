import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import bgVideo from '@/assets/backgroundvid.mp4'
import { EASE } from '@/components/ui/Reveal'

/**
 * Full-width background video band (sits directly below the hero statement).
 *
 * The source video is portrait (720x1280); `object-fit: cover` zooms it to
 * fill this wide horizontal band, cropping top/bottom. It plays silently and
 * automatically as a soft, blurred atmospheric background, with the bold
 * "CHOOSE SBM." statement settling in cinematically over it and drifting a
 * few pixels slower than the scroll (gentle parallax, transform-only).
 *
 * ── FINE-TUNE FRAMING LATER (see .feature-band* in src/index.css) ──────────
 *  • Vertical focal point → `object-position` on .feature-band-video
 *    (higher % = framing sits lower; currently "center 65%").
 *  • Blur amount → `filter: blur(...)` on .feature-band-video.
 *  • Band height → `height` on .feature-band.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function FeatureBand() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Wordmark drifts slightly against the scroll while the band crosses the
  // viewport — subtle depth, never disorienting. Transform-only (60fps).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [16, -16])

  // Force the muted property (React's `muted` attribute alone isn't always
  // applied to the DOM node, and browsers only autoplay truly-muted video).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  }, [])

  return (
    <section ref={sectionRef} className="feature-band" id="feature" aria-label="Stay Booked Marketing">
      <video
        ref={videoRef}
        className="feature-band-video"
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Subtle dark tonal overlay so the white wordmark lifts off the video */}
      <div className="feature-band-overlay" aria-hidden="true" />
      {/* Bold editorial statement — same condensed display font as the giant
          ADVERTISE/QUALIFY/BOOK words. Slow, cinematic fade-and-settle. */}
      <motion.div
        className="feature-band-mark"
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.965 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <motion.span style={reduce ? undefined : { y: parallaxY }}>Choose SBM.</motion.span>
      </motion.div>
    </section>
  )
}
