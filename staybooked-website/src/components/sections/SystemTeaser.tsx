import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

/**
 * Replaces "What we build". One line and a link to /the-system, the page
 * that shows how the backend works, step by step.
 */
export default function SystemTeaser() {
  return (
    <section className="st" id="the-system">
      <Reveal className="st-inner" amount={0.4}>
        <RevealItem as="p" className="st-line">
          People are always asking how we built this system. <span>Here's how.</span>
        </RevealItem>
        <RevealItem>
          <Link className="st-link" to="/the-system">
            <span>See the system behind the scenes</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M16.17 11 10.8 5.64l1.42-1.42L20 12l-7.78 7.78-1.42-1.42L16.17 13H4v-2z" fill="currentColor" /></svg>
          </Link>
        </RevealItem>
      </Reveal>
    </section>
  )
}
