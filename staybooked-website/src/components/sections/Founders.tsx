import { Reveal, RevealItem } from '@/components/ui/Reveal'
import kolbyPhoto from '@/assets/kolby.webp'
import jordanPhoto from '@/assets/jordan.webp'
import austinPhoto from '@/assets/austin.webp'
import trevorPhoto from '@/assets/trevor.webp'

/**
 * Our Founders — four founder cards in a 2×2 grid (single compact column on
 * mobile). Founder photos fill the square slots via object-fit: cover
 * (see .founder-photo); cards are data-driven so all four stay identical.
 */

type Founder = {
  name: string
  title: string
  bio: string
  email: string
  phone: string
  photo: string
  instagram?: { url: string; handle: string }
}

const FOUNDERS: Founder[] = [
  {
    name: 'Kolby McCargar',
    title: 'Head of Ads & Technical Operations',
    bio: 'Kolby runs the technical side of Stay Booked, from web design and development to project management and analytics. He turns ideas into clean, high-performing websites and keeps every project moving from first build to final launch.',
    email: 'kolby@staybookedmarketing.com',
    phone: '+1 (916) 606-9970',
    photo: kolbyPhoto,
    instagram: { url: 'https://www.instagram.com/kolbymccargar', handle: '@kolbymccargar' },
  },
  {
    name: 'Jordan Vo',
    title: 'Head of Client Relations & Growth',
    bio: 'Jordan leads client outreach and partnerships, making sure every business we work with gets the attention it deserves. He oversees advertising strategy and campaign review, keeping our clients in front of the right people at the right time.',
    email: 'jordan@staybookedmarketing.com',
    phone: '+1 (408) 712-0017',
    photo: jordanPhoto,
    instagram: { url: 'https://www.instagram.com/jjordanvvo', handle: '@jjordanvvo' },
  },
  {
    name: 'Austin Uke',
    title: 'Head of Systems & Operations',
    bio: "Austin leads operations and systems setup, handling much of the technical backend that keeps everything running. He builds and manages the infrastructure behind our lead generation systems, making sure every client's setup is dialed in and built to scale.",
    email: 'austin@staybookedmarketing.com',
    phone: '+1 (214) 708-2025',
    photo: austinPhoto,
  },
  {
    name: 'Trevor Mayberry',
    title: 'Head of Finance & Client Management',
    bio: 'Trevor helps manage the company and oversees our financials while working directly with clients alongside the team. He keeps the business steady and organized and makes sure every client relationship gets the attention it deserves.',
    email: 'trevor@staybookedmarketing.com',
    phone: '+1 (813) 480-5818',
    photo: trevorPhoto,
  },
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export default function Founders() {
  return (
    <section className="section section-offwhite" id="founders">
      <Reveal className="wrap">
        <RevealItem as="p" className="label">Meet the founders</RevealItem>
        <RevealItem as="h2" className="title">Our Founders</RevealItem>
        <div className="founders-grid">
          {FOUNDERS.map((f) => (
            <RevealItem as="article" className="founder-card" key={f.name}>
              {/* Frame clips the photo so its slow hover scale stays inside the rounded slot */}
              <div className="founder-photo-frame">
                <img className="founder-photo" src={f.photo} alt={f.name} />
              </div>
              <h3 className="founder-name">{f.name}</h3>
              <p className="founder-title">{f.title}</p>
              <p className="founder-bio">{f.bio}</p>
              <div className="founder-contact">
                <a className="founder-email" href={`mailto:${f.email}`}>{f.email}</a>
                <p className="founder-phone">{f.phone}</p>
                {f.instagram && (
                  <a
                    className="founder-instagram"
                    href={f.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${f.name} on Instagram`}
                  >
                    <InstagramIcon />
                    <span>{f.instagram.handle}</span>
                  </a>
                )}
              </div>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
