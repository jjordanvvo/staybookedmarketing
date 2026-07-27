import { Reveal, RevealItem } from '@/components/ui/Reveal'

const STEPS = [
  {
    num: '01',
    word: 'Advertise',
    desc: 'We build and run targeted Meta ad campaigns that put your business in front of the right local customers actively looking for what you offer.',
  },
  {
    num: '02',
    word: 'Qualify',
    desc: 'Every lead is automatically contacted and screened the moment they come in, so you never waste time on tire-kickers or cold inquiries.',
  },
  {
    num: '03',
    word: 'Book',
    desc: 'Qualified, interested leads are delivered straight to you or booked directly onto your calendar, ready for you to close.',
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
