/**
 * The niches Stay Booked serves — one per sales one-pager — and the
 * canonical data behind both the "Who we help" list (Industries.tsx), the
 * niche detail overlays, the site search, and the interactive Niche Explorer.
 *
 * Content mirrors the one-pagers: what we do, what we book, who gets the AI's
 * booking summary, the investment structure, the performance guarantee, and
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
  /** Who it's for, from the one-pager. */
  examples: string
  /** "What we do" paragraph, one-pager voice. */
  whatWeDo: string
  /** The three things we book, from "driving ..." in each one-pager. */
  books: [string, string, string]
  /** Who receives the AI's real-time booking summary. */
  handoff: string
  /** The guaranteed deliverable from the one-pager guarantee. */
  guarantee: string
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
    desc: 'Contractors, roofers, plumbers, electricians, HVAC, remodelers — every trade that keeps homes running.',
    examples: 'Contractors, trades, and home-service businesses',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving estimate requests and booked jobs to your crew. We target the exact homeowners searching for help, right when something needs to get done. Our AI qualifies, contacts, and books the estimate, turning clicks into scheduled work.',
    books: ['Estimate requests', 'Booked jobs', 'Service calls'],
    handoff: 'your office',
    guarantee: 'qualified estimate requests',
    tuned: 'your busy season, storm spikes, and slower weeks',
    varies: 'trade & season',
    demand: [55, 55, 62, 72, 86, 96, 100, 99, 92, 86, 84, 88],
    seo: { title: 'Home Services Marketing & Lead Generation for HVAC, Roofing, Plumbing & More | Stay Booked', description: "Lead generation for home service contractors: ads, automated follow-up, and booking for HVAC, roofing, plumbing, electrical, pool, pest control and remodeling companies." },
  },
  {
    id: 'clubs',
    name: 'Clubs & Nightlife',
    desc: 'Nightclubs and venues filling guest lists, VIP tables, and bottle service.',
    examples: 'Nightclubs, lounges, and event venues',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving guest-list signups, VIP table reservations, and bottle-service bookings to your nightclub. We target the exact people looking for a night out, right when they are deciding where to go. Our AI qualifies, contacts, and books the table, turning clicks into packed rooms.',
    books: ['Guest-list signups', 'VIP tables', 'Bottle service'],
    handoff: 'your VIP host',
    guarantee: 'qualified VIP and bottle-service bookings',
    tuned: 'your big nights, slow midweeks, and featured events',
    varies: 'venue, nights & season',
    demand: [72, 70, 74, 74, 80, 90, 96, 100, 84, 80, 70, 95],
    seo: { title: 'Nightclub & Lounge Marketing: Packs the Room | Stay Booked', description: "Event promotion, guest-list automation and follow-up systems for nightclubs and lounges that want packed rooms every week." },
  },
  {
    id: 'legal',
    name: 'Law Firms',
    desc: 'Firms and solo attorneys who want a calendar of qualified consultations.',
    examples: 'Law firms and solo practitioners',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving case evaluations and consult requests to your firm. We target the exact people searching for counsel, right when they need an attorney. Our AI qualifies, contacts, and books the consult, turning clicks into intake appointments.',
    books: ['Case evaluations', 'Consult requests', 'Intake appointments'],
    handoff: 'intake',
    guarantee: 'qualified consults',
    tuned: 'your practice areas and intake capacity',
    varies: 'practice area & market',
    demand: [88, 72, 78, 76, 80, 74, 78, 76, 80, 78, 74, 70],
    seo: { title: 'Law Firm Marketing: Intake That Books More Cases | Stay Booked', description: "Lead generation for personal injury, family law, criminal defense, estate planning, immigration and business law firms." },
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Big Ticket',
    desc: 'High-consideration purchases: showroom visits, demos, and consults.',
    examples: 'Showrooms, jewelers, autos, and premium retail',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving showroom visits, demos, and consults for high-consideration purchases. We target the exact people researching the buy, right when they are deciding who to trust. Our AI qualifies, contacts, and books the appointment, turning clicks into in-person conversations.',
    books: ['Showroom visits', 'Demos', 'Consults'],
    handoff: 'your sales team',
    guarantee: 'qualified appointments',
    tuned: 'your launch calendar and high-intent buying windows',
    varies: 'category & season',
    demand: [62, 58, 64, 70, 76, 82, 84, 88, 78, 84, 100, 100],
    seo: { title: 'Big-Ticket Lifestyle Marketing: Weddings, Venues & Charters | Stay Booked', description: "Marketing for wedding venues, event venues, yacht charters and premium experiences: reach high-intent buyers, follow up in minutes, book the date." },
  },
  {
    id: 'medical',
    name: 'Medical & Health',
    desc: 'Practices and clinics, with a compliance-first process built for regulated healthcare.',
    examples: 'Practices, clinics, and med spas',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving new-patient appointments and consult requests to your practice. We target the exact people searching for care, right when they are deciding who to see. Our AI qualifies, contacts, and books the appointment, turning clicks into filled chairs.',
    books: ['New-patient appointments', 'Consult requests', 'Booked visits'],
    handoff: 'your front desk',
    guarantee: 'qualified appointments',
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
    examples: 'Property rentals, equipment, vehicles, and bookable services',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving tours, bookings, and rental inquiries to your team. We target the exact people searching for a unit, vehicle, or time slot, right when they are ready to reserve. Our AI qualifies, contacts, and books the appointment, turning clicks into confirmed reservations.',
    books: ['Tours', 'Bookings', 'Rental inquiries'],
    handoff: 'your desk',
    guarantee: 'qualified booking requests',
    tuned: 'availability, peak demand, and slower windows',
    varies: 'market & season',
    demand: [58, 56, 62, 70, 80, 92, 98, 96, 90, 88, 95, 100],
    seo: { title: 'Marketing for Movers, Rentals & Transactional Services | Stay Booked', description: "Lead generation for movers, equipment rental, vacation rentals and car rental businesses: instant follow-up that turns inquiries into bookings." },
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    desc: 'Reservations, private dining, and events, with fast sites and targeted ads.',
    examples: 'Restaurants and private-dining venues',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving reservations, private dining, and event bookings to your restaurant. We target the exact people deciding where to eat, right when they are ready to book. Our AI qualifies, contacts, and books the table, turning clicks into filled seats.',
    books: ['Reservations', 'Private dining', 'Event bookings'],
    handoff: 'your host stand',
    guarantee: 'qualified reservations',
    tuned: 'your slow nights, peak service, and private events',
    varies: 'service & season',
    demand: [86, 74, 80, 76, 82, 88, 92, 94, 84, 82, 88, 100],
    seo: { title: 'Restaurant Marketing & Private Dining Bookings | Stay Booked', description: "Marketing systems for restaurants and private dining: fill tables weeknights, book events and private dining with automated follow-up." },
  },
  {
    id: 'brand',
    name: 'Brand & Product Promotion',
    desc: 'Product launches with landing pages built to convert and ads on Meta and Google.',
    examples: 'Brands launching products and running promos',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook, driving product trials, demo days, and in-store appointments. We target the exact people discovering the brand, right when they are deciding what to try next. Our AI qualifies, contacts, and books the visit, turning clicks into real product conversations.',
    books: ['Product trials', 'Demo days', 'In-store appointments'],
    handoff: 'your team',
    guarantee: 'qualified product appointments',
    tuned: 'launches, drops, and promo windows',
    varies: 'campaign & season',
    demand: [66, 60, 56, 62, 72, 66, 60, 66, 76, 84, 100, 100],
    seo: { title: 'Brand & Product Promotion Campaigns | Stay Booked', description: "Launch and promotion campaigns for brands and products: multi-platform advertising, creative and automated follow-up that converts." },
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    desc: 'Realtors and listing agents turning buyer and seller interest into booked showings and consults.',
    examples: 'Realtors, listing agents, and brokerages',
    whatWeDo:
      'We run high-converting campaigns across Google, Instagram, and Facebook that put your listings in front of buyers the moment they start searching. You already live on Zillow, and we build on that: our ads catch buyers early, route them to your listings and your calendar, and our AI answers every inquiry in real time. The result: showing requests and buyer consults booked automatically, flowing straight into the pipeline you already run.',
    books: ['Showing requests', 'Buyer consults', 'Listing appointments'],
    handoff: 'your phone',
    guarantee: 'qualified showing requests',
    tuned: 'your listings, neighborhoods, and price bands',
    varies: 'market & listing volume',
    demand: [46, 52, 72, 82, 92, 96, 100, 92, 76, 68, 58, 48],
    seo: { title: 'Real Estate Marketing That Books Listings & Buyers | Stay Booked', description: "Lead generation for residential, luxury and brokerage real estate: seller and buyer campaigns with five-minute follow-up." },
  },
]

/** The universal speed-to-lead stats every one-pager leads with — the
 *  comparison itself: our 5-minute AI contact vs. a reply 30 minutes later. */
export const SPEED_STATS = [
  { value: 5, suffix: ' min', label: 'every inquiry contacted within — versus the 30-minute-later industry norm' },
  { value: 100, suffix: 'x', label: 'more likely to be reached than a lead contacted 30 minutes later' },
  { value: 21, suffix: 'x', label: 'more likely to be qualified than a lead contacted 30 minutes later' },
]

/** Investment, identical structure in every one-pager. */
export const INVESTMENT = {
  adSpend: 1500,
  retainer: 2000,
}
