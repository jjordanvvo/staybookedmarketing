import { Reveal, RevealItem } from '@/components/ui/Reveal'

export default function Services() {
  return (
    <section className="section section-deep" id="services">
      <Reveal className="wrap">
        <RevealItem as="p" className="label">Services</RevealItem>
        <RevealItem as="h2" className="title">Three things, done well.</RevealItem>
        <div className="services">
          <RevealItem className="service-row">
            <span className="service-name">Website Design</span>
            <span className="service-desc">Fast, clean sites built to convert local traffic into booked jobs.</span>
          </RevealItem>
          <RevealItem className="service-row">
            <span className="service-name">Local SEO</span>
            <span className="service-desc">Google Business Profile, citations, and on-page work that puts you in front of buyers.</span>
          </RevealItem>
          <RevealItem className="service-row">
            <span className="service-name">Meta Advertising</span>
            <span className="service-desc">Lead campaigns that send new customers directly to your phone.</span>
          </RevealItem>
        </div>
      </Reveal>
    </section>
  )
}
