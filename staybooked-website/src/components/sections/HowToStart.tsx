import { Reveal, RevealItem } from '@/components/ui/Reveal'

export const STEPS = [
  {
    num: '01',
    name: 'Strategy call',
    desc: 'Fifteen minutes on your business, your goals, and what a new customer is worth to you.',
  },
  {
    num: '02',
    name: 'Build',
    desc: 'We set up your ads, follow-up and booking around how your business actually runs.',
  },
  {
    num: '03',
    name: 'Launch',
    desc: 'Campaigns go live and qualified leads start landing on your calendar.',
  },
  {
    num: '04',
    name: 'Improve',
    desc: 'We review the numbers with you every month and keep adjusting what works.',
  },
]

/**
 * Getting started — the onboarding path from first call to ongoing work, as a
 * compact four-column row so it can't be mistaken for the "How it works"
 * system rows above.
 */
export default function HowToStart() {
  return (
    <section className="section section-offwhite" id="start">
      <div className="wrap">
        <Reveal amount={0.3}>
          <RevealItem as="h2" className="title">Getting started</RevealItem>
        </Reveal>
        <Reveal as="ul" className="gs-row" amount={0.25}>
          {STEPS.map((step) => (
            <RevealItem as="li" className="gs-step" key={step.num}>
              <span className="gs-num">{step.num}</span>
              <h3 className="gs-name">{step.name}</h3>
              <p className="gs-desc">{step.desc}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
