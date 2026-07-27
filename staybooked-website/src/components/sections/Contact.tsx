import type { ReactNode } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

const BOOKING_URL = 'https://calendar.app.google/Euu7i4zJdkcJc6Eb6'

/**
 * Contact is the final section. The Footer is rendered as `children`
 * INSIDE this section (pinned to the bottom of the contact screen).
 *
 * Three ways to start: schedule (primary button), email, and call.
 */
export default function Contact({ children }: { children?: ReactNode }) {
  return (
    <section className="section section-deep contact-section" id="contact">
      <div className="contact-center">
        <Reveal className="wrap wrap-contact" amount={0.3}>
          <RevealItem as="p" className="label">Get in touch</RevealItem>
          <RevealItem as="h2" className="contact-headline">Let's get you booked.</RevealItem>
          <RevealItem as="p" className="body contact-body">Send us an email, give us a direct call, or schedule a 15-minute meeting with our team. Whatever works best for you.</RevealItem>

          {/* Primary call to action — a booked call is the best outcome */}
          <RevealItem
            as="a"
            className="contact-book-btn"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a 15-Minute Call
          </RevealItem>

          {/* Alternatives */}
          <RevealItem as="div" className="contact-alts">
            <div className="contact-alt">
              <span className="contact-alt-label">Email us</span>
              <a className="contact-alt-value" href="mailto:staybookedmarketing@gmail.com">staybookedmarketing@gmail.com</a>
            </div>
            <div className="contact-alt">
              <span className="contact-alt-label">Call direct</span>
              <a className="contact-alt-value" href="tel:+19166069970">(916) 606-9970</a>
            </div>
          </RevealItem>
        </Reveal>
      </div>
      {children}
    </section>
  )
}
