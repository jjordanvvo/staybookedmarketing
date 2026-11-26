/**
 * POST /api/lead — the only door into the GHL lead workflow.
 *
 * The site's lead form posts here; this function screens the submission and,
 * only if it passes, forwards it to the GHL inbound webhook. The webhook URL
 * lives in the GHL_LEAD_WEBHOOK_URL env var (Vercel project settings), so it
 * never ships to the browser or sits in this public repo.
 *
 * Screening, cheapest first:
 *  1. POST from our own site only (Origin check), small JSON body
 *  2. honeypot field empty, form open for at least 3 seconds
 *  3. fields valid: real-looking name, email, 10-15 digit phone, length caps
 *  4. rate limits: per IP, per email, and a ceiling on total forwards
 *
 * Rate limits are kept in memory. Vercel reuses a warm instance for many
 * requests, so they hold against a burst from one source; a cold instance
 * starts fresh, so they are a brake, not a vault. A Vercel Firewall rate-limit
 * rule on /api/lead is the durable layer on top (set in the dashboard).
 * Bots get a 200 with nothing forwarded, so they learn nothing.
 */

const ALLOWED_ORIGINS = new Set([
  'https://staybookedmarketing.com',
  'https://www.staybookedmarketing.com',
])
const MAX_BODY = 8_000 // bytes
const MIN_FILL_MS = 3_000

const MIN = 60_000
const HOUR = 60 * MIN
const LIMITS = {
  ipBurst: { max: 3, window: 10 * MIN }, // one person, a few honest retries
  ipDay: { max: 8, window: 24 * HOUR },
  email: { max: 2, window: 24 * HOUR }, // same email: no repeat alerts
  global: { max: 40, window: HOUR }, // ceiling on GHL runs per instance
}

const hits = new Map<string, number[]>()

/** Sliding-window counter. Returns true when the key is over its limit. */
function over(key: string, { max, window }: { max: number; window: number }, now: number, record: boolean) {
  const list = (hits.get(key) ?? []).filter((t) => now - t < window)
  const blocked = list.length >= max
  if (record && !blocked) list.push(now)
  hits.set(key, list)
  if (hits.size > 5_000) {
    // keep memory bounded: drop the oldest keys
    for (const k of Array.from(hits.keys()).slice(0, 1_000)) hits.delete(k)
  }
  return blocked
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function isAllowedOrigin(origin: string | null) {
  if (!origin) return false
  if (ALLOWED_ORIGINS.has(origin)) return true
  // Vercel preview deployments of this project, and local dev
  return /^https:\/\/staybookedmarketing[a-z0-9-]*\.vercel\.app$/.test(origin) || /^http:\/\/localhost:\d+$/.test(origin)
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  if (!isAllowedOrigin(origin)) return json(403, { ok: false })

  const raw = await request.text()
  if (raw.length > MAX_BODY) return json(413, { ok: false })
  let d: Record<string, unknown>
  try {
    d = JSON.parse(raw)
  } catch {
    return json(400, { ok: false })
  }

  // Bots: pretend it worked, forward nothing.
  const t = typeof d.t === 'number' ? d.t : 0
  if (str(d.company_site, 200) || t < MIN_FILL_MS) return json(200, { ok: true })

  const full = str(d.full_name, 80)
  const email = str(d.email, 120).toLowerCase()
  const phone = str(d.phone, 30)
  const digits = phone.replace(/\D/g, '')
  if (!full || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || digits.length < 10 || digits.length > 15) {
    return json(422, { ok: false })
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const now = Date.now()
  // check every limit before recording any, so a blocked request costs nothing
  const checks: [string, (typeof LIMITS)[keyof typeof LIMITS]][] = [
    [`ip10:${ip}`, LIMITS.ipBurst],
    [`ipday:${ip}`, LIMITS.ipDay],
    [`email:${email}`, LIMITS.email],
    ['global', LIMITS.global],
  ]
  if (checks.some(([k, l]) => over(k, l, now, false))) return json(429, { ok: false })
  for (const [k, l] of checks) over(k, l, now, true)

  const webhook = process.env.GHL_LEAD_WEBHOOK_URL
  if (!webhook) return json(503, { ok: false })

  const [first, ...rest] = full.split(/\s+/)
  const payload = new URLSearchParams({
    first_name: first,
    last_name: rest.join(' '),
    full_name: full,
    phone,
    email,
    business: str(d.business, 120),
    goal: str(d.goal, 60),
    message: str(d.message, 2_000),
    source: str(d.source, 60),
    page: str(d.page, 200),
  })
  try {
    const res = await fetch(webhook, { method: 'POST', body: payload, signal: AbortSignal.timeout(8_000) })
    if (!res.ok) return json(502, { ok: false })
  } catch {
    return json(502, { ok: false })
  }
  return json(200, { ok: true })
}
