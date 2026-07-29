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
 * Three full-width numbered rows with giant condensed words and hairline
 * separators. Each row choreographs its own entrance: the giant word lands
 * first, bold and confident, with its number and description cascading in
 * a tight stagger just after (stagger={0} + explicit delays).
 */
export default function HowWeWork() {
  return (
    <section className="howwework" id="how">
      <div className="howwework-inner">
        <Reveal amount={0.3}>
          <RevealItem as="p" className="label">How We Work</RevealItem>
        </Reveal>
        <div className="hw-rows">
          {STEPS.map((step) => (
            <Reveal key={step.num} className="hw-row" amount={0.35} stagger={0}>
              <RevealItem as="span" className="hw-num" delay={0.16}>{step.num}</RevealItem>
              <div className="hw-main">
                <RevealItem className="hw-word">{step.word}</RevealItem>
                <RevealItem as="p" className="hw-desc" delay={0.22}>{step.desc}</RevealItem>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
