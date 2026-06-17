import { Reveal, RevealItem } from '@/components/ui/Reveal'

// Transparent 1x1 placeholder — swap each `src` for a square founder photo later.
const PHOTO_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1'%20height='1'%3E%3C/svg%3E"

export default function Founders() {
  return (
    <section className="section section-light" id="founders">
      <Reveal className="wrap">
        <RevealItem as="h2" className="title">Meet our Team</RevealItem>
        <div className="founders-grid">

          <RevealItem as="article" className="founder-card">
            {/* Replace src with Jordan's photo (square, e.g. jordan-vo.jpg) */}
            <img className="founder-photo" src={PHOTO_PLACEHOLDER} alt="Jordan Vo" />
            <h3 className="founder-name">Jordan Vo</h3>
            <p className="founder-title">Founder</p>
            <p className="founder-bio">Jordan leads client outreach and partnerships, making sure every business we work with gets the attention it deserves. He oversees advertising strategy and campaign review, keeping our clients in front of the right people at the right time.</p>
            <div className="founder-contact">
              <a className="founder-email" href="mailto:jordan@staybookedmarketing.com">jordan@staybookedmarketing.com</a>
              <p className="founder-phone">+1 (408) 712-0017</p>
            </div>
          </RevealItem>

          <RevealItem as="article" className="founder-card">
            {/* Replace src with Kolby's photo (square, e.g. kolby-mccargar.jpg) */}
            <img className="founder-photo" src={PHOTO_PLACEHOLDER} alt="Kolby McCargar" />
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
