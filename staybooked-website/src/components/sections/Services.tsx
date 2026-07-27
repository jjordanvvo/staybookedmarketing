import { Reveal, RevealItem } from '@/components/ui/Reveal'

const SERVICES = [
  {
    num: '01',
    name: 'Lead Generation Systems',
    desc: 'Complete Meta ad campaigns with automated lead qualification and booking, built to deliver you a steady flow of ready-to-buy customers.',
  },
  {
    num: '02',
    name: 'Website Design',
    desc: 'Fast, clean, conversion-focused websites that turn your traffic into booked jobs and give your ads somewhere powerful to land.',
  },
  {
    num: '03',
    name: 'Local SEO and Google Profile',
    desc: 'Google Business Profile optimization and local SEO that makes your business the obvious choice when customers search.',
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
