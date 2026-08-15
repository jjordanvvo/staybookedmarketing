import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Reveal, RevealItem, EASE } from '@/components/ui/Reveal'
import logoTile from '@/assets/logo.webp'
import logo from '@/assets/logo-nav.webp'
import { BOOKING_URL } from '@/lib/booking'

const STEPS = [
  {
    num: '01',
    word: 'Advertise',
    desc: 'Targeted ads put your practice in front of people in your area actively seeking mental health care.',
  },
  {
    num: '02',
    word: 'Qualify',
    desc: 'Every lead is contacted and screened within minutes, so you only see real, qualified patients.',
  },
  {
    num: '03',
    word: 'Book',
    desc: 'Qualified patients are booked straight onto your calendar, ready for their appointment.',
  },
]

// Real, sourced speed-to-lead research — the figures are pulled out as the big
// editorial numbers; the sentences and sources render exactly as written.
const SPEED_STATS = [
  {
    figure: '21x',
    text: 'Responding to a lead within 5 minutes makes you 21x more likely to qualify them than waiting 30 minutes.',
    source: 'MIT / Harvard Business Review Lead Response Study',
  },
  {
    figure: '78%',
    text: '78% of patients book with the first practice that responds to them.',
    source: 'Lead Response Management research',
  },
  {
    figure: '7%',
    text: 'The average business takes 42 hours to respond. Only 7% respond within 5 minutes.',
    source: 'Lead Response Management Study',
  },
]

const WHY_POINTS = [
  'Month to month. We earn your business every month, no long contracts.',
  'We handle everything: ads, follow-up, qualification, and booking.',
  'You focus on your patients. We keep them coming.',
]

/**
 * Cinematic cold-open, played once on load (skipped entirely under
 * prefers-reduced-motion):
 *
 *   0.00s  tan curtain covers the screen
 *   0.00s  the SBM mark presses in — scale overshoots down like a stamp,
 *          sharpening from blur, then holds
 *   0.70s  a hairline "cut" draws across the center seam and fades
 *   1.05s  the curtain parts along the cut — top half up, bottom half down —
 *          revealing the hero beneath; the stamp dissolves as it opens
 *   1.95s  overlay unmounts
 *
 * Transform/opacity only; both panels and the mark are composited layers.
 */
function Intro({ onDone }: { onDone: () => void }) {
  return (
    <div className="lp-intro" aria-hidden="true">
      <motion.div
        className="lp-intro-panel lp-intro-top"
        initial={{ y: 0 }}
        animate={{ y: '-100.5%' }}
        transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
      />
      <motion.div
        className="lp-intro-panel lp-intro-bottom"
        initial={{ y: 0 }}
        animate={{ y: '100.5%' }}
        transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
        onAnimationComplete={onDone}
      />
      {/* The stamp — the actual logo tile, so it blends seamlessly into the
          tan curtain and reads as printed on it */}
      <motion.img
        className="lp-intro-mark"
        src={logoTile}
        alt=""
        initial={{ opacity: 0, scale: 1.18, filter: 'blur(12px)' }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [1.18, 0.985, 1, 1.06],
          filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'],
        }}
        transition={{ duration: 1.45, times: [0, 0.42, 0.78, 1], ease: EASE }}
      />
      {/* The cut line the curtain will part along */}
      <motion.div
        className="lp-intro-rule"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ delay: 0.7, duration: 0.8, times: [0, 0.55, 1], ease: EASE }}
      />
    </div>
  )
}

/**
 * /free-call — single-purpose ad landing page for psychiatric and mental
 * health practices. One job: convert ad traffic into a booked strategy call.
 * No nav, no distractions; every CTA is the booking calendar. The guarantee
 * band is the trust anchor, backed by sourced speed-to-lead research.
 *
 * Hero choreography (starts while the curtain is still parting, so the page
 * feels continuous): headline lines swing up from behind masks (1.12s/1.30s),
 * the giant outlined "Booked." ghost-mark breathes in behind the content
 * (1.55s) and drifts on scroll, support copy blur-rises (1.70s), and the CTA
 * springs in (1.95s) with a one-time sheen sweep (2.7s, CSS).
 */
export default function FreeCall() {
  const reduce = useReducedMotion()
  const [introDone, setIntroDone] = useState(false)
  const showIntro = !reduce && !introDone

  // Ghost-mark parallax: drifts down slightly as the hero scrolls away.
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 70])

  useEffect(() => {
    document.title = 'Book a Free Call | Stay Booked Marketing'
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [])

  // Safety net: animation clocks pause in hidden tabs, so a page opened in the
  // background plays its intro when the visitor arrives — good. But if the
  // completion callback ever failed to fire, the curtain would strand the page.
  // Retire the overlay after 5s of *visible* time, no matter what.
  useEffect(() => {
    if (reduce || introDone) return
    let timer: number | undefined
    const arm = () => {
      if (document.visibilityState === 'visible' && timer === undefined) {
        timer = window.setTimeout(() => setIntroDone(true), 5000)
      }
    }
    arm()
    document.addEventListener('visibilitychange', arm)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', arm)
    }
  }, [reduce, introDone])

  return (
    <>
      {showIntro && <Intro onDone={() => setIntroDone(true)} />}

      {/* 1. Minimal header — logo plus the booking CTA (the page's one job) */}
      <header className="simple-header">
        <Link to="/" className="simple-header-logo" aria-label="Stay Booked Marketing home">
          <img src={logo} alt="Stay Booked Marketing" />
        </Link>
        <a className="nav-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a Call</a>
      </header>

      {/* 2. Hero — bold statement + primary CTA, choreographed off the intro */}
      <section ref={heroRef} className="lp-hero">
        {/* Giant outlined ghost-mark — echoes the outlined service numbers */}
        <motion.span
          className="lp-ghost"
          aria-hidden="true"
          style={reduce ? undefined : { y: ghostY }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.55, duration: 1.4, ease: EASE }}
        >
          Booked.
        </motion.span>

        <div className="lp-hero-inner">
          <h1 className="lp-headline">
            <span className="lp-line-mask">
              <motion.span
                className="lp-line"
                initial={reduce ? false : { y: '115%', rotate: 2.5 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ delay: 1.12, duration: 0.95, ease: EASE }}
              >
                More Patients for Your Practice.
              </motion.span>
            </span>
            <span className="lp-line-mask">
              <motion.span
                className="lp-line"
                initial={reduce ? false : { y: '115%', rotate: 2.5 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ delay: 1.3, duration: 0.95, ease: EASE }}
              >
                Without the Chasing.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="body lp-support"
            initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.7, duration: 0.8, ease: EASE }}
          >
            We help psychiatric and mental health practices fill their calendars with qualified patients, using targeted ads and instant, automated follow-up. You focus on care. We keep the appointments coming.
          </motion.p>

          <motion.a
            className="contact-book-btn lp-cta-hero"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              opacity: { delay: 1.95, duration: 0.5, ease: EASE },
              y: { type: 'spring', stiffness: 90, damping: 14, delay: 1.95 },
              scale: { type: 'spring', stiffness: 90, damping: 14, delay: 1.95 },
            }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
          >
            Book a Free Call
          </motion.a>
        </div>
      </section>

      {/* 3. The guarantee — the trust anchor, set on its own ink band */}
      <section className="lp-guarantee">
        <Reveal className="wrap" amount={0.35}>
          <RevealItem as="p" className="label lp-guarantee-label">Our Guarantee</RevealItem>
          <RevealItem as="h2" className="title lp-guarantee-headline">
            10 booked appointments in 90 days. Or we work for free until you get them.
          </RevealItem>
          <RevealItem as="p" className="body lp-guarantee-body">
            We put our own skin in the game. If we don't deliver at least 10 booked patient appointments within 90 days, we keep working at no cost until we do. That's how confident we are in the system, and how serious we are about your results.
          </RevealItem>
        </Reveal>
      </section>

      {/* 4. The problem / hook — short and punchy */}
      <section className="section section-offwhite lp-hook">
        <Reveal className="wrap lp-narrow" amount={0.35}>
          <RevealItem as="h2" className="title">Getting interest is easy. Booking patients isn't.</RevealItem>
          <RevealItem as="p" className="body lp-hook-body">
            Most practices lose potential patients in the gap between interest and follow-up. Someone reaches out, waits, hears nothing for hours, and books with whoever responds first. We close that gap completely.
          </RevealItem>
        </Reveal>
      </section>

      {/* 5. Speed-to-lead proof — sourced stats in the editorial number style */}
      <section className="section section-light lp-proof">
        <Reveal className="wrap" amount={0.35}>
          <RevealItem as="p" className="label">Why It Works</RevealItem>
          <RevealItem as="h2" className="title">Speed wins patients. We're built for speed.</RevealItem>
        </Reveal>
        <Reveal as="div" className="wrap lp-stat-rows" amount={0.2}>
          {SPEED_STATS.map((s) => (
            <RevealItem as="article" className="lp-stat-row" key={s.figure}>
              <span className="lp-stat-figure" aria-hidden="true">{s.figure}</span>
              <div>
                <p className="lp-stat-text">{s.text}</p>
                <p className="lp-stat-source">{s.source}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
        <Reveal className="wrap" amount={0.5}>
          <RevealItem as="p" className="body lp-proof-close">
            Our system contacts every lead in minutes, automatically. That's the difference between a full calendar and a missed opportunity.
          </RevealItem>
        </Reveal>
      </section>

      {/* 6. How it works — the site's signature numbered editorial rows */}
      <section className="howwework lp-how">
        <div className="howwework-inner">
          <Reveal amount={0.3}>
            <RevealItem as="p" className="label">How it works</RevealItem>
          </Reveal>
          <div className="hw-rows">
            {STEPS.map((step) => (
              <Reveal key={step.num} className="hw-row" amount={0.35} stagger={0}>
                <RevealItem as="span" className="hw-num" delay={0.16}>{step.num}</RevealItem>
                <div className="hw-main">
                  <RevealItem className="hw-word">{step.word}</RevealItem>
                  <RevealItem as="p" className="hw-desc" delay={0.22}>{step.desc}</RevealItem>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why us — practice-first promises, hairline editorial list */}
      <section className="section section-offwhite">
        <Reveal className="wrap lp-narrow" amount={0.35}>
          <RevealItem as="h2" className="title">Built for practices. Backed by a guarantee.</RevealItem>
          <RevealItem as="ul" className="lp-points">
            {WHY_POINTS.map((point) => (
              <li key={point} className="lp-point">{point}</li>
            ))}
          </RevealItem>
        </Reveal>
      </section>

      {/* 8. Final CTA */}
      <section className="section section-deep lp-final">
        <Reveal className="wrap wrap-contact" amount={0.35}>
          <RevealItem as="h2" className="contact-headline lp-final-headline">Ready to fill your calendar?</RevealItem>
          <RevealItem as="p" className="body contact-body">
            Book a free strategy call and we'll show you exactly what this would look like for your practice, guarantee included.
          </RevealItem>
          <RevealItem
            as="a"
            className="contact-book-btn lp-cta-large"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            delay={0.2}
          >
            Book a Free Call
          </RevealItem>
        </Reveal>
      </section>

      {/* 9. Minimal footer — logo, domain, phone, privacy. No other nav. */}
      <footer className="footer lp-footer">
        <img className="footer-logo" src={logo} alt="Stay Booked Marketing" />
        <span className="footer-domain">staybookedmarketing.com</span>
        <span className="footer-phone">(408) 712-0017</span>
        <Link className="footer-privacy" to="/privacy">Privacy Policy</Link>
      </footer>
    </>
  )
}
