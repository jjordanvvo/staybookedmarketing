/**
 * /api/lead — the calculator's "Text me my estimate" capture.
 *
 * Forwards the lead to the SBM GoHighLevel sub-account via an Inbound
 * Webhook trigger URL (Vercel env: GHL_LEAD_WEBHOOK). GHL workflow then
 * creates/updates the contact and can fire the "your estimate" SMS.
 *
 * Until GHL_LEAD_WEBHOOK is configured this returns 503 and the calculator
 * shows its fallback (Book a Call) — the funnel never breaks.
 */

const MAX = {
  name: 80,
  business: 120,
  phone: 20,
  email: 120,
  niche: 80,
  responseSpeed: 40,
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function num(v: unknown): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : NaN
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method_not_allowed' })
    return
  }

  const b = req.body ?? {}
  const lead = {
    source: 'sbm-calculator',
    page: 'https://staybookedmarketing.com/#pricing',
    submittedAt: new Date().toISOString(),
    name: str(b.name, MAX.name),
    business: str(b.business, MAX.business),
    phone: str(b.phone, MAX.phone),
    email: str(b.email, MAX.email),
    niche: str(b.niche, MAX.niche),
    avgWorth: num(b.avgWorth),
    jobsPerMonth: num(b.jobsPerMonth),
    responseSpeed: str(b.responseSpeed, MAX.responseSpeed),
    monthlyTotal: num(b.monthlyTotal),
    monthlyNewBusiness: num(b.monthlyNewBusiness),
    monthlyLeak: num(b.monthlyLeak),
  }

  if (!lead.phone && !lead.email) {
    res.status(400).json({ ok: false, reason: 'phone_or_email_required' })
    return
  }

  const webhook = process.env.GHL_LEAD_WEBHOOK?.trim()
  if (!webhook) {
    res.status(503).json({ ok: false, reason: 'not_configured' })
    return
  }

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) throw new Error(`webhook ${r.status}`)
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(502).json({ ok: false, reason: 'webhook_failed' })
  }
}
