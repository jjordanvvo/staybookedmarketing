import { NICHES, type Niche } from '@/lib/niches'

/** Words a visitor might type for each niche. Matching is loose on purpose:
 *  "roof", "dentist", "lawyer" should all land somewhere sensible. */
const KEYWORDS: Record<string, string[]> = {
  'home-services': ['home', 'contractor', 'roof', 'plumb', 'electric', 'hvac', 'heating', 'air', 'remodel', 'construction', 'pool', 'pest', 'landscap', 'lawn', 'clean', 'paint', 'solar', 'garage', 'handyman', 'trade', 'flooring', 'fence', 'tree', 'window', 'pressure', 'moving', 'movers', 'cabinet', 'kitchen', 'bath'],
  clubs: ['club', 'night', 'bar', 'lounge', 'venue', 'event', 'party', 'dj', 'bottle'],
  legal: ['law', 'lawyer', 'attorney', 'legal', 'firm', 'injury', 'divorce', 'immigration', 'dui', 'estate plan'],
  lifestyle: ['jewel', 'auto', 'car', 'dealer', 'boat', 'showroom', 'luxury', 'furniture', 'retail', 'watch', 'yacht', 'golf'],
  finance: ['financ', 'advisor', 'wealth', 'cpa', 'account', 'tax', 'insurance', 'mortgage', 'planner', 'bookkeep', 'loan'],
  medical: ['medic', 'health', 'doctor', 'clinic', 'dent', 'ortho', 'chiro', 'med spa', 'medspa', 'spa', 'botox', 'aesthetic', 'therap', 'physical', 'nurse', 'practice', 'wellness', 'iv therapy', 'derma', 'vet', 'optom', 'eye', 'mental', 'weight'],
  rentals: ['rental', 'rent', 'airbnb', 'vacation', 'equipment', 'tour', 'charter', 'property', 'storage', 'booking', 'reservation'],
  restaurants: ['restaurant', 'food', 'cafe', 'coffee', 'dining', 'catering', 'bakery', 'pizza', 'chef', 'brewery', 'winery'],
  brand: ['brand', 'product', 'ecommerce', 'e-commerce', 'online', 'shopify', 'etsy', 'amazon', 'launch', 'apparel', 'clothing', 'beauty', 'supplement', 'startup', 'app'],
  'real-estate': ['real estate', 'realtor', 'realty', 'agent', 'broker', 'home buy', 'listing', 'house'],
  'private-schools': ['school', 'academy', 'education', 'tutor', 'admission', 'prep', 'montessori', 'daycare', 'preschool', 'learning'],
}

export function findNiche(raw: string): Niche | null {
  const q = raw.trim().toLowerCase()
  if (q.length < 2) return null
  let best: { niche: Niche; score: number } | null = null
  for (const n of NICHES) {
    let score = 0
    if (n.name.toLowerCase().includes(q)) score = 3
    for (const k of KEYWORDS[n.id] ?? []) {
      // Keywords match at the start of a word ("roof" finds "roofing" but
      // "air" never finds "hair"); short ones must be the whole word.
      const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(k.length < 4 ? `\\b${esc}\\b` : `\\b${esc}`)
      if (re.test(q)) score = Math.max(score, k.length >= 4 ? 2 : 1)
    }
    if (score && (!best || score > best.score)) best = { niche: n, score }
  }
  return best?.niche ?? null
}

/** Shown in the input, one at a time, as gentle examples. */
export const FINDER_EXAMPLES = ['a roofing company', 'an online store', 'a med spa', 'a product brand', 'a law firm', 'a restaurant', 'a gym', 'a software startup']
