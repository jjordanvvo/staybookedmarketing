import { useEffect, useRef } from 'react'
import logo from '@/assets/logo.png'

export default function Hero() {
  const logoRef = useRef<HTMLImageElement>(null)

  // Hero intro: after the entrance settles, hand off to the breath animation.
  // Runs once on mount; skipped entirely under reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = logoRef.current
    const t = window.setTimeout(() => el?.classList.add('settled'), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <header className="hero snap" id="hero">
      <img ref={logoRef} className="hero-logo" src={logo} alt="Stay Booked Marketing" />
    </header>
  )
}
