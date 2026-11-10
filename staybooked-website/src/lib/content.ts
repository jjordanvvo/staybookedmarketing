/** Site copy and contact details in one place. The home page, the side pages
 *  and the prerender script all read from here, so wording never drifts. */

export const PHONE_DISPLAY = '(813) 480-5818'
export const PHONE_TEL = 'tel:+18134805818'
export const EMAIL = 'kolby@staybookedmarketing.com'

/** Every founder inbox. The contact form copies all of them. */
export const TEAM_EMAILS = [
  'kolby@staybookedmarketing.com',
  'jordan@staybookedmarketing.com',
  'austin@staybookedmarketing.com',
  'trevor@staybookedmarketing.com',
  'jordanniles@staybookedmarketing.com',
]

/** The home page leads with the visitor's problem, then our answer. */
export const PROBLEMS = [
  {
    problem: "The phone isn't ringing enough.",
    answer: 'We run your ads on Google, Meta and social, aimed at people already looking for what you sell.',
    service: 'Advertising',
  },
  {
    problem: 'Leads come in and go cold.',
    answer: 'Every new lead gets a reply in minutes, day or night. We qualify them and book them onto your calendar.',
    service: 'Follow-up and booking',
  },
  {
    problem: "Your website isn't bringing anyone in.",
    answer: 'We design and build fast sites in-house, made to turn a visit into a call.',
    service: 'Websites',
  },
  {
    problem: 'Too much of the week is busywork.',
    answer: 'Custom software and automation for the repetitive parts of running your business.',
    service: 'Software',
  },
]

export const SERVICES = [
  {
    num: '01',
    name: 'Lead Generation Systems',
    desc: 'The whole path from first click to booked appointment: campaigns, landing pages, automated qualification and follow-up that runs without you.',
  },
  {
    num: '02',
    name: 'Multi-Platform Advertising',
    desc: 'Meta, Google and social, managed as one system. Creative, targeting, budget and testing, with leads answered in seconds instead of hours.',
  },
  {
    num: '03',
    name: 'Software Development',
    desc: 'Websites, web apps and custom tools built in-house. Fast, clean and built to convert.',
  },
]

/** The three moves behind every account (kept for search engines). */
export const HOW_STEPS = [
  { num: '01', word: 'Advertise', desc: 'Campaigns that put you in front of local customers already looking for what you offer.' },
  { num: '02', word: 'Qualify', desc: 'Every lead is contacted and screened the moment it comes in.' },
  { num: '03', word: 'Book', desc: 'Interested customers land on your calendar, ready for the appointment.' },
]

/** Working together, from first call onward. */
export const PLAN_STEPS = [
  { num: '01', name: 'A short call', desc: 'Fifteen minutes on your business, your goals and what a new customer is worth to you.' },
  { num: '02', name: 'We build it', desc: 'Ads, follow-up and booking, set up for your business. Usually live within days.' },
  { num: '03', name: 'Customers book', desc: 'Leads get answered in minutes and land on your calendar.' },
  { num: '04', name: 'We keep tuning', desc: 'We review the numbers with you every month and keep improving what works.' },
]
