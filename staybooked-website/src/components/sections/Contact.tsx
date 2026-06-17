import type { ReactNode } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * Contact is the final full-screen section. The Footer is rendered as `children`
 * INSIDE this section (pinned to the bottom of the contact screen) to preserve
 * the original DOM layout.
 */
export default function Contact({ children }: { children?: ReactNode }) {
  return (
    <section className="section section-deep contact-section" id="contact">
      <div className="contact-center">
        <Reveal className="wrap wrap-contact">
          <RevealItem as="p" className="label">Get in touch</RevealItem>
          <RevealItem as="h2" className="title">Ready to stay booked?</RevealItem>
          <RevealItem as="p" className="body contact-body">Tell us about your business and we will show you exactly what we would do.</RevealItem>
          <RevealItem as="a" className="email-cta" href="mailto:kolby@staybookedmarketing.com">kolby@staybookedmarketing.com</RevealItem>
        </Reveal>
      </div>
      {children}
    </section>
  )
}
