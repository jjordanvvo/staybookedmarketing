import type { ReactNode } from 'react'
import Fade from './Fade'

/** Opening block for side pages: a small caption and a serif title. */
export default function PageHead({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="q-pagehead q-wrap">
      <Fade>
        <p className="q-kicker">{kicker}</p>
        <h1 className="q-pagetitle">{title}</h1>
        {children && <div className="q-lede">{children}</div>}
      </Fade>
    </header>
  )
}
