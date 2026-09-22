import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

export const INDUSTRIES = [
  {
    name: 'Home Services',
    desc: 'Cleaning, landscaping, HVAC, and every service that keeps homes running.',
  },
  {
    name: 'Trades & Construction',
    desc: 'Contractors, roofers, plumbers, electricians, and remodelers.',
  },
  {
    name: 'Legal',
    desc: 'Firms and solo attorneys who want a calendar of qualified consultations.',
  },
  {
    name: 'Fitness & Med Spas',
    desc: 'Gyms, studios, med spas, and wellness businesses built on bookings.',
  },
  {
    name: 'Professional Services',
    desc: 'Accountants, advisors, and every business that runs on appointments.',
  },
  {
    name: 'Healthcare & Medical',
    desc: 'Practices and clinics, with a compliance-first process built for regulated healthcare.',
    to: '/healthcare',
    linkLabel: 'See how we work with healthcare',
  },
  {
    name: 'Restaurants & Clubs',
    desc: 'Reservations, events, and private bookings, with fast sites and targeted ads.',
  },
  {
    name: 'Rentals & Transactional Services',
    desc: 'Businesses that book and get paid online, with pricing, checkout, and follow-up.',
  },
  {
    name: 'Brand & Product Promotion',
    desc: 'Product launches with landing pages built to convert and ads on Meta and Google.',
  },
]

/**
 * INDUSTRIES — hairline editorial list of the verticals we serve, so visitors
 * self-identify. Reuses the lp-point row rhythm; the healthcare row routes to
 * the dedicated /healthcare page. Header and rows reveal independently (never
 * one tall Reveal around the whole section).
 */
export default function Industries() {
  return (
    <section className="section section-offwhite" id="industries">
      <div className="wrap">
        <Reveal>
          <RevealItem as="p" className="label">Industries</RevealItem>
          <RevealItem as="h2" className="title">Who we help.</RevealItem>
          <RevealItem as="p" className="body why-body">
            If your business serves local customers, we can build for it. Here's where we spend most of our time.
          </RevealItem>
        </Reveal>

        <Reveal as="ul" className="lp-points ind-list" amount={0.15}>
          {INDUSTRIES.map((ind) => (
            <RevealItem as="li" className="lp-point ind-row" key={ind.name}>
              {ind.to ? (
                <Link className="ind-link" to={ind.to}>
                  <span className="ind-name">{ind.name}</span>
                  <span className="ind-desc">
                    {ind.desc}{' '}
                    <span className="ind-more">
                      {ind.linkLabel}
                      <svg
                        className="ind-arrow"
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 8h11M9 3.5 13.5 8 9 12.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </Link>
              ) : (
                <>
                  <span className="ind-name">{ind.name}</span>
                  <span className="ind-desc">{ind.desc}</span>
                </>
              )}
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
