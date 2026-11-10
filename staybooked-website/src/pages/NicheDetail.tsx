import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHead from '@/components/q/PageHead'
import TalkBlock from '@/components/q/TalkBlock'
import Fade from '@/components/q/Fade'
import Arrow from '@/components/q/Arrow'
import { NICHES } from '@/lib/niches'

/** One industry, on one calm page. Same NICHES data as the finder and the
 *  prerendered SEO pages. */
export default function NicheDetail() {
  const { id = '' } = useParams()
  const niche = NICHES.find((n) => n.id === id)

  useEffect(() => {
    document.title = niche?.seo?.title ?? 'Stay Booked Marketing'
    const meta = document.querySelector('meta[name="description"]')
    if (niche?.seo?.description && meta) meta.setAttribute('content', niche.seo.description)
    return () => { document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses' }
  }, [niche])

  if (!niche) {
    return (
      <>
        <Navbar />
        <main className="q-page">
          <PageHead kicker="Industries" title="We haven't written that one up yet.">
            <p>If your customers can find you online, we can build for it. A short call is the fastest way to know.</p>
          </PageHead>
          <TalkBlock />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="q-page">
        <PageHead kicker={`Industries / ${niche.name}`} title={niche.name}>
          <p>{niche.summary}</p>
        </PageHead>

        <section className="q-sec q-wrap q-split">
          <Fade>
            <p className="q-kicker">What we do</p>
          </Fade>
          <Fade className="q-prose">
            <p>{niche.whatWeDo}</p>
          </Fade>
        </section>

        <section className="q-sec q-wrap q-split">
          <Fade>
            <p className="q-kicker">The details</p>
          </Fade>
          <Fade>
            <dl className="q-facts">
              <div><dt>For</dt><dd>{niche.examples}</dd></div>
              <div><dt>We book</dt><dd>{niche.books.join(', ')}</dd></div>
              <div><dt>Tuned around</dt><dd>{niche.tuned}</dd></div>
              <div><dt>Bookings reported to</dt><dd>{niche.handoff}</dd></div>
              <div><dt>Pricing</dt><dd>Quoted after a free call. No startup fee, no long contract.</dd></div>
            </dl>
            {niche.to && (
              <Link className="q-link q-facts-link" to={niche.to}>{niche.linkLabel} <Arrow /></Link>
            )}
          </Fade>
        </section>

        <TalkBlock line="Sound like your business?" />
      </main>
      <Footer />
    </>
  )
}
