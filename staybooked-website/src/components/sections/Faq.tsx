import { useState } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

const FAQS = [
  {
    q: 'Do you actually understand HIPAA, or do you just say you do?',
    a: "We're not a covered entity, but we operate as a Business Associate whenever we touch anything PHI-adjacent. That means we're built to sign BAAs, avoid standard tracking pixels on pages that could capture health information, and design with data minimization in mind from day one.",
  },
  {
    q: 'Do you know the advertising rules in my state?',
    a: 'State medical advertising rules vary widely. Texas, for example, bans testimonials in medical advertising outright. We research your specific state and license type before any campaign goes live, not after.',
  },
  {
    q: 'Can you guarantee more patients?',
    a: "No agency honestly can, and we won't pretend to. What we focus on is a compliant, professional presence and a process built specifically for regulated healthcare marketing, which most agencies simply aren't equipped to do.",
  },
  {
    q: 'I have a delegating physician or collaborative practice agreement. Does that affect my marketing?',
    a: 'Yes, and we account for it. Your scope of practice, prescriptive authority, and any required physician disclosures are all part of what we review before we write a single word of copy.',
  },
  {
    q: 'Will you use my tracking pixels the way a normal agency would?',
    a: 'No. On any page that could capture health-related information, we work to skip standard Meta Pixel and Google Analytics setups in favor of server-side or anonymized tracking, specifically to reduce your HIPAA exposure.',
  },
  {
    q: 'Do you handle patient data directly?',
    a: "We minimize this wherever possible by design. Where it's unavoidable, we're built to operate under a signed Business Associate Agreement with the appropriate safeguards.",
  },
  {
    q: 'What happens if you make a mistake that creates compliance risk for me?',
    a: 'Our process is built so copy and landing pages get a compliance review before they publish. That step exists specifically to catch issues before they ever become your problem.',
  },
  {
    q: 'Do you work with solo and independent NP practices, or only larger groups?',
    a: "Both. Our niche focus started with independent and small-practice NPs specifically because they're the ones least likely to have marketing support built for their regulatory reality.",
  },
  {
    q: 'How is this different from a general marketing agency?',
    a: "A general agency treats healthcare like any other client. We built our process around the actual rules that apply to prescribers, state advertising law, HIPAA, delegating-physician requirements, because getting those wrong isn't just bad marketing. It's real liability for you.",
  },
]

/**
 * FAQ — hairline-separated accordion in the editorial list style (same rhythm
 * as the lp-points rows). One answer open at a time; the collapse animates via
 * the CSS grid 0fr → 1fr trick, so no JS measuring and reduced-motion users
 * just get an instant toggle (transition disabled in CSS).
 */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="section section-offwhite" id="faq">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">FAQ</RevealItem>
          <RevealItem as="h2" className="title">Questions, answered.</RevealItem>
        </Reveal>

        <Reveal as="div" className="faq-list" amount={0.15}>
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <RevealItem as="div" className="faq-item" key={item.q}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={`faq-icon${isOpen ? ' faq-icon-open' : ''}`} aria-hidden="true" />
                </button>
                <div id={`faq-a-${i}`} className={`faq-a-wrap${isOpen ? ' faq-a-open' : ''}`}>
                  <div className="faq-a">
                    <p className="faq-body">{item.a}</p>
                  </div>
                </div>
              </RevealItem>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
