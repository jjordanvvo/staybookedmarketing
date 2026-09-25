import { Reveal, RevealItem } from '@/components/ui/Reveal'
import CostCalculator from '@/components/sections/CostCalculator'

/**
 * Pricing — the flat rate, stated plainly, now as a live cost calculator.
 * The title keeps the editorial voice; the calculator estimates the monthly
 * total for the visitor's niche from their own numbers, then hands off to
 * the booking CTA inside the results panel.
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
          <CostCalculator />
        </Reveal>
      </div>
    </section>
  )
}
