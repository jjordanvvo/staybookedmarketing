import { useEffect } from 'react'

const SRC = 'https://link.msgsndr.com/js/form_embed.js'

/**
 * Loads GoHighLevel's form embed helper once. It finds iframes whose id is
 * `inline-<formId>` and sizes each one to the form's real height, so the
 * Send button is never clipped by a fixed iframe height.
 */
export function useGhlFormResize() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SRC}"]`)) return
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    document.body.appendChild(s)
  }, [])
}
