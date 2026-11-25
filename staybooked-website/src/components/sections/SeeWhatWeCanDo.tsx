import { Reveal, RevealItem } from '@/components/ui/Reveal'
import LeadForm from '@/components/ui/LeadForm'
import { NEXT_STEPS } from '@/lib/nextSteps'


/**
 * See what we can do for you — replaces the industry list. The system works
 * for any business that wins customers by phone, booking, reservation or
 * sale, so this section asks about yours instead of making people find their
 * niche in a list. The form sits right here, a scroll below How it works.
 */
export default function SeeWhatWeCanDo() {
  return (
    <section className="swc" id="get-started">
      <div className="swc-inner">
        <div className="swc-copy">
          <Reveal amount={0.2}>
          <RevealItem as="h2" className="title">See what we can do for you</RevealItem>
          <RevealItem as="p" className="body swc-lede">
            Restaurants, law firms, contractors, clinics, schools, brands: if customers reach you by calling,
            booking, reserving or buying, the system works for you. Tell us a little about your business.
          </RevealItem>
          </Reveal>
          <Reveal as="ul" className="swc-next" amount={0.2}>
            {NEXT_STEPS.map((s, i) => (
              <RevealItem as="li" key={s.name} className="swc-step">
                <span className="swc-step-num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <b>{s.name}</b>
                  {s.desc}
                </span>
              </RevealItem>
            ))}
          </Reveal>
        </div>
        <Reveal className="swc-form" amount={0.1}>
          <RevealItem>
            <LeadForm source="see-what-we-can-do" />
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
