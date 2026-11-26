/** The one booking link: the GoHighLevel "Free 15-Minute Strategy Call"
 *  calendar in the SBM sub-account (synced to Kolby's Google Calendar, with
 *  email confirmations and 24h + 1h email reminders). Every "Book a Call" CTA
 *  that leaves the site points here. Change it in this file and every button follows. */
export const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/5rlgGO8sgu3Wy1b6STMa'

/** The same GHL calendar, embedded inline on /book so visitors book without
 *  leaving the site. A Vercel env value (VITE_BOOKING_EMBED_URL) overrides it. */
export const BOOKING_EMBED_URL = BOOKING_URL

/** Where the lead form posts. Our own Vercel function (api/lead.ts) screens
 *  each submission and forwards it to GHL; the GHL webhook URL itself lives only
 *  in the Vercel env var GHL_LEAD_WEBHOOK_URL, never in the browser or the repo. */
export const LEAD_ENDPOINT = '/api/lead'
