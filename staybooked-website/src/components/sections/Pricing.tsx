import { Reveal, RevealItem } from '@/components/ui/Reveal'
import AnimatedLabel from '@/components/ui/AnimatedLabel'

/**
 * Pricing — every program is quoted per business after a free strategy call.
 * The section says so plainly, then states the two terms that make the call
 * low-risk: no startup fee, and the 90-day goal guarantee.
 */
export default function Pricing() {
  return (
    <section className="section section-tan" id="pricing">
      <div className="wrap">
        <Reveal>
          <RevealItem as="h2" className="title">How pricing works</RevealItem>
          <RevealItem as="p" className="body pr-lede">
            Every market, budget and goal is different, so we quote each program after a free
            15-minute strategy call. You leave the call with a real number.
          </RevealItem>
        </Reveal>
        <Reveal as="div" className="pr-terms" amount={0.25}>
          <RevealItem as="div" className="pr-term">
            <h3>No startup fee</h3>
            <p>You pay for the program, not for getting set up. Ad spend is billed by the ad platforms directly, never through us.</p>
          </RevealItem>
          <RevealItem as="div" className="pr-term">
            <h3>Our 90-day guarantee</h3>
            <p>We set a goal together on the call. If we don't hit it within 90 days, we keep working for free until we do.</p>
          </RevealItem>
        </Reveal>
        <Reveal amount={0.3}>
          <RevealItem as="div" className="pr-cta">
            <a className="contact-book-btn anim-btn" href="/book">
              <AnimatedLabel>Book a Free Strategy Call</AnimatedLabel>
            </a>
            <p className="pricing-calc">
              Want a rough idea first? <a href="/growth-calculator/">Try the growth calculator</a>. No contact info needed.
            </p>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
