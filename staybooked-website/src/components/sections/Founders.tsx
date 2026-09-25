import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import kolbyPhoto from '@/assets/kolby.webp'
import jordanPhoto from '@/assets/jordan.webp'
import austinPhoto from '@/assets/austin.webp'
import trevorPhoto from '@/assets/trevor.webp'
import nilesPhoto from '@/assets/niles.webp'

/**
 * Our Founders — five founder cards in a two-column grid (single compact
 * column on mobile; the odd fifth card centers itself across both columns).
 * Founder photos fill the square slots via object-fit: cover
 * (see .founder-photo); cards are data-driven so all five stay identical.
 * Two founders are named Jordan, so cards always show full names.
 */

type Founder = {
  name: string
  title: string
  /** Education line, shown between the title and the bio. */
  degree?: string
  bio: string
  email?: string
  phone?: string
  photo?: string
  /** Fallback monogram for founders without a headshot yet. */
  initials?: string
}

export const FOUNDERS: Founder[] = [
  {
    name: 'Trevor Mayberry',
    title: 'CFO',
    degree: 'Graduated from Stanford University with a degree in Science, Technology, and Society.',
    bio: "Trevor Mayberry is the CFO of Stay Booked Marketing, where he owns the company's finances, from budgeting and cash flow to the systems that keep every account profitable. He built the company's entity structure and financial framework and keeps a close watch on the numbers across the business, making sure every dollar, from ad spend to payroll, is tracked and working. He pairs big-picture planning with hands-on financial management, keeping the company's foundation solid as it scales.",
    email: 'trevor@staybookedmarketing.com',
    phone: '+1 (813) 480-5818',
    photo: trevorPhoto,
  },
  {
    name: 'Jordan Vo',
    title: 'Founder & CEO',
    bio: "Jordan Vo founded Stay Booked Marketing and leads the company as CEO, setting its direction and building the close, hands-on client relationships the business runs on. He oversees advertising strategy and campaign performance across every account, making sure each business stays in front of the right people at the right time, and he keeps clients informed with clear, plain-language updates they can act on. His dedication to communication and follow-through keeps every relationship strong long after the deal is signed, and his focus on long-term trust keeps clients with Stay Booked well beyond the first campaign.",
    email: 'jordan@staybookedmarketing.com',
    phone: '+1 (408) 712-0017',
    photo: jordanPhoto,
  },
  {
    name: 'Kolby McCargar',
    title: 'Chief Marketing Officer',
    degree: "Studying Business Marketing at Point Loma Nazarene University's Fermanian School of Business.",
    bio: "Kolby McCargar is the Chief Marketing Officer of Stay Booked Marketing, where he owns the campaigns that bring clients their customers, from the first ad to the last follow-up. He builds and runs the lead generation systems behind every account across Meta, Google, and social, handling creative, targeting, and budget, and testing constantly to find what actually moves the numbers. He keeps a close watch on cost-per-lead and ad spend efficiency, tightening every client's setup so it stays dialed in and built to scale. Kolby pairs a marketer's instinct for what people respond to with a hands-on approach that keeps every campaign performing long after launch.",
    email: 'kolby@staybookedmarketing.com',
    phone: '+1 (916) 606-9970',
    photo: kolbyPhoto,
  },
  {
    name: 'Austin Uke',
    title: 'Chief Technology Officer',
    degree: 'Graduated from Stanford University with a degree in Science, Technology, and Society.',
    bio: "Austin Uke is the Chief Technology Officer of Stay Booked Marketing, where he owns everything the company builds, from client websites and web applications to the custom software and automation running underneath every campaign. He designs and develops the systems that qualify leads, trigger follow-up, and land booked appointments on client calendars, and he manages every project from first build to final launch. He keeps a sharp focus on page speed, mobile performance, and reliability, and stays hands-on after launch, maintaining and improving every site and tool so it keeps running smoothly long-term. Austin turns ideas into working software quickly and keeps it working, giving every client a digital presence that is polished, functional, and built to convert.",
    email: 'austin@staybookedmarketing.com',
    phone: '+1 (214) 708-2025',
    photo: austinPhoto,
  },
  {
    name: 'Jordan Niles',
    title: 'Chief Operating Officer',
    degree: 'Graduated from the University of Pennsylvania.',
    bio: 'Jordan Niles serves as Chief Operating Officer, managing the daily operations that keep Stay Booked Marketing running smoothly behind the scenes. He handles internal workflows, coordinates across teams, and makes sure projects stay on track and deadlines get met. Jordan brings a steady, organized hand to the business, making sure the small details never fall through the cracks as the company scales.',
    email: 'jordanniles@staybookedmarketing.com',
    phone: '+1 (727) 479-3780',
    photo: nilesPhoto,
  },
]

export default function Founders() {
  return (
    <section className="section section-offwhite" id="founders">
      <div className="wrap">
        <Reveal amount={0.4}>
          <RevealItem as="p" className="label">Meet the founders</RevealItem>
          <RevealItem as="h2" className="title">Our Founders</RevealItem>
          <RevealItem as="p" className="body why-body">
            Five founders running every account hands-on. No account managers, no ticket systems.
          </RevealItem>
          <RevealItem as="div" className="founders-cta" delay={0.15}>
            <Link className="contact-book-btn" to="/team">Meet our team</Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
