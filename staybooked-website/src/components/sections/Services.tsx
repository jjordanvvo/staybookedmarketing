import { Reveal, RevealItem } from '@/components/ui/Reveal'

const SERVICES = [
  {
    num: '01',
    name: 'Lead Generation Systems',
    desc: 'Our core offering. We build the entire path from first click to booked appointment — campaigns, landing pages, automated qualification, and follow-up that runs without you. Every lead is screened before it reaches you, so what lands on your calendar is ready to talk.',
  },
  {
    num: '02',
    name: 'Multi-Platform Advertising',
    desc: 'Meta, Google, and social, managed as one system rather than separate channels. We handle creative, targeting, budget, and testing, and we layer conversational AI on top so leads get a response in seconds instead of hours.',
  },
  {
    num: '03',
    name: 'Software Development',
    desc: 'Websites, web applications, and custom software built in-house. Fast, clean, and built to convert — whether that is a site your ads can actually send traffic to or an internal tool that runs a piece of your business.',
  },
]

export default function Services() {
  return (
    <section className="section section-light" id="services">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Services</RevealItem>
          <RevealItem as="h2" className="title">What we build.</RevealItem>
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
