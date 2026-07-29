import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ComponentProps } from 'react'

/**
 * Reveal / RevealItem — framer-motion entrance system.
 *
 * Wrap a block in <Reveal> and its <RevealItem> descendants rise + sharpen in
 * sequence the first time the block scrolls into view (once: true, so it never
 * re-runs or flickers on scroll-back). Honors prefers-reduced-motion: when set,
 * everything appears instantly with no transform/blur.
 *
 * The travel + blur + easing here IS the site's global motion language — every
 * section entrance routes through it so the whole page settles with one voice.
 * On touch-first devices the travel and blur are lighter (cheaper to composite,
 * calmer on small screens).
 */

/** Global premium easing — matches the cubic-bezier(0.16, 1, 0.3, 1) used in CSS. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** No-op variants for prefers-reduced-motion: content is simply there. */
export const still: Variants = { hidden: { opacity: 1 }, show: { opacity: 1 } }

// Touch-first devices get lighter entrances (decided once at load).
const COARSE =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const TRAVEL = COARSE ? 24 : 36
const BLUR = COARSE ? 6 : 12

// Motion-enabled tags we actually use, kept in a typed map so `as` stays safe.
const TAGS = {
  div: motion.div,
  section: motion.section,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
  a: motion.a,
  article: motion.article,
} as const

type Tag = keyof typeof TAGS

// Variant objects are cached per stagger/delay so re-renders reuse identities.
const containerCache = new Map<number, Variants>()
function containerFor(stagger: number): Variants {
  let v = containerCache.get(stagger)
  if (!v) {
    v = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: 0.06 } } }
    containerCache.set(stagger, v)
  }
  return v
}

const itemCache = new Map<number, Variants>()
function itemFor(delay: number): Variants {
  let v = itemCache.get(delay)
  if (!v) {
    v = {
      hidden: { opacity: 0, y: TRAVEL, filter: `blur(${BLUR}px)` },
      show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          // Spring on the travel, gentle tweens on opacity/blur — feels alive, not bouncy.
          y: { type: 'spring', stiffness: 64, damping: 16, mass: 1, delay },
          opacity: { duration: 0.7, ease: EASE, delay },
          filter: { duration: 0.8, ease: EASE, delay },
        },
      },
    }
    itemCache.set(delay, v)
  }
  return v
}

type RevealProps<T extends Tag> = {
  as?: T
  amount?: number
  /** Seconds between each child's entrance. Pass 0 to choreograph children
   *  yourself with per-item `delay`s instead. */
  stagger?: number
} & Omit<ComponentProps<(typeof TAGS)[T]>, 'ref'>

export function Reveal<T extends Tag = 'div'>({
  as,
  amount = 0.25,
  stagger = 0.12,
  children,
  ...rest
}: RevealProps<T>) {
  const reduce = useReducedMotion()
  const Comp = TAGS[(as ?? 'div') as Tag]
  return (
    <Comp
      variants={reduce ? still : containerFor(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...(rest as any)}
    >
      {children}
    </Comp>
  )
}

type RevealItemProps<T extends Tag> = Omit<RevealProps<T>, 'amount' | 'stagger'> & {
  /** Extra seconds before this item enters, on top of the parent's stagger. */
  delay?: number
}

export function RevealItem<T extends Tag = 'div'>({
  as,
  delay = 0,
  children,
  ...rest
}: RevealItemProps<T>) {
  const reduce = useReducedMotion()
  const Comp = TAGS[(as ?? 'div') as Tag]
  return (
    <Comp variants={reduce ? still : itemFor(delay)} {...(rest as any)}>
      {children}
    </Comp>
  )
}
