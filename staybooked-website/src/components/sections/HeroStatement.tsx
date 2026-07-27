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
          <p>We build advertising systems that bring local businesses a steady flow of qualified, ready-to-buy customers.</p>
          <p>Websites, ads, and automation built to turn attention into booked revenue.</p>
        </RevealItem>
      </Reveal>
    </section>
  )
}
