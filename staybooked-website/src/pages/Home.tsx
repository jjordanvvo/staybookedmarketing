import { useCallback, useEffect, useState } from 'react'
import Intro, { claimIntro, consumeIntro } from '@/components/ui/Intro'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import TermsMarquee from '@/components/sections/TermsMarquee'
import HowWeWork from '@/components/sections/HowWeWork'
import SystemTeaser from '@/components/sections/SystemTeaser'
import SeeWhatWeCanDo from '@/components/sections/SeeWhatWeCanDo'
import SpeedEvidence from '@/components/sections/SpeedEvidence'
import Founders from '@/components/sections/Founders'
import Faq from '@/components/sections/Faq'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

/**
 * The one-page site at "/". It reads as one continuous story rather than a
 * stack of boxes: the hero hands off to the terms strip, then the
 * problem (the stickman's unanswered call), How it works down a single spine,
 * the step tree and the form, the system teaser, the founders, questions, and
 * the close.
 */
export default function Home() {
  const [intro] = useState(claimIntro)
  const [revealed, setRevealed] = useState(!intro)
  const reveal = useCallback(() => setRevealed(true), [])

  useEffect(() => {
    consumeIntro()
  }, [])

  return (
    <>
      {intro && <Intro onReveal={reveal} />}
      <Navbar revealed={revealed} delay={intro ? 0.45 : 0.05} />
      <Hero revealed={revealed} intro={intro} />
      {revealed && (
        <>
          <TermsMarquee />
          <SpeedEvidence />
          <HowWeWork />
          <SeeWhatWeCanDo />
          <SystemTeaser />
          <Founders />
          <Faq />
          <Contact>
            <Footer />
          </Contact>
        </>
      )}
    </>
  )
}
