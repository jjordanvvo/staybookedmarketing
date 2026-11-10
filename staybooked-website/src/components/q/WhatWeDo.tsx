import { Link } from 'react-router-dom'
import { WHAT_WE_DO } from '@/lib/content'
import Arrow from './Arrow'
import Fade from './Fade'

/** What we do, written as one paragraph you can read in fifteen seconds. */
export default function WhatWeDo() {
  return (
    <section className="q-sec q-what" id="what">
      <div className="q-wrap q-what-grid">
        <Fade>
          <p className="q-kicker">What we do</p>
        </Fade>
        <Fade>
          <p className="q-what-text">
            {WHAT_WE_DO.map((part, i) =>
              part.em ? <em key={i}>{part.text}</em> : <span key={i}>{part.text}</span>,
            )}
          </p>
          <Link className="q-link q-what-link" to="/how-it-works">How it works <Arrow /></Link>
        </Fade>
      </div>
    </section>
  )
}
