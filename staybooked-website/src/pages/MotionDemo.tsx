import { Link } from 'react-router-dom'
import ParticleField from '@/components/originkit-sb/ParticleField'

/**
 * /motion — particle-hero test bench (branch: particle-hero).
 * Three live demos of the Casberry-style engine against the real SBM palette:
 *   1. text morph — the swarm forms the headline, holds, bursts, reforms
 *   2. drag sphere — pseudo-3D ball with spin inertia
 *   3. ambient — the hero-backdrop treatment (pointer-reactive, sits behind content)
 * Not linked from the main site; this route exists so the direction can be
 * reviewed on a live URL before anything touches production.
 */
export default function MotionDemo() {
  return (
    <main className="motion-page">
      <a className="motion-back" href="/">
        ← staybookedmarketing.com
      </a>

      {/* 1 — TEXT MORPH HERO ------------------------------------------------ */}
      <section className="motion-stage motion-stage--tall">
        <ParticleField mode="text" text="STAY BOOKED" density={9} />
        <div className="motion-caption motion-caption--bottom">
          <p className="motion-label">01 — Text morph</p>
          <p className="motion-note">
            The swarm assembles the headline, holds it, bursts, and reforms.
            Move your cursor through the letters.
          </p>
        </div>
      </section>

      {/* 2 — DRAG SPHERE ---------------------------------------------------- */}
      <section className="motion-stage">
        <ParticleField mode="sphere" density={12} />
        <div className="motion-caption motion-caption--top">
          <p className="motion-label">02 — Drag sphere</p>
          <p className="motion-note">
            Grab it and throw it. It spins with inertia and settles back to a
            slow idle turn.
          </p>
        </div>
      </section>

      {/* 3 — AMBIENT / HERO BACKDROP ---------------------------------------- */}
      <section className="motion-stage motion-stage--hero">
        <div className="motion-ambient-canvas">
          <ParticleField mode="ambient" density={4} intensity={1} />
        </div>
        <div className="motion-caption motion-caption--center">
          <p className="motion-label">03 — Ambient backdrop</p>
          <p className="motion-note">
            The treatment for the live hero: warm specks on a slow vortex, part
            around the pointer, and stay behind the logo.
          </p>
          <Link className="motion-cta" to="/">
            See it behind the real hero →
          </Link>
        </div>
      </section>

      <footer className="motion-foot">
        <p>
          Built custom on the particle-hero branch, zero new dependencies.
          Originkit CLI is wired (components.json) — one <code>originkit login</code>{' '}
          unlocks 573 registry components to drop in beside this engine.
        </p>
      </footer>
    </main>
  )
}
