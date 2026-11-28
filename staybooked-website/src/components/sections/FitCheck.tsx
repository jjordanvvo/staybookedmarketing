import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { FIT_ENDPOINT, LEAD_ENDPOINT } from '@/lib/booking'
import { track } from '@/lib/tracking'

/**
 * FitCheck — "will this work for my business?" as a search bar. Sits between
 * the terms strip and the stickman. The visitor types what they run; Claude
 * (through the staybooked-lead-api relay, /api/fit) streams back how we'd grow
 * that exact business. After the first answer a short contact card appears;
 * it posts to the same /api/lead relay as the site form, so the contact and
 * the whole transcript land in GHL ("website: fit-check chat").
 */

type Turn = { role: 'user' | 'assistant'; content: string }

const EXAMPLES = [
  'I own a roofing company',
  'I sell skincare on Shopify',
  'I manage OnlyFans creators',
  'I run a dropshipping store',
  "I'm starting my own agency",
  'We sell B2B data',
  'I run a med spa',
  'I have a food truck',
]
const CHIPS: [label: string, question: string][] = [
  ['Roofing company', 'I own a roofing company.'],
  ['Shopify brand', 'I run a Shopify brand selling physical products.'],
  ['Creator agency', 'I manage OnlyFans and social media creators.'],
  ['Dropshipping', 'I run a dropshipping store.'],
  ['Starting an agency', "I'm starting my own marketing agency and need clients."],
]
const MAX_QUESTIONS = 7

/** Typewriter placeholder: types an example, holds, erases, moves on. */
function useCyclingPlaceholder(active: boolean) {
  const [text, setText] = useState(EXAMPLES[0])
  useEffect(() => {
    if (!active) return
    let i = 0
    let n = EXAMPLES[0].length
    let deleting = true
    let timer = 0
    const step = () => {
      if (deleting) {
        n--
        if (n <= 0) {
          deleting = false
          i = (i + 1) % EXAMPLES.length
          n = 0
        }
      } else n++
      setText(EXAMPLES[i].slice(0, n))
      let delay = deleting ? 28 : 62
      if (!deleting && n >= EXAMPLES[i].length) {
        deleting = true
        delay = 1900
      }
      timer = window.setTimeout(step, delay)
    }
    timer = window.setTimeout(step, 1900)
    return () => window.clearTimeout(timer)
  }, [active])
  return text
}

/** Site copy never uses long dashes; neither does the chat. */
const tidy = (s: string) => s.replace(/\s*[—–]\s*/g, ', ')

/** Tiny renderer: paragraphs, "- " bullets, **bold**. Nothing else is trusted. */
function Rich({ text }: { text: string }) {
  // the booking page and phone number become real links
  const links = (part: string, key: number) =>
    part.split(/((?:https?:\/\/)?(?:www\.)?staybookedmarketing\.com\/book|\(813\) 480-5818)/g).map((bit, j) =>
      /staybookedmarketing\.com\/book/.test(bit) ? (
        <a key={`${key}-${j}`} href="/book">{bit}</a>
      ) : bit === '(813) 480-5818' ? (
        <a key={`${key}-${j}`} href="tel:+18134805818">{bit}</a>
      ) : (
        bit
      ),
    )
  const bold = (line: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{links(part.slice(2, -2), i)}</strong> : links(part, i),
    )
  const blocks: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) blocks.push(<ul key={`l${blocks.length}`}>{list.map((l, i) => <li key={i}>{bold(l)}</li>)}</ul>)
    list = []
  }
  for (const raw of tidy(text).split('\n')) {
    const line = raw.trim()
    if (/^[-*•]\s+/.test(line)) list.push(line.replace(/^[-*•]\s+/, ''))
    else {
      flush()
      if (line) blocks.push(<p key={`p${blocks.length}`}>{bold(line.replace(/^#+\s*/, ''))}</p>)
    }
  }
  flush()
  return <>{blocks}</>
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M16.17 11 10.8 5.64l1.42-1.42L20 12l-7.78 7.78-1.42-1.42L16.17 13H4v-2z" fill="currentColor" />
  </svg>
)

export default function FitCheck() {
  const id = useId()
  const reduce = useReducedMotion()
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const startedAt = useRef(0)
  const placeholder = useCyclingPlaceholder(!reduce && !focused && !draft && turns.length === 0)

  const asked = turns.filter((t) => t.role === 'user').length
  const answered = turns.some((t) => t.role === 'assistant' && t.content) && !busy
  const capped = asked >= MAX_QUESTIONS

  // keep the newest message in view inside the thread (not the page)
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns])

  const ask = async (question: string) => {
    const q = question.trim().slice(0, 700)
    if (!q || busy || capped) return
    if (!turns.length) {
      startedAt.current = performance.now()
      track('fit_chat_start', { business: q.slice(0, 80) })
    }
    const history: Turn[] = [...turns, { role: 'user', content: q }]
    setTurns([...history, { role: 'assistant', content: '' }])
    setDraft('')
    setBusy(true)

    const write = (content: string) =>
      setTurns((prev) => {
        const next = prev.slice()
        next[next.length - 1] = { role: 'assistant', content }
        return next
      })

    try {
      const res = await fetch(FIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!res.ok || !res.body) throw new Error(`fit ${res.status}`)
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let text = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        text += dec.decode(value, { stream: true })
        write(text)
      }
      if (!text.trim()) throw new Error('empty')
    } catch {
      write(
        "We work with businesses like yours, and we'd love to show you how. Our chat is busy right now, so book a free 15-minute strategy call at staybookedmarketing.com/book or call (813) 480-5818.",
      )
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    ask(draft)
  }

  const started = turns.length > 0

  return (
    <section className="fc" id="fit" aria-labelledby={`${id}-title`}>
      <Reveal className="fc-inner" amount={0.3}>
        <RevealItem as="p" className="fc-kicker">Wondering if we work with businesses like yours?</RevealItem>
        <RevealItem as="h2" className="fc-title" id={`${id}-title`}>
          Tell us what you run. We'll show you how we'd grow it.
        </RevealItem>

        <RevealItem>
          <form className={`fc-bar${focused ? ' is-focus' : ''}${started ? ' is-started' : ''}`} onSubmit={onSubmit} role="search">
            <svg className="fc-bar-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <label className="sr-only" htmlFor={`${id}-q`}>
              {started ? 'Ask a follow-up question' : 'Describe your business'}
            </label>
            <input
              ref={inputRef}
              id={`${id}-q`}
              className="fc-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={capped ? 'Book a call and we can keep going' : started ? 'Ask a follow-up…' : placeholder}
              maxLength={700}
              autoComplete="off"
              enterKeyHint="send"
              disabled={capped}
            />
            <button type="submit" className="fc-go" disabled={busy || !draft.trim() || capped} aria-label="Ask">
              {busy ? <span className="fc-spin" aria-hidden="true" /> : <Arrow />}
            </button>
          </form>
        </RevealItem>

        {!started && (
          <RevealItem as="ul" className="fc-chips" aria-label="Try an example">
            {CHIPS.map(([label, question]) => (
              <li key={label}>
                <button type="button" className="fc-chip" onClick={() => ask(question)}>
                  {label}
                </button>
              </li>
            ))}
          </RevealItem>
        )}

        <AnimatePresence initial={false}>
          {started && (
            <motion.div
              key="thread"
              className="fc-panel"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="fc-thread" ref={threadRef} aria-live="polite" aria-busy={busy}>
                {turns.map((t, i) =>
                  t.role === 'user' ? (
                    <p key={i} className="fc-q">{t.content}</p>
                  ) : (
                    <div key={i} className="fc-a">
                      {t.content ? <Rich text={t.content} /> : <span className="fc-dots" aria-label="Thinking"><i /><i /><i /></span>}
                    </div>
                  ),
                )}
              </div>
              {answered && <FitLead turns={turns} startedAt={startedAt.current} />}
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  )
}

/** The contact card under the first answer → /api/lead → GHL, with the transcript. */
function FitLead({ turns, startedAt }: { turns: Turn[]; startedAt: number }) {
  const id = useId()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [first, setFirst] = useState('')
  const [err, setErr] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('company_site')) return
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const email = String(data.get('email') || '').trim()
    if (!name) return setErr('Add your name.')
    if (phone.replace(/\D/g, '').length < 10) return setErr('Add a phone number we can reach you on.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Add an email like you@business.com.')
    setErr('')
    setStatus('sending')
    const transcript = turns
      .map((t) => `${t.role === 'user' ? 'Visitor' : 'StayBooked'}: ${tidy(t.content)}`)
      .join('\n\n')
      .slice(-5_800)
    const [firstName, ...rest] = name.split(/\s+/)
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: rest.join(' '),
          full_name: name,
          phone,
          email,
          business: turns[0]?.content.slice(0, 120) ?? '',
          goal: 'Fit check',
          message: `Fit-check chat transcript:\n\n${transcript}`,
          source: 'website: fit-check chat',
          page: window.location.pathname,
          t: Math.round(performance.now() - startedAt),
          company_site: '',
        }),
      })
      if (!res.ok) throw new Error(`lead ${res.status}`)
      setFirst(firstName)
      setStatus('sent')
      track('lead_form_submit', { location: 'fit-check chat' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div className="fc-lead" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {status === 'sent' ? (
        <div className="fc-lead-done" role="status">
          <p className="fc-lead-title">Thanks{first ? `, ${first}` : ''}. We'll reach out shortly.</p>
          <p className="fc-lead-sub">Want to lock in a time now?</p>
          <a className="fc-book" href="/book">Pick a time <Arrow /></a>
        </div>
      ) : (
        <>
          <div className="fc-lead-head">
            <p className="fc-lead-title">Want us to map this out for your business?</p>
            <p className="fc-lead-sub">
              Leave your details and we'll reach out, or <a href="/book">book a free 15-minute call</a> now.
            </p>
          </div>
          <form className="fc-lead-form" onSubmit={onSubmit} noValidate>
            <label className="sr-only" htmlFor={`${id}-n`}>Your name</label>
            <input id={`${id}-n`} name="name" className="fc-field" placeholder="Name" autoComplete="name" />
            <label className="sr-only" htmlFor={`${id}-p`}>Phone</label>
            <input id={`${id}-p`} name="phone" className="fc-field" placeholder="Phone" type="tel" inputMode="tel" autoComplete="tel" />
            <label className="sr-only" htmlFor={`${id}-e`}>Email</label>
            <input id={`${id}-e`} name="email" className="fc-field" placeholder="Email" type="email" autoComplete="email" />
            <input type="text" name="company_site" tabIndex={-1} autoComplete="off" className="lf-hp" aria-hidden="true" />
            <button type="submit" className="fc-send" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </form>
          {err && <p className="fc-err" role="alert">{err}</p>}
          {status === 'error' && (
            <p className="fc-err" role="alert">
              That didn't go through. Call or text <a href="tel:+18134805818">(813) 480-5818</a> or <a href="/book">book a time</a>.
            </p>
          )}
          <p className="fc-consent">
            By sending this you agree to be contacted by call, text or email about your inquiry. Msg and data rates may
            apply. Reply STOP to opt out. <a href="/privacy">Privacy policy</a>.
          </p>
        </>
      )}
    </motion.div>
  )
}
