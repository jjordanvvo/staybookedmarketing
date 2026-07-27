/**
 * Full-width feature image band — an easy-to-replace image slot.
 *
 * To drop in a real photo later, import it and replace the placeholder
 * <span> with:
 *   import feature from '@/assets/feature.jpg'
 *   <img className="feature-band-img" src={feature} alt="Stay Booked Marketing" />
 */
export default function FeatureBand() {
  return (
    <section className="feature-band" id="feature" aria-label="Featured image">
      <span className="feature-band-text">Image coming soon</span>
    </section>
  )
}
