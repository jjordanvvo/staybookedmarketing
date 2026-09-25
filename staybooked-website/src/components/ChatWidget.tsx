import { useEffect } from 'react'

/**
 * ChatWidget — the GoHighLevel chat widget (SBM's own stack), mounted once
 * in App. Inert until configured: Kolby pastes the widget ID (and, if the
 * embed uses a custom script host, the script src) into Vercel env vars
 * (VITE_CHAT_WIDGET_ID, optional VITE_CHAT_WIDGET_SRC) and it lights up on
 * the next deploy. No ID, no script, no broken UI.
 */
const CHAT_WIDGET_ID = (import.meta.env.VITE_CHAT_WIDGET_ID as string | undefined)?.trim() || ''
const CHAT_WIDGET_SRC =
  (import.meta.env.VITE_CHAT_WIDGET_SRC as string | undefined)?.trim() ||
  'https://msgsndr.com/js/widgets/chat.js'

export default function ChatWidget() {
  useEffect(() => {
    if (!CHAT_WIDGET_ID) return
    const s = document.createElement('script')
    s.async = true
    s.src = CHAT_WIDGET_SRC
    s.setAttribute('data-widget-id', CHAT_WIDGET_ID)
    document.body.appendChild(s)
  }, [])

  return null
}
