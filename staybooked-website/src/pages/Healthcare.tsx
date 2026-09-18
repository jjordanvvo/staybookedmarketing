import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import Navbar from '@/components/sections/Navbar'
import Faq, { type FaqEntry } from '@/components/sections/Faq'
import logo from '@/assets/logo-nav.webp'
import { BOOKING_URL } from '@/lib/booking'

// The compliance pillars — short versions; the full detail lives in the FAQ
// accordion below, moved verbatim from the old main-site FAQ.
const PILLARS = [
  {
    name: 'HIPAA & BAAs',
    desc: "We're built to operate as a Business Associate: signed BAAs, data minimization, and PHI-aware page design from day one.",
  },
  {
    name: 'State advertising rules',
    desc: 'We research your state and license type before any campaign goes live, not after.',
  },
  {
    name: 'Delegating physician requirements',
    desc: 'Scope of practice, prescriptive authority, and required disclosures are reviewed before we write a word of copy.',
  },
  {
    name: 'PHI-safe tracking',
    desc: 'We work to use server-side and anonymized tracking in place of standard pixels on pages that could capture health information.',
  },
  {
    name: 'Solo and independent NP practices',
    desc: 'Our healthcare focus started with independent and small-practice NPs, and we work with solo practices and larger groups alike.',
  },
]

const HEALTHCARE_FAQS: FaqEntry[] = [
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
 * /healthcare — the dedicated medical page. The main site speaks to any local
 * business; this page holds all the healthcare-specific material: compliance
 * pillars, the healthcare FAQ, and the door to the psychiatric and mental
 * health program on /free-call. Same design system as everywhere else.
 */
export default function Healthcare() {
  useEffect(() => {
    document.title = 'Healthcare Marketing | Stay Booked Marketing'
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="nav-spacer" aria-hidden="true" />

      {/* 1. Header — who this page is for */}
      <section className="section section-offwhite">
        <Reveal className="wrap lp-narrow" amount={0.2}>
          <RevealItem as="p" className="label">Industries / Healthcare</RevealItem>
          <RevealItem as="h1" className="title">Marketing built for regulated healthcare.</RevealItem>
          <RevealItem as="p" className="body lp-hook-body">
            We work with medical and healthcare practices of every size: solo NPs, independent clinics, and growing groups. The same system that books customers for any local business gets a compliance-first layer here, because healthcare marketing has rules most agencies ignore.
          </RevealItem>
        </Reveal>
      </section>

      {/* 2. Compliance pillars — the healthcare-specific expertise */}
      <section className="section section-light">
        <div className="wrap">
          <Reveal>
            <RevealItem as="p" className="label">Compliance</RevealItem>
            <RevealItem as="h2" className="title">The rules are the point.</RevealItem>
          </Reveal>
          <Reveal as="ul" className="lp-points ind-list" amount={0.15}>
            {PILLARS.map((p) => (
              <RevealItem as="li" className="lp-point ind-row" key={p.name}>
                <span className="ind-name">{p.name}</span>
                <span className="ind-desc">{p.desc}</span>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 3. Healthcare FAQ — the nine questions moved from the main site */}
      <Faq items={HEALTHCARE_FAQS} title="Healthcare questions, answered." />

      {/* 4. Mental health program + booking CTA */}
      <section className="section section-deep lp-final">
        <Reveal className="wrap wrap-contact" amount={0.35}>
          <RevealItem as="h2" className="contact-headline">Run a psychiatric or mental health practice?</RevealItem>
          <RevealItem as="p" className="body contact-body">
            We have a dedicated program for you, with a guarantee: 10 booked appointments in 90 days, or we work for free until you get them.
          </RevealItem>
          <RevealItem as="div" className="hc-ctas" delay={0.2}>
            <Link className="contact-book-btn" to="/free-call">See the program</Link>
            <a
              className="contact-book-btn"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call
            </a>
          </RevealItem>
        </Reveal>
      </section>

      {/* 5. Minimal footer — same as the free-call page */}
      <footer className="footer lp-footer">
        <img className="footer-logo" src={logo} alt="Stay Booked Marketing" />
        <span className="footer-domain">staybookedmarketing.com</span>
        <span className="footer-phone">(408) 712-0017</span>
        <div className="footer-legal">
          <Link className="footer-privacy" to="/privacy">Privacy Policy</Link>
          <Link className="footer-privacy" to="/terms">Terms of Service</Link>
        </div>
      </footer>
    </>
  )
}
