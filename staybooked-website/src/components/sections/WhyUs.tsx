import { Reveal, RevealItem } from '@/components/ui/Reveal'

const STATS = [
  { num: '5 min', label: 'Reply to every new lead' },
  { num: '100%', label: 'Your ads, leads and data stay yours' },
  { num: '90 days', label: 'To hit our goal, or we work free until we do' },
]

/**
 * Why Stay Booked — terms and promises, stated once. The figures are static:
 * a speed promise shouldn't visibly count up.
 */
export default function WhyUs() {
  return (
    <section className="section section-light" id="why">
      <div className="wrap">
        <Reveal>
          <RevealItem as="h2" className="title">We earn your business every month</RevealItem>
          <RevealItem as="p" className="body why-body">
            Stay month to month or sign on for longer, your choice. Every lead gets a reply within
            minutes, and if we ever part ways, the ad accounts, audiences and leads go with you.
          </RevealItem>
        </Reveal>

        <Reveal className="stats-band" amount={0.3}>
          {STATS.map((s) => (
            <RevealItem className="stat" key={s.num}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
