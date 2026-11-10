import { useEffect } from 'react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHead from '@/components/q/PageHead'
import TalkBlock from '@/components/q/TalkBlock'
import Fade from '@/components/q/Fade'
import { PHOTOS } from '@/components/q/Portraits'
import { FOUNDERS } from '@/lib/founders'

export default function Team() {
  useEffect(() => {
    document.title = 'Meet the Team | Stay Booked Marketing'
    return () => { document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses' }
  }, [])

  return (
    <>
      <Navbar />
      <main className="q-page">
        <PageHead kicker="Team" title={<>Five founders. <span className="q-tan">No account managers.</span></>}>
          <p>Founded by Stanford graduates. You talk to the people building your system, every time.</p>
        </PageHead>

        <section className="q-sec q-wrap">
          <div className="q-team">
            {FOUNDERS.map((f) => (
              <Fade key={f.name} className="q-person">
                <div className="q-person-photo">
                  {f.photo && <img src={PHOTOS[f.photo]} alt={f.name} loading="lazy" />}
                </div>
                <div className="q-person-text">
                  <h2>{f.name}</h2>
                  <p className="q-person-role">{f.title}</p>
                  {f.degree && <p className="q-person-degree">{f.degree}</p>}
                  <details>
                    <summary>Read more</summary>
                    <p>{f.bio}</p>
                  </details>
                  <p className="q-person-contact">
                    {f.email && <a href={`mailto:${f.email}`}>{f.email}</a>}
                    {f.phone && <a href={`tel:${f.phone.replace(/[^\d+]/g, '')}`}>{f.phone}</a>}
                  </p>
                </div>
              </Fade>
            ))}
          </div>
        </section>

        <TalkBlock line="Want to talk to one of us?" />
      </main>
      <Footer />
    </>
  )
}
