import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import Navbar from '@/components/sections/Navbar'
import { NICHES, SPEED_STATS, INVESTMENT } from '@/lib/niches'

/**
 * NicheDetail — the one-pager for a single niche, as its own page.
 * Reached from the "Who we help" list ("Learn more" on every niche) and from
 * site search. Everything renders from the same NICHES data that drives the
 * list, the Niche Explorer, and the search index, so the copy can never drift
 * from the rest of the site.
 */
export default function NicheDetail() {
  const { id = '' } = useParams()
  const niche = NICHES.find((n) => n.id === id)

  useEffect(() => {
    document.title = niche?.seo?.title ?? 'Stay Booked Marketing'
    const meta = document.querySelector('meta[name="description"]')
    if (niche?.seo?.description && meta) meta.setAttribute('content', niche.seo.description)
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [niche])

  if (!niche) {
    return (
      <>
        <Navbar />
        <div className="nav-spacer" aria-hidden="true" />
        <section className="section section-offwhite">
          <div className="wrap lp-narrow">
            <h1 className="title">We don't build for that yet.</h1>
            <p className="body lp-hook-body">
              If your business serves local customers, we can build for it. See every niche we
              serve, or book a free strategy call.
            </p>
            <Link className="contact-book-btn" to="/">See who we help</Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="nav-spacer" aria-hidden="true" />

      {/* 1. Header — the niche and who it's for */}
      <section className="section section-offwhite" id={`nd-${niche.id}`}>
        <Reveal className="wrap lp-narrow" amount={0.2}>
          <RevealItem as="p" className="label">Industries / {niche.name}</RevealItem>
          <RevealItem as="h1" className="title">{niche.name}.</RevealItem>
          <RevealItem as="p" className="body lp-hook-body">{niche.desc}</RevealItem>
          <RevealItem as="p" className="body lp-hook-body nd-examples">
            Who it's for: {niche.examples}.
          </RevealItem>
        </Reveal>
      </section>

      {/* 2. What we do — the one-pager voice */}
      <section className="section section-light">
        <div className="wrap lp-narrow">
          <Reveal amount={0.2}>
            <RevealItem as="p" className="label">What we do</RevealItem>
            <RevealItem as="p" className="body nd-whatwedo">{niche.whatWeDo}</RevealItem>
          </Reveal>
          <Reveal className="nd-books" amount={0.15}>
            <RevealItem as="p" className="label">What we book</RevealItem>
            <div className="nx-books">
              {niche.books.map((b) => (
                <span className="nx-book" key={b}>{b}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. How the system is tuned — the one-pager details */}
      <section className="section section-offwhite">
        <div className="wrap lp-narrow">
          <Reveal as="ul" className="lp-points ind-list" amount={0.15}>
            <RevealItem as="li" className="lp-point ind-row nd-row">
              <span className="ind-name">Tuned around</span>
              <span className="ind-desc">{niche.tuned}.</span>
            </RevealItem>
            <RevealItem as="li" className="lp-point ind-row nd-row">
              <span className="ind-name">Your AI reports to</span>
              <span className="ind-desc">{niche.handoff}.</span>
            </RevealItem>
            <RevealItem as="li" className="lp-point ind-row nd-row">
              <span className="ind-name">Performance guarantee</span>
              <span className="ind-desc">
                If we haven&apos;t delivered {niche.guarantee} by the end of the guarantee
                window, your retainer pauses until we do.
              </span>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* 4. Speed to lead + investment */}
      <section className="section section-deep">
        <div className="wrap lp-narrow">
          <Reveal amount={0.2}>
            <RevealItem as="p" className="label">Speed to lead</RevealItem>
            <Reveal as="ul" className="nd-stats" amount={0.15}>
              {SPEED_STATS.map((s) => (
                <RevealItem as="li" className="nd-stat" key={s.label}>
                  <span className="nd-stat-value">{s.value}{s.suffix}</span>
                  <span className="nd-stat-label">{s.label}</span>
                </RevealItem>
              ))}
            </Reveal>
          </Reveal>
          <Reveal className="nd-invest" amount={0.15}>
            <RevealItem as="p" className="label">Investment</RevealItem>
            <RevealItem as="p" className="body nd-whatwedo">
              No startup fee. No long-term contract. Ad spend: ~${INVESTMENT.adSpend}/mo — it goes
              directly to the ad platforms, not to us. Retainer varies by {niche.varies}.
              Month-to-month, and it&apos;s backed by the guarantee above.
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="section section-light lp-final">
        <Reveal className="wrap wrap-contact" amount={0.35}>
          <RevealItem as="h2" className="contact-headline">Sound like your business?</RevealItem>
          <RevealItem as="p" className="body contact-body">
            Book a free strategy call and we&apos;ll show you exactly how this system books {niche.books[0].toLowerCase()} for {niche.examples.toLowerCase()}.
          </RevealItem>
          <RevealItem as="div" className="hc-ctas" delay={0.2}>
            <a className="contact-book-btn" href="/book">
              Book a Call
            </a>
            <Link className="contact-book-btn" to="/#industries">See every niche</Link>
          </RevealItem>
        </Reveal>
      </section>
    </>
  )
}
