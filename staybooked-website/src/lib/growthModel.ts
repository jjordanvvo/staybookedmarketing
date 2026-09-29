/**
 * growthModel — the Stay Booked Growth Calculator's single source of truth.
 *
 * Everything Trevor's spec pins down lives here: the benchmark table (copied
 * from the published projection canvases), the fixed program costs, the ramp
 * schedules, the per-trade question wording, and the projection math.
 * No component redefines any of these numbers.
 */

/* ------------------------------------------------------------------ */
/* Program config — fixed for every prospect                           */
/* ------------------------------------------------------------------ */

export const PROGRAM = {
  adSpend: 1500,      // $/mo in paid media
  retainer: 2000,     // $/mo Stay Booked fee
  costMonthly: 3500,  // ad spend + retainer
  costYearly: 42000,  // 12 × program cost
} as const

/* ------------------------------------------------------------------ */
/* Industry benchmarks — straight from the published projection canvases */
/* ------------------------------------------------------------------ */

export interface Benchmarks {
  /** Cost per lead, dollars (LocaliQ / WordStream 2026 blends) */
  cpl: number
  /** Lead-to-client rate when a lead is answered within 5 minutes */
  fastRate: number
  /** Lead-to-client rate at an average follow-up speed */
  avgRate: number
  /** New-client ramp by month, index 0 = month 1. Standard: 30/60/90/100%. */
  ramp: number[]
  /** Year-one ramp multiplier (standard 10.8; real estate 8.5) */
  yearMultiplier: number
  /** Footer credit line naming the canvas / sources the numbers come from */
  builtFrom: string
}

const STANDARD_RAMP = [0.3, 0.6, 0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1]
const REAL_ESTATE_RAMP = [0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1, 1, 1, 1]

export const GROUPS: Record<string, Benchmarks> = {
  'Medical & Health': {
    cpl: 37.5, fastRate: 0.51, avgRate: 0.255,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'Medical projection canvas — LocaliQ search benchmarks',
  },
  'Home Services': {
    cpl: 41.67, fastRate: 0.175, avgRate: 0.0875,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'Home Services projection canvas — LocaliQ search benchmarks',
  },
  Legal: {
    cpl: 60, fastRate: 0.21, avgRate: 0.14,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'Legal projection canvas — LocaliQ search benchmarks',
  },
  'Financial Services': {
    cpl: 50, fastRate: 0.2, avgRate: 0.05,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'LEGACI projection canvas — LocaliQ benchmarks',
  },
  'Real Estate': {
    cpl: 30, fastRate: 0.03, avgRate: 0.01,
    ramp: REAL_ESTATE_RAMP, yearMultiplier: 8.5,
    builtFrom: 'LocaliQ Facebook/search lead costs; NAR & Ylopo close rates',
  },
  'Lifestyle & Big-Ticket': {
    cpl: 30, fastRate: 0.1785, avgRate: 0.0595,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'Lifestyle projection canvas — LocaliQ benchmarks',
  },
  'Rentals & Transactional': {
    cpl: 25, fastRate: 0.4, avgRate: 0.28,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'Rentals projection canvas — LocaliQ benchmarks',
  },
  Clubs: {
    cpl: 18.75, fastRate: 0.25, avgRate: 0.12,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'Clubs projection canvas — LocaliQ Facebook benchmarks',
  },
  Restaurants: {
    cpl: 5.77, fastRate: 0.3, avgRate: 0.15,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'Restaurants projection canvas — LocaliQ benchmarks',
  },
  Other: {
    cpl: 47, fastRate: 0.175, avgRate: 0.0875,
    ramp: STANDARD_RAMP, yearMultiplier: 10.8,
    builtFrom: 'All-industry average cost per lead — LocaliQ / WordStream 2026',
  },
}

/* ------------------------------------------------------------------ */
/* Trades — 42 of them, grouped by industry                            */
/* ------------------------------------------------------------------ */

export interface Trade {
  /** Dropdown label */
  label: string
  group: string
  /** Unit noun used across the results page ("case", "install") */
  unit: string
  /** Q4 — money per job (per-trade wording) */
  q4: string
  /** Q5 — cost per job (or take-home for commission trades) */
  q5: string
  /** Q6 — volume in a typical month (or year, for real estate) */
  q6: string
  /** Commission trades are asked what they take home, not what they pay out */
  commission?: boolean
  /** Repeat trades: a new client is worth more than one transaction. The
   *  perYear factor is the new client's average transactions (or months of
   *  service) in their first year — the projection counts that first-year
   *  value, never just the first job. Disclosed on the results page. */
  repeat?: { perYear: number; note: string }
  /** Optional variance note appended under the money questions */
  varies?: string
  /** Real estate trades think in annual closings */
  perYear?: boolean
}

export const TRADES: Trade[] = [
  // Medical & Health
  { label: 'Dentist', group: 'Medical & Health', unit: 'patient',
    q4: 'What is your average revenue from a new patient?',
    q5: 'On average, what does it cost your practice to serve a new patient?',
    q6: 'How many new patients do you see in a typical month?' },
  { label: 'Orthodontist', group: 'Medical & Health', unit: 'patient',
    q4: 'What is your average revenue from a new case?',
    q5: 'On average, what does it cost your practice to work a case?',
    q6: 'How many new cases do you start in a typical month?' },
  { label: 'Med spa / aesthetics', group: 'Medical & Health', unit: 'client',
    q4: 'What is your average ticket for a new client?',
    q5: 'On average, what does it cost you to deliver a new client\u2019s treatments?',
    q6: 'How many new clients do you sign in a typical month?',
    repeat: { perYear: 2, note: 'aesthetic clients typically re-book treatments through their first year' },
  },
  { label: 'Chiropractor', group: 'Medical & Health', unit: 'patient',
    q4: 'What is your average revenue from a new patient?',
    q5: 'On average, what does it cost you to serve a new patient\u2019s care plan?',
    q6: 'How many new patients do you start in a typical month?' },
  { label: 'Physical therapy', group: 'Medical & Health', unit: 'patient',
    q4: 'What is your average revenue from a new patient\u2019s plan of care?',
    q5: 'On average, what does it cost your clinic to deliver a plan of care?',
    q6: 'How many new patients do you start in a typical month?' },
  { label: 'Dermatology', group: 'Medical & Health', unit: 'patient',
    q4: 'What is your average revenue from a new patient?',
    q5: 'On average, what does it cost your practice to treat a new patient?',
    q6: 'How many new patients do you see in a typical month?',
    repeat: { perYear: 1.8, note: 'cosmetic and follow-up visits bring patients back several times in year one' },
  },
  { label: 'Plastic surgery', group: 'Medical & Health', unit: 'procedure',
    q4: 'What is your average fee for a procedure?',
    q5: 'On average, what does it cost your practice to perform a procedure?',
    q6: 'How many procedures do you book in a typical month?',
    varies: 'Totals vary by procedure; a typical procedure is fine.' },
  { label: 'Primary or concierge care', group: 'Medical & Health', unit: 'patient',
    q4: 'What is your average revenue from a new member or patient?',
    q5: 'On average, what does it cost you to serve a new member for their first year?',
    q6: 'How many new members or patients do you sign in a typical month?' },

  // Home Services
  { label: 'Turf installation', group: 'Home Services', unit: 'install',
    q4: 'What is your average revenue per install?',
    q5: 'On average, what does an install cost you in materials and labor?',
    q6: 'How many installs do you complete in a typical month?' },
  { label: 'Landscaping', group: 'Home Services', unit: 'project',
    q4: 'What is your average revenue per project or contract?',
    q5: 'On average, what does a project cost you in crew, materials and equipment?',
    q6: 'How many projects do you sign in a typical month?',
    repeat: { perYear: 1.5, note: 'install clients usually add maintenance work through the year' },
  },
  { label: 'Roofing', group: 'Home Services', unit: 'job',
    q4: 'What is your average revenue per roof?',
    q5: 'On average, what does a roof cost you in materials and labor?',
    q6: 'How many roofs do you sell in a typical month?' },
  { label: 'HVAC', group: 'Home Services', unit: 'system',
    q4: 'What is your average revenue per system or service job?',
    q5: 'On average, what does a job cost you in parts and labor?',
    q6: 'How many jobs do you book in a typical month?',
    repeat: { perYear: 1.5, note: 'new customers typically add maintenance visits or a service plan in year one' },
  },
  { label: 'Plumbing', group: 'Home Services', unit: 'job',
    q4: 'What is your average revenue per job?',
    q5: 'On average, what does a job cost you in parts and labor?',
    q6: 'How many jobs do you book in a typical month?',
    repeat: { perYear: 2.2, note: 'a customer who finds a plumber they trust calls back for water heaters, re-pipes and add-on work in year one' },
  },
  { label: 'Electrical', group: 'Home Services', unit: 'job',
    q4: 'What is your average revenue per job?',
    q5: 'On average, what does a job cost you in materials and labor?',
    q6: 'How many jobs do you book in a typical month?',
    repeat: { perYear: 2.2, note: 'new customers commonly come back for panel upgrades, EV chargers and fixture work within the first year' },
  },
  { label: 'Pool service', group: 'Home Services', unit: 'customer',
    q4: 'What is your average revenue per customer, per month?',
    q5: 'On average, what does each customer cost you per month to service?',
    q6: 'How many customers do you sign in a typical month?',
    repeat: { perYear: 12, note: 'a new pool customer is a recurring monthly account, twelve months a year' },
  },
  { label: 'Pest control', group: 'Home Services', unit: 'customer',
    q4: 'What is your average revenue per customer, per year?',
    q5: 'On average, what does each customer cost you per year to service?',
    q6: 'How many customers do you sign in a typical month?',
    repeat: { perYear: 2.5, note: 'year one includes the initial treatment, the recurring plan and common yard add-ons' },
  },
  { label: 'Remodeling', group: 'Home Services', unit: 'project',
    q4: 'What is your average revenue per project?',
    q5: 'On average, what does a project cost you in materials and labor?',
    q6: 'How many projects do you sell in a typical month?',
    varies: 'Totals vary by scope; a typical project is fine.' },
  { label: 'Solar', group: 'Home Services', unit: 'install',
    q4: 'What is your average revenue per install?',
    q5: 'On average, what does an install cost you in panels, labor and permits?',
    q6: 'How many installs do you close in a typical month?',
    varies: 'Totals vary by system size; a typical install is fine.' },

  // Legal
  { label: 'Personal injury', group: 'Legal', unit: 'case',
    q4: 'What is your average fee on a settled case?',
    q5: 'On average, how much does it cost your firm to work a case?',
    q6: 'How many new cases do you sign in a typical month?' },
  { label: 'Family law', group: 'Legal', unit: 'case',
    q4: 'What is your average fee on a case?',
    q5: 'On average, how much does it cost your firm to work a case?',
    q6: 'How many new cases do you sign in a typical month?' },
  { label: 'Criminal defense', group: 'Legal', unit: 'case',
    q4: 'What is your average fee on a case?',
    q5: 'On average, how much does it cost your firm to work a case?',
    q6: 'How many new cases do you sign in a typical month?' },
  { label: 'Estate planning', group: 'Legal', unit: 'client',
    q4: 'What is your average fee per client or engagement?',
    q5: 'On average, how much does it cost your firm to handle an engagement?',
    q6: 'How many new clients do you sign in a typical month?' },
  { label: 'Immigration', group: 'Legal', unit: 'case',
    q4: 'What is your average fee on a case?',
    q5: 'On average, how much does it cost your firm to work a case?',
    q6: 'How many new cases do you sign in a typical month?' },
  { label: 'Business law', group: 'Legal', unit: 'client',
    q4: 'What is your average fee per client or engagement?',
    q5: 'On average, how much does it cost your firm to handle an engagement?',
    q6: 'How many new clients do you sign in a typical month?' },

  // Financial Services
  { label: 'Life insurance agent', group: 'Financial Services', unit: 'policy',
    q4: 'What is your average commission per policy?',
    q5: 'After your upline or agency split, how much do you take home per policy, on average?',
    q6: 'How many policies do you write in a typical month?',
    commission: true,
    repeat: { perYear: 2, note: 'households commonly add policies for a spouse or kids, plus riders, in the first year' } },
  { label: 'Financial advisor', group: 'Financial Services', unit: 'client',
    q4: 'What is your average first-year revenue from a new client?',
    q5: 'On average, what does it cost you to acquire and onboard a new client?',
    q6: 'How many new clients do you sign in a typical month?',
  },
  { label: 'Mortgage broker', group: 'Financial Services', unit: 'loan',
    q4: 'What is your average commission per loan?',
    q5: 'After your branch or broker split, how much do you take home per loan, on average?',
    q6: 'How many loans do you close in a typical month?',
    commission: true },

  // Real Estate
  { label: 'Residential real estate agent', group: 'Real Estate', unit: 'closing',
    q4: 'What is your average commission per closing?',
    q5: 'After your brokerage split and fees, how much do you take home per closing, on average?',
    q6: 'How many transactions do you close in a typical year?',
    commission: true, perYear: true },
  { label: 'Luxury real estate agent', group: 'Real Estate', unit: 'closing',
    q4: 'What is your average commission per closing?',
    q5: 'After your brokerage split and fees, how much do you take home per closing, on average?',
    q6: 'How many transactions do you close in a typical year?',
    commission: true, perYear: true,
    varies: 'Totals vary by property; a typical closing is fine.' },
  { label: 'Real estate team or brokerage', group: 'Real Estate', unit: 'closing',
    q4: 'What is your average gross commission per closing?',
    q5: 'After splits and fees, how much does the team take home per closing, on average?',
    q6: 'How many transactions does the team close in a typical year?',
    commission: true, perYear: true },

  // Lifestyle & Big-Ticket
  { label: 'Wedding venue', group: 'Lifestyle & Big-Ticket', unit: 'wedding',
    q4: 'What is your average revenue per wedding?',
    q5: 'On average, what does a wedding cost you to host?',
    q6: 'How many weddings do you book in a typical month?',
    varies: 'Totals vary by season and package; a typical wedding is fine.' },
  { label: 'Event venue', group: 'Lifestyle & Big-Ticket', unit: 'event',
    q4: 'What is your average revenue per event?',
    q5: 'On average, what does an event cost you to host?',
    q6: 'How many events do you book in a typical month?',
    varies: 'Totals vary by event type; a typical event is fine.' },
  { label: 'Boat or yacht charter', group: 'Lifestyle & Big-Ticket', unit: 'charter',
    q4: 'What is your average revenue per charter?',
    q5: 'On average, what does a charter cost you to run?',
    q6: 'How many charters do you book in a typical month?',
    varies: 'Totals vary by vessel and trip length; a typical charter is fine.' },
  { label: 'Premium experiences', group: 'Lifestyle & Big-Ticket', unit: 'booking',
    q4: 'What is your average revenue per booking?',
    q5: 'On average, what does a booking cost you to deliver?',
    q6: 'How many bookings do you take in a typical month?',
    varies: 'Totals vary by experience; a typical booking is fine.',
    repeat: { perYear: 1.6, note: 'experience buyers commonly rebook or gift again within the year' },
  },

  // Rentals & Transactional
  { label: 'Movers', group: 'Rentals & Transactional', unit: 'move',
    q4: 'What is your average revenue per move?',
    q5: 'On average, what does a move cost you in crew, trucks and fuel?',
    q6: 'How many moves do you book in a typical month?' },
  { label: 'Equipment rental', group: 'Rentals & Transactional', unit: 'rental',
    q4: 'What is your average revenue per rental?',
    q5: 'On average, what does each rental cost you?',
    q6: 'How many rentals do you book in a typical month?',
    varies: 'Totals vary by equipment and days; a typical rental is fine.',
    repeat: { perYear: 2, note: 'renters come back for the next project, repeat rental business is the norm' },
  },
  { label: 'Vacation rental', group: 'Rentals & Transactional', unit: 'stay',
    q4: 'What is your average revenue per stay?',
    q5: 'On average, what does each stay cost you in cleaning, fees and upkeep?',
    q6: 'How many stays do you book in a typical month?' },
  { label: 'Car or exotic rental', group: 'Rentals & Transactional', unit: 'rental',
    q4: 'What is the average value of a rental?',
    q5: 'On average, how much does each rental cost you?',
    q6: 'How many rentals do you book in a typical month?',
    varies: 'Totals vary by vehicle and number of days; a typical rental is fine.',
    repeat: { perYear: 1.5, note: 'specialty renters commonly rebook within the year' },
  },

  // Clubs
  { label: 'Nightclub', group: 'Clubs', unit: 'table booking',
    q4: 'What is your average spend per table booking?',
    q5: 'On average, what does a table booking cost you to host?',
    q6: 'How many table bookings do you take in a typical month?',
    repeat: { perYear: 2, note: 'table guests who have a great night rebook through the year' },
  },
  { label: 'Lounge', group: 'Clubs', unit: 'table booking',
    q4: 'What is your average spend per table booking?',
    q5: 'On average, what does a table booking cost you to host?',
    q6: 'How many table bookings do you take in a typical month?',
    repeat: { perYear: 2, note: 'bottle-service regulars rebook through the year' },
  },

  // Restaurants
  { label: 'Restaurant', group: 'Restaurants', unit: 'reservation',
    q4: 'What is the average check for a reservation?',
    q5: 'On average, what does it cost to serve a reservation?',
    q6: 'How many reservations do you receive in a typical month?',
    repeat: { perYear: 2.4, note: 'new guests who like you come back, year-one repeat visits are the industry norm' },
  },
  { label: 'Private dining & events', group: 'Restaurants', unit: 'private event',
    q4: 'What is your average revenue per private event?',
    q5: 'On average, what does a private event cost you to host?',
    q6: 'How many private events do you book in a typical month?',
    varies: 'Totals vary by party size; a typical event is fine.' },

  // Other
  { label: 'Something else', group: 'Other', unit: 'client',
    q4: 'What is your average revenue from a new client or job?',
    q5: 'On average, what does one job or client cost you to serve?',
    q6: 'How many new clients or jobs do you sign in a typical month?' },
]

/** Dropdown ordering, grouped exactly as the spec lays it out. */
export const GROUP_ORDER = [
  'Medical & Health', 'Home Services', 'Legal', 'Financial Services',
  'Real Estate', 'Lifestyle & Big-Ticket', 'Rentals & Transactional',
  'Clubs', 'Restaurants', 'Other',
]

export const SPEED_OPTIONS = [
  'Under 5 minutes',
  'Within an hour',
  'Same day',
  'Next day or later',
  'Not sure',
] as const

/* ------------------------------------------------------------------ */
/* Math                                                               */
/* ------------------------------------------------------------------ */

export interface CalcInput {
  trade: Trade
  price: number
  /** What Q5 collected: cost per job, or take-home for commission trades */
  q5Value: number
  clientsPerMonth: number
  speed: string
}

export interface Projection {
  group: Benchmarks
  /** price − cost (for commission trades, the take-home entered) */
  profitPerClient: number
  /** first-year value of one NEW client (profit per client × repeat factor) */
  newValue: number
  profitToday: number
  leads: number
  newClients: number
  clientsFull: number
  profitFull: number
  addedProfit: number
  newClients6: number
  addedProfit6: number
  newClients12: number
  profit12: number
  leftAfter12: number
  backPerDollar: number
  breakEven: number
  /** cumulative arrays, index 0 = month 1 */
  greyLine: number[]
  emeraldLine: number[]
  multiple: number
  /** same leads, their current speed (null if they already answer in 5 min) */
  currentSpeedClients: number | null
}

export function computeProjection(input: CalcInput): Projection {
  const { trade, price, q5Value, clientsPerMonth, speed } = input
  const group = GROUPS[trade.group]
  const profitPerClient = trade.commission ? q5Value : price - q5Value
  const profitToday = clientsPerMonth * profitPerClient

  // New clients are valued across their first year where the trade repeats:
  // a returning diner, a service plan, a rebooked table. The prospect's own
  // existing clients keep the plain per-unit basis — we never touch those.
  const repeat = trade.repeat?.perYear ?? 1
  const newValue = profitPerClient * repeat

  const leads = PROGRAM.adSpend / group.cpl
  const newClients = leads * group.fastRate
  const clientsFull = clientsPerMonth + newClients
  const profitFull = profitToday + newClients * newValue - PROGRAM.costMonthly
  const addedProfit = profitFull - profitToday

  const ramp6 = group.ramp.slice(0, 6).reduce((a, b) => a + b, 0)
  const newClients6 = newClients * ramp6
  const addedProfit6 = newClients6 * newValue - 6 * PROGRAM.costMonthly

  const newClients12 = newClients * group.yearMultiplier
  const profit12 = newClients12 * newValue
  const leftAfter12 = profit12 - PROGRAM.costYearly
  const backPerDollar = profit12 / PROGRAM.costYearly
  const breakEven = PROGRAM.costMonthly / newValue

  // Chart: cumulative profit, months 1–12
  const greyLine: number[] = []
  const emeraldLine: number[] = []
  let emeraldCum = 0
  for (let m = 1; m <= 12; m++) {
    greyLine.push(m * profitToday)
    const rampM = group.ramp[m - 1] ?? 1
    emeraldCum += newClients * rampM * newValue - PROGRAM.costMonthly
    emeraldLine.push(m * profitToday + emeraldCum)
  }
  const multiple = greyLine[11] > 0 ? emeraldLine[11] / greyLine[11] : emeraldLine[11] > 0 ? Infinity : 0

  const currentSpeedClients =
    speed === 'Under 5 minutes' ? null : leads * group.avgRate

  return {
    group, profitPerClient, newValue, profitToday, leads, newClients, clientsFull,
    profitFull, addedProfit, newClients6, addedProfit6, newClients12,
    profit12, leftAfter12, backPerDollar, breakEven,
    greyLine, emeraldLine, multiple, currentSpeedClients,
  }
}

/* ------------------------------------------------------------------ */
/* Rounding & formatting                                               */
/* ------------------------------------------------------------------ */

/** Dollars to the nearest $100 — nearest $1,000 above $100,000. */
export function fmtUSD(n: number): string {
  const neg = n < 0
  const a = Math.abs(n)
  const r = a > 100000 ? Math.round(a / 1000) * 1000 : Math.round(a / 100) * 100
  return (neg ? '\u2212$' : '$') + r.toLocaleString('en-US')
}

/** Clients as a whole count, "about 12". */
export function fmtClients(n: number): string {
  return 'about ' + Math.round(n).toLocaleString('en-US')
}

/** The plural of a trade unit: "case" → "cases", "system" → "systems". */
export function plural(unit: string, n: number): string {
  if (n === 1) return unit
  if (unit === 'table booking') return 'table bookings'
  return unit + 's'
}
