import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * Editorial statement band directly under the logo hero.
 * Big condensed headline (left) + short supporting copy (right).
 */
export default function HeroStatement() {
  return (
    <section className="statement" id="statement">
      <Reveal className="statement-inner" amount={0.35}>
        <RevealItem as="h1" className="statement-headline">
          We don't chase leads.<br />We book them.
        </RevealItem>
        <RevealItem className="statement-support">
          <p>We build complete lead generation systems for local businesses. Targeted Meta ads bring in the right people, our automated system qualifies them, and booked, ready-to-buy customers land straight on your calendar.</p>
          <p>Advertising, qualification, and booking, handled end to end, so you focus on closing, not chasing.</p>
        </RevealItem>
      </Reveal>
    </section>
  )
}
