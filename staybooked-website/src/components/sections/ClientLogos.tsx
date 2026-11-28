/**
 * ClientLogos — the strip under the hero. The businesses we work with, each
 * logo recoloured to the site's gold (same mark, gold metal), sliding past in
 * a CSS-only loop. A soft light sweeps across each logo now and then, masked
 * to the logo's own shape. Pauses on hover; reduced motion shows a static row.
 *
 * Logos live in /public/clients (made from each client's own logo file).
 */
export const CLIENTS = [
  { name: 'Clearwater Central Catholic High School', src: '/clients/ccchs.png', w: 172, s: 1 },
  { name: 'Water Warehouse', src: '/clients/waterwarehouse.png', w: 306, s: 1.15 },
  { name: 'Alpha Mental Health Services', src: '/clients/alpha.png', w: 370, s: 1.18 },
  { name: 'Elk Grove Waterboy', src: '/clients/waterboy.png', w: 203, s: 1 },
  { name: 'PRG Real Estate', src: '/clients/prg.png', w: 200, s: 0.88 },
]

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="cl-track" aria-hidden={hidden || undefined}>
      {CLIENTS.map((c, i) => (
        <li key={c.name} className="cl-item" style={{ ['--i' as string]: i }}>
          <span className="cl-logo" style={{ ['--src' as string]: `url(${c.src})`, ['--ar' as string]: c.w / 200, ['--s' as string]: c.s }}>
            <img src={c.src} alt={hidden ? '' : c.name} width={c.w} height={200} loading="lazy" decoding="async" />
            <i className="cl-shine" aria-hidden="true" />
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function ClientLogos() {
  return (
    <section className="cl" id="clients" aria-label="Businesses we work with">
      <div className="cl-rail">
        <Track />
        <Track hidden />
        <Track hidden />
        <Track hidden />
      </div>
    </section>
  )
}
