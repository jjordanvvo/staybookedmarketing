/**
 * The example week drawn in the hero planner. Illustrative, not client data:
 * each entry is one lead that came in from an ad, got a reply, and landed on
 * the calendar. Services mirror the niches in niches.ts.
 *
 * Time is measured in business hours from Monday 8:00 am: the planner shows
 * Mon–Sat, 8 am–6 pm, so a day is 10 units and the week runs 0 → 60.
 * `bookedAt` is when the lead came in (negative = before this week); it is
 * always earlier than the slot it books.
 */
export type HeroAppt = {
  /** 0 = Monday … 5 = Saturday */
  day: number
  /** Start hour on a 24h clock, halves allowed (14.5 = 2:30 pm). */
  start: number
  /** Length in hours. */
  dur: number
  title: string
  who: string
  city: string
  source: string
  /** Minutes from the lead coming in to our first reply. */
  reply: number
  bookedAt: number
}

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEK_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_START = 8
export const DAY_HOURS = 10
export const WEEK_LENGTH = WEEK_DAYS.length * DAY_HOURS

export const HERO_WEEK: HeroAppt[] = [
  { day: 0, start: 9, dur: 1, title: 'Roof repair estimate', who: 'Dana K.', city: 'Fresno', source: 'a Facebook ad', reply: 2, bookedAt: -8 },
  { day: 0, start: 11.5, dur: 1, title: 'New-patient visit', who: 'Marcus T.', city: 'San Diego', source: 'a Google ad', reply: 1, bookedAt: -5 },
  { day: 0, start: 14, dur: 1.5, title: 'Kitchen remodel quote', who: 'Priya S.', city: 'Sacramento', source: 'an Instagram ad', reply: 3, bookedAt: 1.5 },
  { day: 0, start: 16, dur: 1, title: 'Case evaluation', who: 'Luis M.', city: 'Bakersfield', source: 'a Google ad', reply: 4, bookedAt: 3 },
  { day: 1, start: 8.5, dur: 1, title: 'HVAC service call', who: 'Jen W.', city: 'Riverside', source: 'a Facebook ad', reply: 1, bookedAt: 6 },
  { day: 1, start: 10, dur: 1, title: 'Smile consult', who: 'Owen P.', city: 'Irvine', source: 'an Instagram ad', reply: 2, bookedAt: 4.5 },
  { day: 1, start: 13, dur: 1, title: 'Showing request', who: 'Ana R.', city: 'Pasadena', source: 'a Google ad', reply: 3, bookedAt: 9 },
  { day: 1, start: 15.5, dur: 1, title: 'Solar walkthrough', who: 'Grace L.', city: 'Modesto', source: 'a Facebook ad', reply: 2, bookedAt: 12 },
  { day: 2, start: 9, dur: 1.5, title: 'Buyer consult', who: 'Theo B.', city: 'San Jose', source: 'an Instagram ad', reply: 2, bookedAt: 14 },
  { day: 2, start: 12, dur: 1, title: 'Botox consult', who: 'Mia C.', city: 'Santa Monica', source: 'an Instagram ad', reply: 1, bookedAt: 16 },
  { day: 2, start: 14.5, dur: 1, title: 'Fence estimate', who: 'Rob D.', city: 'Chico', source: 'a Facebook ad', reply: 3, bookedAt: 19 },
  { day: 2, start: 16.5, dur: 1, title: 'Campus tour', who: 'Lena F.', city: 'Oakland', source: 'a Google ad', reply: 4, bookedAt: 22 },
  { day: 3, start: 8, dur: 1, title: 'Water heater call', who: 'Sam H.', city: 'Fresno', source: 'a Google ad', reply: 1, bookedAt: 24 },
  { day: 3, start: 10.5, dur: 1, title: 'Discovery call', who: 'Nina V.', city: 'Palo Alto', source: 'a Google ad', reply: 2, bookedAt: 27 },
  { day: 3, start: 13, dur: 1.5, title: 'Showroom visit', who: 'Carlos G.', city: 'Long Beach', source: 'an Instagram ad', reply: 2, bookedAt: 29 },
  { day: 3, start: 15.5, dur: 1, title: 'Consult request', who: 'Ivy N.', city: 'Fremont', source: 'a Facebook ad', reply: 3, bookedAt: 33 },
  { day: 4, start: 9, dur: 1, title: 'Roof repair estimate', who: 'Ben A.', city: 'Visalia', source: 'a Facebook ad', reply: 2, bookedAt: 35 },
  { day: 4, start: 11, dur: 1, title: 'Private dining', who: 'Rosa E.', city: 'San Francisco', source: 'an Instagram ad', reply: 1, bookedAt: 38 },
  { day: 4, start: 13.5, dur: 1, title: 'Intake appointment', who: 'Drew K.', city: 'Stockton', source: 'a Google ad', reply: 2, bookedAt: 41 },
  { day: 4, start: 16, dur: 1, title: 'Listing appointment', who: 'Hana Y.', city: 'Santa Rosa', source: 'a Google ad', reply: 3, bookedAt: 44 },
  { day: 5, start: 9, dur: 1.5, title: 'Rental tour', who: 'Kai O.', city: 'Ventura', source: 'an Instagram ad', reply: 2, bookedAt: 47 },
  { day: 5, start: 11.5, dur: 1, title: 'Deck repair job', who: 'Elle J.', city: 'Redding', source: 'a Facebook ad', reply: 1, bookedAt: 50 },
  { day: 5, start: 14, dur: 1, title: 'New-patient visit', who: 'Joel Q.', city: 'Escondido', source: 'a Google ad', reply: 2, bookedAt: 54 },
]

/** Week position of an appointment's start. */
export const slotAt = (a: HeroAppt) => a.day * DAY_HOURS + (a.start - DAY_START)

/** "11:30 am" for an hour on a 24h clock. */
export function clock(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  const h12 = ((h + 11) % 12) + 1
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

/** "Thu 11:30 am" for a week position (negative = last week). */
export function weekClock(t: number, long = false) {
  if (t < 0) return 'last week'
  const day = Math.min(Math.floor(t / DAY_HOURS), WEEK_DAYS.length - 1)
  const names = long ? WEEK_DAY_NAMES : WEEK_DAYS
  return `${names[day]} ${clock(DAY_START + (t - day * DAY_HOURS))}`
}
