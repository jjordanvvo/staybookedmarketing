import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — Lenis inertia scrolling for desktop wheel users, so the
 * scroll-linked loops (the lead path in How it works, the tree drift) glide
 * instead of stepping. Phones keep native scrolling; reduced-motion users get
 * native scrolling everywhere. Pauses while the intro locks the body.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.95 })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Anchor links glide through Lenis instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const el = document.getElementById(a.getAttribute('href')!.slice(1))
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -76 })
      history.replaceState(null, '', a.getAttribute('href'))
    }
    document.addEventListener('click', onClick)

    // The intro locks scrolling with body overflow; mirror that into Lenis.
    const sync = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start())
    const obs = new MutationObserver(sync)
    obs.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    sync()

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      document.removeEventListener('click', onClick)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])
  return null
}
