import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import bgVideo from '@/assets/backgroundvid.mp4'

/**
 * Full-width background video band (sits directly below the hero statement).
 *
 * The source video is portrait (720x1280); `object-fit: cover` zooms it to
 * fill this wide horizontal band, cropping top/bottom. It plays silently and
 * automatically as a soft, blurred atmospheric background, with an elegant
 * cursive "SBM." wordmark fading in over it.
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
  const reduce = useReducedMotion()

  // Force the muted property (React's `muted` attribute alone isn't always
  // applied to the DOM node, and browsers only autoplay truly-muted video).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  }, [])

  return (
    <section className="feature-band" id="feature" aria-label="Stay Booked Marketing">
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
          ADVERTISE/QUALIFY/BOOK words. Slow, graceful fade in on scroll. */}
      <motion.div
        className="feature-band-mark"
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Choose SBM.
      </motion.div>
    </section>
  )
}
