/**
 * The niches Stay Booked serves — one per sales one-pager — and the
 * canonical data behind both the "Who we help" list (Industries.tsx), the
 * niche detail overlays, the site search, and the interactive Niche Explorer.
 *
 * Content mirrors the one-pagers: what we do, what we book, who gets the AI's
 * booking summary, the investment structure, and
 * what targeting gets tuned around. The demand curves are illustrative
 * seasonal patterns, used only to visualize "when your market books."
 */

export type Niche = {
  /** Stable id for chips and animations. */
  id: string
  /** Display name — matches the one-pager covers. */
  name: string
  /** One-line list description (also feeds site search). */
  desc: string
  /** Brief one-pager summary shown when the niche row is expanded. */
  summary: string
  /** Who it's for, from the one-pager. */
  examples: string
  /** "What we do" paragraph, one-pager voice. */
  whatWeDo: string
  /** The three things we book, from "driving ..." in each one-pager. */
  books: [string, string, string]
  /** Who receives the AI's real-time booking summary. */
  handoff: string
  /** Targeting/creative/messaging is tuned around... */
  tuned: string
  /** Keyword-targeted page title + meta description (search intent, per niche). */
  seo: { title: string; description: string }
  /** Retainer varies by... */
  varies: string
  /** Illustrative monthly demand, Jan → Dec, 0–100. */
  demand: number[]
  /** Dedicated page, if the niche has one (healthcare). */
  to?: string
  linkLabel?: string
}

export const NICHES: Niche[] = [
  {
    id: 'home-services',
    name: 'Home Services & Contractors',
    desc: 'Contractors, roofers, plumbers, electricians, HVAC, and remodelers: every trade that keeps homes running.',
    summary:
      'Targeted campaigns catch homeowners the moment something needs fixing, and our AI texts every lead within 5 minutes and books the estimate straight onto your crew\'s calendar.',
    examples: 'Contractors, trades, and home-service businesses',
    whatWeDo:
      'Homeowners don\'t shop around when a pipe bursts or the AC quits in July; they contact whoever shows up first on Google or Facebook. We put your trade in that spot, then our AI texts the lead back within five minutes, asks what your office would ask (address, problem, how soon), and drops the estimate onto your crew\'s calendar.',
    books: ['Estimate requests', 'Booked jobs', 'Service calls'],
    handoff: 'your office',
    tuned: 'your busy season, storm spikes, and slower weeks',
    varies: 'trade & season',
    demand: [55, 55, 62, 72, 86, 96, 100, 99, 92, 86, 84, 88],
    seo: { title: 'Home Services Marketing & Lead Generation for HVAC, Roofing, Plumbing & More | Stay Booked', description: "Lead generation for home service contractors: ads, automated follow-up, and booking for HVAC, roofing, plumbing, electrical, pool, pest control and remodeling companies." },
  },
  {
    id: 'clubs',
    name: 'Clubs & Nightlife',
    desc: 'Nightclubs and venues filling guest lists, VIP tables, and bottle service.',
    summary:
      'Ads in front of people deciding where to go out tonight, plus an AI that confirms guest-list signups and VIP tables in minutes, turning clicks into packed rooms.',
    examples: 'Nightclubs, lounges, and event venues',
    whatWeDo:
      'Most people pick a club the same night, on their phone, usually after 8pm. We run Instagram and Facebook ads around your featured nights and events, and when someone taps for the guest list or a table, our AI confirms party size and arrival time, then hands the booking to your VIP host.',
    books: ['Guest-list signups', 'VIP tables', 'Bottle service'],
    handoff: 'your VIP host',
    tuned: 'your big nights, slow midweeks, and featured events',
    varies: 'venue, nights & season',
    demand: [72, 70, 74, 74, 80, 90, 96, 100, 84, 80, 70, 95],
    seo: { title: 'Nightclub & Lounge Marketing: Packs the Room | Stay Booked', description: "Event promotion, guest-list automation and follow-up systems for nightclubs and lounges that want packed rooms every week." },
  },
  {
    id: 'legal',
    name: 'Law Firms',
    desc: 'Firms and solo attorneys who want a calendar of qualified consultations.',
    summary:
      'Case-type campaigns reach people the moment they need counsel, and AI intake qualifies and books the consult in under 5 minutes, before they call the firm down the street.',
    examples: 'Law firms and solo practitioners',
    whatWeDo:
      'Someone who needs a lawyer usually contacts two or three firms and hires the one that calls back first. Our Google and Meta campaigns are built per practice area, and our AI intake replies within minutes, screens for case type and timing, and books the consultation with your intake team.',
    books: ['Case evaluations', 'Consult requests', 'Intake appointments'],
    handoff: 'intake',
    tuned: 'your practice areas and intake capacity',
    varies: 'practice area & market',
    demand: [88, 72, 78, 76, 80, 74, 78, 76, 80, 78, 74, 70],
    seo: { title: 'Law Firm Marketing: Intake That Books More Cases | Stay Booked', description: "Lead generation for personal injury, family law, criminal defense, estate planning, immigration and business law firms." },
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Big Ticket',
    desc: 'High-consideration purchases: showroom visits, demos, and consults.',
    summary:
      'We capture high-intent buyers researching a big purchase, then our AI nurtures them across the 30-90 day decision window and books the private showroom or demo appointment.',
    examples: 'Showrooms, jewelers, autos, and premium retail',
    whatWeDo:
      'A buyer about to spend real money on jewelry, a car or a premium purchase researches for weeks before walking in. We keep your brand in front of them through that window with Meta and Google ads, and our AI answers their questions at any hour and books the showroom visit or demo when they\'re ready.',
    books: ['Showroom visits', 'Demos', 'Consults'],
    handoff: 'your sales team',
    tuned: 'your launch calendar and high-intent buying windows',
    varies: 'category & season',
    demand: [62, 58, 64, 70, 76, 82, 84, 88, 78, 84, 100, 100],
    seo: { title: 'Big-Ticket & Luxury Retail Marketing: Showroom Visits & Demos | Stay Booked', description: 'Lead generation for jewelers, auto dealers, showrooms and premium retail: reach buyers while they research, follow up in minutes, and book the showroom visit.' },
  },
  {
    id: 'finance',
    name: 'Financial Firms',
    desc: 'Advisors, planners, CPAs, and firms who want a calendar of qualified consults, with a compliance-first process.',
    summary:
      'Campaigns reach people the moment they need financial help (tax deadlines, retirement questions, new money), and AI books the discovery call in under 5 minutes, before they find the firm down the street.',
    examples: 'Financial advisors, planners, CPAs, and insurance agencies',
    whatWeDo:
      'People look for an advisor or CPA at predictable moments: tax season, a retirement date, an inheritance, the sale of a business. We time Google and Meta campaigns to those moments, keep the messaging inside the lines your compliance team sets, and our AI books the discovery call before they move on to the next firm.',
    books: ['Consult requests', 'Discovery calls', 'Portfolio reviews'],
    handoff: 'your advisor team',
    tuned: 'tax season, year-end planning, and your consult capacity',
    varies: 'practice & market',
    demand: [78, 88, 94, 96, 80, 66, 62, 60, 64, 70, 82, 90],
    seo: { title: 'Financial Advisor & CPA Marketing That Books Consults | Stay Booked', description: 'Compliance-aware lead generation for financial advisors, planners, CPAs and insurance agencies: ads, automated follow-up, and consult booking that fills your calendar.' },
  },
  {
    id: 'medical',
    name: 'Medical & Health',
    desc: 'Practices and clinics, with a compliance-first process built for regulated healthcare.',
    summary:
      'Compliance-first campaigns reach patients searching for care, with AI booking the appointment within minutes and reminders that cut no-shows. Built for regulated healthcare.',
    examples: 'Practices, clinics, and med spas',
    whatWeDo:
      'Patients looking for a dentist, med spa or specialist tend to book with the first practice that gets back to them. We run compliance-first campaigns, reply to every inquiry within minutes, book the new-patient visit, and send reminders so fewer people no-show. Our healthcare page explains how we handle patient data and advertising rules.',
    books: ['New-patient appointments', 'Consult requests', 'Booked visits'],
    handoff: 'your front desk',
    tuned: 'your clinic hours and high-demand appointment types',
    varies: 'specialty & market',
    demand: [96, 82, 84, 80, 78, 74, 78, 80, 84, 82, 80, 78],
    to: '/healthcare',
    linkLabel: 'See how we work with healthcare',
    seo: { title: 'Healthcare & Med Spa Marketing That Books Patients | Stay Booked', description: "Compliance-aware lead generation for dentists, orthodontists, med spas, chiropractors, physical therapy, dermatology, plastic surgery and concierge practices." },
  },
  {
    id: 'rentals',
    name: 'Rentals & Transactional',
    desc: 'Businesses that book and get paid online: tours, reservations, and checkout.',
    summary:
      'Ads catch people ready to reserve and drive direct bookings instead of paying 15-20% platform commissions, with AI answering quote requests 24/7.',
    examples: 'Property rentals, equipment, vehicles, and bookable services',
    whatWeDo:
      'Every booking that comes through a marketplace costs you a commission. We send people searching for a unit, a vehicle or a rental slot to your own booking page instead, and our AI answers quote requests around the clock so the reservation doesn\'t drift back to the platform.',
    books: ['Tours', 'Bookings', 'Rental inquiries'],
    handoff: 'your desk',
    tuned: 'availability, peak demand, and slower windows',
    varies: 'market & season',
    demand: [58, 56, 62, 70, 80, 92, 98, 96, 90, 88, 95, 100],
    seo: { title: 'Rental & Booking Marketing: More Direct Reservations | Stay Booked', description: 'Lead generation for property, equipment and vehicle rentals and other bookable services: direct bookings instead of marketplace commissions, with instant replies to quote requests.' },
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    desc: 'Reservations, private dining, and events, with fast sites and targeted ads.',
    summary:
      'Appetite-driven ads matched to the occasion turn scrolls into reservations, private-dining bookings, and events that land in your system with a phone number you keep.',
    examples: 'Restaurants and private-dining venues',
    whatWeDo:
      'Weeknight covers, private dining and holiday parties all start with someone deciding where to go, often the same day. We run food-first ads timed to your slow nights and events, and our AI handles private-dining and event inquiries so your host stand isn\'t stuck on the phone during service.',
    books: ['Reservations', 'Private dining', 'Event bookings'],
    handoff: 'your host stand',
    tuned: 'your slow nights, peak service, and private events',
    varies: 'service & season',
    demand: [86, 74, 80, 76, 82, 88, 92, 94, 84, 82, 88, 100],
    seo: { title: 'Restaurant Marketing & Private Dining Bookings | Stay Booked', description: "Marketing systems for restaurants and private dining: fill tables weeknights, book events and private dining with automated follow-up." },
  },
  {
    id: 'brand',
    name: 'Brand & Product Promotion',
    desc: 'Product launches with landing pages built to convert and ads on Meta and Google.',
    summary:
      'Launch campaigns built around a pre-sold waitlist and founder-led creative, with AI answering every question in real time while buying intent is hot.',
    examples: 'Brands launching products and running promos',
    whatWeDo:
      'A launch has a short window when people are curious enough to buy. We build the landing page, run founder-led creative on Meta and Google, and our AI answers product questions in real time, books demos and trial visits, and keeps the waitlist warm while interest is high.',
    books: ['Product trials', 'Demo days', 'In-store appointments'],
    handoff: 'your team',
    tuned: 'launches, drops, and promo windows',
    varies: 'campaign & season',
    demand: [66, 60, 56, 62, 72, 66, 60, 66, 76, 84, 100, 100],
    seo: { title: 'Brand & Product Promotion Campaigns | Stay Booked', description: "Launch and promotion campaigns for brands and products: multi-platform advertising, creative and automated follow-up that converts." },
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    desc: 'Realtors and listing agents turning buyer and seller interest into booked showings and consults.',
    summary:
      'Neighborhood farming and listing campaigns catch buyers early and route them to your listings, and our AI answers every inquiry in real time, booking showings and consults straight into your pipeline.',
    examples: 'Realtors, listing agents, and brokerages',
    whatWeDo:
      'You already get leads from Zillow; the hard part is reaching them before another agent does. Our listing and neighborhood campaigns find buyers and sellers earlier, and our AI replies to every inquiry in real time and books showings and listing appointments into the pipeline you already use.',
    books: ['Showing requests', 'Buyer consults', 'Listing appointments'],
    handoff: 'your phone',
    tuned: 'your listings, neighborhoods, and price bands',
    varies: 'market & listing volume',
    demand: [46, 52, 72, 82, 92, 96, 100, 92, 76, 68, 58, 48],
    seo: { title: 'Real Estate Marketing That Books Listings & Buyers | Stay Booked', description: "Lead generation for residential, luxury and brokerage real estate: seller and buyer campaigns with five-minute follow-up." },
  },
  {
    id: 'private-schools',
    name: 'Private Schools',
    desc: 'Private elementary, middle, and high schools filling campus tours, open houses, and admissions inquiries.',
    summary:
      'Campaigns that reach parents deciding where to enroll, right when they are weighing schools. Our AI books the campus tour and sends admissions a full summary, so no family slips away.',
    examples: 'Private elementary, middle, and high schools',
    whatWeDo:
      'Families compare schools months before enrollment deadlines, and the campus tour is usually where they decide. We run campaigns to parents during tour and open-house season, and our AI books the visit, answers common admissions questions, and sends your admissions team a summary of each family.',
    books: ['Campus tours', 'Open-house RSVPs', 'Admissions inquiries'],
    handoff: 'admissions',
    tuned: 'open houses, application deadlines, and grade-level openings',
    varies: 'school size & enrollment season',
    demand: [90, 86, 78, 68, 58, 48, 44, 76, 84, 82, 88, 72],
    seo: { title: 'Private School Marketing: More Campus Tours & Enrollments | Stay Booked', description: 'Lead generation for private elementary, middle and high schools: ads that reach parents deciding where to enroll, with AI follow-up that books the campus tour.' },
  },
]
