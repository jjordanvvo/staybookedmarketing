/**
 * Type declaration for the Originkit "Glass Icon" component module
 * (https://www.originkit.dev/components/glass-icon, preset=base).
 *
 * The module is a compify build: it resolves React, react/jsx-runtime and
 * framer-motion from `window.__compifyGlobals` at import time (see
 * ui/GlassMark.tsx, which installs those globals before the dynamic import).
 * Everything else — the WebGL2 renderer, SDF glass shapes, refraction shaders —
 * is bundled inside the module. Vendored byte-for-byte; no three.js dep.
 */

export interface GlassIconBackdropFont {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string | number
  fontStyle?: string
  letterSpacing?: string | number
  lineHeight?: number | string
}

export interface GlassIconBackdrop {
  type?: 'None' | 'Image' | 'Video' | 'Text'
  text?: string
  textColor?: string
  image?: string
  video?: string
  font?: GlassIconBackdropFont
}

export interface GlassIconGlass {
  tint?: string
  frost?: number
  chromatic?: number
}

export interface GlassIconOrient {
  angleX?: number
  angleY?: number
  angleZ?: number
  offsetX?: number
  offsetY?: number
}

export interface GlassIconProps {
  style?: React.CSSProperties
  /** Solid color behind the backdrop plate. */
  background?: string
  /** Glass body shape. 'Logo' extrudes the `logo` image's alpha. */
  shape?: 'X' | 'Torus' | 'Sphere' | 'Logo'
  /** PNG/data-URL whose alpha becomes the glass body when shape='Logo'. */
  logo?: string
  /** Body thickness, 0–200 (%). Ignored for 'Sphere'. */
  depth?: number
  /** Body size, 5–100 (% of the frame). */
  size?: number
  /** Idle spin speed, 0–100. */
  speed?: number
  direction?: 'Clockwise' | 'Counterclockwise'
  orient?: GlassIconOrient
  backdrop?: GlassIconBackdrop
  glass?: GlassIconGlass
}

declare const GlassIcon: React.ComponentType<GlassIconProps>
export default GlassIcon
