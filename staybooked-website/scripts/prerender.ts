/**
 * Prerender — build-time SEO snapshots for every route (run after vite build).
 *
 * The site is a client-rendered React SPA, which search engines, AI crawlers,
 * and link previews can't reliably read. This script reads the built shell
 * (dist/index.html), and for each route writes a fully-formed static HTML
 * page: per-route title, meta description, canonical + Open Graph tags,
 * JSON-LD schema, and real semantic content inside #root. React still takes
 * over on load (createRoot replaces the content), so nothing changes for
 * visitors — crawlers just finally see the whole site.
 *
 * Copy is imported from the same data modules the app renders from, so it
 * can never drift. Routes with content: /, /team, /niches/*, /book.
 * Meta-only: /healthcare, /free-call, /privacy, /terms.
 *
 * Also regenerates dist/sitemap.xml with every route.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { NICHES, INVESTMENT } from '../src/lib/niches'
import { FAQS } from '../src/lib/faqs'
import { FOUNDERS } from '../src/lib/founders'
import { STEPS as HOW_STEPS } from '../src/components/sections/HowWeWork'
import { SERVICES } from '../src/components/sections/Services'
import { STEPS as PLAN_STEPS } from '../src/components/sections/HowToStart'

const DIST = join(process.cwd(), 'dist')
const SITE = 'https://staybookedmarketing.com'
const TEMPLATE = readFileSync(join(DIST, 'index.html'), 'utf8')

/* ---------- helpers ---------- */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const label = (t: string) => `<p class="label">${esc(t)}</p>`
const title = (t: string) => `<h2 class="title">${esc(t)}</h2>`
const h1 = (t: string) => `<h1 class="title">${esc(t)}</h1>`
const body = (t: string) => `<p class="body">${esc(t)}</p>`
const section = (inner: string, id = '', tone = '') =>
  `<section class="section ${tone}"${id ? ` id="${id}"` : ''}><div class="wrap">${inner}</div></section>`

const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

type Route = {
  /** URL path, e.g. / or /team or /niches/home-services */
  path: string
  title: string
  description: string
  content: string
  schema?: string
}

/** Write the template with this route's head + content. */
function writeRoute(r: Route) {
  let html = TEMPLATE
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(r.title)}</title>`)
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${esc(r.description)}" />`,
  )
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${SITE}${r.path === '/' ? '/' : r.path}" />`,
  )
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${esc(r.title)}" />`,
  )
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${esc(r.description)}" />`,
  )
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${SITE}${r.path === '/' ? '/' : r.path}" />`,
  )
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
  )
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
  )
  if (r.schema) html = html.replace('</head>', `${r.schema}\n</head>`)
  html = html.replace('<div id="root"></div>', `<div id="root">${r.content}</div>`)

  const out = join(DIST, r.path === '/' ? 'index.html' : r.path.replace(/^\//, '') + '/index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  console.log('prerendered', r.path)
}

/* ---------- home ---------- */

const homeContent = [
  section(
    label('The system') +
      h1("We don't chase leads. We book them.") +
      body(
        'Founded by Stanford graduates, Stay Booked Marketing builds complete lead generation systems for local businesses: targeted ads bring in the right local customers, our automated system qualifies them, and ready-to-book customers land straight on your calendar.',
      ),
    'statement',
  ),
  section(
    label('How we work') + title('Three steps, one system.') +
      HOW_STEPS.map((s) => `<p class="body"><strong>${esc(s.word)}.</strong> ${esc(s.desc)}</p>`).join(''),
    'how',
  ),
  section(
    label('Services') + title('What we build.') +
      SERVICES.map((s) => `<p class="body"><strong>${esc(s.name)}.</strong> ${esc(s.desc)}</p>`).join(''),
    'services',
  ),
  section(
    label('Who we help') + title('Built for local businesses.') +
      `<p class="body">Every partnership includes a performance guarantee period: if we haven't delivered by the end of that window, your retainer pauses until we do.</p>` +
      NICHES.map(
        (n) =>
          `<p class="body"><a href="/niches/${n.id}"><strong>${esc(n.name)}</strong></a> — ${esc(n.desc)}</p>`,
      ).join(''),
    'industries',
  ),
  section(
    label('The team') + title('Our founders.') +
      `<p class="body">Five founders running every account hands-on: ${FOUNDERS.map((f) => `${esc(f.name)} (${esc(f.title)})`).join(', ')}.</p><p class="body"><a href="/team">Meet our team</a></p>`,
    'founders',
  ),
  section(
    label('Pricing') + title("Great marketing shouldn't cost a fortune.") +
      `<p class="body">Estimate the monthly total for your niche with the cost calculator: tell us what you do, what an average job is worth, and how fast you respond. Flat ${esc('$')}2,000 monthly retainer plus ad spend (about ${esc('$')}${INVESTMENT.adSpend}/mo, billed by the ad platforms and always yours). No startup fee, month to month, backed by the performance guarantee. <a href="/book">Book a strategy call</a>.</p>`,
    'pricing',
    'section-deep',
  ),
  section(
    label('FAQ') + title('Questions, answered.') +
      FAQS.map((f) => `<p class="body"><strong>${esc(f.q)}</strong><br/>${esc(f.a)}</p>`).join(''),
    'faq',
    'section-offwhite',
  ),
].join('')

/* ---------- routes ---------- */

const routes: Route[] = [
  {
    path: '/',
    title: 'Stay Booked Marketing | Lead Generation for Local Businesses',
    description:
      'Stay Booked Marketing builds lead generation systems, multi-platform advertising, and custom software for local businesses that want more customers.',
    content: homeContent,
    schema: jsonLd(faqSchema(FAQS)),
  },
  {
    path: '/team',
    title: 'Meet the Team | Stay Booked Marketing',
    description:
      'Meet the five founders behind Stay Booked Marketing: Stanford to Penn, running every account hands-on. No account managers, no ticket systems.',
    content: section(
      label('Meet the founders') + h1('The people behind Stay Booked.') +
        FOUNDERS.map(
          (f) =>
            `<article><h3>${esc(f.name)}</h3><p><strong>${esc(f.title)}</strong></p>${
              f.degree ? `<p>${esc(f.degree)}</p>` : ''
            }<p class="body">${esc(f.bio)}</p>${
              f.email ? `<p><a href="mailto:${esc(f.email!)}">${esc(f.email)}</a>${f.phone ? ` — ${esc(f.phone)}` : ''}</p>` : ''
            }</article>`,
        ).join(''),
      'team',
    ),
  },
  ...NICHES.map((n): Route => {
    const seo = n.seo ?? { title: `${n.name} Marketing | Stay Booked Marketing`, description: n.desc }
    const content = section(
      label(`Industries / ${n.name}`) +
        h1(n.name) +
        body(n.desc) +
        `<p class="body"><strong>Who it's for:</strong> ${esc(n.examples)}.</p>` +
        `<p class="body">${esc(n.whatWeDo)}</p>` +
        `<p class="body"><strong>What we book:</strong> ${n.books.map(esc).join(', ')}.</p>` +
        `<p class="body"><strong>The system is tuned around</strong> ${esc(n.tuned)}.</p>` +
        `<p class="body"><strong>Your AI books in real time and reports to</strong> ${esc(n.handoff)}.</p>` +
        `<p class="body"><strong>Performance guarantee:</strong> if we haven't delivered ${esc(n.guarantee)} by the end of the guarantee window, your retainer pauses until we do.</p>` +
        `<p class="body"><strong>Investment:</strong> flat ${esc('$')}2,000 monthly retainer plus about ${esc('$')}${INVESTMENT.adSpend}/mo ad spend, billed by the platforms and always yours. No startup fee, month to month. <a href="/book">Book a strategy call</a> or <a href="/#industries">see every niche</a>.</p>`,
      `nd-${n.id}`,
      'section-offwhite',
    )
    return {
      path: `/niches/${n.id}`,
      title: seo.title,
      description: seo.description,
      content,
      schema: jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: `${n.name} marketing and lead generation`,
        description: seo.description,
        provider: {
          '@type': 'ProfessionalService',
          name: 'Stay Booked Marketing',
          url: SITE,
        },
        areaServed: 'United States',
      }),
    }
  }),
  {
    path: '/book',
    title: 'Book a Strategy Call | Stay Booked Marketing',
    description:
      'Book a free 30-minute strategy call: we audit your setup, tell you what we would do to book more jobs, and give you a clear number. You leave with a plan either way.',
    content: section(
      label('Book a Call') + h1('Grab a time that works.') +
        `<p class="body">The calendar books instantly — no back and forth, no forms.</p>` +
        `<p class="body"><strong>30 minutes, straight answers.</strong> We audit your current setup, look at your market, and tell you exactly what we'd do to book more jobs. You leave with a plan whether or not you hire us.</p>` +
        `<p class="body"><strong>A clear number.</strong> Flat retainer, ad spend estimate for your niche, and the guarantee: no results, your retainer pauses until we deliver.</p>`,
      'book',
      'section-offwhite',
    ),
  },
  {
    path: '/healthcare',
    title: 'Healthcare Marketing | Stay Booked Marketing',
    description:
      'Compliance-first healthcare marketing: BAAs, PHI-safe tracking, state advertising rules, and booking systems for solo NPs, clinics and growing practices.',
    content: section(
      label('Industries / Healthcare') + h1('Marketing built for regulated healthcare.') +
        `<p class="body">We work with medical and healthcare practices of every size: solo NPs, independent clinics, and growing groups. The same system that books customers for any local business gets a compliance-first layer here.</p><p class="body"><a href="/">See how the system works</a> or <a href="/book">book a call</a>.</p>`,
      'hc-intro',
      'section-offwhite',
    ),
  },
  {
    path: '/free-call',
    title: 'Free Strategy Call | Stay Booked Marketing',
    description: 'A free strategy call: your business, your market, and a plan to book more jobs.',
    content: section(
      label('Free call') + h1('The free strategy call.') +
        `<p class="body">A real conversation about your business — not a pitch deck. <a href="/book">Book a time</a>.</p>`,
      'freecall',
      'section-offwhite',
    ),
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Stay Booked Marketing',
    description: 'Stay Booked Marketing privacy policy.',
    content: section(label('Legal') + h1('Privacy policy.'), 'privacy'),
  },
  {
    path: '/terms',
    title: 'Terms of Service | Stay Booked Marketing',
    description: 'Stay Booked Marketing terms of service.',
    content: section(label('Legal') + h1('Terms of service.'), 'terms'),
  },
]

for (const r of routes) writeRoute(r)

/* ---------- sitemap ---------- */

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)
console.log('sitemap written,', routes.length, 'routes')
