import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * Pricing — every program is quoted per business after a free strategy call,
 * so this section's job is to make getting that quote effortless: book, call,
 * text, or email, all one tap away. The Growth Calculator (/growth-calculator/)
 * still shows what new leads could be worth.
 */
export default function Pricing() {
  return (
    <section className="section section-deep" id="pricing">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Pricing</RevealItem>
          <RevealItem as="h2" className="title">Pricing built around your business.</RevealItem>
        </Reveal>
        <Reveal amount={0.2}>
          <div className="gc-launch">
            <div className="gc-launch-text">
              <h3>Get your quote in one short call.</h3>
              <p>
                Every business has a different market, budget, and goal, so we price each program
                after a free 15-minute strategy call. No startup fee, no long-term contract, and ad
                spend always goes straight to the ad platforms, never through us.
              </p>
              <ul className="pricing-contact" aria-label="Ways to reach us">
                <li><a href="tel:+18134805818">Call (813) 480-5818</a></li>
                <li><a href="sms:+18134805818">Text (813) 480-5818</a></li>
                <li><a href="mailto:kolby@staybookedmarketing.com?subject=Pricing%20question">Email kolby@staybookedmarketing.com</a></li>
              </ul>
            </div>
            <a className="contact-book-btn gc-launch-btn" href="/book">
              Book a Free Strategy Call
            </a>
          </div>
        </Reveal>
        <Reveal amount={0.2}>
          <p className="pricing-calc">
            Curious what more booked appointments could be worth first?{' '}
            <a href="/growth-calculator/">Run the growth calculator</a>. No contact info needed.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
