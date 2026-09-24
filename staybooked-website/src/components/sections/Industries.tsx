import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { NICHES, type Niche } from '@/lib/niches'
import { BOOKING_URL } from '@/lib/booking'

// Kept for the site search (searchIndex maps { name, desc } entries).
export const INDUSTRIES = NICHES.map((n) => ({ name: n.name, desc: n.desc }))

/**
 * INDUSTRIES — "Who we help." The eight niches from the sales one-pagers,
 * each row clickable: it opens an editorial detail overlay carrying the
 * important info from that niche's one-pager (what we do, what we book, who
 * gets the AI summary, speed-to-lead, investment, and the performance
 * guarantee). Medical & Health also links onward to the dedicated
 * /healthcare page. Header and rows reveal independently; the overlay is
 * skippable at any moment via click / Esc and locks page scroll while up.
 */

const overlayV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
}

const cardV = {
  hidden: { opacity: 0, y: 34, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 20, scale: 0.99, transition: { duration: 0.22, ease: 'easeIn' } },
}

function NicheOverlay({ niche, onClose }: { niche: Niche; onClose: () => void }) {
  // Esc closes; scroll stays locked while the overlay is up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className="niche-overlay"
      variants={overlayV}
      initial="hidden"
      animate="show"
      exit="exit"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={niche.name}
    >
      <motion.div className="niche-card" variants={cardV} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="niche-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <p className="niche-kicker">Who we help</p>
        <h3 className="niche-name">{niche.name}</h3>
        <p className="niche-examples">{niche.examples}</p>

        <p className="niche-what">{niche.whatWeDo}</p>

        <div className="niche-books" aria-label="What we book">
          {niche.books.map((b) => (
            <span className="niche-book-chip" key={b}>{b}</span>
          ))}
        </div>

        <dl className="niche-facts">
          <div className="niche-fact">
            <dt>Speed to lead</dt>
            <dd>
              Every inquiry is contacted within <strong>5 minutes</strong> by our AI. It books in
              real time and sends a full summary to {niche.handoff}, so nothing is missed.
            </dd>
          </div>
          <div className="niche-fact">
            <dt>Investment</dt>
            <dd>
              No startup fee. No long-term contract. Ad spend ~$1,500/mo (billed by the platforms,
              never by us). Retainer ~$2,000/mo, varies by {niche.varies}.
            </dd>
          </div>
          <div className="niche-fact">
            <dt>Our guarantee</dt>
            <dd>
              Every partnership includes a performance guarantee period. If we haven&apos;t
              delivered {niche.guarantee} by the end of that window, your retainer pauses until we
              do.
            </dd>
          </div>
          <div className="niche-fact">
            <dt>How we work together</dt>
            <dd>
              Optional weekly review calls, two direct points of contact, no ticket systems. We
              adjust targeting, creative, and messaging around {niche.tuned}.
            </dd>
          </div>
        </dl>

        <div className="niche-card-cta">
          <a className="contact-book-btn" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            Book a Free Strategy Call
          </a>
          {niche.to && (
            <Link className="niche-page-link" to={niche.to} onClick={onClose}>
              {niche.linkLabel}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Industries() {
  const [open, setOpen] = useState<Niche | null>(null)

  return (
    <section className="section section-offwhite" id="industries">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Industries</RevealItem>
          <RevealItem as="h2" className="title">Who we help.</RevealItem>
          <RevealItem as="p" className="body why-body">
            If your business serves local customers, we can build for it. Tap any niche to see
            exactly how we book it.
          </RevealItem>
        </Reveal>

        <Reveal as="ul" className="lp-points ind-list" amount={0.15}>
          {NICHES.map((niche) => (
            <RevealItem as="li" className="lp-point ind-row" key={niche.id}>
              <button type="button" className="ind-link ind-link-btn" onClick={() => setOpen(niche)}>
                <span className="ind-name">{niche.name}</span>
                <span className="ind-desc">
                  {niche.desc}{' '}
                  <span className="ind-more">
                    See how we book it
                    <svg className="ind-arrow" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </button>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <AnimatePresence>
        {open && <NicheOverlay niche={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  )
}
