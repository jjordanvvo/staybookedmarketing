import { Link } from 'react-router-dom'
import { TERMS, WHAT_WE_DO } from '@/lib/content'
import Fade from './Fade'

/** What we do in one line, then the terms that remove the risk of calling. */
export default function WhatWeDo() {
  return (
    <section className="q-sec q-what" id="what">
      <div className="q-wrap">
        <Fade>
          <p className="q-kicker">What we do</p>
          <p className="q-what-line">
            {WHAT_WE_DO.map((w, i) => (
              <span key={w}>
                <Link to="/how-it-works">{w}</Link>
                {i < WHAT_WE_DO.length - 1 ? <span className="q-what-sep">,</span> : <span className="q-what-sep">.</span>}{' '}
              </span>
            ))}
          </p>
        </Fade>
        <Fade delay={0.1}>
          <ul className="q-terms">
            {TERMS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Fade>
      </div>
    </section>
  )
}
