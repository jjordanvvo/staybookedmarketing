import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NICHES } from '@/lib/niches'
import { findNiche, FINDER_EXAMPLES } from '@/lib/finder'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/content'
import Arrow from './Arrow'
import Fade from './Fade'

/**
 * Find your business. One sentence with a blank in it. Type what you do and
 * the matching industry answers underneath; the full list stays folded away
 * as a single line of links for anyone who wants to browse.
 */
export default function Finder() {
  const [q, setQ] = useState('')
  const [browse, setBrowse] = useState(false)
  const [ex, setEx] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const niche = useMemo(() => findNiche(q), [q])
  const typed = q.trim().length >= 2

  // Rotate the example in the placeholder while the field is empty.
  useEffect(() => {
    if (q) return
    const t = window.setInterval(() => setEx((i) => (i + 1) % FINDER_EXAMPLES.length), 2600)
    return () => window.clearInterval(t)
  }, [q])

  return (
    <section className="q-sec q-finder" id="find">
      <div className="q-wrap">
        <Fade className="q-sec-head">
          <p className="q-kicker">Find your business</p>
        </Fade>

        <Fade>
          <label className="q-finder-line" onClick={() => input.current?.focus()}>
            <span>I run</span>
            <input
              ref={input}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={FINDER_EXAMPLES[ex]}
              aria-label="What kind of business do you run?"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
        </Fade>

        <div className="q-finder-out" aria-live="polite">
          <AnimatePresence mode="wait">
            {typed && niche && (
              <motion.div
                key={niche.id}
                className="q-finder-hit"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="q-finder-name">{niche.name}</p>
                <p className="q-finder-sum">{niche.summary}</p>
                <p className="q-finder-books">We book: {niche.books.join(', ').toLowerCase()}.</p>
                <Link className="q-link" to={`/niches/${niche.id}`}>How it works for you <Arrow /></Link>
              </motion.div>
            )}
            {typed && !niche && (
              <motion.div key="none" className="q-finder-hit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="q-finder-name">We haven't written that one up yet.</p>
                <p className="q-finder-sum">
                  If your customers can find you online, we can build for it. A quick call is the
                  fastest way to know: <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="q-finder-browse">
          <button type="button" className="q-textbtn" aria-expanded={browse} onClick={() => setBrowse(!browse)}>
            {browse ? 'Hide the list' : `Or browse all ${NICHES.length} industries`}
          </button>
          <AnimatePresence initial={false}>
            {browse && (
              <motion.p
                className="q-finder-all"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
              >
                {NICHES.map((n) => (
                  <Link key={n.id} to={`/niches/${n.id}`}>{n.name}</Link>
                ))}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
