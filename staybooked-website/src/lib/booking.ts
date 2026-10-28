/** The one Google Calendar booking link — every "Book a Call" CTA on the site
 *  points here. Change it in this file and every button follows. */
export const BOOKING_URL = 'https://calendar.app.google/Euu7i4zJdkcJc6Eb6'

/** The same Google appointment schedule in its embeddable form (gv=true), shown
 *  inline on /book so visitors book without leaving the site. A Vercel env
 *  value (VITE_BOOKING_EMBED_URL) overrides it, e.g. for a GHL calendar later. */
export const BOOKING_EMBED_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2m0LH9hyV-0R7icXmmiS4JCMsBUTJsb2mAZfBqT__QHZWRXH6g1NjxsdJWBItLAsE3uGkYLeWK?gv=true'
