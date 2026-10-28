import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import AnimatedLabel from '@/components/ui/AnimatedLabel'

/**
 * Contact is the final section. The Footer is rendered as `children`
 * INSIDE this section (pinned to the bottom of the contact screen).
 *
 * Three ways to start: schedule (primary button), email, and call.
 */
export default function Contact({ children }: { children?: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <section className="section section-deep contact-section" id="contact">
      <div className="contact-center">
        <Reveal className="wrap wrap-contact" amount={0.3}>
          <RevealItem as="p" className="label">Get in touch</RevealItem>
          <RevealItem as="h2" className="contact-headline">Let's get you booked.</RevealItem>
          <RevealItem as="p" className="body contact-body">Send us an email, give us a direct call, or schedule a 15-minute meeting with our team. Whatever works best for you.</RevealItem>

          {/* Primary call to action — a booked call is the best outcome.
              whileTap gives a confident press; hover lift + fill live in CSS. */}
          <RevealItem
            as="a"
            className="contact-book-btn anim-btn"
            href="/book"
            whileTap={reduce ? undefined : { scale: 0.98 }}
          >
            <AnimatedLabel>Book a 15-Minute Call</AnimatedLabel>
          </RevealItem>

          {/* Alternatives */}
          <RevealItem as="div" className="contact-alts">
            <div className="contact-alt">
              <span className="contact-alt-label">Email us</span>
              <a className="contact-alt-value" href="mailto:kolby@staybookedmarketing.com">kolby@staybookedmarketing.com</a>
            </div>
            <div className="contact-alt">
              <span className="contact-alt-label">Call direct</span>
              <a className="contact-alt-value" href="tel:+18134805818">(813) 480-5818</a>
            </div>
          </RevealItem>
        </Reveal>
      </div>
      {children}
    </section>
  )
}
