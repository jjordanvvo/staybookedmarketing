import { lazy, Suspense, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import * as framerMotion from 'framer-motion'
import type { GlassIconProps } from '@/vendor/originkit-glass-icon'

/**
 * The Originkit module is a compify build: it resolves react,
 * react/jsx-runtime and framer-motion from a host global at import time.
 * Install the globals before the (lazy) dynamic import ever runs.
 */
declare global {
  interface Window {
    __compifyGlobals?: Record<string, unknown>
  }
}
if (typeof window !== 'undefined') {
  window.__compifyGlobals = {
    ...(window.__compifyGlobals ?? {}),
    react: React,
    'react/jsx-runtime': jsxRuntime,
    'framer-motion': framerMotion,
  }
}

const GlassIcon = lazy(() => import('@/vendor/originkit-glass-icon'))

type GlassMarkProps = {
  /** CSS color of the plate behind the glass (matches the hero panel). */
  background: string
  /** Lettering refracted through the glass. */
  text: string
  /** Lettering color on the plate. */
  textColor: string
} & Partial<GlassIconProps>

/** Viewport width hook — backdrop lettering scales down on small screens
 *  (the plate texture is drawn at element size, so oversized text crops). */
function useViewportWidth() {
  const [w, setW] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  )
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

/**
 * GlassMark — the Originkit "Glass Icon" (preset=base) tuned for the SBM hero:
 * a slow glass torus refracting the brand lettering, Archivo 800 to match the
 * display statements. Calm by design — the lettering stays the focal point.
 */
export default function GlassMark({
  background,
  text,
  textColor,
  shape = 'Torus',
  size = 58,
  speed = 30,
  glass,
  ...rest
}: GlassMarkProps) {
  const vw = useViewportWidth()
  const reduce = useReducedMotion()

  // Lettering fits the plate: large on desktop, scaled down on phones.
  const fontSize = vw < 480 ? '44px' : vw < 768 ? '72px' : '140px'

  // Mobile frames are short and wide, so the glass reads much bigger there.
  // Drop its size so the lettering, not the coin, stays the focal point.
  const coinSize = vw < 768 ? 36 : size

  return (
    <div className="glass-mark" role="img" aria-label="Stay Booked Marketing">
      <Suspense fallback={null}>
        <GlassIcon
          style={{ minWidth: 0, minHeight: 0 }}
          background={background}
          shape={shape}
          size={coinSize}
          speed={reduce ? 0 : speed}
          direction="Counterclockwise"
          backdrop={{
            type: 'Text',
            text,
            textColor,
            font: {
              fontFamily: "'Archivo', sans-serif",
              fontSize,
              fontWeight: 800,
              fontStyle: 'normal',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
            },
          }}
          glass={{ tint: '#FFFFFF', frost: 50, chromatic: 65, ...glass }}
          {...rest}
        />
      </Suspense>
    </div>
  )
}
