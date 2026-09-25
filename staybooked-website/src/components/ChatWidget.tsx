import { useEffect } from 'react'

/**
 * ChatWidget — the GoHighLevel chat widget, mounted once in App. Replaced the
 * old hardcoded embed (removed from index.html) with an env-driven one so the
 * widget config lives in Vercel, not in the markup. Kolby pastes the new
 * widget's ID into Vercel env (VITE_CHAT_WIDGET_ID) and it lights up on the
 * next deploy; no ID, no script.
 */
const CHAT_WIDGET_ID = (import.meta.env.VITE_CHAT_WIDGET_ID as string | undefined)?.trim() || ''

export default function ChatWidget() {
  useEffect(() => {
    if (!CHAT_WIDGET_ID) return
    const s = document.createElement('script')
    s.src = 'https://widgets.leadconnectorhq.com/loader.js'
    s.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js')
    s.setAttribute('data-widget-id', CHAT_WIDGET_ID)
    s.setAttribute('data-source', 'WEB_USER')
    document.body.appendChild(s)
  }, [])

  return null
}
