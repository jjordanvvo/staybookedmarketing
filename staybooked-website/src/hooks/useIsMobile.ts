import { useEffect, useState } from 'react'

/**
 * useIsMobile — true while the viewport is at or below the site's main
 * mobile breakpoint (1100px, matching the media queries in index.css).
 * Listens for changes so resizing/desktop-mode on phones stays correct.
 */
export function useIsMobile(breakpoint = 1100) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    onChange()
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])

  return isMobile
}
