import { Reveal, RevealItem } from '@/components/ui/Reveal'

const STEPS = [
  {
    num: '01',
    word: 'Advertise',
    desc: 'We run targeted Meta ad campaigns that put your business in front of the right local customers.',
  },
  {
    num: '02',
    word: 'Qualify',
    desc: 'Our automated system follows up instantly and filters every lead so you only talk to real prospects.',
  },
  {
    num: '03',
    word: 'Book',
    desc: 'Qualified leads get routed straight to you or booked onto your calendar, ready to close.',
  },
]

/**
 * HOW WE WORK — signature editorial element.
 * Three full-width numbered rows with giant condensed words and
 * hairline separators. Each row reveals cleanly on scroll.
 */
export default function HowWeWork() {
  return (
    <section className="howwework" id="how">
      <Reveal className="howwework-inner" amount={0.2}>
        <RevealItem as="p" className="label">How We Work</RevealItem>
        <div className="hw-rows">
          {STEPS.map((step) => (
            <RevealItem key={step.num} className="hw-row">
              <span className="hw-num">{step.num}</span>
              <div className="hw-main">
                <div className="hw-word">{step.word}</div>
                <p className="hw-desc">{step.desc}</p>
              </div>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
