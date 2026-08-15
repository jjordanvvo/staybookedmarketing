import { Reveal, RevealItem } from '@/components/ui/Reveal'

const STEPS = [
  {
    num: '01',
    name: 'Strategy Call',
    desc: 'A quick call to learn your business, your goals, and what a new customer is worth to you.',
  },
  {
    num: '02',
    name: 'Campaign Build',
    desc: 'We build your ads, follow-up, and booking system, tailored to your business.',
  },
  {
    num: '03',
    name: 'Launch',
    desc: 'Your campaigns go live and qualified leads start landing on your calendar.',
  },
  {
    num: '04',
    name: 'Ongoing Optimization',
    desc: 'We review performance month to month and keep improving what works.',
  },
]

/**
 * The plan — four-step path from first call to ongoing optimization, reusing
 * the HOW WE WORK editorial row system at a smaller display scale. Each step
 * unfolds on its own as it enters view: number first, then name, then its
 * one-line description in a tight cascade.
 */
export default function HowToStart() {
  return (
    <section className="howwework" id="start">
      <Reveal className="howwework-inner" amount={0.3}>
        <RevealItem as="p" className="label">The plan</RevealItem>
        <RevealItem as="h2" className="title">How it works</RevealItem>
      </Reveal>
      <div className="howwework-inner">
        <div className="hw-rows">
          {STEPS.map((step) => (
            <Reveal key={step.num} className="hw-row" amount={0.4} stagger={0}>
              <RevealItem as="span" className="hw-num">{step.num}</RevealItem>
              <div className="hw-main">
                <RevealItem as="h3" className="hw-plan-word" delay={0.1}>{step.name}</RevealItem>
                <RevealItem as="p" className="hw-desc" delay={0.2}>{step.desc}</RevealItem>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
