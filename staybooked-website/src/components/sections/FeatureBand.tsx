import { useEffect, useRef } from 'react'
import bgVideo from '@/assets/backgroundvid.mp4'

/**
 * Full-width background video band (sits directly below the hero statement).
 *
 * The source video is portrait (720x1280); `object-fit: cover` zooms it to
 * fill this wide horizontal band, cropping top/bottom. It plays silently and
 * automatically as a background element — muted, looping, no controls.
 *
 * ── FINE-TUNE FRAMING LATER (see .feature-band* in src/index.css) ──────────
 *  • Vertical focal point → change `object-position` on .feature-band-video
 *    (e.g. "center 30%" shows more of the top, "center 70%" more of the bottom).
 *  • Band height → change `height` on .feature-band.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function FeatureBand() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Force the muted property (React's `muted` attribute alone isn't always
  // applied to the DOM node, and browsers only autoplay truly-muted video).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  }, [])

  return (
    <section className="feature-band" id="feature" aria-label="Stay Booked Marketing background video">
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
    </section>
  )
}
