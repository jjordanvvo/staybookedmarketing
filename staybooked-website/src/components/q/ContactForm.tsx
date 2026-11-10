import { useState, type FormEvent } from 'react'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, TEAM_EMAILS } from '@/lib/content'

/**
 * A short note form. Submissions go to every founder's inbox at once
 * (FormSubmit relays to the first address and copies the rest), so whoever
 * is free answers first. FormSubmit sends a one-time activation email to
 * the first address before the very first message is delivered.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${TEAM_EMAILS[0]}`

type State = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<State>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('_honey')) return
    setState('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          contact: f.get('contact'),
          business: f.get('business'),
          message: f.get('message'),
          _subject: `New website note from ${f.get('name') || 'a visitor'}`,
          _cc: TEAM_EMAILS.slice(1).join(','),
          _template: 'table',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('sent')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="q-form-done" role="status">
        <p className="q-form-done-head">Got it. Thank you.</p>
        <p>One of us will get back to you shortly. If it can't wait, call {PHONE_DISPLAY}.</p>
      </div>
    )
  }

  return (
    <form className="q-form" onSubmit={submit}>
      <div className="q-field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" name="name" required autoComplete="name" />
      </div>
      <div className="q-field">
        <label htmlFor="cf-contact">Phone or email</label>
        <input id="cf-contact" name="contact" required autoComplete="email" />
      </div>
      <div className="q-field">
        <label htmlFor="cf-business">Your business</label>
        <input id="cf-business" name="business" placeholder="e.g. HVAC in Sacramento" />
      </div>
      <div className="q-field">
        <label htmlFor="cf-message">What's going on? <em>optional</em></label>
        <textarea id="cf-message" name="message" rows={3} />
      </div>
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="q-honey" aria-hidden="true" />
      <div className="q-form-end">
        <button className="q-btn q-btn-ghost" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending' : 'Send'}
        </button>
        <span className="q-form-fine">Goes straight to all five founders.</span>
      </div>
      {state === 'error' && (
        <p className="q-form-err" role="alert">
          That didn't go through. Call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> or email{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      )}
    </form>
  )
}
