/**
 * Tracking — one funnel event API for the whole site.
 *
 * Backends light up per environment (set as Vercel env vars, no code change):
 *   VITE_GA4_ID            → GA4 Measurement ID (G-XXXX)
 *   VITE_META_PIXEL_ID     → Meta Pixel numeric ID
 * When an ID is absent its platform simply doesn't load — the site runs
 * clean with zero tracking until Kolby drops the IDs in Vercel.
 *
 * track('book_call_click') etc. fans out to every loaded platform, and also
 * pushes to window.dataLayer so future tools can replay the funnel.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

export const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined)?.trim() || ''
export const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim() || ''

export function initTracking() {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer!.push(args)
    }

  // GA4
  if (GA4_ID) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
    document.head.appendChild(s)
    window.gtag('js', new Date())
    window.gtag('config', GA4_ID, { send_page_view: false })
  }

  // Meta Pixel (standard snippet, guarded)
  if (META_PIXEL_ID && !window.fbq) {
    /* eslint-disable */
    const fbq: any = (window.fbq = function (...args: unknown[]) {
      fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args)
    })
    fbq.push = window.fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    window._fbq = fbq
    /* eslint-enable */
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(s)
    window.fbq!('init', META_PIXEL_ID)
  }
}

/** SPA route change: fire a page_view on every platform. */
export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', { page_path: path })
  window.fbq?.('track', 'PageView')
}

/** A funnel event: GA4 custom event + Meta custom event, name-spaced. */
export function track(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer?.push({ event, ...params })
  window.gtag?.('event', event, params)
  window.fbq?.('trackCustom', event, params)
}
