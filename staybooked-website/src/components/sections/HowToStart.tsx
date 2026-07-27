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
 * editorial row system (off-white band, numbered rows, blur-to-clear reveal).
 */
export default function HowToStart() {
  return (
    <section className="howwework" id="start">
      <Reveal className="howwework-inner" amount={0.2}>
        <RevealItem as="p" className="label">The process</RevealItem>
        <RevealItem as="h2" className="title">How to get started</RevealItem>
        <div className="hw-rows">
          {STEPS.map((step) => (
            <RevealItem key={step.num} className="hw-row">
              <span className="hw-num">{step.num}</span>
              <p className="hw-step">{step.text}</p>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
