import { useEffect, useMemo, useState } from 'react'
import { track } from '@/lib/tracking'
import {
  PROGRAM, TRADES, GROUP_ORDER, SPEED_OPTIONS,
  computeProjection, fmtUSD, fmtClients, plural,
  type Trade, type Projection,
} from '@/lib/growthModel'

/**
 * CostCalculator — the Stay Booked Growth Calculator, built to Trevor's
 * Sept 24 spec. Seven questions (easy first, money in the middle, follow-up
 * speed last), then an instant personalized growth projection styled after
 * the LEGACI canvas. No contact info required to see the numbers.
 *
 * All benchmarks, program costs, ramps and trade wording live in
 * src/lib/growthModel.ts — one config object, no numbers duplicated here.
 *
 * Every results page carries the illustrative-projection label. It is a
 * projection built from the prospect's numbers plus published industry
 * benchmarks — never presented as a case study or a client result.
 */

const Q_COUNT = 7
const SMS_CTA = '813-480-5818'
const SMS_LINK = 'sms:+18134805818'
const PROJECTION_ENDPOINT =
  'https://ai-jakey-27b6a498.base44.app/functions/sbmProjectionLead'

/** The projection disclaimer — spec-required wording, verbatim. */
const LABEL =
  'This is an illustrative projection, not a guarantee or a past client result. It combines the numbers you entered with published industry benchmarks. Actual results vary with your market, pricing, offer and follow-up.'

/** Encode the seven answers into a shareable, unique link. */
function encodeShare(d: ShareData): string {
  return btoa(encodeURIComponent(JSON.stringify(d)))
}
interface ShareData {
  n: string; b: string; t: string; o: string
  p: number; c: number; v: number; s: string
}
function decodeShare(hash: string): ShareData | null {
  try {
    const d = JSON.parse(decodeURIComponent(atob(hash)))
    if (typeof d === 'object' && d !== null && 'p' in d) return d as ShareData
  } catch { /* malformed link — just start fresh */ }
  return null
}

export default function CostCalculator() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [biz, setBiz] = useState('')
  const [tradeLabel, setTradeLabel] = useState('')
  const [otherText, setOtherText] = useState('')
  const [price, setPrice] = useState('')
  const [cost, setCost] = useState('')
  const [volume, setVolume] = useState('')
  const [speed, setSpeed] = useState('')
  const [err, setErr] = useState('')

  // Lead capture — optional, never blocks the results
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [leadError, setLeadError] = useState(false)
  const [copied, setCopied] = useState(false)

  /** Restore a shared projection from the URL hash on load. */
  useEffect(() => {
    const m = window.location.hash.match(/growth=([A-Za-z0-9+/=]+)/)
    if (!m) return
    const d = decodeShare(m[1])
    if (!d) return
    setName(d.n); setBiz(d.b); setTradeLabel(d.t); setOtherText(d.o || '')
    setPrice(String(d.p)); setCost(String(d.c)); setVolume(String(d.v)); setSpeed(d.s)
    setStep(Q_COUNT)
  }, [])

  const trade: Trade | null = useMemo(
    () => TRADES.find((t) => t.label === tradeLabel) ?? null,
    [tradeLabel],
  )

  const priceN = parseFloat(price) || 0
  const costN = parseFloat(cost) || 0
  const volumeN = parseFloat(volume) || 0
  const clientsNow = trade?.perYear ? volumeN / 12 : volumeN

  /** Live line under question 5 — profit per unit (or the split, for
   *  commission trades). Shows the moment both numbers exist. */
  const liveProfit = useMemo(() => {
    if (!trade || priceN <= 0 || costN <= 0) return null
    if (trade.commission) {
      if (costN >= priceN) return null
      return `That means about ${fmtUSD(priceN - costN)} of each commission goes to your brokerage split and fees.`
    }
    if (costN >= priceN) return null
    return `That leaves about ${fmtUSD(priceN - costN)} in profit per ${trade.unit}.`
  }, [trade, priceN, costN])

  const projection: Projection | null = useMemo(() => {
    if (!trade || step < Q_COUNT) return null
    if (priceN <= 0 || costN <= 0) return null
    if (costN >= priceN) return null
    if (volumeN <= 0 || !speed) return null
    return computeProjection({
      trade, price: priceN, q5Value: costN,
      clientsPerMonth: clientsNow, speed,
    })
  }, [trade, step, priceN, costN, volumeN, speed, clientsNow])

  const next = () => {
    setErr('')
    // Validate the current question before moving on.
    if (step === 2 && !tradeLabel) return
    if (step === 2 && tradeLabel === 'Something else' && !otherText.trim()) {
      setErr('What kind of business is it? A word or two is fine.')
      return
    }
    if (step === 3 && !(priceN > 0)) {
      setErr('A number above zero keeps the math honest — an estimate is fine.')
      return
    }
    if (step === 4) {
      if (!(costN > 0)) { setErr('A number above zero keeps the math honest — an estimate is fine.'); return }
      if (costN >= priceN) { setErr('Your cost is at or above your price — double-check these two numbers.'); return }
    }
    if (step === 5 && !(volumeN > 0)) {
      setErr('A typical month is fine — one number above zero.')
      return
    }
    const s = Math.min(step + 1, Q_COUNT)
    setStep(s)
    if (s === Q_COUNT) {
      track('projection_viewed', { trade: tradeLabel, group: trade?.group ?? '' })
      // Give each result its unique link.
      const payload: ShareData = {
        n: name.trim(), b: biz.trim(), t: tradeLabel, o: otherText.trim(),
        p: priceN, c: costN, v: volumeN, s: speed,
      }
      window.history.replaceState(null, '', `#growth=${encodeShare(payload)}`)
    }
  }
  const back = () => { setErr(''); setStep((s) => Math.max(s - 1, 0)) }
  const enterNext = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); next() }
  }

  /** Share link for this exact result. */
  const shareLink = useMemo(() => {
    const payload: ShareData = {
      n: name.trim(), b: biz.trim(), t: tradeLabel, o: otherText.trim(),
      p: priceN, c: costN, v: volumeN, s: speed,
    }
    return `${window.location.origin}${window.location.pathname}#growth=${encodeShare(payload)}`
  }, [name, biz, tradeLabel, otherText, priceN, costN, volumeN, speed])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* clipboard unavailable */ }
  }

  /** Email the lead to the relay — the CRM and Trevor's alert hang off it. */
  const submitEmail = async () => {
    const e = email.trim()
    if (!/.+@.+\..+/.test(e) || sending) return
    setSending(true)
    setLeadError(false)
    try {
      const r = await fetch(PROJECTION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_website: honeypot, // honeypot — humans never see it
          name: name.trim(), business: biz.trim(), email: e,
          trade: tradeLabel, otherTrade: tradeLabel === 'Something else' ? otherText.trim() : '',
          price: priceN, cost: costN, clientsPerMonth: clientsNow,
          speed, shareLink,
          profitPerClient: projection?.profitPerClient,
          profitToday: projection?.profitToday,
          newClients: projection?.newClients,
          addedProfitMonthly: projection?.addedProfit,
          profit12: projection?.profit12,
          backPerDollar: projection?.backPerDollar,
        }),
      })
      if (!r.ok) throw new Error('send failed')
      setSent(true)
      track('projection_lead_captured', {
        trade: tradeLabel, group: trade?.group ?? '', email_captured: true,
      })
    } catch {
      setLeadError(true)
    } finally {
      setSending(false)
    }
  }

  /** "Send me a copy" PDF — generated right in the browser, nothing to send. */
  const downloadPdf = async () => {
    track('projection_pdf_download', { trade: tradeLabel })
    try {
      const mod = await (Function('return import("https://unpkg.com/jspdf@2.5.2/dist/jspdf.es.min.js")')() as Promise<{ jsPDF: new () => any }>)
      const doc = new mod.jsPDF()
      const p = projection!
      const u = trade!.unit
      doc.setFont('helvetica', 'bold'); doc.setFontSize(20)
      doc.text(`Projected growth model — ${biz.trim() || 'Your business'}`, 14, 20)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(90)
      doc.text(`Prepared for ${name.trim() || 'you'} · ${tradeLabel}${otherText.trim() ? ` (${otherText.trim()})` : ''}`, 14, 28)
      doc.setTextColor(0); doc.setFontSize(13)
      doc.text('What 5-minute follow-up could add, per month at full ramp:', 14, 42)
      doc.setFontSize(11)
      const rows: [string, string][] = [
        ['Profit today', `${fmtUSD(p.profitToday)} /mo`],
        ['Program cost', `${fmtUSD(PROGRAM.costMonthly)} /mo`],
        ['Profit with Stay Booked, after fees', `${fmtUSD(p.profitFull)} /mo`],
        ['Added profit each month', `${fmtUSD(p.addedProfit)} /mo`],
        ['', ''],
        ['Additional clients per month at full ramp', `${fmtClients(p.newClients)} ${plural(u, 2)}`],
        ['Additional clients, first 6 months', `${fmtClients(p.newClients6)} ${plural(u, 2)}`],
        ['Profit from additional clients, year one', fmtUSD(p.profit12)],
        ['Left after the $42,000 program cost', fmtUSD(p.leftAfter12)],
        ['Break-even', `${fmtClients(p.breakEven)} ${plural(u, 2)} a month`],
        ['Back per $1 invested', `$${p.backPerDollar.toFixed(1)}`],
      ]
      let y = 54
      for (const [k, v] of rows) {
        doc.text(k, 14, y); doc.text(v, 200, y, { align: 'right' }); y += 9
      }
      doc.setFontSize(8.5); doc.setTextColor(110)
      doc.text(doc.splitTextToSize(LABEL, 180), 14, y + 4)
      doc.save(`stay-booked-projection-${(biz.trim() || 'growth').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`)
    } catch {
      // PDF library couldn't load — the print dialog still gets them a copy.
      window.print()
    }
  }

  const pct = (Math.min(step, Q_COUNT) / Q_COUNT) * 100
  const showResults = step >= Q_COUNT && projection !== null

  return (
    <div className="gc">
      {/* ---------------- Stepper ---------------- */}
      {step < Q_COUNT && (
        <div className="gc-quiz" key={step}>
          <div className="gc-progress" aria-hidden={step >= Q_COUNT}>
            <span className="gc-progress-label">Question {step + 1} of {Q_COUNT}</span>
            <div className="gc-progress-track">
              <div className="gc-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="gc-step-body" key={step}>
            {step === 0 && (
              <>
                <span className="gc-q">What is your first name?</span>
                <input className="gc-input" type="text" value={name} autoFocus
                  onChange={(e) => setName(e.target.value)} onKeyDown={enterNext}
                  placeholder="First name" autoComplete="given-name" />
              </>
            )}
            {step === 1 && (
              <>
                <span className="gc-q">What is the name of your business?</span>
                <input className="gc-input" type="text" value={biz} autoFocus
                  onChange={(e) => setBiz(e.target.value)} onKeyDown={enterNext}
                  placeholder="Your business" autoComplete="organization" />
              </>
            )}
            {step === 2 && (
              <>
                <span className="gc-q">What type of business do you run?</span>
                <select className="gc-input gc-select" value={tradeLabel} autoFocus
                  onChange={(e) => { setTradeLabel(e.target.value); setErr('') }}>
                  <option value="">Pick your trade</option>
                  {GROUP_ORDER.map((g) => (
                    <optgroup key={g} label={g}>
                      {TRADES.filter((t) => t.group === g).map((t) => (
                        <option key={t.label} value={t.label}>{t.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {tradeLabel === 'Something else' && (
                  <input className="gc-input gc-input-mt" type="text" value={otherText} autoFocus
                    onChange={(e) => setOtherText(e.target.value)} onKeyDown={enterNext}
                    placeholder="What kind of business is it?" />
                )}
              </>
            )}
            {step === 3 && trade && (
              <>
                <span className="gc-q">{trade.q4}</span>
                <span className="gc-hint">An estimate is fine.{trade.varies ? ` ${trade.varies}` : ''}</span>
                <div className="gc-money">
                  <span className="gc-money-symbol">$</span>
                  <input className="gc-input gc-input-money" type="number" min="0" inputMode="decimal" value={price} autoFocus
                    onChange={(e) => setPrice(e.target.value)} onKeyDown={enterNext}
                    placeholder={trade.commission ? 'e.g. 9000' : 'e.g. 3500'} />
                </div>
              </>
            )}
            {step === 4 && trade && (
              <>
                <span className="gc-q">{trade.q5}</span>
                <span className="gc-hint">An estimate is fine.{trade.varies ? ` ${trade.varies}` : ''}</span>
                <div className="gc-money">
                  <span className="gc-money-symbol">$</span>
                  <input className="gc-input gc-input-money" type="number" min="0" inputMode="decimal" value={cost} autoFocus
                    onChange={(e) => setCost(e.target.value)} onKeyDown={enterNext}
                    placeholder={trade.commission ? 'e.g. 6500' : 'e.g. 1400'} />
                </div>
                {liveProfit && <span className="gc-live">{liveProfit}</span>}
              </>
            )}
            {step === 5 && trade && (
              <>
                <span className="gc-q">{trade.q6}</span>
                <span className="gc-hint">
                  {trade.perYear
                    ? 'A typical year is fine. Agents think in annual volume.'
                    : 'A typical month is fine. It doesn\u2019t need to be exact.'}
                </span>
                <input className="gc-input" type="number" min="0" inputMode="numeric" value={volume} autoFocus
                  onChange={(e) => setVolume(e.target.value)} onKeyDown={enterNext}
                  placeholder={trade.perYear ? 'e.g. 24' : 'e.g. 8'} />
              </>
            )}
            {step === 6 && (
              <>
                <span className="gc-q">When a new inquiry comes in, how quickly does your team respond, on average?</span>
                <div className="gc-chips" role="radiogroup" aria-label="Response speed">
                  {SPEED_OPTIONS.map((s) => (
                    <button key={s} type="button" role="radio" aria-checked={speed === s}
                      className={`gc-chip${speed === s ? ' gc-chip-on' : ''}`}
                      onClick={() => { setSpeed(s); setErr(''); setTimeout(next, 300) }}>
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {err && <span className="gc-error">{err}</span>}
            <div className="gc-nav">
              <button type="button" className="gc-back" onClick={back} disabled={step === 0}>Back</button>
              <button type="button" className="gc-next" onClick={next}>
                {step === Q_COUNT - 1 ? 'See my projection' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Results ---------------- */}
      {step >= Q_COUNT && !projection && (
        <div className="gc-results">
          <span className="gc-q">Something\u2019s missing from the math.</span>
          <p className="gc-note">Back up a question or two and check your numbers — every one needs a value above zero.</p>
          <button type="button" className="gc-back" onClick={back}>Back</button>
        </div>
      )}

      {showResults && projection && trade && (() => {
        const p = projection
        const u = trade.unit
        const bizName = biz.trim() || 'your business'
        const fastPct = Math.round(p.group.fastRate * 1000) / 10
        const multipleTxt = p.multiple > 0 && isFinite(p.multiple)
          ? `About ${p.multiple.toFixed(1)}\u00d7 more profit in year one` : null

        return (
          <div className="gc-results">
            {/* 1. Header */}
            <header className="gc-head">
              <span className="gc-pill">Illustrative projection</span>
              <p className="gc-prepared">Projected growth model · Prepared for {name.trim() || 'you'} · {bizName}</p>
              <h3 className="gc-headline">What 5-minute follow-up could add for {bizName}</h3>
              <p className="gc-tradeline">{tradeLabel}{otherText.trim() && tradeLabel === 'Something else' ? ` (${otherText.trim()})` : ''}</p>
            </header>

            {/* 2. Before and after, per month at full ramp */}
            <section className="gc-band">
              <div className="gc-stat">
                <span className="gc-stat-label">Profit today</span>
                <span className="gc-stat-value">{fmtUSD(p.profitToday)}<em>/mo</em></span>
              </div>
              <div className="gc-stat">
                <span className="gc-stat-label">Program cost</span>
                <span className="gc-stat-value gc-stat-cost">{fmtUSD(PROGRAM.costMonthly)}<em>/mo</em></span>
              </div>
              <div className="gc-stat gc-stat-hi">
                <span className="gc-stat-label">Profit with Stay Booked, after fees</span>
                <span className="gc-stat-value">{fmtUSD(p.profitFull)}<em>/mo</em></span>
              </div>
              <div className="gc-stat gc-stat-hi">
                <span className="gc-stat-label">Added profit each month</span>
                <span className="gc-stat-value gc-stat-emerald">{p.addedProfit >= 0 ? '+' : ''}{fmtUSD(p.addedProfit)}<em>/mo</em></span>
              </div>
            </section>

            {/* 3. How this model is built */}
            <section className="gc-assumptions">
              <h4>How this model is built</h4>
              <ul>
                <li><strong>Your numbers</strong> — {fmtUSD(priceN)} average {u} value, {fmtUSD(p.profitPerClient)} profit per {u}, {fmtClients(clientsNow)} {plural(u, clientsNow)} a month.</li>
                <li><strong>Lead volume</strong> — {fmtUSD(PROGRAM.adSpend)} a month buys {fmtClients(p.leads)} leads at {fmtUSD(p.group.cpl)} per lead ({trade.group} benchmark).</li>
                <li><strong>Close rate</strong> — {fastPct}% of leads become clients when every lead gets a 5-minute response.</li>
                <li><strong>Your current follow-up</strong> — {speed.toLowerCase()}.</li>
                <li><strong>Additional clients</strong> — stacked on top of the {plural(u, clientsNow)} you already sign. We never touch your referral base.</li>
                {trade.repeat && (
                  <li><strong>New-client value</strong> — the first year of a new {u} is worth about {fmtUSD(p.newValue)} to you: {trade.repeat.note}.</li>
                )}
              </ul>
            </section>

            {/* 4. Clients per month */}
            <section className="gc-sum">
              <h4>Clients per month, at full ramp</h4>
              <div className="gc-sum-row">
                <span className="gc-sum-today">Today, without us</span>
                <strong>{fmtClients(clientsNow)} {plural(u, clientsNow)}</strong>
              </div>
              <div className="gc-sum-row gc-sum-add">
                <span>Additional {plural(u, 2)} when working with Stay Booked</span>
                <strong>+{fmtClients(p.newClients)} {plural(u, p.newClients)}</strong>
              </div>
              <div className="gc-sum-row gc-sum-total">
                <span>Total, after the {fmtUSD(PROGRAM.costMonthly)} program cost</span>
                <strong>{fmtClients(p.clientsFull)} {plural(u, p.clientsFull)} → {fmtUSD(p.profitFull)} a month</strong>
              </div>
              <p className="gc-sum-note">Additional means on top of what you already sign — never a smaller number relabeled.</p>
            </section>

            {/* 5. Chart */}
            <section className="gc-chartwrap">
              {multipleTxt && <p className="gc-chart-title">{multipleTxt}</p>}
              <GrowthChart grey={p.greyLine} emerald={p.emeraldLine} />
              <div className="gc-legend">
                <span className="gc-legend-item"><i className="gc-swatch gc-swatch-grey" />Today, without us</span>
                <span className="gc-legend-item"><i className="gc-swatch gc-swatch-emerald" />With Stay Booked, after fees</span>
              </div>
            </section>

            {/* 6. Speed callout — only when they answered slower than 5 minutes */}
            {p.currentSpeedClients !== null && (
              <section className="gc-speed">
                <h4>The only difference is speed</h4>
                <p>
                  The same {fmtClients(p.leads)} leads a month bring {fmtClients(p.currentSpeedClients)} {plural(u, p.currentSpeedClients)} at your current speed ({speed.toLowerCase()}).
                  Answered within 5 minutes: {fmtClients(p.newClients)}. The system makes 5-minute follow-up happen on every lead, around the clock.
                </p>
              </section>
            )}

            {/* 7. Year-one investment and return */}
            <section className="gc-yearone">
              <h4>Year one</h4>
              <div className="gc-yo-grid">
                <div className="gc-yo"><span>Program investment</span><strong>{fmtUSD(PROGRAM.costYearly)}</strong></div>
                <div className="gc-yo"><span>Profit from additional {plural(u, 2)}, 12 months</span><strong>{fmtUSD(p.profit12)}</strong></div>
                <div className="gc-yo"><span>Left after program cost</span><strong>{fmtUSD(p.leftAfter12)}</strong></div>
                <div className="gc-yo"><span>Break-even</span><strong>{fmtClients(p.breakEven)} {plural(u, p.breakEven)} a month</strong></div>
                <div className="gc-yo gc-yo-hi"><span>Return</span><strong>About ${p.backPerDollar.toFixed(1)} back for every $1 invested</strong></div>
              </div>

              {/* Optional copy — leaving it blank never blocks the results */}
              <div className="gc-copy">
                {sent ? (
                  <p className="gc-sent">On its way. Want to talk it through now? Text {SMS_CTA} and we\u2019ll walk through these numbers.</p>
                ) : (
                  <>
                    <p className="gc-copy-title">Want a copy of this projection?</p>
                    <input
                      type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                      name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                      style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }}
                    />
                    <div className="gc-copy-row">
                      <input className="gc-input gc-input-email" type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitEmail()}
                        placeholder="you@business.com" autoComplete="email" />
                      <button type="button" className="gc-next" onClick={submitEmail}
                        disabled={!/.+@.+\..+/.test(email.trim()) || sending}>
                        {sending ? 'Sending…' : 'Email me a copy'}
                      </button>
                    </div>
                    {leadError && <span className="gc-error">Couldn\u2019t send right now — text {SMS_CTA} and we\u2019ll get it to you.</span>}
                  </>
                )}
                <div className="gc-copy-actions">
                  <button type="button" className="gc-linkbtn" onClick={downloadPdf}>Download PDF</button>
                  <button type="button" className="gc-linkbtn" onClick={copyLink}>{copied ? 'Link copied' : 'Copy my link'}</button>
                </div>
              </div>
            </section>

            {/* 8. Projection label */}
            <section className="gc-label">
              <p>{LABEL}</p>
            </section>

            {/* 9. CTA */}
            <a className="gc-cta" href={SMS_LINK}>Text {SMS_CTA} for a free strategy call</a>

            {/* 10. Footer */}
            <footer className="gc-footer">
              <span className="gc-footer-src">{p.group.builtFrom}</span>
              <span className="gc-footer-site">staybookedmarketing.com · staybookedmarketing@gmail.com</span>
            </footer>

            <button type="button" className="gc-back gc-back-final" onClick={back}>Start over</button>
          </div>
        )
      })()}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The chart — cumulative profit, months 1-12                         */
/* ------------------------------------------------------------------ */

function GrowthChart({ grey, emerald }: { grey: number[]; emerald: number[] }) {
  const W = 720, H = 300, PAD_L = 64, PAD_R = 18, PAD_T = 18, PAD_B = 34
  const n = 12
  const all = [...grey, ...emerald, 0]
  const max = Math.max(...all)
  const min = Math.min(...all, 0)
  const span = max - min || 1
  const x = (m: number) => PAD_L + ((m - 1) / (n - 1)) * (W - PAD_L - PAD_R)
  const y = (v: number) => PAD_T + (1 - (v - min) / span) * (H - PAD_T - PAD_B)
  const pts = (arr: number[]) => arr.map((v, i) => `${x(i + 1)},${y(v)}`).join(' ')
  const monthTicks = [1, 3, 6, 9, 12]

  return (
    <svg className="gc-chart" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label="Cumulative profit projection, months 1 to 12">
      {/* gridlines */}
      {monthTicks.map((m) => (
        <line key={`g${m}`} x1={x(m)} x2={x(m)} y1={PAD_T} y2={H - PAD_B}
          stroke="#13213A" strokeOpacity="0.08" strokeWidth="1" />
      ))}
      <line x1={PAD_L} x2={W - PAD_R} y1={y(0)} y2={y(0)}
        stroke="#13213A" strokeOpacity="0.25" strokeWidth="1" />

      {/* month labels */}
      {monthTicks.map((m) => (
        <text key={`m${m}`} x={x(m)} y={H - 12} textAnchor="middle"
          fontSize="11" fill="#13213A" fillOpacity="0.55" fontFamily="IBM Plex Sans, sans-serif">
          {`M${m}`}
        </text>
      ))}

      {/* today, without us */}
      <polyline points={pts(grey)} fill="none" stroke="#9A927F" strokeWidth="2.5" strokeLinejoin="round" />
      {/* with Stay Booked, after fees */}
      <polyline points={pts(emerald)} fill="none" stroke="#0B7A5E" strokeWidth="3.5" strokeLinejoin="round" />

      {/* month-6 marker on the emerald line */}
      <circle cx={x(6)} cy={y(emerald[5])} r="4" fill="#0B7A5E" />
      <text x={x(6)} y={y(emerald[5]) - 10} textAnchor="middle" fontSize="11.5" fontWeight="600"
        fill="#0B7A5E" fontFamily="IBM Plex Sans, sans-serif">
        {fmtUSD(emerald[5])}
      </text>

      {/* both month-12 totals */}
      <circle cx={x(12)} cy={y(grey[11])} r="3.5" fill="#9A927F" />
      <circle cx={x(12)} cy={y(emerald[11])} r="4" fill="#0B7A5E" />
      <text x={x(12) - 6} y={y(grey[11]) + (grey[11] <= emerald[11] ? 20 : -12)} textAnchor="end"
        fontSize="11.5" fontWeight="600" fill="#7A7263" fontFamily="IBM Plex Sans, sans-serif">
        {fmtUSD(grey[11])}
      </text>
      <text x={x(12) - 6} y={y(emerald[11]) - 12} textAnchor="end"
        fontSize="12" fontWeight="700" fill="#0B7A5E" fontFamily="IBM Plex Sans, sans-serif">
        {fmtUSD(emerald[11])}
      </text>
    </svg>
  )
}
