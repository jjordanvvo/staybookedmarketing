import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { EASE, still } from '@/components/ui/Reveal'

/**
 * Editorial statement band directly under the logo hero.
 * Big condensed headline (left) + short supporting copy (right).
 *
 * The headline lands line by line — each line rises and sharpens from a soft
 * blur — then the supporting copy cascades in just after. `custom` is the
 * entrance slot in units of 0.16s.
 */
const rise: Variants = {
  hidden: { opacity: 0, y: '0.55em', filter: 'blur(8px)' },
  show: (slot: number = 0) => ({
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: {
      y: { type: 'spring', stiffness: 60, damping: 16, mass: 1, delay: slot * 0.16 },
      opacity: { duration: 0.7, ease: EASE, delay: slot * 0.16 },
      filter: { duration: 0.8, ease: EASE, delay: slot * 0.16 },
    },
  }),
}

export default function HeroStatement() {
  const reduce = useReducedMotion()
  const v = reduce ? still : rise
  return (
    <section className="statement" id="statement">
      <motion.div
        className="statement-inner"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <h1 className="statement-headline">
          <motion.span className="statement-line" variants={v} custom={0}>
            We don't chase leads.
          </motion.span>
          <motion.span className="statement-line" variants={v} custom={1}>
            We book them.
          </motion.span>
        </h1>
        <div className="statement-support">
          <motion.p variants={v} custom={2.4}>We build complete lead generation systems for medical and local practices. Targeted ads bring in the right patients, our automated system qualifies them, and booked, ready-to-book patients land straight on your calendar.</motion.p>
          <motion.p variants={v} custom={3.1}>Stay Booked Marketing builds lead generation systems for medical practices and local businesses that want more patients and customers. We run the ads, qualify every lead, and handle the digital side so you can focus on care.</motion.p>
        </div>
      </motion.div>
    </section>
  )
}
