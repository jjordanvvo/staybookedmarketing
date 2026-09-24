import { useCallback, useEffect, useState } from 'react'
import Intro, { claimIntro, consumeIntro } from '@/components/ui/Intro'
import Throughline from '@/components/ui/Throughline'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import HeroStatement from '@/components/sections/HeroStatement'
import FlowSegment from '@/components/ui/FlowSegment'
import WeekChapter from '@/components/sections/WeekChapter'
import FeatureBand from '@/components/sections/FeatureBand'
import HowWeWork from '@/components/sections/HowWeWork'
import Services from '@/components/sections/Services'
import Industries from '@/components/sections/Industries'
import NicheExplorer from '@/components/sections/NicheExplorer'
import WhyUs from '@/components/sections/WhyUs'
import Founders from '@/components/sections/Founders'
import HowToStart from '@/components/sections/HowToStart'
import Pricing from '@/components/sections/Pricing'
import Faq from '@/components/sections/Faq'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

/** The original one-page site, unchanged — served at "/". */
export default function Home() {
  // First mount of a page load opens with the cinematic intro; router
  // navigation back here lands on the settled page.
  const [intro] = useState(claimIntro)
  // `revealed` flips the moment the intro curtains start lifting — it cues the
  // navbar/hero entrances and mounts the sections below the hero, so their
  // whileInView entrances play as the page is actually revealed rather than
  // silently finishing behind the title card.
  const [revealed, setRevealed] = useState(!intro)
  const reveal = useCallback(() => setRevealed(true), [])

  useEffect(() => {
    consumeIntro()
  }, [])

  return (
    <>
      {intro && <Intro onReveal={reveal} />}
      <Throughline />
      <Navbar revealed={revealed} delay={intro ? 0.55 : 0.05} />
      <Hero revealed={revealed} intro={intro} />
      {revealed && (
        <>
          <HeroStatement />
          {/* Flow segment A: the Week figure pins beside the story, then
              becomes the System diagram while the real chapters scroll by */}
          <FlowSegment variant="A">
            <WeekChapter />
            <HowWeWork />
            <Services />
          </FlowSegment>
          <FeatureBand />
          {/* Interlude: full-width chapters that need the whole stage */}
          <Industries />
          <NicheExplorer />
          <WhyUs />
          <Founders />
          <HowToStart />
          {/* Flow segment B: the Ledger totals up, then becomes the Stamp */}
          <FlowSegment variant="B">
            <Pricing />
            <Faq />
          </FlowSegment>
          {/* Footer is nested inside the Contact section to match the original layout */}
          <Contact>
            <Footer />
          </Contact>
        </>
      )}
    </>
  )
}
