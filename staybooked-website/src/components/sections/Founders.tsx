import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * Meet our Team — two founder cards with depth.
 *
 * Photo slots are placeholder <div>s. To use a real square photo later,
 * import it and swap the placeholder div for:
 *   <img className="founder-photo" src={jordanPhoto} alt="Jordan Vo" />
 */
export default function Founders() {
  return (
    <section className="section section-offwhite" id="founders">
      <Reveal className="wrap">
        <RevealItem as="p" className="label">Meet the founders</RevealItem>
        <RevealItem as="h2" className="title">Meet our Team</RevealItem>
        <div className="founders-grid">

          {/* Featured card — filled skyLight + soft depth for hierarchy */}
          <RevealItem as="article" className="founder-card featured">
            {/* Replace with Jordan's square photo: <img className="founder-photo" src={...} alt="Jordan Vo" /> */}
            <div className="founder-photo"><span className="founder-photo-label">Photo</span></div>
            <h3 className="founder-name">Jordan Vo</h3>
            <p className="founder-title">Founder</p>
            <p className="founder-bio">Jordan leads client outreach and partnerships, making sure every business we work with gets the attention it deserves. He oversees advertising strategy and campaign review, keeping our clients in front of the right people at the right time.</p>
            <div className="founder-contact">
              <a className="founder-email" href="mailto:jordan@staybookedmarketing.com">jordan@staybookedmarketing.com</a>
              <p className="founder-phone">+1 (408) 712-0017</p>
            </div>
          </RevealItem>

          <RevealItem as="article" className="founder-card">
            {/* Replace with Kolby's square photo: <img className="founder-photo" src={...} alt="Kolby McCargar" /> */}
            <div className="founder-photo"><span className="founder-photo-label">Photo</span></div>
            <h3 className="founder-name">Kolby McCargar</h3>
            <p className="founder-title">Co-Founder</p>
            <p className="founder-bio">Kolby runs the technical side of Stay Booked, from web design and development to project management and analytics. He turns ideas into clean, high-performing websites and keeps every project moving from first build to final launch.</p>
            <div className="founder-contact">
              <a className="founder-email" href="mailto:kolby@staybookedmarketing.com">kolby@staybookedmarketing.com</a>
              <p className="founder-phone">+1 (916) 606-9970</p>
            </div>
          </RevealItem>

        </div>
      </Reveal>
    </section>
  )
}
