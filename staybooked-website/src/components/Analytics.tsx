import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initTracking, trackPageView, track, GA4_ID, META_PIXEL_ID } from '@/lib/tracking'

/**
 * Analytics — mounts once in App. Loads GA4 + Meta Pixel when their IDs are
 * configured (Vercel env: VITE_GA4_ID, VITE_META_PIXEL_ID), fires page_view
 * on every SPA route change, and records funnel clicks via delegation:
 * every "Book a Call" CTA and niche "Learn more" link is tracked without
 * touching the components. The calculator's lead capture fires its own event.
 */
export default function Analytics() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    initTracking()
    trackPageView(pathname + search)
  }, [pathname, search])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      if (t.closest('a.contact-book-btn, a.nav-cta, a.stamp-cta')) {
        track('book_call_click', { location: window.location.pathname })
      } else if (t.closest('a.ind-learnmore')) {
        track('niche_learn_more', { location: window.location.pathname })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    GA4_ID || META_PIXEL_ID ? null : null
  )
}
