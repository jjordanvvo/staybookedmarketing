import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * Pricing — the flat rate, stated plainly. The full Growth Calculator now
 * lives on its own page (/growth-calculator/): six questions about your
 * business, then a personalized 12-month projection built from your numbers
 * and published industry benchmarks. This section launches it.
 */
export default function Pricing() {
  return (
    <section className="section section-deep" id="pricing">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Pricing</RevealItem>
          <RevealItem as="h2" className="title">Great marketing shouldn't cost a fortune.</RevealItem>
        </Reveal>
        <Reveal amount={0.2}>
          <div className="gc-launch">
            <div className="gc-launch-text">
              <h3>See what it's worth to you.</h3>
              <p>
                Six short questions about your business. You'll get a personalized
                12-month projection built from your own numbers — what new leads
                are worth, what 5-minute follow-up adds, and what's left after the
                program cost.
              </p>
              <p className="gc-launch-note">
                $1,500/mo ad spend + $2,000/mo retainer. No contact info needed to
                see your numbers.
              </p>
            </div>
            <a className="contact-book-btn gc-launch-btn" href="/growth-calculator/">
              Run the growth calculator
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
