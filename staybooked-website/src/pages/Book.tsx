import { useEffect } from 'react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Fade from '@/components/q/Fade'
import { BOOKING_URL, BOOKING_EMBED_URL } from '@/lib/booking'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/content'

const EMBED_URL =
  (import.meta.env.VITE_BOOKING_EMBED_URL as string | undefined)?.trim() || BOOKING_EMBED_URL

const AGENDA = [
  ['Fifteen minutes', "We look at your setup and your market and tell you what we'd do."],
  ['No pitch deck', 'A real conversation. If your money is better spent elsewhere, we say so.'],
  ['A clear quote', "What we'd build, the ad budget we'd suggest, and the price."],
]

export default function Book() {
  useEffect(() => {
    document.title = 'Book a Call | Stay Booked Marketing'
    return () => { document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses' }
  }, [])

  return (
    <>
      <Navbar />
      <main className="q-page">
        <section className="q-wrap q-book">
          <Fade className="q-book-side">
            <p className="q-kicker">Book a call</p>
            <h1 className="q-pagetitle">Pick a time.</h1>
            <dl className="q-agenda">
              {AGENDA.map(([h, b]) => (
                <div key={h}>
                  <dt>{h}</dt>
                  <dd>{b}</dd>
                </div>
              ))}
            </dl>
            <p className="q-book-alt">
              Prefer to talk now? <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
            </p>
          </Fade>
          <Fade className="q-book-cal" delay={0.1}>
            <iframe
              src={EMBED_URL}
              title="Book a call with Stay Booked Marketing"
              loading="lazy"
              allow="clipboard-write; fullscreen"
            />
            <p className="q-book-fallback">
              Calendar not loading? <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>.
            </p>
          </Fade>
        </section>
      </main>
      <Footer />
    </>
  )
}
