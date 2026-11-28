import { Reveal, RevealItem } from '@/components/ui/Reveal'
import LeadForm from '@/components/ui/LeadForm'
import StepTree from '@/components/ui/StepTree'

/**
 * See what we can do for you. The four next steps grow as a small tree you
 * can tap through, then the form. The 90-day guarantee (moved here from the
 * old terms strip) sits right above the form, where the decision happens.
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
              booking, reserving or buying, the system works for you. Here's what happens after you reach out.
            </RevealItem>
          </Reveal>
          <StepTree />
        </div>
        <div className="swc-side">
          <Reveal amount={0.3}>
            <RevealItem as="p" className="swc-guarantee">
              <strong>90-day guarantee.</strong> If we don't hit the goal we set together, we keep working for free until we do.
            </RevealItem>
          </Reveal>
          <Reveal className="swc-form" amount={0.1}>
            <RevealItem>
              <LeadForm source="see-what-we-can-do" />
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
