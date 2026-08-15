import { Reveal, RevealItem } from '@/components/ui/Reveal'
import kolbyPhoto from '@/assets/kolby.webp'
import jordanPhoto from '@/assets/jordan.webp'
import austinPhoto from '@/assets/austin.webp'
import trevorPhoto from '@/assets/trevor.webp'

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

const FOUNDERS: Founder[] = [
  {
    name: 'Trevor Mayberry',
    title: 'CEO & CFO',
    degree: 'Graduated from Stanford University with a degree in Science, Technology, and Society.',
    bio: "Trevor Mayberry is the CEO and CFO of Stay Booked Marketing, where he sets the company's vision, drives strategic direction, and oversees every facet of the business from finance to daily operations. He built the company's entity structure, financial systems, and operational framework, and now leads a high-performing team, setting priorities and driving seamless execution across every department. Trevor also leads new business, meeting directly with prospective clients and closing every deal himself. He combines big-picture leadership with hands-on execution, keeping the company running at full strength while positioning it for sustained growth.",
    email: 'trevor@staybookedmarketing.com',
    phone: '+1 (813) 480-5818',
    photo: trevorPhoto,
  },
  {
    name: 'Jordan Vo',
    title: 'Chief Revenue Officer & Chief Growth Officer',
    bio: 'Jordan Vo leads client relations once a partnership begins, making sure every business we work with gets the attention it deserves. He keeps clients informed on campaign performance and results, overseeing advertising strategy and campaign review so clients stay in front of the right people at the right time. His dedication to communication and follow-through keeps every relationship strong long after the deal is signed. He translates campaign data into clear, plain-language updates clients can act on, and stays focused on building long-term trust that keeps clients with Stay Booked well beyond the first campaign.',
    email: 'jordan@staybookedmarketing.com',
    phone: '+1 (408) 712-0017',
    photo: jordanPhoto,
  },
  {
    name: 'Kolby McCargar',
    title: 'Chief Technology Officer',
    degree: "Studying Business Marketing at Point Loma Nazarene University's Fermanian School of Business.",
    bio: "Kolby runs the technical side of Stay Booked, from web design and development to project management and analytics. He turns ideas into clean, high-performing websites and keeps every project moving from first build to final launch, making sure every client's digital presence is polished, functional, and built to convert. He keeps a sharp focus on page speed and mobile optimization, and stays hands-on after launch, troubleshooting and maintaining sites to keep everything running smoothly long-term.",
    email: 'kolby@staybookedmarketing.com',
    phone: '+1 (916) 606-9970',
    photo: kolbyPhoto,
  },
  {
    name: 'Austin Uke',
    title: 'Chief Marketing Officer',
    degree: 'Graduated from Stanford University with a degree in Science, Technology, and Society.',
    bio: "Austin leads marketing at Stay Booked, building and managing the infrastructure behind the company's lead generation systems and running the campaigns that keep clients in front of the right audience. He handles much of the technical backend that keeps everything running, closely tracking ad performance to identify what's working and optimizing what isn't, making sure every client's setup is dialed in and built to scale. He keeps close watch on cost-per-lead and ad spend efficiency, and delivers clear, data-driven updates so clients always know exactly how their campaigns are performing.",
    email: 'austin@staybookedmarketing.com',
    phone: '+1 (214) 708-2025',
    photo: austinPhoto,
  },
  {
    name: 'Jordan Niles',
    title: 'Chief Operating Officer',
    degree: 'Graduated from the University of Pennsylvania.',
    bio: 'Jordan Niles serves as Chief Operating Officer, managing the daily operations that keep Stay Booked Marketing running smoothly behind the scenes. He handles internal workflows, coordinates across teams, and makes sure projects stay on track and deadlines get met. Jordan brings a steady, organized hand to the business, making sure the small details never fall through the cracks as the company scales.',
    initials: 'JN',
  },
]

export default function Founders() {
  // The header and each card reveal INDEPENDENTLY. One Reveal around the whole
  // grid looks tidy but breaks: with five tall cards the wrap grows past
  // ~3000px, `amount: 0.25` of it can never fit a normal viewport at once, so
  // whileInView never fires and the section renders empty (once: true means it
  // never recovers). Per-card observers always trigger as each card scrolls in.
  return (
    <section className="section section-offwhite" id="founders">
      <div className="wrap">
        <Reveal amount={0.5}>
          <RevealItem as="p" className="label">Meet the founders</RevealItem>
          <RevealItem as="h2" className="title">Our Founders</RevealItem>
        </Reveal>
        <div className="founders-grid">
          {FOUNDERS.map((f) => (
            <Reveal as="article" className="founder-card" key={f.name} amount={0.15}>
              {/* Frame clips the photo so its slow hover scale stays inside the rounded slot */}
              <RevealItem className="founder-photo-frame">
                {f.photo ? (
                  <img className="founder-photo" src={f.photo} alt={f.name} />
                ) : (
                  // Branded monogram tile until a headshot is supplied
                  <span className="founder-monogram" aria-hidden="true">{f.initials}</span>
                )}
              </RevealItem>
              <RevealItem as="h3" className="founder-name">{f.name}</RevealItem>
              <RevealItem as="p" className="founder-title">{f.title}</RevealItem>
              {f.degree && <RevealItem as="p" className="founder-degree">{f.degree}</RevealItem>}
              <RevealItem as="p" className="founder-bio">{f.bio}</RevealItem>
              {(f.email || f.phone) && (
                <RevealItem className="founder-contact">
                  {f.email && <a className="founder-email" href={`mailto:${f.email}`}>{f.email}</a>}
                  {f.phone && <p className="founder-phone">{f.phone}</p>}
                </RevealItem>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
