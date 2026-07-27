import { Reveal, RevealItem } from '@/components/ui/Reveal'

const SERVICES = [
  {
    num: '01',
    name: 'Website Design',
    desc: 'Fast, clean sites built to convert local traffic into booked jobs.',
  },
  {
    num: '02',
    name: 'Local SEO',
    desc: 'Google Business Profile, citations, and on-page work that puts you in front of buyers.',
  },
  {
    num: '03',
    name: 'Meta Advertising',
    desc: 'Lead campaigns that send new customers directly to your phone.',
  },
]

export default function Services() {
  return (
    <section className="section section-light" id="services">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Services</RevealItem>
          <RevealItem as="h2" className="title">Three things, done well.</RevealItem>
        </Reveal>

        <div className="svc-list">
          {SERVICES.map((s, i) => (
            // Each block is its own reveal: number → name → description stagger in.
            <Reveal
              as="article"
              key={s.num}
              className={`svc-block${i % 2 === 1 ? ' svc-right' : ''}`}
              amount={0.4}
            >
              <RevealItem as="div" className="svc-num-cell" aria-hidden="true">
                <span className="svc-num">{s.num}</span>
              </RevealItem>
              <RevealItem as="div" className="svc-name-cell">
                <h3 className="svc-name">{s.name}</h3>
              </RevealItem>
              <RevealItem as="p" className="svc-desc">{s.desc}</RevealItem>
              <span className="svc-line" aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
