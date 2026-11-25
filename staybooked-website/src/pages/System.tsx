import { useEffect } from 'react'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import AnimatedLabel from '@/components/ui/AnimatedLabel'
import { SYSTEM_STAGES } from '@/lib/systemStages'

/**
 * /the-system — how the lead system works behind the scenes, one stage per
 * row with a drawing of that stage. Linked from the home page's "here's how"
 * line. The drawings are illustrative diagrams, not client data.
 */

const ART: Record<string, () => JSX.Element> = {
  capture: CaptureArt,
  reply: ReplyArt,
  qualify: QualifyArt,
  book: BookArt,
  handoff: HandoffArt,
  improve: ImproveArt,
}

export default function System() {
  useEffect(() => {
    document.title = 'How Our Lead System Works | Stay Booked Marketing'
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="nav-spacer" aria-hidden="true" />
      <section className="sys-hero">
        <Reveal className="wrap" amount={0.3}>
          <RevealItem as="h1" className="title">How the system works behind the scenes</RevealItem>
          <RevealItem as="p" className="body sys-lede">
            People ask us all the time how we get a reply to every lead within minutes and onto a calendar without
            anyone at the business lifting the phone. Here is the whole path, one stage at a time.
          </RevealItem>
        </Reveal>
        <Reveal className="wrap sys-flow" amount={0.2}>
          <RevealItem>
            <FlowArt />
          </RevealItem>
        </Reveal>
      </section>

      {SYSTEM_STAGES.map(({ id, title, body }, i) => {
        const Art = ART[id]
        return (
        <section key={id} className={`sys-stage${i % 2 ? ' sys-flip' : ''}`} id={id}>
          <div className="sys-stage-inner">
            <Reveal className="sys-text" amount={0.3}>
              <RevealItem as="span" className="sys-num">{String(i + 1).padStart(2, '0')}</RevealItem>
              <RevealItem as="h2" className="sys-title">{title}</RevealItem>
              <RevealItem as="p" className="body">{body}</RevealItem>
            </Reveal>
            <Reveal className="sys-art" amount={0.25}>
              <RevealItem>
                <Art />
              </RevealItem>
            </Reveal>
          </div>
        </section>
        )
      })}

      <section className="sys-end">
        <Reveal className="wrap" amount={0.4}>
          <RevealItem as="h2" className="title">Want it running for your business?</RevealItem>
          <RevealItem as="p" className="body">One free 15-minute call and you'll know exactly what it would look like for you.</RevealItem>
          <RevealItem>
            <a className="contact-book-btn anim-btn" href="/book"><AnimatedLabel>Book a Free Strategy Call</AnimatedLabel></a>
          </RevealItem>
        </Reveal>
      </section>
      <Footer />
    </>
  )
}

/* ---------------- drawings ---------------- */

const svg = { className: 'sys-svg', role: 'img' as const }

function FlowArt() {
  const steps = ['Ad', 'Lead', 'Reply', 'Qualify', 'Book', 'You']
  return (
    <svg {...svg} viewBox="0 0 960 150" aria-label="The path: ad, lead, reply, qualify, book, you">
      <path d="M60 75 H900" className="sys-path" />
      <path d="M60 75 H900" className="sys-path-run" />
      {steps.map((s, i) => {
        const x = 60 + i * 168
        return (
          <g key={s}>
            <circle cx={x} cy="75" r={i === 5 ? 30 : 24} className={i === 5 ? 'sys-node-end' : 'sys-node'} />
            <text x={x} y="130" textAnchor="middle" className="sys-label">{s}</text>
          </g>
        )
      })}
    </svg>
  )
}

function CaptureArt() {
  const src = ['Ad click', 'Form', 'Call', 'Text']
  return (
    <svg {...svg} viewBox="0 0 420 300" aria-label="Ad clicks, forms, calls and texts flowing into one CRM">
      {src.map((s, i) => {
        const y = 40 + i * 70
        return (
          <g key={s}>
            <rect x="20" y={y - 20} width="110" height="40" rx="10" className="sys-box" />
            <text x="75" y={y + 5} textAnchor="middle" className="sys-label">{s}</text>
            <path d={`M130 ${y} C 210 ${y}, 230 150, 290 150`} className="sys-path" />
          </g>
        )
      })}
      <rect x="290" y="100" width="112" height="100" rx="16" className="sys-box-ink" />
      <text x="346" y="146" textAnchor="middle" className="sys-label-inv">One</text>
      <text x="346" y="170" textAnchor="middle" className="sys-label-inv">CRM</text>
    </svg>
  )
}

function ReplyArt() {
  return (
    <svg {...svg} viewBox="0 0 420 300" aria-label="A lead's message and an automatic reply sent within minutes">
      <rect x="40" y="30" width="240" height="54" rx="18" className="sys-box" />
      <text x="60" y="63" className="sys-label">Hi, are you open this week?</text>
      <rect x="140" y="110" width="250" height="78" rx="18" className="sys-box-ink" />
      <text x="160" y="142" className="sys-label-inv">Yes! What do you need</text>
      <text x="160" y="166" className="sys-label-inv">help with?</text>
      <circle cx="96" cy="240" r="30" className="sys-ring" />
      <path d="M96 222 V240 L108 248" className="sys-hand" />
      <text x="142" y="236" className="sys-label">Replied in</text>
      <text x="142" y="260" className="sys-label-big">under 5 min</text>
    </svg>
  )
}

function QualifyArt() {
  const qs = ['What do you need?', 'Where are you?', 'How soon?']
  return (
    <svg {...svg} viewBox="0 0 420 300" aria-label="Qualifying questions, each checked off">
      {qs.map((q, i) => {
        const y = 50 + i * 72
        return (
          <g key={q}>
            <rect x="30" y={y - 26} width="300" height="52" rx="14" className="sys-box" />
            <text x="52" y={y + 6} className="sys-label">{q}</text>
            <circle cx="372" cy={y} r="20" className="sys-node-end" />
            <path d={`M362 ${y} l7 7 l13 -14`} className="sys-check" />
          </g>
        )
      })}
      <text x="30" y="282" className="sys-label">Fits? It moves to booking.</text>
    </svg>
  )
}

function BookArt() {
  const days = ['M', 'T', 'W', 'T', 'F']
  const booked = [[0, 1], [1, 3], [2, 0], [3, 2], [4, 1], [2, 2]]
  return (
    <svg {...svg} viewBox="0 0 420 300" aria-label="A week calendar with appointments booked and a reminder">
      {days.map((d, i) => (
        <text key={i} x={60 + i * 64} y="34" textAnchor="middle" className="sys-label">{d}</text>
      ))}
      {Array.from({ length: 20 }).map((_, k) => {
        const c = k % 5
        const r = Math.floor(k / 5)
        const on = booked.some(([bc, br]) => bc === c && br === r)
        return <rect key={k} x={32 + c * 64} y={48 + r * 46} width="56" height="38" rx="8" className={on ? 'sys-cell-on' : 'sys-cell'} />
      })}
      <rect x="196" y="244" width="206" height="44" rx="12" className="sys-box-ink" />
      <text x="214" y="272" className="sys-label-inv">Reminder sent: 1 hour</text>
    </svg>
  )
}

function HandoffArt() {
  return (
    <svg {...svg} viewBox="0 0 420 300" aria-label="A booking summary card sent to the business">
      <rect x="60" y="30" width="300" height="240" rx="18" className="sys-box" />
      <text x="84" y="70" className="sys-label-big">New booking</text>
      <rect x="84" y="90" width="200" height="12" rx="6" className="sys-bar" />
      <rect x="84" y="114" width="150" height="12" rx="6" className="sys-bar" />
      <text x="84" y="160" className="sys-label">Needs: estimate, this week</text>
      <text x="84" y="188" className="sys-label">Best time: Thursday 10am</text>
      <text x="84" y="216" className="sys-label">Notes from the conversation</text>
      <rect x="84" y="232" width="230" height="10" rx="5" className="sys-bar" />
    </svg>
  )
}

function ImproveArt() {
  const bars = [60, 84, 70, 104, 120, 150]
  return (
    <svg {...svg} viewBox="0 0 420 300" aria-label="A monthly review chart trending up (illustrative)">
      <path d="M40 250 H390" className="sys-path" />
      {bars.map((h, i) => (
        <rect key={i} x={56 + i * 56} y={250 - h} width="34" height={h} rx="6" className={i === bars.length - 1 ? 'sys-cell-on' : 'sys-cell'} />
      ))}
      <path d="M73 182 L129 158 L185 172 L241 138 L297 122 L353 92" className="sys-trend" />
      <text x="40" y="285" className="sys-label">Monthly review (illustration)</text>
    </svg>
  )
}
