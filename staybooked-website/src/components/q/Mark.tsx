import mark from '@/assets/sbm-mark.png'

/** The SBM. letters on their own, no box. Drawn as a mask so the colour
 *  comes from CSS (`color`), which keeps it crisp on any background. */
export default function Mark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`q-mark ${className}`}
      style={{ WebkitMaskImage: `url(${mark})`, maskImage: `url(${mark})` }}
      role="img"
      aria-label="Stay Booked Marketing"
    />
  )
}
