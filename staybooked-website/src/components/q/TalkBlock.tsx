import { Link } from 'react-router-dom'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/content'
import Arrow from './Arrow'
import Fade from './Fade'

/** Compact closing call to action for side pages. */
export default function TalkBlock({ line = 'Easier to just talk it through?' }: { line?: string }) {
  return (
    <section className="q-talkblock">
      <Fade className="q-wrap q-talkblock-inner">
        <p className="q-talkblock-line">{line}</p>
        <div className="q-talkblock-actions">
          <a className="q-btn" href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
          <Link className="q-link" to="/book">Book a 15-minute call <Arrow /></Link>
        </div>
      </Fade>
    </section>
  )
}
