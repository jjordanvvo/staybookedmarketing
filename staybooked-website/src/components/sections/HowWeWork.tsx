import { Reveal, RevealItem } from '@/components/ui/Reveal'

export const STEPS = [
  {
    num: '01',
    word: 'Advertise',
    desc: 'We build and run ad campaigns aimed at local customers who are already looking for what you sell.',
  },
  {
    num: '02',
    word: 'Qualify',
    desc: 'Every new lead gets a reply and a few screening questions within minutes, so you stop spending time on tire-kickers.',
  },
  {
    num: '03',
    word: 'Book',
    desc: 'Qualified customers land on your calendar, or go straight to you, ready for the appointment.',
  },
]

/**
 * HOW IT WORKS — the system in three giant words. Each row choreographs its
 * own entrance: the word lands first, number and description just after.
 */
export default function HowWeWork() {
  return (
    <section className="howwework" id="how">
      <div className="howwework-inner">
        <Reveal amount={0.3}>
          <RevealItem as="h2" className="title">How it works</RevealItem>
        </Reveal>
        <div className="hw-rows">
          {STEPS.map((step) => (
            <Reveal key={step.num} className="hw-row" amount={0.35} stagger={0}>
              <RevealItem as="span" className="hw-num" delay={0.16}>{step.num}</RevealItem>
              <div className="hw-main">
                <RevealItem as="h3" className="hw-word">{step.word}</RevealItem>
                <RevealItem as="p" className="hw-desc" delay={0.22}>{step.desc}</RevealItem>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
