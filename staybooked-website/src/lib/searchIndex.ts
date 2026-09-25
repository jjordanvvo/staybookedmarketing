import { INDUSTRIES } from '@/components/sections/Industries'
import { NICHES } from '@/lib/niches'
import { SERVICES } from '@/components/sections/Services'
import { FAQS } from '@/lib/faqs'
import { STEPS as HOW_STEPS } from '@/components/sections/HowWeWork'
import { STEPS as PLAN_STEPS } from '@/components/sections/HowToStart'
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
 * inline in JSX (hero statement, pricing, contact) — keep them in step if that
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
const SERVICE_KEYWORDS: Record<string, string> = {
  '01': 'leads ads booking follow-up automation',
  '02': 'ads paid advertising meta facebook instagram google social',
  '03': 'website web design app software development',
}

function build(): SearchEntry[] {
  const home = 'Home'
  return [
    // ---- Home ----
    {
      title: "We don't chase leads. We book them.",
      section: 'Overview',
      page: home,
      path: '/#statement',
      text: 'Founded by Stanford graduates. We build complete lead generation systems for local businesses. Targeted ads bring in the right local customers, our automated system qualifies them, and ready-to-book customers land straight on your calendar. Stay Booked Marketing builds lead generation systems for local businesses that want more customers. We run the ads, qualify every lead, and handle the digital side so you can focus on running your business.',
      keywords: 'about lead generation agency',
    },
    ...HOW_STEPS.map((s) => ({
      title: s.word,
      section: 'How we work',
      page: home,
      path: '/#how',
      text: s.desc,
    })),
    ...SERVICES.map((s) => ({
      title: s.name,
      section: 'Services',
      page: home,
      path: '/#services',
      text: s.desc,
      keywords: `service what we build ${SERVICE_KEYWORDS[s.num] ?? ''}`,
    })),
    ...INDUSTRIES.map((i) => ({
      title: i.name,
      section: 'Industries',
      page: home,
      path: '/#industries',
      text: i.desc,
      keywords: 'industry niche who we help',
    })),
    {
      title: 'Results first. Terms that fit you.',
      section: 'Why Stay Booked',
      page: home,
      path: '/#why',
      text: 'We earn your business every month, on terms that fit you: month to month or a longer partnership, your choice. Most clients see results in the first 30 days. 30 days to results. $2K flat monthly rate. 24/7 automated follow-up.',
      keywords: 'why us results stats',
    },
    ...FOUNDERS.map((f) => ({
      title: f.name,
      section: 'Founders',
      page: 'Team',
      path: '/team',
      text: `${f.title}. ${f.degree ?? ''} ${f.bio}`,
      keywords: 'team founder',
    })),
    ...NICHES.map((n) => ({
      title: n.name,
      section: 'Niches',
      page: 'Niche',
      path: `/niches/${n.id}`,
      text: `${n.desc} ${n.whatWeDo} What we book: ${n.books.join(', ')}. Tuned around ${n.tuned}. Performance guarantee: if we haven't delivered ${n.guarantee} by the end of the guarantee window, your retainer pauses until we do.`,
      keywords: 'industry niche one pager learn more',
    })),
    ...PLAN_STEPS.map((s) => ({
      title: s.name,
      section: 'The plan',
      page: home,
      path: '/#start',
      text: s.desc,
      keywords: 'how it works getting started',
    })),
    {
      title: 'Pricing',
      section: 'Pricing',
      page: home,
      path: '/#pricing',
      text: "Great marketing shouldn't cost a fortune. Estimate the monthly total for your niche with the cost calculator: tell us what you do, what an average job is worth, and how fast you respond, and see your flat retainer, ad spend, and what slow follow-up may be costing you. No startup fee, month to month.",
      keywords: 'price cost rate fee monthly plan budget calculator estimate',
    },
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
      text: 'Send us an email, give us a direct call, or schedule a 15-minute meeting with our team. Book a 15-Minute Call. Email us staybookedmarketing@gmail.com. Call direct (408) 712-0017.',
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
      text: 'We have a dedicated program for you, with a guarantee: 10 booked appointments in 90 days, or we work for free until you get them.',
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
      title: '10 booked appointments in 90 days. Or we work for free until you get them.',
      section: 'Our guarantee',
      page: 'Free Call',
      path: '/free-call#guarantee',
      text: 'We put our own skin in the game. If we don\'t deliver at least 10 booked patient appointments within 90 days, we keep working at no cost until we do.',
      keywords: 'guarantee',
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
      title: 'Built for practices. Backed by a guarantee.',
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
      text: "Book a free strategy call and we'll show you exactly what this would look like for your practice, guarantee included.",
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
