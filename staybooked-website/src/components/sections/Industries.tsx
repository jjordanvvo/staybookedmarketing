import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { NICHES, type Niche } from '@/lib/niches'

// Kept for the site search (searchIndex maps { name, desc } entries).
export const INDUSTRIES = NICHES.map((n) => ({ name: n.name, desc: n.desc }))

/**
 * INDUSTRIES — "Who we help." A clean name-only index: one niche per row,
 * nothing else on it. Clicking a row expands a brief summary in place (the
 * most important things from the one-pager: what we do, what we book, the
 * guarantee) with the "Learn more" button inside it — that opens the niche's
 * full info page (/niches/:id) with everything. Header and rows reveal
 * independently; only one row is expanded at a time.
 */

const panelV = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: 'auto',
    opacity: 1,
    transition: { height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25 } },
  },
  exit: { height: 0, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
}

function NichePanel({ niche }: { niche: Niche }) {
  return (
    <motion.div className="ind-panel" variants={panelV} initial="hidden" animate="show" exit="exit">
      <div className="ind-panel-inner">
        <p className="ind-summary">{niche.summary}</p>

        <div className="ind-books" aria-label="What we book">
          {niche.books.map((b) => (
            <span className="ind-chip" key={b}>{b}</span>
          ))}
        </div>

        <p className="ind-guarantee">
          <strong>Our guarantee:</strong> if we haven&apos;t delivered {niche.guarantee} by the
          end of the guarantee window, your retainer pauses until we do.
        </p>

        <div className="ind-panel-ctas">
          <Link className="ind-learnmore" to={`/niches/${niche.id}`}>
            Learn more
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          {niche.to && (
            <Link className="ind-learnmore ind-learnmore-alt" to={niche.to}>
              {niche.linkLabel}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Industries() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section className="section section-offwhite" id="industries">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Industries</RevealItem>
          <RevealItem as="h2" className="title">Who we help.</RevealItem>
          <RevealItem as="p" className="body why-body">
            If your business serves local customers, we can build for it. Tap any niche for the
            quick version — Learn more opens the full page.
          </RevealItem>
        </Reveal>

        <Reveal as="ul" className="lp-points ind-list" amount={0.15}>
          {NICHES.map((niche) => {
            const isOpen = open === niche.id
            return (
              <RevealItem as="li" className={`lp-point ind-row${isOpen ? ' is-open' : ''}`} key={niche.id}>
                <button
                  type="button"
                  className="ind-link ind-link-btn"
                  onClick={() => setOpen(isOpen ? null : niche.id)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Close' : 'Open'} ${niche.name}`}
                >
                  <span className="ind-name">{niche.name}</span>
                  <svg className="ind-arrow" width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && <NichePanel niche={niche} />}
                </AnimatePresence>
              </RevealItem>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
