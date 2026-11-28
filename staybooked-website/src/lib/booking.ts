/** The one booking link: the GoHighLevel "Free 15-Minute Strategy Call"
 *  calendar in the SBM sub-account (synced to Kolby's Google Calendar, with
 *  email confirmations and 24h + 1h email reminders). Every "Book a Call" CTA
 *  that leaves the site points here. Change it in this file and every button follows. */
export const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/5rlgGO8sgu3Wy1b6STMa'

/** The same GHL calendar, embedded inline on /book so visitors book without
 *  leaving the site. A Vercel env value (VITE_BOOKING_EMBED_URL) overrides it. */
export const BOOKING_EMBED_URL = BOOKING_URL

/** Where the lead form posts: a small Vercel function in its own project
 *  (staybooked-lead-api, Kolby's Vercel account, kept out of this public repo).
 *  It screens each submission (origin, honeypot, timing, validation, rate
 *  limits) and forwards it to GHL; the GHL webhook URL lives only in that
 *  project's env vars, never in the browser or here. */
export const LEAD_ENDPOINT = 'https://staybooked-lead-api.vercel.app/api/lead'

/** The "see if we're a fit" chat (FitCheck under the hero): same relay project,
 *  /api/fit. It holds the Anthropic key and streams Claude's answer back as text. */
export const FIT_ENDPOINT = 'https://staybooked-lead-api.vercel.app/api/fit'
