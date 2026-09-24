import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Throughline — the site's spine.
 *
 * A thin tan line fixed at the left edge of the viewport draws downward as
 * you travel the whole page, passing chapter nodes along the way: the page
 * stops being a stack of sections and becomes one continuous motion, top to
 * bottom. This is the centerpiece's connective tissue — every chapter lands
 * on the line, and the line itself is the same warm ink the intro, the week
 * board, and the logo all speak in.
 *
 * Chapter nodes are positioned by measuring each section's true place in the
 * document, so the rail stays correct no matter how content shifts. Clicking
 * a node glides you there (Lenis when available). Desktop only, never under
 * prefers-reduced-motion (the rail renders as a plain static hairline).
 */

const CHAPTERS = [
  { id: 'week', no: '01', label: 'The Week' },
  { id: 'how', no: '02', label: 'How It Works' },
  { id: 'services', no: '03', label: 'Services' },
  { id: 'feature', no: '04', label: 'Choose SBM' },
  { id: 'industries', no: '05', label: 'Who We Help' },
  { id: 'explorer', no: '06', label: 'The Explorer' },
  { id: 'why', no: '07', label: 'Why Us' },
  { id: 'founders', no: '08', label: 'Founders' },
  { id: 'start', no: '09', label: 'Getting Started' },
  { id: 'pricing', no: '10', label: 'Pricing' },
  { id: 'faq', no: '11', label: 'FAQ' },
  { id: 'contact', no: '12', label: 'Contact' },
]

type Tick = { id: string; no: string; label: string; at: number }

function Node({ tick, progress }: { tick: Tick; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  // A node fills warm as the line reaches it.
  const lit = useTransform(progress, [tick.at - 0.015, tick.at + 0.01], [0, 1])
  const goTo = () => {
    const el = document.getElementById(tick.id)
    if (!el) return
    const lenis = (window as any).__lenis
    if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -80, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <motion.button
      className="tl-node"
      style={{ top: `${tick.at * 100}%` }}
      onClick={goTo}
      aria-label={tick.label}
      title={`${tick.no} — ${tick.label}`}
    >
      <span className="tl-node-ring" />
      <motion.span className="tl-node-core" style={{ opacity: lit }} />
      <motion.span className="tl-node-no" style={{ opacity: lit }}>
        {tick.no}
      </motion.span>
    </motion.button>
  )
}

export default function Throughline() {
  const reduce = useReducedMotion()
  const [ticks, setTicks] = useState<Tick[]>([])
  const { scrollYProgress } = useScroll()
  const drawn = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Measure each chapter's true position along the page (fraction of total
  // scrollable distance where the section's top hits mid-viewport).
  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const next: Tick[] = []
      for (const ch of CHAPTERS) {
        const el = document.getElementById(ch.id)
        if (!el) continue
        const at = Math.min(1, Math.max(0, (el.offsetTop - window.innerHeight * 0.42) / scrollable))
        next.push({ ...ch, at })
      }
      setTicks(next)
    }
    measure()
    const t1 = window.setTimeout(measure, 600) // after fonts/layout settle
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(t1)
      window.removeEventListener('resize', measure)
    }
  }, [])

  if (reduce) return null

  return (
    <nav className="throughline" aria-label="Chapters">
      <div className="tl-track" aria-hidden="true" />
      <motion.div className="tl-draw" aria-hidden="true" style={{ height: drawn }} />
      {ticks.map((t) => (
        <Node key={t.id} tick={t} progress={scrollYProgress} />
      ))}
    </nav>
  )
}
