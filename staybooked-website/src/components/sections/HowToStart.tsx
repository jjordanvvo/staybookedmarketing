import { Reveal, RevealItem } from '@/components/ui/Reveal'

const STEPS = [
  {
    num: '01',
    text: 'Book a quick call. We learn about your business, your goals, and what a new customer is worth to you.',
  },
  {
    num: '02',
    text: 'We build your system. We set up your ads, qualification, and booking, tailored to your business, and launch.',
  },
  {
    num: '03',
    text: 'You start getting booked. Qualified leads come in and land on your calendar. We manage and optimize everything month to month.',
  },
]

/**
 * How to get started — clear three-step path, reusing the HOW WE WORK
 * editorial row system. Each step unfolds on its own as it enters view:
 * number first, its text following in a tight cascade.
 */
export default function HowToStart() {
  return (
    <section className="howwework" id="start">
      <Reveal className="howwework-inner" amount={0.3}>
        <RevealItem as="p" className="label">The process</RevealItem>
        <RevealItem as="h2" className="title">How to get started</RevealItem>
      </Reveal>
      <div className="howwework-inner">
        <div className="hw-rows">
          {STEPS.map((step) => (
            <Reveal key={step.num} className="hw-row" amount={0.4} stagger={0}>
              <RevealItem as="span" className="hw-num">{step.num}</RevealItem>
              <RevealItem as="p" className="hw-step" delay={0.14}>{step.text}</RevealItem>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
