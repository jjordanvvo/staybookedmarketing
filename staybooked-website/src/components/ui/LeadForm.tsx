import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LEAD_WEBHOOK_URL } from '@/lib/booking'
import { track } from '@/lib/tracking'

/**
 * LeadForm — the site's own lead form (replaces the GoHighLevel iframe).
 * Posts to a GHL "Inbound Webhook" workflow trigger as form-encoded data (a
 * simple request, so no CORS preflight); the workflow creates the contact,
 * alerts Kolby and auto-replies, same as the old embedded form.
 */

const GOALS = ['Booked appointments', 'More calls', 'Reservations', 'Online sales', 'Something else']

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function LeadForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const id = useId()
  const [goal, setGoal] = useState(GOALS[0])
  const [status, setStatus] = useState<Status>('idle')
  const [first, setFirst] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('company_site')) return // honeypot: bots fill hidden fields
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const email = String(data.get('email') || '').trim()
    const next: Record<string, string> = {}
    if (!name) next.name = 'Add your name.'
    if (phone.replace(/\D/g, '').length < 10) next.phone = 'Add a phone number we can reach you on.'
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Add an email address like you@business.com.'
    setErrors(next)
    if (Object.keys(next).length) {
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }

    setStatus('sending')
    const [firstName, ...rest] = name.split(/\s+/)
    const body = new URLSearchParams({
      first_name: firstName,
      last_name: rest.join(' '),
      full_name: name,
      phone,
      email,
      business: String(data.get('business') || ''),
      goal,
      message: String(data.get('message') || ''),
      source: `website: ${source}`,
      page: window.location.pathname,
    })
    try {
      if (!LEAD_WEBHOOK_URL) throw new Error('no webhook configured')
      // no-cors: the webhook answers without CORS headers; a network failure still throws
      await fetch(LEAD_WEBHOOK_URL, { method: 'POST', mode: 'no-cors', body })
      setFirst(firstName)
      setStatus('sent')
      track('lead_form_submit', { location: source })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={`lf${compact ? ' lf-compact' : ''}`}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            className="lf-done"
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="lf-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <p className="lf-done-title">Got it{first ? `, ${first}` : ''}.</p>
            <p className="lf-done-body">We'll be in touch shortly. Want to skip the wait?</p>
            <a className="contact-book-btn" href="/book">Pick a time now</a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="lf-form"
            onSubmit={onSubmit}
            noValidate
            initial={false}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          >
            <fieldset className="lf-goals">
              <legend className="lf-label">What do you want more of?</legend>
              <div className="lf-chips">
                {GOALS.map((g) => (
                  <label key={g} className={`lf-chip${goal === g ? ' is-on' : ''}`}>
                    <input type="radio" name="goal" value={g} checked={goal === g} onChange={() => setGoal(g)} />
                    {g}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="lf-grid">
              <Field id={`${id}-name`} name="name" label="Your name" autoComplete="name" error={errors.name} />
              <Field id={`${id}-business`} name="business" label="Business" autoComplete="organization" optional />
              <Field id={`${id}-phone`} name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} />
              <Field id={`${id}-email`} name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
            </div>
            {!compact && (
              <div className="lf-field">
                <label className="lf-label" htmlFor={`${id}-msg`}>
                  Anything we should know? <span className="lf-opt">Optional</span>
                </label>
                <textarea id={`${id}-msg`} name="message" rows={3} className="lf-input lf-textarea" />
              </div>
            )}
            {/* honeypot */}
            <input type="text" name="company_site" tabIndex={-1} autoComplete="off" className="lf-hp" aria-hidden="true" />

            <div className="lf-foot">
              <button type="submit" className="lf-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'See what we can do'}
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M16.17 11 10.8 5.64l1.42-1.42L20 12l-7.78 7.78-1.42-1.42L16.17 13H4v-2z" fill="currentColor" /></svg>
              </button>
              <p className="lf-consent">
                By sending this you agree to be contacted by call, text or email about your inquiry. Message and
                data rates may apply. Reply STOP to opt out. See our <a href="/privacy">privacy policy</a>.
              </p>
            </div>
            {status === 'error' && (
              <p className="lf-error" role="alert">
                That didn't go through. Call or text us at <a href="tel:+18134805818">(813) 480-5818</a>, or{' '}
                <a href="/book">book a time</a> instead.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  inputMode,
  optional,
  error,
}: {
  id: string
  name: string
  label: string
  type?: string
  autoComplete?: string
  inputMode?: 'tel' | 'email' | 'text'
  optional?: boolean
  error?: string
}) {
  return (
    <div className={`lf-field${error ? ' has-error' : ''}`}>
      <label className="lf-label" htmlFor={id}>
        {label} {optional && <span className="lf-opt">Optional</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="lf-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && <span className="lf-field-err" id={`${id}-err`}>{error}</span>}
    </div>
  )
}
