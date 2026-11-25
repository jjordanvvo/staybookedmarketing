import { SYSTEM_STAGES } from '@/lib/systemStages'
import { NEXT_STEPS } from '@/lib/nextSteps'
import { TERMS } from '@/components/sections/TermsMarquee'
import { FAQS } from '@/lib/faqs'
import { STEPS as HOW_STEPS } from '@/components/sections/HowWeWork'
import { FOUNDERS } from '@/lib/founders'
import { PILLARS, HEALTHCARE_FAQS } from '@/pages/Healthcare'
import { STEPS as LP_STEPS, SPEED_STATS, WHY_POINTS } from '@/pages/FreeCall'
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from '@/pages/Privacy'
import { TERMS_INTRO, TERMS_SECTIONS } from '@/pages/Terms'
import type { LegalSection } from '@/components/sections/LegalPage'
import { slugify } from '@/lib/utils'
import { prepare, type SearchEntry } from '@/lib/search'

/**
 * The site search index: one entry per section, row, question, or clause on
 * every page. It is derived from the exported content constants the sections
 * render, so it is assembled at build time by the bundler and can never drift
 * from the live copy. The few hand-written entries below cover copy that lives
 * inline in JSX (hero, why, pricing, contact) — keep them in step if that
 * copy changes.
 *
 * Built lazily (first search), which also keeps this module's page imports
 * from being touched while those pages are still evaluating.
 */

function legalEntries(page: string, path: string, intro: string[], sections: LegalSection[]): SearchEntry[] {
  return [
    { title: page, section: 'Legal', page, path, text: intro.join(' ') },
    ...sections.map((s) => ({
      title: s.heading.replace(/^\d+\.\s*/, ''),
      section: 'Legal',
      page,
      path: `${path}#${slugify(s.heading)}`,
      text: [...(s.paras ?? []), ...(s.list ?? []), ...(s.contact?.lines ?? []), s.contact?.email ?? ''].join(' '),
    })),
  ]
}

// Plain-language terms people search for, per service number.
function build(): SearchEntry[] {
  const home = 'Home'
  return [
    // ---- Home ----
    {
      title: 'We turn your ads into booked customers.',
      section: 'Overview',
      page: home,
      path: '/#hero',
      text: 'Founded by Stanford and Penn graduates. We run your ads, reply to every new lead within minutes, and book them onto your calendar. Book a free strategy call or call (813) 480-5818.',
      keywords: 'about lead generation agency',
    },
    ...HOW_STEPS.map((s) => ({
      title: s.word,
      section: 'How we work',
      page: home,
      path: '/#how',
      text: s.desc,
    })),
    ...SYSTEM_STAGES.map((st) => ({
      title: st.title,
      section: 'The system',
      page: 'How the system works',
      path: `/the-system#${st.id}`,
      text: st.body,
      keywords: 'how we built it system backend crm automation ai reply booking',
    })),
    {
      title: 'See what we can do for you',
      section: 'Get started',
      page: home,
      path: '/#get-started',
      text: 'If customers reach you by calling, booking, reserving or buying, the system works for you. Tell us about your business. ' + NEXT_STEPS.map((n) => `${n.name}. ${n.desc}`).join(' '),
      keywords: 'industry niche who we help form contact get started restaurants law firms contractors clinics schools brands',
    },
    {
      title: "Most businesses answer too slowly. Yours won't.",
      section: 'Why speed wins',
      page: home,
      path: '/#evidence',
      text: SPEED_STATS.map((s) => `${s.text} ${s.source}`).join(' ') + " Our system replies to every new lead within minutes, day or night.",
      keywords: 'speed to lead research stats response time',
    },
    ...TERMS.map((t) => ({
      title: t.strong,
      section: 'Pricing and guarantee',
      page: home,
      path: '/#terms',
      text: `${t.strong}. ${t.rest}.`,
      keywords: 'price cost fee pricing guarantee contract terms month to month',
    })),
    ...FOUNDERS.map((f) => ({
      title: f.name,
      section: 'Founders',
      page: 'Team',
      path: '/team',
      text: `${f.title}. ${f.degree ?? ''} ${f.bio}`,
      keywords: 'team founder',
    })),
    ...FAQS.map((f) => ({
      title: f.q,
      section: 'FAQ',
      page: home,
      path: '/#faq',
      text: f.a,
      keywords: 'question',
    })),
    {
      title: "Let's get you booked.",
      section: 'Contact',
      page: home,
      path: '/#contact',
      text: 'Book a free 15-minute call, send us a message, or call us directly. Book a Free Strategy Call. Email us kolby@staybookedmarketing.com. Call direct (813) 480-5818.',
      keywords: 'contact email phone call book a call schedule get in touch',
    },

    // ---- Healthcare ----
    {
      title: 'Marketing built for regulated healthcare.',
      section: 'Healthcare',
      page: 'Healthcare',
      path: '/healthcare#hc-intro',
      text: 'We work with medical and healthcare practices of every size: solo NPs, independent clinics, and growing groups. The same system that books customers for any local business gets a compliance-first layer here, because healthcare marketing has rules most agencies ignore.',
      keywords: 'medical practice clinic doctor',
    },
    ...PILLARS.map((p) => ({
      title: p.name,
      section: 'Compliance',
      page: 'Healthcare',
      path: '/healthcare#hc-compliance',
      text: p.desc,
    })),
    ...HEALTHCARE_FAQS.map((f) => ({
      title: f.q,
      section: 'Healthcare FAQ',
      page: 'Healthcare',
      path: '/healthcare#faq',
      text: f.a,
      keywords: 'question',
    })),
    {
      title: 'Run a psychiatric or mental health practice?',
      section: 'Mental health program',
      page: 'Healthcare',
      path: '/healthcare#hc-program',
      text: 'We have a dedicated program for you: targeted ads, instant follow-up, and booked patient appointments, built around the rules your practice has to follow.',
      keywords: 'psychiatry therapy',
    },

    // ---- Free call (mental health program) ----
    {
      title: 'More Patients for Your Practice. Without the Chasing.',
      section: 'Free call',
      page: 'Free Call',
      path: '/free-call',
      text: 'We help psychiatric and mental health practices fill their calendars with qualified patients, using targeted ads and instant, automated follow-up. You focus on care. We keep the appointments coming. Book a Free Call.',
      keywords: 'psychiatric mental health program',
    },
    {
      title: "Getting interest is easy. Booking patients isn't.",
      section: 'The gap',
      page: 'Free Call',
      path: '/free-call#gap',
      text: 'Most practices lose potential patients in the gap between interest and follow-up. Someone reaches out, waits, hears nothing for hours, and books with whoever responds first. We close that gap completely.',
    },
    {
      title: "Speed wins patients. We're built for speed.",
      section: 'Why it works',
      page: 'Free Call',
      path: '/free-call#why-it-works',
      text: SPEED_STATS.map((s) => `${s.text} ${s.source}`).join(' ') + ' Our system contacts every lead in minutes, automatically.',
      keywords: 'speed to lead research stats',
    },
    ...LP_STEPS.map((s) => ({
      title: s.word,
      section: 'How it works',
      page: 'Free Call',
      path: '/free-call#how-it-works',
      text: s.desc,
    })),
    {
      title: 'Built for practices. Run by the founders.',
      section: 'Why us',
      page: 'Free Call',
      path: '/free-call#why-practices',
      text: WHY_POINTS.join(' '),
    },
    {
      title: 'Ready to fill your calendar?',
      section: 'Book a free call',
      page: 'Free Call',
      path: '/free-call#ready',
      text: "Book a free strategy call and we'll show you exactly what this would look like for your practice, and what it would cost.",
      keywords: 'book a call',
    },

    // ---- Legal ----
    ...legalEntries('Privacy Policy', '/privacy', PRIVACY_INTRO, PRIVACY_SECTIONS),
    ...legalEntries('Terms of Service', '/terms', TERMS_INTRO, TERMS_SECTIONS),
  ]
}

let prepared: ReturnType<typeof prepare> | null = null

/** The prepared (tokenized) index, built once on first use. */
export function getSearchIndex() {
  if (!prepared) prepared = prepare(build())
  return prepared
}
