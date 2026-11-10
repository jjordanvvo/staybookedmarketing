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

/** Headline, used in the hero, footer, social previews and prerender. */
export const TAGLINE = ['We find your', 'customers.'] as const
export const TAGLINE_TEXT = TAGLINE.join(' ')

/** "What we do" on the home page: one line, then the three things that
 *  make it easy to say yes (all stated in the FAQ). */
export const WHAT_WE_DO = ['Ads', 'Follow-up', 'Websites', 'Software', 'Launches']
export const TERMS = ['No setup fee', 'No long contract', 'You own every account and lead']

/** Business finder: what the visitor wants more of. Each answer works for
 *  any business; `{biz}` becomes what they typed. */
export const GOALS = [
  {
    id: 'calls',
    label: 'more calls',
    answer: "We'd run search and social ads aimed at people already searching for what {biz} offers, and make sure every inquiry gets an answer within minutes.",
  },
  {
    id: 'bookings',
    label: 'more bookings',
    answer: "We'd fill the top with targeted ads, reply to every lead within minutes, qualify them and put the appointment straight on your calendar.",
  },
  {
    id: 'sales',
    label: 'more online sales',
    answer: "We'd point Meta and Google ads at a store built to convert, then follow up with the people who almost bought.",
  },
  {
    id: 'walkins',
    label: 'more foot traffic',
    answer: "We'd target people close to {biz} with an offer worth the trip, and track which ads actually bring them through the door.",
  },
  {
    id: 'launch',
    label: 'a product launch',
    answer: "We'd build the landing page, the creative and the paid campaign for the launch, then keep tuning it once it's live.",
  },
  {
    id: 'custom',
    label: 'something built',
    answer: 'Websites, apps, internal tools, automations. If {biz} needs it built, tell us about it on a short call.',
  },
] as const

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
