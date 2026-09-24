import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * WeekChapter — the narrative captions that ride beside the Week/System
 * centerpiece in flow segment A. Short editorial passages, spaced like
 * chapter openers; the pinned figure tells the story and these lines score
 * it. The wrapper carries id="week" (chapter node on the throughline).
 *
 * On mobile the pinned stage is hidden, so a compact static "booked" board
 * renders inline here to keep the chapter's payoff on small screens.
 */
export default function WeekChapter() {
  return (
    <div className="wkchapter" id="week">
      <Reveal className="wkchapter-block">
        <RevealItem as="p" className="wkchapter-no">01</RevealItem>
        <RevealItem as="p" className="wkchapter-text">
          Every call that rings out, every form nobody answers. A week
          quietly coming apart.
        </RevealItem>
      </Reveal>

      <Reveal className="wkchapter-block">
        <RevealItem as="p" className="wkchapter-no">01 — cont.</RevealItem>
        <RevealItem as="p" className="wkchapter-text">
          The same week on a Stay Booked system. Ads catch, automation
          qualifies, the calendar fills.
        </RevealItem>
      </Reveal>

      <Reveal className="wkchapter-block">
        <RevealItem as="p" className="wkchapter-no">02</RevealItem>
        <RevealItem as="p" className="wkchapter-text">
          This is the machine. Three moves, end to end, running while
          you sleep. Keep scrolling: everything below is how it fits
          together.
        </RevealItem>
      </Reveal>

      {/* Mobile payoff: the week, already booked (stage is desktop-only) */}
      <div className="wkchapter-static" aria-hidden="true">
        <div className="wk-board">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <span key={d} className="wk-day">{d}</span>
          ))}
          {Array.from({ length: 28 }, (_, i) => {
            const open = [5, 11, 17, 22].includes(i) // the same honest gaps
            return (
              <span key={i} className="wk-cell">
                {open ? <span className="wk-open" /> : <span className={`wk-booked wk-shade-${i % 3}`} />}
              </span>
            )
          })}
        </div>
        <p className="wkchapter-static-line">24 appointments. One week. Staying booked.</p>
      </div>
    </div>
  )
}
