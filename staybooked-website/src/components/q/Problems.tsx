import { PHONE_TEL } from '@/lib/content'
import { PROBLEMS } from '@/lib/content'
import Fade from './Fade'

/** What we do, told as the visitor's problem first. */
export default function Problems() {
  return (
    <section className="q-sec q-problems" id="what">
      <div className="q-wrap">
        <Fade className="q-sec-head">
          <p className="q-kicker">What we do</p>
          <h2 className="q-h2">Where is business slipping away?</h2>
        </Fade>

        <ol className="q-plist">
          {PROBLEMS.map((p, i) => (
            <Fade as="li" key={p.problem} className="q-prow" delay={i * 0.05}>
              <span className="q-prow-n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="q-prow-problem">{p.problem}</h3>
              <div className="q-prow-answer">
                <p>{p.answer}</p>
                <span className="q-prow-tag">{p.service}</span>
              </div>
            </Fade>
          ))}
        </ol>

        <Fade className="q-problems-note">
          <p>
            Something else entirely? Most of our clients came to us with a problem that isn't on
            this list. <a href={PHONE_TEL}>Call and tell us about it.</a>
          </p>
        </Fade>
      </div>
    </section>
  )
}
