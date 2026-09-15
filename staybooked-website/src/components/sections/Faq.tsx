import { useState } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

export type FaqEntry = { q: string; a: string }

const FAQS: FaqEntry[] = [
  {
    q: 'What industries do you work with?',
    a: 'Any local service business: home services, trades, legal, fitness and med spas, professional services, and healthcare. If your customers are local and your business runs on appointments or jobs, the system fits. For medical and healthcare practices, we have a dedicated compliance-first approach you can read about on our healthcare page.',
  },
  {
    q: 'How fast will I see results?',
    a: "Most clients see results within the first 30 days. Ads can start running within days of your strategy call, and our follow-up system goes to work on the very first lead. Timelines vary by industry and budget, so we'll give you an honest read on yours during the call.",
  },
  {
    q: "What's included in the monthly price?",
    a: "Everything: campaign creation and management, landing pages, automated lead follow-up, qualification, and booking, all handled end to end for $2,000 per month. There's no startup fee. Ad spend is billed separately by the ad platforms and always stays yours.",
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
    q: 'Can you guarantee results?',
    a: "No agency honestly can, and we won't pretend to. What we can promise is a complete system, fast follow-up on every lead, and a team that reviews performance every month and keeps improving what works.",
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
type FaqProps = {
  /** Question list — defaults to the general main-site FAQ. */
  items?: FaqEntry[]
  title?: string
}

export default function Faq({ items = FAQS, title = 'Questions, answered.' }: FaqProps) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="section section-offwhite" id="faq">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">FAQ</RevealItem>
          <RevealItem as="h2" className="title">{title}</RevealItem>
        </Reveal>

        <Reveal as="div" className="faq-list" amount={0.15}>
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <RevealItem as="div" className="faq-item" key={item.q}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={`faq-icon${isOpen ? ' faq-icon-open' : ''}`} aria-hidden="true" />
                </button>
                <div id={`faq-a-${i}`} className={`faq-a-wrap${isOpen ? ' faq-a-open' : ''}`}>
                  <div className="faq-a">
                    <p className="faq-body">{item.a}</p>
                  </div>
                </div>
              </RevealItem>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
