import { useMemo, useState } from 'react'
import { track } from '@/lib/tracking'
import { LEAD_ENDPOINT } from '@/lib/leads'

/**
 * CostCalculator — the pricing section's live estimator, run as a
 * one-question-at-a-time flow: name, business, niche, job worth, volume,
 * response speed, then the numbers. Enter or Next advances, Back returns,
 * and the results screen keeps the lead capture (text me my estimate).
 *
 * The inputs mirror the sales one-pagers:
 *  - What do you do → niche (drives the recommended ad spend tier)
 *  - Average job/contract worth + contracts per month → their monthly
 *    new-business revenue, the number the system works to grow
 *  - Response speed → how much of that revenue slow follow-up likely leaks
 *
 * Every output is labeled a rough estimate, not a promise.
 */

/** Niche dropdown: the categories SBM serves, each with its specialties. */
const NICHE_GROUPS: { group: string; adSpend: number; options: string[] }[] = [
  {
    group: 'Medical & Health',
    adSpend: 2000,
    options: ['Dentist', 'Orthodontist', 'Med spa / aesthetics', 'Chiropractor', 'Physical therapy', 'Dermatology', 'Plastic surgery', 'Primary or concierge care'],
  },
  {
    group: 'Home Services',
    adSpend: 1500,
    options: ['Turf installation', 'Landscaping', 'Roofing', 'HVAC', 'Plumbing', 'Electrical', 'Pool service', 'Pest control', 'Remodeling', 'Solar'],
  },
  {
    group: 'Legal',
    adSpend: 2500,
    options: ['Personal injury', 'Family law', 'Criminal defense', 'Estate planning', 'Immigration', 'Business law'],
  },
  {
    group: 'Financial Services',
    adSpend: 2000,
    options: ['Life insurance agent', 'Financial advisor', 'Mortgage broker'],
  },
  {
    group: 'Real Estate',
    adSpend: 1500,
    options: ['Residential real estate agent', 'Luxury real estate agent', 'Real estate team or brokerage'],
  },
  {
    group: 'Lifestyle & Big-Ticket',
    adSpend: 1500,
    options: ['Wedding venue', 'Event venue', 'Boat or yacht charter', 'Premium experiences'],
  },
  {
    group: 'Rentals & Transactional',
    adSpend: 1000,
    options: ['Movers', 'Equipment rental', 'Vacation rental', 'Car or exotic rental'],
  },
  {
    group: 'Clubs',
    adSpend: 1000,
    options: ['Nightclub', 'Lounge'],
  },
  {
    group: 'Restaurants',
    adSpend: 1000,
    options: ['Restaurant', 'Private dining & events'],
  },
  { group: 'Other', adSpend: 1500, options: ['Something else'] },
]

/** Rough share of inquiries a business likely loses at each response speed.
 *  Anchored to the same speed-to-lead research the one-pagers cite. */
const RESPONSE_SPEEDS = [
  { label: 'Under 5 minutes', leak: 0.05 },
  { label: 'Within an hour', leak: 0.2 },
  { label: 'Same day', leak: 0.35 },
  { label: 'Next day or later', leak: 0.5 },
  { label: 'Not sure', leak: 0.35 },
]

const RETAINER = 2000

/** Number of questions before the results reveal. */
const Q_COUNT = 6

const usd = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US')

export default function CostCalculator() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [biz, setBiz] = useState('')
  const [niche, setNiche] = useState('')
  const [worth, setWorth] = useState('')
  const [count, setCount] = useState('')
  const [speed, setSpeed] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [leadError, setLeadError] = useState(false)

  /** Honeypot: hidden input spam bots love to fill; the relay silently
   *  drops those submissions. */
  const [honeypot, setHoneypot] = useState('')

  const next = () => setStep((s) => Math.min(s + 1, Q_COUNT))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const enterNext = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      next()
    }
  }

  const selected = useMemo(() => {
    for (const g of NICHE_GROUPS) if (g.options.includes(niche)) return g
    return null
  }, [niche])

  const worthN = parseFloat(worth) || 0
  const countN = parseFloat(count) || 0
  const speedObj = RESPONSE_SPEEDS.find((s) => s.label === speed) ?? null

  const adSpend = selected?.adSpend ?? null
  const total = adSpend !== null ? RETAINER + adSpend : null
  const revenue = worthN > 0 && countN > 0 ? worthN * countN : null
  const leak = revenue !== null && speedObj ? revenue * speedObj.leak : null

  const intro = name.trim() ? `${name.trim()}, h` : 'H'
  const bizName = biz.trim()

  const digits = phone.replace(/\D/g, '')
  const canSend = digits.length >= 10 || /.+@.+\..+/.test(email.trim())

  const submitLead = async () => {
    if (!canSend || sending) return
    setSending(true)
    setLeadError(false)
    try {
      const r = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          business: biz,
          company_website: honeypot,
          phone: digits.length >= 10 ? digits : '',
          email: email.trim(),
          niche,
          avgWorth: worthN,
          jobsPerMonth: countN,
          responseSpeed: speed,
          monthlyTotal: total,
          monthlyNewBusiness: revenue,
          monthlyLeak: leak,
        }),
      })
      if (!r.ok) throw new Error('send failed')
      setSent(true)
      track('lead_captured', {
        niche,
        monthly_total: total ?? 0,
        response_speed: speed,
      })
    } catch {
      setLeadError(true)
    } finally {
      setSending(false)
    }
  }

  const pct = (Math.min(step, Q_COUNT) / Q_COUNT) * 100

  return (
    <div className="cc cc-step">
      {/* Progress — question count and a hairline that fills as they go */}
      <div className="cc-progress" aria-hidden={step >= Q_COUNT}>
        <span className="cc-progress-label">
          {step < Q_COUNT ? `Question ${step + 1} of ${Q_COUNT}` : 'Your estimate'}
        </span>
        <div className="cc-progress-track">
          <div className="cc-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Question steps — one at a time, Enter or Next to advance */}
      {step < Q_COUNT && (
        <div className="cc-step-body" key={step}>
          {step === 0 && (
            <>
              <span className="cc-step-q">First, what's your name?</span>
              <input
                className="cc-step-input" type="text" value={name} autoFocus
                onChange={(e) => setName(e.target.value)} onKeyDown={enterNext}
                placeholder="First name" autoComplete="given-name"
              />
            </>
          )}
          {step === 1 && (
            <>
              <span className="cc-step-q">Nice to meet you{name.trim() ? `, ${name.trim()}` : ''}. What's the business called?</span>
              <input
                className="cc-step-input" type="text" value={biz} autoFocus
                onChange={(e) => setBiz(e.target.value)} onKeyDown={enterNext}
                placeholder="Your business" autoComplete="organization"
              />
            </>
          )}
          {step === 2 && (
            <>
              <span className="cc-step-q">What do you do?</span>
              <select
                className="cc-step-input cc-step-select" value={niche} autoFocus
                onChange={(e) => {
                  setNiche(e.target.value)
                  if (e.target.value) setTimeout(next, 250)
                }}
              >
                <option value="">Pick your specialty</option>
                {NICHE_GROUPS.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </>
          )}
          {step === 3 && (
            <>
              <span className="cc-step-q">What's an average new job or contract worth?</span>
              <span className="cc-step-hint">One project, or a year of maintenance on a contract. A rough estimate is fine.</span>
              <input
                className="cc-step-input" type="number" min="0" inputMode="decimal" value={worth} autoFocus
                onChange={(e) => setWorth(e.target.value)} onKeyDown={enterNext}
                placeholder="e.g. 2500"
              />
            </>
          )}
          {step === 4 && (
            <>
              <span className="cc-step-q">How many new jobs or contracts do you sign in a typical month?</span>
              <span className="cc-step-hint">A typical month is fine. It doesn't need to be exact.</span>
              <input
                className="cc-step-input" type="number" min="0" inputMode="numeric" value={count} autoFocus
                onChange={(e) => setCount(e.target.value)} onKeyDown={enterNext}
                placeholder="e.g. 8"
              />
            </>
          )}
          {step === 5 && (
            <>
              <span className="cc-step-q">When a new inquiry comes in, how fast does someone usually respond?</span>
              <div className="nx-chips cc-chips cc-step-chips" role="radiogroup" aria-label="Response speed">
                {RESPONSE_SPEEDS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    role="radio"
                    aria-checked={speed === s.label}
                    className={`nx-chip${speed === s.label ? ' nx-chip-active' : ''}`}
                    onClick={() => {
                      setSpeed(s.label)
                      setTimeout(next, 350)
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="cc-step-nav">
            <button type="button" className="cc-step-back" onClick={back} disabled={step === 0}>
              Back
            </button>
            <button type="button" className="cc-step-next" onClick={next}>
              {step === Q_COUNT - 1 ? 'See my estimate' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Results reveal — the estimate they just built, full width */}
      {step >= Q_COUNT && (
        <div className="cc-step-body cc-step-result" key="result">
          {total === null && revenue === null && leak === null ? (
            <>
              <span className="cc-step-q">Nothing to crunch yet.</span>
              <p className="cc-empty">
                Back up a question or two and tell us what you do — that's where the estimate comes from.
              </p>
              <div className="cc-step-nav">
                <button type="button" className="cc-step-back" onClick={back}>
                  Back
                </button>
              </div>
            </>
          ) : (
            <div className="cc-step-reveal">
              {bizName && <p className="cc-for">{bizName}, by the numbers:</p>}
              {total !== null && (
                <div className="cc-line cc-line-total">
                  <span className="cc-line-label">Your estimated monthly total with Stay Booked</span>
                  <span className="cc-line-value">{usd(total)}</span>
                  <span className="cc-breakdown">
                    {usd(RETAINER)} flat retainer + {usd(adSpend!)} ad spend{selected!.group === 'Other' ? '' : ` for ${selected!.group.toLowerCase()}`}. Ad spend goes
                    to the platforms, not to us. No startup fee, month to month.
                  </span>
                </div>
              )}
              {revenue !== null && (
                <div className="cc-line">
                  <span className="cc-line-label">Your typical month in signed new business</span>
                  <span className="cc-line-value">{usd(revenue)}</span>
                </div>
              )}
              {leak !== null && (
                <div className="cc-line cc-line-leak">
                  <span className="cc-line-label">
                    What {speed === 'Under 5 minutes' ? 'a slower team' : 'your current response time'} may be leaving on the table
                  </span>
                  <span className="cc-line-value">{usd(leak)}<span className="cc-per"> /mo</span></span>
                  <span className="cc-breakdown">
                    {speed === 'Under 5 minutes'
                      ? 'Your response time is already elite — the system keeps it there around the clock, weekends included.'
                      : `Inquiries contacted within 5 minutes are dramatically more likely to book. At your response speed, roughly ${Math.round((speedObj!.leak) * 100)}% of interested buyers sign with someone else first. Rough estimate, not a promise.`}
                  </span>
                </div>
              )}
              <p className="cc-verdict">
                {leak !== null && total !== null && leak > total
                  ? `${intro}ere's the picture: ${usd(total)}/mo to run the system, against roughly ${usd(leak)}/mo currently walking out the door.`
                  : `${intro}ere's your estimate — rough numbers, honest math.`}
              </p>

              {/* Lead capture: the estimate lands in their pocket, the lead lands in GHL */}
              {sent ? (
                <p className="cc-sent">
                  On its way{bizName ? `, ${bizName}` : ''}. Check your phone in the next minute — and
                  grab a time on the calendar whenever you're ready to talk.
                </p>
              ) : (
                <div className="cc-lead">
                  <p className="cc-lead-title">Want this estimate on your phone?</p>
                  <p className="cc-lead-sub">
                    We'll text you the numbers. No spam, no newsletter — the estimate and that's it.
                  </p>
                  <input
                    type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                    name="company_website" tabIndex={-1} autoComplete="off"
                    aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }}
                  />
                  <div className="cc-lead-fields">
                    <label className="cc-lead-field">
                      <span>Phone</span>
                      <input
                        type="tel" inputMode="tel" value={phone}
                        onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567"
                        autoComplete="tel"
                      />
                    </label>
                    <label className="cc-lead-field">
                      <span>Email (optional)</span>
                      <input
                        type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>
                  <button
                    type="button" className="cc-lead-btn" onClick={submitLead}
                    disabled={!canSend || sending}
                  >
                    {sending ? 'Sending…' : 'Text me my estimate'}
                  </button>
                  {leadError && (
                    <p className="cc-lead-error">
                      Couldn't send right now — Book a Call below works meanwhile.
                    </p>
                  )}
                </div>
              )}

              <div className="cc-step-nav cc-step-nav-result">
                <button type="button" className="cc-step-back" onClick={back}>
                  Back
                </button>
                <a className="contact-book-btn" href="/book">
                  Book a Call
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
