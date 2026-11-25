import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { AdScene, CalendarScene, ChatScene } from './StepScenes'

export const STEPS = [
  {
    num: '01',
    word: 'Advertise',
    desc: 'We build and run ad campaigns aimed at local customers who are already looking for what you sell.',
    Scene: AdScene,
  },
  {
    num: '02',
    word: 'Qualify',
    desc: 'Every new lead gets a reply and a few screening questions within minutes, so you stop spending time on tire-kickers.',
    Scene: ChatScene,
  },
  {
    num: '03',
    word: 'Book',
    desc: 'Qualified customers land on your calendar, or go straight to you, ready for the appointment.',
    Scene: CalendarScene,
  },
]

/**
 * HOW IT WORKS — three steps that alternate sides, each paired with a small
 * looping scene. A spine down the middle draws itself as you scroll, and a
 * "lead" dot rides it from Advertise to Book, lighting each step's node as it
 * passes.
 */
export default function HowWeWork() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const draw = useTransform(p, [0, 1], [0, 1])
  const dotTop = useTransform(p, [0, 1], ['0%', '100%'])

  return (
    <section className="hw2" id="how" ref={ref}>
      <div className="hw2-inner">
        <Reveal amount={0.3} className="hw2-head">
          <RevealItem as="h2" className="title">How it works</RevealItem>
          <RevealItem as="p" className="body hw2-sub">
            Three steps that run every day, nights and weekends included.
          </RevealItem>
        </Reveal>

        <div className="hw2-rows">
          <div className="hw2-spine" aria-hidden="true">
            <motion.span className="hw2-spine-fill" style={reduce ? { scaleY: 1 } : { scaleY: draw }} />
            {!reduce && <motion.span className="hw2-lead" style={{ top: dotTop }} />}
          </div>

          {STEPS.map(({ num, word, desc, Scene }, i) => (
            <div key={num} className={`hw2-row${i % 2 ? ' hw2-flip' : ''}`}>
              <Reveal className="hw2-text" amount={0.35} stagger={0}>
                <RevealItem as="span" className="hw2-num" delay={0.12}>{num}</RevealItem>
                <RevealItem as="h3" className="hw2-word">{word}</RevealItem>
                <RevealItem as="p" className="hw2-desc" delay={0.18}>{desc}</RevealItem>
              </Reveal>
              <span className="hw2-node" aria-hidden="true" />
              <Reveal className="hw2-scene" amount={0.25}>
                <RevealItem>
                  <Scene />
                </RevealItem>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
