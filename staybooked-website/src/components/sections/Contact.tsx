import type { ReactNode } from 'react'

/**
 * Contact is the final 100vh snap screen. The Footer is rendered as `children`
 * INSIDE this section (pinned to the bottom of the contact screen) to preserve
 * the original DOM and the page-turn scroll-snap behavior exactly.
 */
export default function Contact({ children }: { children?: ReactNode }) {
  return (
    <section className="section section-deep section-reveal snap contact-section" id="contact">
      <div className="contact-center">
        <div className="wrap wrap-contact">
          <p className="label stagger">Get in touch</p>
          <h2 className="title stagger heading">Ready to stay booked?</h2>
          <p className="body contact-body stagger">Tell us about your business and we will show you exactly what we would do.</p>
          <a className="email-cta stagger" href="mailto:kolby@staybookedmarketing.com">kolby@staybookedmarketing.com</a>
        </div>
      </div>
      {children}
    </section>
  )
}
