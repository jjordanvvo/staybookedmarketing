/**
 * Tiny client-side search — no third-party service, no runtime fetch.
 *
 * The index (see searchIndex.ts) is a flat list of entries assembled at build
 * time from the same content constants the sections render, so a search result
 * can never drift from what's on the page. Matching is token-based: every
 * query token must hit somewhere in an entry (exact, prefix, or a small
 * edit-distance so misspellings still land), with title/keyword hits weighted
 * well above body hits.
 */

export type SearchEntry = {
  /** What the result shows — a heading, question, or row name. */
  title: string
  /** Section label, e.g. "Industries" or "FAQ". */
  section: string
  /** Page name, e.g. "Home" or "Healthcare". */
  page: string
  /** Route, with a hash for section anchors: "/#pricing", "/healthcare#faq". */
  path: string
  /** Body copy the result represents (searched, not displayed). */
  text: string
  /** Extra search terms that count like title hits ("price cost rate"). */
  keywords?: string
}

type Prepared = {
  entry: SearchEntry
  head: string[]
  body: string[]
}

const WEIGHTS = {
  exact: [10, 4],
  prefix: [6, 2.5],
  fuzzy: [3, 1.2],
} as const

/** Light plural stem so "ads" meets "ad" and "restaurants" meets "restaurant". */
function stem(t: string) {
  if (t.length > 3 && t.endsWith('ies')) return t.slice(0, -3) + 'y'
  if (t.length > 3 && t.endsWith('es') && !t.endsWith('ses')) return t.slice(0, -2)
  if (t.length > 2 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1)
  return t
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/(\d),(\d)/g, '$1$2')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1)
    .map(stem)
}

function unique(tokens: string[]) {
  return Array.from(new Set(tokens))
}

/** Damerau-Levenshtein (optimal string alignment) distance, capped early. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const prev2: number[] = []
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let curr: number[] = []
  for (let i = 1; i <= a.length; i++) {
    curr = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1)
      }
      curr[j] = v
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
    prev2.splice(0, prev2.length, ...prev)
    prev = curr
  }
  return prev[b.length]
}

function fuzzyAllowance(q: string) {
  if (q.length >= 8) return 2
  if (q.length >= 4) return 1
  return 0
}

/** Best match quality of one query token against a token list: 0 = none. */
function matchTokens(q: string, tokens: string[], tier: 0 | 1): number {
  let best = 0
  const allow = fuzzyAllowance(q)
  for (const t of tokens) {
    if (t === q) return WEIGHTS.exact[tier]
    if (t.startsWith(q)) {
      best = Math.max(best, WEIGHTS.prefix[tier])
      continue
    }
    if (allow && best < WEIGHTS.fuzzy[tier]) {
      // Whole-token distance, or distance against the same-length prefix so
      // "resturant" still reaches "restaurants".
      if (
        editDistance(q, t, allow) <= allow ||
        (t.length > q.length && editDistance(q, t.slice(0, q.length), allow) <= allow)
      ) {
        best = WEIGHTS.fuzzy[tier]
      }
    }
  }
  return best
}

export function prepare(index: SearchEntry[]): Prepared[] {
  return index.map((entry) => ({
    entry,
    head: unique(tokenize(`${entry.title} ${entry.section} ${entry.keywords ?? ''}`)),
    body: unique(tokenize(`${entry.text} ${entry.page}`)),
  }))
}

export function search(prepared: Prepared[], query: string, limit = 8): SearchEntry[] {
  const terms = unique(tokenize(query))
  if (terms.length === 0) return []

  const scored: { entry: SearchEntry; score: number; order: number }[] = []
  prepared.forEach((p, order) => {
    let score = 0
    for (const q of terms) {
      const s = Math.max(matchTokens(q, p.head, 0), matchTokens(q, p.body, 1))
      if (s === 0) return
      score += s
    }
    scored.push({ entry: p.entry, score, order })
  })

  // Ties keep index order, which lists the home page first.
  scored.sort((a, b) => b.score - a.score || a.order - b.order)
  return scored.slice(0, limit).map((s) => s.entry)
}
