import { useEffect, useRef } from 'react'

/**
 * ParticleField — a hand-built, dependency-free particle engine in the spirit
 * of Casberry's AI particle sims and Originkit's pointer-reactive fields.
 *
 * Modes:
 *  - 'ambient'  sparse warm specks drifting on a slow vortex; pointer shoves
 *               them aside. Made to sit behind the hero without stealing it.
 *  - 'text'     the swarm assembles into a headline (glyph-sampled targets),
 *               holds, then bursts apart and reforms. The Casberry party trick.
 *  - 'sphere'   a pseudo-3D particle ball with drag-to-spin inertia.
 *
 * Canvas2D on purpose: no three.js weight, one file, and the warm SBM palette
 * keeps it editorial instead of gamer RGB.
 */

export type FieldMode = 'ambient' | 'text' | 'sphere'

type ParticleFieldProps = {
  mode?: FieldMode
  /** Text mode only — the word(s) the swarm forms. */
  text?: string
  /** Particles per 10,000 px² of canvas. Clamped for safety. */
  density?: number
  className?: string
  /** Dims the whole field (0-1). Use to keep it behind content. */
  intensity?: number
}

const PALETTE = ['#CFB48E', '#82683F', '#E5D5B3', '#B99B6B', '#141414']

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function ParticleField({
  mode = 'ambient',
  text = 'STAY BOOKED',
  density = 7,
  className,
  intensity = 1,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduce = prefersReducedMotion()
    let raf = 0
    let running = true
    let w = 0
    let h = 0
    let dpr = 1

    // --- state -----------------------------------------------------------
    let count = 0
    let px = new Float32Array(0)
    let py = new Float32Array(0)
    let pz = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)
    let vz = new Float32Array(0)
    let col = new Uint8Array(0)
    let size = new Float32Array(0)

    // pointer (canvas space, lerped)
    let mx = -9999
    let my = -9999
    let tmx = -9999
    let tmy = -9999
    // sphere drag
    let ang = 0
    let spinVel = 0.0015
    let dragging = false
    let lastDragX = 0

    // text morph targets
    let targets = new Float32Array(0) // pairs
    let targetCount = 0
    let phase: 'swarm' | 'form' | 'hold' | 'burst' = 'swarm'
    let phaseT = 0

    function build() {
      const rect = canvas!.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      count = Math.round(
        Math.min(Math.max((w * h * density * (mode === 'text' ? 1.8 : 1)) / 10000, 300), 7000)
      )
      px = new Float32Array(count)
      py = new Float32Array(count)
      pz = new Float32Array(count)
      vx = new Float32Array(count)
      vy = new Float32Array(count)
      vz = new Float32Array(count)
      col = new Uint8Array(count)
      size = new Float32Array(count)

      const R = Math.min(w, h) * 0.42
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const r = R * (0.35 + Math.random() * 0.85)
        px[i] = w / 2 + Math.cos(a) * r * (mode === 'ambient' ? 1.35 : 1)
        py[i] = h / 2 + Math.sin(a) * r * (mode === 'ambient' ? 0.55 : 1)
        pz[i] = (Math.random() - 0.5) * R
        vx[i] = (Math.random() - 0.5) * 0.25
        vy[i] = (Math.random() - 0.5) * 0.25
        vz[i] = (Math.random() - 0.5) * 0.02
        col[i] = Math.random() < 0.06 ? 4 : Math.floor(Math.random() * 4)
        size[i] = 0.8 + Math.random() * 1.6
      }
    }

    /** Sample glyph pixels of `text` as target coordinates. */
    function sampleText() {
      const off = document.createElement('canvas')
      const octx = off.getContext('2d')
      if (!octx) return
      const cw = Math.round(w)
      const ch = Math.round(h)
      off.width = cw
      off.height = ch
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      let fs = Math.min(ch * 0.34, (cw / Math.max(4, text.length)) * 2.1)
      octx.font = `700 ${fs}px 'Archivo', 'Helvetica Neue', Arial, sans-serif`
      while (octx.measureText(text).width > cw * 0.86 && fs > 12) {
        fs *= 0.94
        octx.font = `700 ${fs}px 'Archivo', 'Helvetica Neue', Arial, sans-serif`
      }
      octx.fillText(text, cw / 2, ch / 2)
      const img = octx.getImageData(0, 0, cw, ch).data
      const pts: number[] = []
      const step = Math.max(3, Math.round(fs / 26))
      for (let y = 0; y < ch; y += step) {
        for (let x = 0; x < cw; x += step) {
          if (img[(y * cw + x) * 4 + 3] > 140) pts.push(x, y)
        }
      }
      targets = new Float32Array(pts)
      targetCount = pts.length / 2
    }

    function burst() {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const s = 1.5 + Math.random() * 4
        vx[i] += Math.cos(a) * s
        vy[i] += Math.sin(a) * s
      }
    }

    function frame() {
      if (!running) return
      const ctxR = ctx!
      ctxR.clearRect(0, 0, w, h)

      mx += (tmx - mx) * 0.12
      my += (tmy - my) * 0.12
      const t = performance.now() / 1000

      // sphere rotation this frame (drag inertia + idle turn)
      if (mode === 'sphere') {
        spinVel = Math.min(Math.max(spinVel * 0.99, -0.05), 0.05)
        ang += spinVel + 0.0015
      }

      for (let i = 0; i < count; i++) {
        let x = px[i]
        let y = py[i]

        if (mode === 'sphere') {
          // orbit every particle around the field center
          const cx = w / 2
          const cy = h / 2
          const dx = x - cx
          const dy = y - cy
          const nx = cx + dx * Math.cos(ang) - dy * Math.sin(ang)
          const ny = cy + dx * Math.sin(ang) + dy * Math.cos(ang)
          x = nx
          y = ny
        } else {
          // pointer vortex
          const dxs = x - mx
          const dys = y - my
          const d2 = dxs * dxs + dys * dys
          const R2 = 160 * 160
          if (d2 < R2 && d2 > 1) {
            const d = Math.sqrt(d2)
            const f = (1 - d / 160) * 0.9
            vx[i] += (dxs / d) * f * 0.5 - (dys / d) * f * 0.65
            vy[i] += (dys / d) * f * 0.5 + (dxs / d) * f * 0.65
          }
          x += vx[i] + Math.sin(t * 0.25 + y * 0.004) * 0.12
          y += vy[i] + Math.cos(t * 0.21 + x * 0.004) * 0.12
          pz[i] += vz[i]
          vx[i] *= 0.96
          vy[i] *= 0.96

          if (mode === 'text') {
            if ((phase === 'form' || phase === 'hold') && targetCount > 0) {
              const ti = (i % targetCount) * 2
              const tx = targets[ti]
              const ty = targets[ti + 1]
              const k = phase === 'form' ? 0.02 : 0.006
              vx[i] += (tx - x) * k
              vy[i] += (ty - y) * k
              vx[i] *= 0.85
              vy[i] *= 0.85
            }
            if (x < -20) x = w + 20
            if (x > w + 20) x = -20
            if (y < -20) y = h + 20
            if (y > h + 20) y = -20
            if (pz[i] > 60) pz[i] = -60
            if (pz[i] < -60) pz[i] = 60
          } else if (x < -30 || x > w + 30 || y < -30 || y > h + 30) {
            x = w / 2
            y = h / 2
          }
        }

        px[i] = x
        py[i] = y

        const depth = (pz[i] + 60) / 120
        const r = size[i] * (0.6 + depth * 0.9)
        const alpha =
          (mode === 'ambient' ? 0.16 : 0.4) * (0.35 + depth * 0.75) * intensity
        ctxR.globalAlpha = alpha
        ctxR.fillStyle = PALETTE[col[i]]
        ctxR.beginPath()
        ctxR.arc(x, y, r, 0, Math.PI * 2)
        ctxR.fill()
      }

      if (mode === 'text' && !reduce) {
        phaseT++
        const SEC = 60
        if (phase === 'swarm' && phaseT > SEC * 2.2) {
          phase = 'form'
          phaseT = 0
        } else if (phase === 'form' && phaseT > SEC * 2.6) {
          phase = 'hold'
          phaseT = 0
        } else if (phase === 'hold' && phaseT > SEC * 2.2) {
          phase = 'burst'
          phaseT = 0
          burst()
        } else if (phase === 'burst' && phaseT > SEC * 0.9) {
          phase = 'swarm'
          phaseT = 0
        }
      }

      raf = requestAnimationFrame(frame)
    }

    function renderOnce() {
      const ctxR = ctx!
      ctxR.clearRect(0, 0, w, h)
      for (let i = 0; i < count; i++) {
        ctxR.globalAlpha = (mode === 'ambient' ? 0.16 : 0.4) * intensity
        ctxR.fillStyle = PALETTE[col[i]]
        ctxR.beginPath()
        ctxR.arc(px[i], py[i], size[i], 0, Math.PI * 2)
        ctxR.fill()
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect()
      tmx = e.clientX - r.left
      tmy = e.clientY - r.top
      if (mode === 'sphere' && dragging) {
        spinVel += (e.clientX - lastDragX) * 0.0006
        lastDragX = e.clientX
      }
    }
    const onLeave = () => {
      tmx = -9999
      tmy = -9999
      dragging = false
    }
    const onDown = (e: PointerEvent) => {
      if (mode !== 'sphere') return
      dragging = true
      lastDragX = e.clientX
    }
    const onUp = () => {
      dragging = false
    }

    const ro = new ResizeObserver(() => {
      build()
      if (mode === 'text') sampleText()
      if (reduce) renderOnce()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(
      (entries) => {
        if (reduce) return
        for (const en of entries) {
          if (en.isIntersecting && !raf) {
            running = true
            raf = requestAnimationFrame(frame)
          } else if (!en.isIntersecting && raf) {
            running = false
            cancelAnimationFrame(raf)
            raf = 0
          }
        }
      },
      { threshold: 0.02 }
    )
    io.observe(canvas)

    build()
    if (mode === 'text') sampleText()

    window.addEventListener('pointermove', onMove, { passive: true })
    canvas.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    canvas.addEventListener('pointerleave', onLeave)

    if (reduce) {
      renderOnce()
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [mode, text, density, intensity])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        cursor: mode === 'sphere' ? 'grab' : undefined,
      }}
      aria-hidden="true"
    />
  )
}
