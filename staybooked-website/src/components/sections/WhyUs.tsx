import { Reveal, RevealItem } from '@/components/ui/Reveal'

export default function WhyUs() {
  return (
    <section className="section section-light" id="why">
      <Reveal className="wrap">
        <div className="why-grid">
          <div className="why-left">
            <RevealItem as="p" className="label">Why Stay Booked</RevealItem>
            <RevealItem as="h2" className="title">Results first. No long contracts.</RevealItem>
            <RevealItem as="p" className="body why-body">We work month to month because we earn your business every month. Most clients see results in the first 30 days.</RevealItem>
          </div>
          <div className="why-right">
            <RevealItem className="stat">
              <div className="stat-num">5+</div>
              <div className="stat-label">Active Clients</div>
            </RevealItem>
            <RevealItem className="stat">
              <div className="stat-num">30</div>
              <div className="stat-label">Days to Results</div>
            </RevealItem>
            <RevealItem className="stat">
              <div className="stat-num">0</div>
              <div className="stat-label">Long Term Contracts</div>
            </RevealItem>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
