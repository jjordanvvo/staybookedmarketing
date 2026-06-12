import { useEffect } from 'react'

/**
 * Page-turn blur-to-clear reveal — ported 1:1 from the original script.js.
 * Each `.section-reveal` sharpens into focus as it snaps into view and resets
 * when it leaves, so the reveal replays on scroll back. Its `.stagger` children
 * fade/lift/sharpen in sequence (150ms + 120ms each). Honors reduced motion.
 */
export function useScrollReveal() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.section-reveal'),
    )
    if (!sections.length) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      sections.forEach((s) => {
        s.classList.add('visible')
        s.querySelectorAll<HTMLElement>('.stagger').forEach((el) =>
          el.classList.add('visible'),
        )
      })
      return
    }

    const timeouts: number[] = []

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          if (entry.isIntersecting) {
            target.classList.add('visible')
            const staggers =
              target.querySelectorAll<HTMLElement>('.stagger')
            staggers.forEach((el, i) => {
              const t = window.setTimeout(
                () => el.classList.add('visible'),
                150 + i * 120,
              )
              timeouts.push(t)
            })
          } else {
            target.classList.remove('visible')
            target
              .querySelectorAll<HTMLElement>('.stagger')
              .forEach((el) => el.classList.remove('visible'))
          }
        })
      },
      { threshold: 0.3 },
    )

    sections.forEach((s) => observer.observe(s))

    return () => {
      observer.disconnect()
      timeouts.forEach((t) => clearTimeout(t))
    }
  }, [])
}
