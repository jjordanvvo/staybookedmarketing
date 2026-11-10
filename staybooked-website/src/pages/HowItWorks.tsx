import { useEffect, useState } from 'react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHead from '@/components/q/PageHead'
import TalkBlock from '@/components/q/TalkBlock'
import Fade from '@/components/q/Fade'
import { PLAN_STEPS, SERVICES } from '@/lib/content'
import { SPEED_EVIDENCE } from '@/lib/evidence'
import { FAQS } from '@/lib/faqs'

/** Everything a careful reader wants, kept off the home page. */
export default function HowItWorks() {
  const [open, setOpen] = useState<number | null>(null)
  useEffect(() => {
    document.title = 'How It Works | Stay Booked Marketing'
    return () => { document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses' }
  }, [])

  return (
    <>
      <Navbar />
      <main className="q-page">
        <PageHead kicker="How it works" title={<>One system, <span className="q-tan">from first click to booked.</span></>}>
          <p>
            Most agencies hand you leads and leave the rest to you. We run the ads, answer every lead
            within minutes, qualify them and put the appointment on your calendar.
          </p>
        </PageHead>

        <section className="q-sec q-wrap">
          <Fade className="q-sec-head"><p className="q-kicker">Working together</p></Fade>
          <ol className="q-steps">
            {PLAN_STEPS.map((s, i) => (
              <Fade as="li" key={s.num} delay={i * 0.05}>
                <span className="q-steps-n">{s.num}</span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </Fade>
            ))}
          </ol>
        </section>

        <section className="q-sec q-wrap">
          <Fade className="q-sec-head"><p className="q-kicker">What we build</p></Fade>
          <div className="q-services">
            {SERVICES.map((s) => (
              <Fade key={s.num} className="q-service">
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </Fade>
            ))}
          </div>
        </section>

        <section className="q-sec q-wrap">
          <Fade className="q-sec-head">
            <p className="q-kicker">Why speed matters</p>
            <h2 className="q-h2">Most businesses answer too slowly.</h2>
          </Fade>
          <ul className="q-stats">
            {SPEED_EVIDENCE.map((s) => (
              <Fade as="li" key={s.figure}>
                <span className="q-stat-fig">{s.figure}</span>
                <p>{s.text}</p>
                <a href={s.url} target="_blank" rel="noopener noreferrer">{s.source}</a>
              </Fade>
            ))}
          </ul>
        </section>

        <section className="q-sec q-wrap q-split">
          <Fade>
            <p className="q-kicker">Pricing</p>
            <h2 className="q-h2">Quoted for your business.</h2>
          </Fade>
          <Fade className="q-prose">
            <p>
              Markets, budgets and goals differ, so we price each program after a free 15-minute call.
              No startup fee and no long-term contract. Ad spend goes straight to the ad platforms,
              never through us, and you own the accounts and every lead.
            </p>
            <p>
              Curious what more booked appointments could be worth? Try the{' '}
              <a href="/growth-calculator/">growth calculator</a>. No contact details needed.
            </p>
          </Fade>
        </section>

        <section className="q-sec q-wrap q-split" id="faq">
          <Fade>
            <p className="q-kicker">Questions</p>
            <h2 className="q-h2">Asked often.</h2>
          </Fade>
          <div className="q-faq">
            {FAQS.map((f, i) => (
              <div className={`q-faq-item${open === i ? ' is-open' : ''}`} key={f.q}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  <span>{f.q}</span>
                  <i aria-hidden="true" />
                </button>
                <div className="q-faq-a"><div><p>{f.a}</p></div></div>
              </div>
            ))}
          </div>
        </section>

        <TalkBlock />
      </main>
      <Footer />
    </>
  )
}
