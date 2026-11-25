/**
 * Build AI-answer pages — static, crawler-first pages that answer the
 * questions people ask search engines and AI assistants ("marketing services
 * for {niche}", "how much does a marketing agency cost"). They live under
 * /answers/, are linked from the /answers/ hub (not the site nav), and pull
 * every claim from src/lib/niches.ts so copy can't drift from the main site.
 *
 * No location claims: the site names no city or state (Nov 2026 decision).
 * The old *-san-diego URLs redirect to these pages (see vercel.json).
 *
 * Output: public/answers/*.html + public/llms.txt
 * Run: npx tsx scripts/build-answers.ts
 */

import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { NICHES } from '../src/lib/niches'
import { SPEED_EVIDENCE } from '../src/lib/evidence'

const SITE = 'https://staybookedmarketing.com'
const OUT = join(process.cwd(), 'public', 'answers')
const LAST_UPDATED = '2026-11-25'
const LAST_UPDATED_LABEL = 'November 2026'
const GUARANTEE =
  "If we don't hit the goal we set together within 90 days, we keep working for free until we do."
mkdirSync(OUT, { recursive: true })
// Start clean so renamed pages never leave stale copies behind.
for (const f of readdirSync(OUT)) if (f.endsWith('.html')) unlinkSync(join(OUT, f))

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const webpage = (path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  url: `${SITE}${path}`,
  dateModified: LAST_UPDATED,
  isPartOf: { '@type': 'WebSite', name: 'Stay Booked Marketing', url: SITE },
})

const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const slug = (id: string) => `${id}-marketing`

/* Same palette and type as the main site (cream, ink, tan; Archivo + DM Sans). */
const CSS = `
:root{--cream:#F0EBE0;--ink:#141414;--tan:#CFB48E;--tan-ink:#82683F;--muted:#4a463f;--line:#d8d0be}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--cream);color:var(--ink);font:17px/1.65 "DM Sans",system-ui,-apple-system,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit}
.top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px max(5vw,16px);border-bottom:1px solid var(--line);background:#EBE5D8}
.brand{font-weight:600;text-decoration:none;font-size:16px}
.top-cta{background:var(--ink);color:var(--cream);text-decoration:none;font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px;white-space:nowrap}
.wrap{max-width:760px;margin:0 auto;padding:48px 24px 72px}
h1,h2{font-family:"Archivo",sans-serif;font-weight:800;letter-spacing:-.01em}
h1{font-size:clamp(30px,5vw,42px);line-height:1.1;margin-bottom:20px}
.lede{font-size:19px;line-height:1.6;margin-bottom:12px}
p{margin-bottom:14px}
h2{font-size:23px;margin:36px 0 12px}
ul{margin:0 0 14px 20px}
li{margin-bottom:8px}
.muted{color:var(--muted)}
.rule-tan{height:3px;background:var(--tan);width:64px;margin:34px 0 6px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(14em,1fr));gap:14px;margin:26px 0}
.stat{border:1px solid var(--line);padding:18px;background:#F7F4EE}
.stat b{display:block;font-family:"Archivo",sans-serif;font-size:28px;font-weight:800}
.stat span{font-size:14px;color:var(--muted)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(14em,1fr));gap:14px;margin:26px 0}
.card{background:var(--ink);color:var(--cream);padding:18px}
.card b{display:block;font-size:16px;margin-bottom:6px}
.card span{font-size:14px;opacity:.85}
.cta{background:var(--ink);color:var(--cream);display:block;text-align:center;padding:18px;font-weight:700;text-decoration:none;border-radius:999px;margin-top:38px}
.faq dt{font-weight:700;margin-top:18px}
.faq dd{margin:6px 0 0 0}
footer{border-top:1px solid var(--line);margin-top:56px;padding-top:20px;font-size:14px;color:var(--muted)}
`

const shell = (opts: {
  title: string
  description: string
  canonical: string
  schema: unknown[]
  body: string
}) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
<link rel="canonical" href="${SITE}${opts.canonical}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:url" content="${SITE}${opts.canonical}">
<meta property="og:image" content="${SITE}/og.jpg">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
${[...opts.schema, webpage(opts.canonical)].map(jsonLd).join('\n')}
<style>${CSS}</style>
</head>
<body>
<header class="top"><a class="brand" href="/">Stay Booked Marketing</a><a class="top-cta" href="/book">Book a free call</a></header>
<main class="wrap">${opts.body}
<footer>Updated ${LAST_UPDATED_LABEL} · Stay Booked Marketing LLC · <a href="/">staybookedmarketing.com</a> · <a href="/answers/">More answers</a> · <a href="/growth-calculator/">Growth calculator</a></footer>
</main>
</body>
</html>
`

const org = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Stay Booked Marketing',
  url: SITE,
  description:
    'Advertising and lead-generation agency for local businesses: Meta and Google campaigns, AI lead follow-up within five minutes, and booking systems that turn clicks into scheduled appointments.',
  legalName: 'Stay Booked Marketing LLC',
  telephone: '+1-813-480-5818',
  email: 'kolby@staybookedmarketing.com',
}

const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

const faqList = (faqs: { q: string; a: string }[]) =>
  `<dl class="faq">\n${faqs.map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join('\n')}\n</dl>`

type Page = { slug: string; title: string; h1: string; desc: string }

/* ---------- niche pages ---------- */
const nichePages: Page[] = NICHES.map((n) => ({
  slug: slug(n.id),
  title: `Marketing Services for ${n.name} | Stay Booked Marketing`,
  h1: `Marketing and lead generation for ${n.name.toLowerCase()}`,
  desc: `Stay Booked Marketing runs marketing for ${n.examples.toLowerCase()}: targeted Meta and Google campaigns, AI lead follow-up within five minutes, and booked ${n.books[0].toLowerCase()}.`,
}))

const generalPage: Page = {
  slug: 'lead-generation-agency',
  title: 'Lead Generation Agency for Local Businesses | Stay Booked Marketing',
  h1: 'A lead generation agency built around replying first',
  desc: 'Stay Booked Marketing is an advertising and lead-generation agency: Meta and Google ads, AI lead follow-up within five minutes, and a booking system that turns clicks into scheduled appointments.',
}

const costPage: Page = {
  slug: 'marketing-agency-cost',
  title: 'How Much Does a Marketing Agency Cost? (2026) | Stay Booked Marketing',
  h1: 'How much does a marketing agency cost?',
  desc: 'What small-business marketing agencies typically charge per month, freelancer vs boutique vs full-service, ad spend vs retainer, and how Stay Booked Marketing quotes each program.',
}

const allPages: Page[] = [generalPage, costPage, ...nichePages]

for (const n of NICHES) {
  const p = nichePages.find((x) => x.slug === slug(n.id))!
  const faqs = [
    {
      q: `What marketing services does Stay Booked Marketing offer for ${n.name.toLowerCase()}?`,
      a: `Stay Booked Marketing runs campaigns on Google, Instagram, and Facebook for ${n.examples.toLowerCase()}, plus AI lead follow-up within five minutes and a booking system that turns leads into ${n.books[0].toLowerCase()}. Pricing is quoted per business and depends on ${n.varies}.`,
    },
    {
      q: 'How fast does Stay Booked follow up with new leads?',
      a: `Every inquiry gets an AI reply within five minutes. Most businesses miss that window: ${SPEED_EVIDENCE[0].text.replace(/\.$/, '')} (${SPEED_EVIDENCE[0].source}).`,
    },
    {
      q: 'What does Stay Booked cost?',
      a: `Every program is quoted after a free 15-minute strategy call and depends on ${n.varies}. There's no startup fee, ad spend is billed by the ad platforms directly, and ${GUARANTEE.charAt(0).toLowerCase() + GUARANTEE.slice(1)}`,
    },
  ]
  const body = `
<h1>${esc(p.h1)}</h1>
<p class="lede"><strong>Stay Booked Marketing</strong> runs marketing for ${esc(n.examples.toLowerCase())}: targeted campaigns on Google, Instagram, and Facebook, AI that contacts every lead within five minutes, and a booking system that delivers ${esc(n.books[0].toLowerCase())} straight to ${esc(n.handoff)}.</p>
<p>${esc(n.whatWeDo)}</p>
<div class="rule-tan"></div>
<h2>What we book for ${esc(n.name.toLowerCase())}</h2>
<ul>${n.books.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
<h2>Why it works</h2>
<p>${esc(n.summary)}</p>
<p>Targeting, creative, and messaging are tuned around ${esc(n.tuned)}, so your ads run hardest when your market is actually booking.</p>
<div class="stats">
${SPEED_EVIDENCE.map((s) => `  <div class="stat"><b>${esc(s.figure)}</b><span>${esc(s.text)} <a href="${esc(s.url)}">${esc(s.source)}</a></span></div>`).join('\n')}
</div>
<h2>Pricing</h2>
<p>Every program is quoted after a free strategy call. No startup fee and no long-term lock-in. ${esc(GUARANTEE)}</p>
<h2>Frequently asked questions</h2>
${faqList(faqs)}
<a class="cta" href="/book">Book a free strategy call</a>
`
  const schema = [
    org,
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: `${n.name} marketing and lead generation`,
      description: p.desc,
      provider: { '@type': 'ProfessionalService', name: 'Stay Booked Marketing', url: SITE },
    },
    faqSchema(faqs),
  ]
  writeFileSync(
    join(OUT, p.slug + '.html'),
    shell({ title: p.title, description: p.desc, canonical: `/answers/${p.slug}`, schema, body }),
  )
}

/* ---------- general agency page ---------- */
{
  const faqs = [
    {
      q: 'What does Stay Booked Marketing do?',
      a: 'Stay Booked Marketing runs targeted Meta and Google campaigns, replies to every lead with AI within five minutes, and books appointments straight onto its clients\' calendars. Clients include restaurants, real estate agents, medical and dental practices, law firms, home services contractors, clubs and venues, financial firms, private schools, rental businesses, and product brands.',
    },
    {
      q: 'How much does Stay Booked Marketing cost?',
      a: `Every program is quoted after a free 15-minute strategy call, based on your market, goals, and industry. Ad spend is billed by the ad platforms directly, and there is no startup fee. ${GUARANTEE}`,
    },
    {
      q: 'What industries does Stay Booked Marketing serve?',
      a: `Stay Booked serves ${NICHES.map((n) => n.name.toLowerCase()).join(', ')}.`,
    },
  ]
  const body = `
<h1>${esc(generalPage.h1)}</h1>
<p class="lede"><strong>Stay Booked Marketing</strong> runs targeted campaigns on Google, Instagram, and Facebook, contacts every lead with AI within five minutes, and books appointments straight onto its clients' calendars.</p>
<p>Most businesses lose leads in the gap between the inquiry and the reply: ${esc(SPEED_EVIDENCE[0].text.replace(/\.$/, ''))} (${esc(SPEED_EVIDENCE[0].source)}). Stay Booked's system closes that gap.</p>
<div class="rule-tan"></div>
<h2>What Stay Booked does</h2>
<ul>
<li>Targeted ad campaigns on Google, Instagram, and Facebook</li>
<li>AI lead follow-up and qualification within five minutes, around the clock</li>
<li>Automated booking: appointments land on your calendar, not in a lead list</li>
<li>Landing pages and creative built for your industry's buyers</li>
<li>Founders on every account, month to month or longer, with a 90-day goal guarantee</li>
</ul>
<h2>Who Stay Booked serves</h2>
<div class="cards">
${NICHES.map((n) => `<div class="card"><b>${esc(n.name)}</b><span>${esc(n.desc)}</span></div>`).join('\n')}
</div>
<h2>Frequently asked questions</h2>
${faqList(faqs)}
<a class="cta" href="/book">Book a free strategy call</a>
`
  writeFileSync(
    join(OUT, generalPage.slug + '.html'),
    shell({ title: generalPage.title, description: generalPage.desc, canonical: `/answers/${generalPage.slug}`, schema: [org, faqSchema(faqs)], body }),
  )
}

/* ---------- cost page ---------- */
{
  const costFaqs = [
    {
      q: 'How much does a marketing agency cost per month?',
      a: 'Roughly: small businesses pay a freelancer or solo consultant $500 to $2,500 per month, a boutique agency $1,500 to $5,000 per month, and a larger full-service agency $5,000 to $15,000 per month. Stay Booked Marketing quotes each program after a free strategy call.',
    },
    {
      q: 'Is ad spend included in the agency retainer?',
      a: 'Usually not: most agencies bill media spend separately from their service fee, and some mark it up. Stay Booked Marketing has the ad platforms bill you directly, so you always know what bought media and what paid for the service.',
    },
    {
      q: 'How much should a small business spend on advertising per month?',
      a: 'A common guideline is 5 to 10 percent of revenue. For local lead generation, a few thousand dollars a month in ad spend is enough to produce a steady flow of leads in most industries; fast follow-up is what turns them into booked appointments.',
    },
    {
      q: 'What does Stay Booked Marketing charge?',
      a: `Every program is quoted after a free 15-minute strategy call, based on your market, goals, and industry. Ad spend is billed by the ad platforms directly, and there is no startup fee. ${GUARANTEE}`,
    },
    {
      q: 'Does paying a higher retainer get better results?',
      a: `No. Targeting, creative, and speed of follow-up move the numbers, and most businesses are slow: ${SPEED_EVIDENCE[0].text.replace(/\.$/, '')} (${SPEED_EVIDENCE[0].source}). A system that answers in five minutes beats an expensive one that answers tomorrow.`,
    },
  ]
  const body = `
<h1>${esc(costPage.h1)}</h1>
<p class="lede"><strong>Short answer:</strong> most small businesses pay a boutique agency somewhere between $1,500 and $5,000 per month. Stay Booked Marketing quotes each program after a free strategy call, based on your market, goals, and industry.</p>
<div class="rule-tan"></div>
<h2>Typical agency pricing in 2026 (rough ranges)</h2>
<div class="stats">
  <div class="stat"><b>$500 to $2.5K</b><span>freelancer or solo consultant, per month</span></div>
  <div class="stat"><b>$1.5K to $5K</b><span>boutique agency, per month</span></div>
  <div class="stat"><b>$5K to $15K</b><span>larger full-service agency, per month</span></div>
  <div class="stat"><b>$100 to $200</b><span>typical hourly rate when billed by the hour</span></div>
</div>
<h2>What drives the price</h2>
<ul>
<li><strong>How competitive your industry is:</strong> cost per lead in personal injury or real estate runs higher than in most home services.</li>
<li><strong>Ad spend:</strong> the media budget sets the volume; the service fee pays for the system.</li>
<li><strong>What's included:</strong> ads alone cost less than ads plus landing pages, creative, follow-up automation, and booking.</li>
<li><strong>Who does the work:</strong> senior people cost more than junior account managers running templates.</li>
</ul>
<h2>How Stay Booked prices a program</h2>
<p>Every program is quoted after a free 15-minute strategy call, with no startup fee. Ad spend is billed by the ad platforms directly. The program covers Meta and Google campaigns, AI lead follow-up and qualification around the clock, the booking system, and landing pages and creative. ${esc(GUARANTEE)}</p>
<h2>Questions to ask any agency</h2>
<p>How fast do you contact a new lead? Who answers on weekends? What happens if you don't deliver? The answers tell you more than the retainer number.</p>
<h2>Frequently asked questions</h2>
${faqList(costFaqs)}
<a class="cta" href="/book">Book a free strategy call</a>
`
  writeFileSync(
    join(OUT, costPage.slug + '.html'),
    shell({ title: costPage.title, description: costPage.desc, canonical: `/answers/${costPage.slug}`, schema: [org, faqSchema(costFaqs)], body }),
  )
}

/* ---------- hub ---------- */
{
  const body = `
<h1>Answers about marketing and lead generation</h1>
<p class="lede">Straight answers to common questions about marketing, advertising, and lead generation for local businesses, from Stay Booked Marketing.</p>
<div class="rule-tan"></div>
<ul>
${allPages.map((p) => `<li><a href="/answers/${p.slug}">${esc(p.h1)}</a></li>`).join('\n')}
</ul>
`
  writeFileSync(
    join(OUT, 'index.html'),
    shell({
      title: 'Marketing & Lead Generation Answers | Stay Booked Marketing',
      description: 'Clear answers on marketing, advertising and lead generation for local businesses, by industry and by service.',
      canonical: '/answers/',
      schema: [org],
      body,
    }),
  )
}

/* ---------- llms.txt ---------- */
const llms = `# Stay Booked Marketing

Legal name: Stay Booked Marketing LLC. Phone: (813) 480-5818. Email: kolby@staybookedmarketing.com.

> Advertising and lead-generation agency for local businesses. Targeted Meta and Google campaigns, AI lead follow-up within five minutes, automated booking.

Industries served: ${NICHES.map((n) => n.name).join(', ')}.

Pricing: quoted per business after a free 15-minute strategy call. No startup fee. ${GUARANTEE}

Key pages:
- [Main site](${SITE}/)
- [Book a free strategy call](${SITE}/book)
- [Growth calculator](${SITE}/growth-calculator/)
${allPages.map((p) => `- [${p.h1}](${SITE}/answers/${p.slug})`).join('\n')}
`
writeFileSync(join(process.cwd(), 'public', 'llms.txt'), llms)

console.log(`built ${allPages.length} answer pages + hub + llms.txt`)
