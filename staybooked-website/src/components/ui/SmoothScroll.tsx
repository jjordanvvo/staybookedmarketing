import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — Lenis inertia scrolling for the whole site.
 *
 * The browser wheel becomes a buttery, weighted glide: the single biggest
 * "award site" tell, and the foundation every scroll-driven scene sits on.
 * framer-motion's useScroll keeps working untouched (Lenis animates the real
 * window scroll, so every scroll listener just works).
 *
 * - Never initializes under prefers-reduced-motion (native scroll stays).
 * - Stops while the intro title card is up (it locks the body) and resumes
 *   the moment it lifts — watched via body overflow, which the intro owns.
 * - The instance is exposed on window for hash navigation to glide to
 *   anchors instead of jumping.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })
    ;(window as any).__lenis = lenis

    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // The intro locks scrolling with body overflow — mirror that into Lenis.
    const syncLock = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop()
      else lenis.start()
    }
    const obs = new MutationObserver(syncLock)
    obs.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    syncLock()

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      lenis.destroy()
      delete (window as any).__lenis
    }
  }, [])

  return null
}
