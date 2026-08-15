import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { BOOKING_URL } from '@/lib/booking'

/**
 * Pricing — one flat rate, stated plainly in the site's editorial voice.
 * Giant display figure on the left (echoing the stats band), the no-startup-fee
 * promise and what's included on the right, closed by the booking CTA.
 */
export default function Pricing() {
  return (
    <section className="section section-deep" id="pricing">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Pricing</RevealItem>
          <RevealItem as="h2" className="title">Simple pricing. Lower than anyone else.</RevealItem>
        </Reveal>

        <Reveal className="pricing-band" amount={0.3}>
          <RevealItem as="div" className="pricing-figure-cell">
            <span className="pricing-figure">$2,000</span>
            <span className="pricing-term">per month, plus ad spend</span>
          </RevealItem>
          <RevealItem as="div" className="pricing-detail" delay={0.14}>
            <p className="pricing-promise">No startup fee. Just simple monthly pricing.</p>
            <p className="body pricing-body">
              Everything included: campaign creation and management, lead follow-up, qualification, and booking, all handled end to end. Ad spend is billed separately by the ad platforms and always stays yours.
            </p>
            <p className="body pricing-body pricing-terms">
              Flexible terms: month to month or longer, your choice.
            </p>
            <a
              className="contact-book-btn pricing-cta"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call
            </a>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
