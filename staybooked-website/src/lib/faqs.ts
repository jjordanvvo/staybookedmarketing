/** Site FAQ data — shared by the Faq section, site search, and the
 *  prerendered FAQPage schema (scripts/prerender.ts). */
export type FaqEntry = { q: string; a: string }

export const FAQS: FaqEntry[] = [
  {
    q: 'How fast will I see results?',
    a: "Ads can start running within days of your strategy call, and our follow-up system goes to work on the very first lead. Timelines vary by industry and budget, so we'll give you an honest read on yours during the call.",
  },
  {
    q: 'How much does it cost?',
    a: "We quote each program after a free 15-minute strategy call, because markets, budgets and goals differ. The program covers your campaigns, landing pages, lead follow-up, qualification and booking. There's no startup fee, and ad spend is billed by the ad platforms directly, so it always stays yours.",
  },
  {
    q: "What if it doesn't work?",
    a: "We set a goal together on the strategy call. If we don't hit it within 90 days, we keep working for free until we do.",
  },
  {
    q: 'Do you require a long-term contract?',
    a: "No. Terms are flexible: month to month or longer, your choice. We'd rather earn your business every month than lock you into anything.",
  },
  {
    q: 'Who owns the ad accounts and the data?',
    a: 'You do. Ad accounts, audiences, and every lead we generate belong to you. If we ever part ways, all of it stays with you.',
  },
  {
    q: "How will I know it's working?",
    a: "You'll see the numbers. We review performance with you every month, including leads, booked appointments, and cost per lead, and we keep improving what works. The ad accounts are yours, so you can check them any time.",
  },
  {
    q: 'How is this different from other agencies?',
    a: "Most agencies stop at generating leads and leave the follow-up to you. We built the whole system around speed: every lead is contacted and qualified within minutes, automatically, and booked straight onto your calendar. Responding first is how local businesses win, and we make sure that's you.",
  },
]

/**
 * FAQ — hairline-separated accordion in the editorial list style (same rhythm
 * as the lp-points rows). One answer open at a time; the collapse animates via
 * the CSS grid 0fr → 1fr trick, so no JS measuring and reduced-motion users
 * just get an instant toggle (transition disabled in CSS).
 */
