import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ComponentProps } from 'react'

/**
 * Reveal / RevealItem — framer-motion entrance system.
 *
 * Wrap a block in <Reveal> and its <RevealItem> descendants rise + sharpen in
 * sequence the first time the block scrolls into view (once: true, so it never
 * re-runs or flickers on scroll-back). Honors prefers-reduced-motion: when set,
 * everything appears instantly with no transform/blur.
 */

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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      // Spring on the travel, gentle tweens on opacity/blur — feels alive, not bouncy.
      y: { type: 'spring', stiffness: 64, damping: 16, mass: 1 },
      opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      filter: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  },
}

const still: Variants = { hidden: { opacity: 1 }, show: { opacity: 1 } }

type RevealProps<T extends Tag> = {
  as?: T
  amount?: number
} & Omit<ComponentProps<(typeof TAGS)[T]>, 'ref'>

export function Reveal<T extends Tag = 'div'>({
  as,
  amount = 0.25,
  children,
  ...rest
}: RevealProps<T>) {
  const reduce = useReducedMotion()
  const Comp = TAGS[(as ?? 'div') as Tag]
  return (
    <Comp
      variants={reduce ? still : container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...(rest as any)}
    >
      {children}
    </Comp>
  )
}

export function RevealItem<T extends Tag = 'div'>({
  as,
  children,
  ...rest
}: Omit<RevealProps<T>, 'amount'>) {
  const reduce = useReducedMotion()
  const Comp = TAGS[(as ?? 'div') as Tag]
  return (
    <Comp variants={reduce ? still : item} {...(rest as any)}>
      {children}
    </Comp>
  )
}
