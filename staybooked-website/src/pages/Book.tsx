import { useEffect } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import { BOOKING_URL, BOOKING_EMBED_URL } from '@/lib/booking'

/**
 * Book — the on-site booking page. "Book a Call" CTAs land here instead of
 * bouncing visitors to an external calendar page: the calendar is embedded
 * directly (Vercel env: VITE_BOOKING_EMBED_URL — the GHL calendar widget
 * embed URL), with the agenda beside it. Until the embed URL
 * is configured, the page falls back to the external calendar link so the
 * funnel never breaks.
 */

const EMBED_URL =
  (import.meta.env.VITE_BOOKING_EMBED_URL as string | undefined)?.trim() || BOOKING_EMBED_URL

const AGENDA = [
  {
    head: '15 minutes, straight answers',
    body: "We audit your current setup, look at your market, and tell you exactly what we'd do to book more jobs. You leave with a plan whether or not you hire us.",
  },
  {
    head: 'No pitch deck, no pressure',
    body: 'A real conversation about your business. If your money is better spent elsewhere, we say so.',
  },
  {
    head: 'A clear quote',
    body: "What we'd build for your business, the ad budget we'd recommend, and your price. No surprises.",
  },
]

export default function Book() {
  useEffect(() => {
    document.title = 'Book a Strategy Call | Stay Booked Marketing'
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="nav-spacer" aria-hidden="true" />

      <section className="section section-offwhite" id="book">
        <div className="wrap">
          <Reveal amount={0.3}>
            <RevealItem as="p" className="label">Book a Call</RevealItem>
            <RevealItem as="h1" className="title">Grab a time that works.</RevealItem>
            <RevealItem as="p" className="body lp-hook-body">
              {EMBED_URL
                ? 'Pick a time below and it books instantly. No back and forth.'
                : 'Pick a time on our calendar and it books instantly. No back and forth.'}
            </RevealItem>
          </Reveal>

          <div className="book-layout">
            <Reveal as="div" className="book-side" amount={0.2}>
              <RevealItem as="p" className="label">What to expect</RevealItem>
              {AGENDA.map((a) => (
                <RevealItem as="div" className="book-point" key={a.head}>
                  <p className="book-point-head">{a.head}</p>
                  <p className="book-point-body">{a.body}</p>
                </RevealItem>
              ))}
              <RevealItem as="p" className="book-fine">
                Booked in seconds. A confirmation lands in your inbox and a reminder before we talk.
              </RevealItem>
            </Reveal>

            <Reveal as="div" className="book-calendar" amount={0.2}>
              {EMBED_URL ? (
                <>
                  <iframe
                    src={EMBED_URL}
                    title="Book a strategy call with Stay Booked Marketing"
                    loading="lazy"
                    allow="clipboard-write; fullscreen"
                  />
                  <p className="book-newtab">
                    Calendar not loading?{' '}
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>,
                    or call or text <a href="tel:+18134805818">(813) 480-5818</a>.
                  </p>
                </>
              ) : (
                <div className="book-fallback">
                  <p className="book-fallback-body">
                    Our calendar opens in a new tab. Choose any open time.
                  </p>
                  <a className="contact-book-btn" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                    See open times
                  </a>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
