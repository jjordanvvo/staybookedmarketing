# Niche-Agnostic Site Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make staybookedmarketing.com read as a general local-business lead-gen agency, with a new dedicated `/healthcare` page holding all healthcare-specific content, and a split FAQ.

**Architecture:** Copy-and-structure change only inside `staybooked-website/` (Vite + React + TS). New `Industries` homepage section and `Healthcare` page reuse the existing design system (`section`, `wrap`, `label`, `title`, `lp-*`, `faq-*`, `Reveal`/`RevealItem`); `Faq` is parameterized so both pages share the accordion. `/free-call` (psych ad landing page) is untouched.

**Tech Stack:** React 18, react-router-dom, framer-motion `Reveal` components, single `src/index.css`.

**Spec:** The user's prompt of 2026-09-14 (Goals 1–3 + rules), recorded in the session; constraints below.

## Global Constraints

- NO visual design changes: keep brand, colors, fonts, logo, layout. Reuse existing CSS classes and tokens; new CSS only where a new section needs it, matching existing patterns.
- Keep tagline "We don't chase leads. We book them." and "Founded by Stanford graduates".
- Keep $2,000/mo + ad spend, no startup fee, flexible month-to-month-or-longer terms, speed-to-lead angle.
- Honest no-guarantee voice ("no agency honestly can, and we won't pretend to"); compliance answers stay soft ("we're built to" / "we work to"), never hard guarantees.
- Site copy: NO em dashes, nothing AI-sounding, say "California" never a single city.
- Do NOT alter `/free-call` guarantee terms or stat numbers.
- Booking link only via `BOOKING_URL` from `src/lib/booking.ts`.
- Never wrap a tall section in a single `<Reveal>` (whileInView threshold bug); reveal header and rows independently.
- No test suite exists; the verification gate per task is `npm run build` (tsc + vite) from `staybooked-website/` plus targeted greps.
- Work on branch `niche-agnostic-restructure`; commit per task; do not push without the user.

---

### Task 1: Broaden homepage copy (HeroStatement, HowWeWork, Services, index.html)

**Files:**
- Modify: `staybooked-website/src/components/sections/HeroStatement.tsx:55-84`
- Modify: `staybooked-website/src/components/sections/HowWeWork.tsx:3-19`
- Modify: `staybooked-website/src/components/sections/Services.tsx:4-8`
- Modify: `staybooked-website/index.html:12,40`

**Interfaces:**
- Produces: the `Learn More` CTA in HeroStatement now targets `#industries` (anchor id created in Task 2).

- [ ] **Step 1: HeroStatement support copy → niche-agnostic**

Replace the two paragraphs (lines 55-56):

```
We build complete lead generation systems for local businesses. Targeted ads bring in the right local customers, our automated system qualifies them, and ready-to-book customers land straight on your calendar.
```

```
Stay Booked Marketing builds lead generation systems for local businesses that want more customers. We run the ads, qualify every lead, and handle the digital side so you can focus on running your business.
```

- [ ] **Step 2: Retarget the Learn More CTA**

The `MotionLink to="/free-call"` becomes a plain `motion.a href="#industries"` (HeroStatement renders only on the home page). Keep the same className, variants, custom slot, whileTap, and arrow SVG. Remove the now-unused `Link`/`MotionLink` if nothing else uses them.

- [ ] **Step 3: HowWeWork steps → industry-neutral**

01 Advertise: `We build and run targeted ad campaigns that put your business in front of the right local customers actively looking for what you offer.`
02 Qualify: unchanged (already neutral).
03 Book: `Qualified, interested customers are delivered straight to you or booked directly onto your calendar, ready for their appointment.`

- [ ] **Step 4: Services 01 description → neutral**

`Complete ad campaigns with automated lead qualification and booking, built to deliver your business a steady flow of ready-to-book customers.`

- [ ] **Step 5: index.html meta + JSON-LD description**

Both instances: `Stay Booked Marketing builds websites, runs ads, and manages full-funnel campaigns for local businesses that want more customers.`

- [ ] **Step 6: Verify + commit**

Run: `npm run build` (expect success), then `grep -rniE "patient|practice|clinic" src/components/sections/HeroStatement.tsx src/components/sections/HowWeWork.tsx src/components/sections/Services.tsx` (expect no matches). Commit: `copy: broaden homepage from medical-only to any local business`.

### Task 2: Industries section on the homepage

**Files:**
- Create: `staybooked-website/src/components/sections/Industries.tsx`
- Modify: `staybooked-website/src/pages/Home.tsx` (mount after `<Services />`)
- Modify: `staybooked-website/src/index.css` (small `.ind-*` block after `.lp-point`, plus a mobile stack rule)

**Interfaces:**
- Produces: section `id="industries"` (Task 1's CTA and Task 3's nav anchor target); healthcare row links to `/healthcare` (route created in Task 5).

- [ ] **Step 1: Component**

```tsx
import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

const INDUSTRIES = [
  { name: 'Home Services', desc: 'Cleaning, landscaping, HVAC, and every service that keeps homes running.' },
  { name: 'Trades & Construction', desc: 'Contractors, roofers, plumbers, electricians, and remodelers.' },
  { name: 'Legal', desc: 'Firms and solo attorneys who want a calendar of qualified consultations.' },
  { name: 'Fitness & Med Spas', desc: 'Gyms, studios, med spas, and wellness businesses built on bookings.' },
  { name: 'Professional Services', desc: 'Accountants, advisors, and every business that runs on appointments.' },
  { name: 'Healthcare & Medical', desc: 'Practices and clinics, with a compliance-first process built for regulated healthcare.', to: '/healthcare' },
]

export default function Industries() {
  return (
    <section className="section section-offwhite" id="industries">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Industries</RevealItem>
          <RevealItem as="h2" className="title">Who we help.</RevealItem>
          <RevealItem as="p" className="body why-body">If your business serves local customers, we can build for it. Here's where we spend most of our time.</RevealItem>
        </Reveal>
        <Reveal as="ul" className="lp-points ind-list" amount={0.15}>
          {INDUSTRIES.map((ind) => (
            <RevealItem as="li" className="lp-point ind-row" key={ind.name}>
              {ind.to ? (
                <Link className="ind-link" to={ind.to}>
                  <span className="ind-name">{ind.name}</span>
                  <span className="ind-desc">{ind.desc} See how we work with healthcare →</span>
                </Link>
              ) : (
                <>
                  <span className="ind-name">{ind.name}</span>
                  <span className="ind-desc">{ind.desc}</span>
                </>
              )}
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
```

(The `→` is an arrow character in a link affordance, not an em dash; if it reads wrong against the design, use the same inline arrow SVG as `statement-cta`.)

- [ ] **Step 2: CSS (match existing tokens/idiom, hover gated to fine pointers)**

```css
/* Industries / expertise rows — lead term + one-liner on the lp-point hairlines
   (shared by the homepage Industries list and the healthcare page pillars) */
.ind-list { list-style: none; padding-left: 0; }
.ind-row { display: grid; grid-template-columns: minmax(170px, 250px) 1fr; gap: 6px 36px; align-items: baseline; }
.ind-link { display: contents; color: inherit; text-decoration: none; }
.ind-name { font-weight: 600; color: var(--ink); }
@media (hover: hover) and (pointer: fine) {
  .ind-link:hover .ind-name { text-decoration: underline; text-underline-offset: 4px; }
}
@media (max-width: 720px) {
  .ind-row { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Mount in Home.tsx** after `<Services />`, before `<WhyUs />`.

- [ ] **Step 4: Verify + commit**

`npm run build`; visually the section must use existing rhythm (no new colors/fonts). Commit: `feat: Industries we serve section on the homepage`.

### Task 3: Navbar — For Practices → Industries

**Files:**
- Modify: `staybooked-website/src/components/sections/Navbar.tsx:17-23,81,106`

- [ ] **Step 1:** Add `{ label: 'Industries', id: 'industries' }` as the FIRST entry of `ANCHORS`; delete both hardcoded `<li><Link to="/free-call">For Practices</Link></li>` rows (desktop + mobile sheet). The anchor helper already makes it route-aware (`/#industries` off-home, retrying scroller in App.tsx).

- [ ] **Step 2: Verify + commit**

`npm run build`; `grep -n "free-call\|For Practices" src/components/sections/Navbar.tsx` expects no matches. Commit: `nav: replace For Practices with Industries anchor`.

### Task 4: Split the FAQ — parameterize Faq, write general questions

**Files:**
- Modify: `staybooked-website/src/components/sections/Faq.tsx`

**Interfaces:**
- Produces: `export type FaqEntry = { q: string; a: string }`; `Faq` accepts optional `{ items?: FaqEntry[]; title?: string }` (defaults: general FAQ, "Questions, answered."). Task 5 consumes `<Faq items={...} title={...} />`.

- [ ] **Step 1:** Replace `FAQS` with the general list (the 9 healthcare entries move verbatim to Task 5):

1. q `What industries do you work with?` — a `Any local service business: home services, trades, legal, fitness and med spas, professional services, and healthcare. If your customers are local and your business runs on appointments or jobs, the system fits. For medical and healthcare practices, we have a dedicated compliance-first approach you can read about on our healthcare page.`
2. q `How fast will I see results?` — a `Most clients see results within the first 30 days. Ads can start running within days of your strategy call, and our follow-up system goes to work on the very first lead. Timelines vary by industry and budget, so we'll give you an honest read on yours during the call.`
3. q `What's included in the monthly price?` — a `Everything: campaign creation and management, landing pages, automated lead follow-up, qualification, and booking, all handled end to end for $2,000 per month. There's no startup fee. Ad spend is billed separately by the ad platforms and always stays yours.`
4. q `Do you require a long-term contract?` — a `No. Terms are flexible: month to month or longer, your choice. We'd rather earn your business every month than lock you into anything.`
5. q `Who owns the ad accounts and the data?` — a `You do. Ad accounts, audiences, and every lead we generate belong to you. If we ever part ways, all of it stays with you.`
6. q `Can you guarantee results?` — a `No agency honestly can, and we won't pretend to. What we can promise is a complete system, fast follow-up on every lead, and a team that reviews performance every month and keeps improving what works.`
7. q `How is this different from other agencies?` — a `Most agencies stop at generating leads and leave the follow-up to you. We built the whole system around speed: every lead is contacted and qualified within minutes, automatically, and booked straight onto your calendar. Responding first is how local businesses win, and we make sure that's you.`

- [ ] **Step 2:** Parameterize the component (accordion markup unchanged):

```tsx
export type FaqEntry = { q: string; a: string }
type FaqProps = { items?: FaqEntry[]; title?: string }
export default function Faq({ items = FAQS, title = 'Questions, answered.' }: FaqProps) {
```

and map over `items`, render `{title}` in the `<h2>`.

- [ ] **Step 3: Verify + commit**

`npm run build`; `grep -niE "hipaa|physician|np practices" src/components/sections/Faq.tsx` expects no matches. Commit: `faq: general business questions on the main site`.

### Task 5: /healthcare page

**Files:**
- Create: `staybooked-website/src/pages/Healthcare.tsx`
- Modify: `staybooked-website/src/App.tsx` (route `/healthcare`)

**Interfaces:**
- Consumes: `Faq` + `FaqEntry` from Task 4, `.ind-*` CSS from Task 2, `Navbar`, `Reveal`/`RevealItem`, `BOOKING_URL`, footer classes from FreeCall.

- [ ] **Step 1: Page structure** (no intro animation; document.title set like FreeCall does, reset on unmount):

1. **Header** (`section section-offwhite`, top-padded past the fixed nav via `nav-spacer`): label `Industries / Healthcare`, h1 `title`: `Marketing built for regulated healthcare.` Body: `We work with medical and healthcare practices across California: solo NPs, independent clinics, and growing groups. The same system that books customers for any local business gets a compliance-first layer here, because healthcare marketing has rules most agencies ignore.`
2. **Compliance pillars** (`section section-light`), label `Compliance`, title `The rules are the point.`, `lp-points ind-list` rows (short; full detail lives in the FAQ below):
   - `HIPAA & BAAs` / `We're built to operate as a Business Associate: signed BAAs, data minimization, and PHI-aware page design from day one.`
   - `State advertising rules` / `We research your state and license type before any campaign goes live, not after.`
   - `Delegating physician requirements` / `Scope of practice, prescriptive authority, and required disclosures are reviewed before we write a word of copy.`
   - `PHI-safe tracking` / `We work to use server-side and anonymized tracking in place of standard pixels on pages that could capture health information.`
   - `Solo and independent NP practices` / `Our healthcare focus started with independent and small-practice NPs, and we work with solo practices and larger groups alike.`
3. **Healthcare FAQ**: `<Faq items={HEALTHCARE_FAQS} title="Healthcare questions, answered." />` where `HEALTHCARE_FAQS` is the current 9-entry list from Faq.tsx moved verbatim (soft compliance phrasing preserved exactly).
4. **Mental-health offer band** (`section section-deep`, contact/CTA styling): title `Run a psychiatric or mental health practice?` Body: `We have a dedicated program for you, with a guarantee: 10 booked appointments in 90 days, or we work for free until you get them.` Links: `Link` to `/free-call` (`See the program`, `contact-book-btn` style or `ind-link` text style) and the standard `Book a Call` `contact-book-btn` on `BOOKING_URL`.
5. **Minimal footer**: same markup as FreeCall's footer (logo, domain, phone, privacy/terms links).

- [ ] **Step 2: Route** in App.tsx: `<Route path="/healthcare" element={<Healthcare />} />` + import.

- [ ] **Step 3: Verify + commit**

`npm run build`; confirm all six spec items present on the page (HIPAA/BAA, state rules, delegating physician, pixels/PHI, NP practices, healthcare FAQ). Commit: `feat: dedicated /healthcare page with compliance content and FAQ`.

### Task 6: Whole-site link + copy sweep

**Files:** none new; verification only, fixes inline if found.

- [ ] **Step 1:** `grep -rn "free-call\|/healthcare\|#industries" src/` — every internal link resolves: `/free-call` still routed, `/healthcare` routed, `#industries` section exists.
- [ ] **Step 2:** `grep -rniE "patient|practice|clinic|hipaa" src/components/sections/ src/pages/Home.tsx index.html` — remaining hits only where intended (FeatureBand? none found earlier; legal pages conditional language stays; Faq item 1 mentions practices in the industry list context, allowed).
- [ ] **Step 3:** `grep -rn "—" src/` — no em dashes in copy (code comments exempt but keep clean).
- [ ] **Step 4:** `npm run build` final; commit any sweep fixes: `chore: link and copy sweep after restructure`.

## Self-Review

- Spec coverage: Goal 1 → Tasks 1, 2, 3, 6 (hero, patients→customers, HowWeWork, nav rename, industries section). Goal 2 → Task 5 (all six healthcare content items). Goal 3 → Tasks 4 + 5 (FAQ split). Rules → Global Constraints. ✓
- Placeholders: none; all copy is written out. ✓
- Type consistency: `FaqEntry`/`items`/`title` defined in Task 4, consumed with same names in Task 5; `#industries` id defined in Task 2, consumed in Tasks 1 and 3. ✓
