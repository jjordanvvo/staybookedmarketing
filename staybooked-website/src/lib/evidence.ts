/** Speed-to-lead evidence used across the site (home, niche pages, the
 *  free-call page, the answer pages). Every figure comes from research
 *  published in 2026 and is quoted the way its source states it. Replace an
 *  entry when a newer study supersedes it; keep the source and date with it. */
export type Evidence = {
  /** The big number shown in the editorial stat style. */
  figure: string
  /** One plain sentence stating the finding. */
  text: string
  /** Who published it, what it measured, and when. */
  source: string
  /** Where a reader can check it. */
  url: string
}

export const SPEED_EVIDENCE: Evidence[] = [
  {
    figure: '74%',
    text: "74% of service businesses don't respond to a new lead within five minutes.",
    source: 'Blazeo 2026 Speed-to-Lead Benchmark Report, survey of 573 service businesses, September 2026',
    url: 'https://finance.yahoo.com/small-business/articles/blazeo-benchmark-finds-74-businesses-113000929.html',
  },
  {
    figure: '52%',
    text: 'Only 52% of people who call a home services business get to speak with a person.',
    source: 'Invoca Home Services Lead Conversion Benchmarks Report, July 2026',
    url: 'https://invoca.com/reports/the-invoca-home-services-lead-conversion-benchmarks-report-2026',
  },
  {
    figure: '58%',
    text: '58% of consumers expect a reply within seconds or minutes, and they ranked response speed as the top reason they stay loyal.',
    source: 'Moneypenny survey of 2,000 consumers, reported by Contracting Business, May 2026',
    url: 'https://www.contractingbusiness.com/industry-news/news/55380706/fast-response-times-drive-home-services-customer-loyalty-survey-shows',
  },
]
