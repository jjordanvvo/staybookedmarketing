import { Reveal, RevealItem } from '@/components/ui/Reveal'

export const SERVICES = [
  {
    num: '01',
    name: 'Lead Generation Systems',
    desc: 'Our core offering. We build the whole path from first click to booked appointment: campaigns, landing pages, automated qualification, and follow-up that runs without you. Leads are screened before they reach you, so the people on your calendar are ready to talk.',
  },
  {
    num: '02',
    name: 'Multi-Platform Advertising',
    desc: 'Facebook, Instagram, Google and other platforms, run as one budget instead of separate channels. We handle creative, targeting, budget and testing, and conversational AI replies to new leads in seconds instead of hours.',
  },
  {
    num: '03',
    name: 'Software Development',
    desc: 'Websites, web apps and custom software, built in-house. That could be a site your ads can send traffic to without losing leads, or an internal tool that takes a manual job off your plate.',
  },
]

export default function Services() {
  return (
    <section className="section section-light" id="services">
      <div className="wrap">
        <Reveal>
          <RevealItem as="h2" className="title">What we build</RevealItem>
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
