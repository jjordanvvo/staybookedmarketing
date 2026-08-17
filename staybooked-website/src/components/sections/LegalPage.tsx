import { useEffect } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

export type LegalSection = {
  heading: string
  /** Paragraphs shown under the heading, in order. */
  paras?: string[]
  /** Bulleted list rendered after the paragraphs. */
  list?: string[]
  /** Mailing-address contact block: plain lines followed by a mailto link. */
  contact?: { lines: string[]; email: string }
}

type LegalPageProps = {
  /** Browser tab title while the page is mounted. */
  docTitle: string
  title: string
  effectiveDate: string
  /** Opening paragraph(s) before the numbered sections. */
  intro: string[]
  sections: LegalSection[]
}

/**
 * Shared layout for legal documents (/privacy, /terms) — site-wide nav and
 * footer around a readable single-column document. Each section reveals
 * independently: these pages run many viewports tall, and a single whileInView
 * wrapper around the whole document could never meet its visibility threshold.
 */
export default function LegalPage({ docTitle, title, effectiveDate, intro, sections }: LegalPageProps) {
  useEffect(() => {
    document.title = docTitle
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [docTitle])

  return (
    <>
      {/* The one site-wide nav; the spacer keeps content clear of the fixed bar */}
      <Navbar />
      <div className="nav-spacer" aria-hidden="true" />

      <main className="legal">
        <div className="legal-inner">
          <Reveal amount={0.1} stagger={0.08}>
            <RevealItem as="h1" className="legal-title">{title}</RevealItem>
            <RevealItem as="p" className="legal-updated">
              Stay Booked Marketing LLC
              <br />
              Effective Date: {effectiveDate}
            </RevealItem>
            {intro.map((p) => (
              <RevealItem key={p.slice(0, 40)} as="p" className="legal-body">{p}</RevealItem>
            ))}
          </Reveal>

          {sections.map((s) => (
            <Reveal key={s.heading} as="section" className="legal-section" amount={0.2} stagger={0.08}>
              <RevealItem as="h2" className="legal-heading">{s.heading}</RevealItem>
              {s.paras?.map((p) => (
                <RevealItem key={p.slice(0, 40)} as="p" className="legal-body">{p}</RevealItem>
              ))}
              {s.list && (
                <RevealItem as="ul" className="legal-list">
                  {s.list.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </RevealItem>
              )}
              {s.contact && (
                <RevealItem as="p" className="legal-body legal-contact">
                  {s.contact.lines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                  <a href={`mailto:${s.contact.email}`}>{s.contact.email}</a>
                </RevealItem>
              )}
            </Reveal>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
