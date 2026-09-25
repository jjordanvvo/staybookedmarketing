import { useEffect } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import Navbar from '@/components/sections/Navbar'
import kolbyPhoto from '@/assets/kolby.webp'
import jordanPhoto from '@/assets/jordan.webp'
import austinPhoto from '@/assets/austin.webp'
import trevorPhoto from '@/assets/trevor.webp'
import nilesPhoto from '@/assets/niles.webp'
import { FOUNDERS } from '@/lib/founders'

const PHOTOS: Record<string, string> = {
  trevor: trevorPhoto,
  jordan: jordanPhoto,
  kolby: kolbyPhoto,
  austin: austinPhoto,
  niles: nilesPhoto,
}
import Footer from '@/components/sections/Footer'

/**
 * Team — the founders, on their own page. Same cards and data as the old
 * inline home section, but a dedicated page: bigger breathing room, one
 * column on mobile, easy to read and share. The home section now just holds
 * the title and a button that links here.
 */
export default function Team() {
  useEffect(() => {
    document.title = 'Meet the Team | Stay Booked Marketing'
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="nav-spacer" aria-hidden="true" />

      <section className="section section-offwhite" id="team">
        <div className="wrap">
          <Reveal amount={0.4}>
            <RevealItem as="p" className="label">Meet the founders</RevealItem>
            <RevealItem as="h1" className="title">The people behind Stay Booked.</RevealItem>
            <RevealItem as="p" className="body lp-hook-body">
              Five founders, Stanford to Penn, running every account hands-on. No account
              managers, no ticket systems — you talk to the people building your system.
            </RevealItem>
          </Reveal>

          {/* The same per-card reveal pattern as the old home section: each
              card reveals independently as it scrolls in. */}
          <div className="founders-grid">
            {FOUNDERS.map((f) => (
              <Reveal as="article" className="founder-card" key={f.name} amount={0.15}>
                <RevealItem className="founder-photo-frame">
                  {f.photo && PHOTOS[f.photo] ? (
                    <img className="founder-photo" src={PHOTOS[f.photo]} alt={f.name} />
                  ) : (
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

      <Footer />
    </>
  )
}
