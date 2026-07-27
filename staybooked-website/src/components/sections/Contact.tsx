import type { ReactNode } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * Contact is the final section. The Footer is rendered as `children`
 * INSIDE this section (pinned to the bottom of the contact screen).
 */
export default function Contact({ children }: { children?: ReactNode }) {
  return (
    <section className="section section-deep contact-section" id="contact">
      <div className="contact-center">
        <Reveal className="wrap wrap-contact" amount={0.3}>
          <RevealItem as="p" className="label">Get in touch</RevealItem>
          <RevealItem as="h2" className="contact-headline">Let's get you booked.</RevealItem>
          <RevealItem as="p" className="body contact-body">Tell us about your business and we'll show you exactly what we would do to bring you a steady flow of qualified, ready-to-buy customers.</RevealItem>
          <RevealItem as="a" className="email-cta" href="mailto:kolby@staybookedmarketing.com">kolby@staybookedmarketing.com</RevealItem>
        </Reveal>
      </div>
      {children}
    </section>
  )
}
