import { useState } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { FAQS, type FaqEntry } from '@/lib/faqs'

export type { FaqEntry }

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
