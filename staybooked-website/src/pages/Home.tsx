import { useCallback, useEffect, useState } from 'react'
import Intro, { claimIntro, consumeIntro } from '@/components/ui/Intro'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import HowWeWork from '@/components/sections/HowWeWork'
import Services from '@/components/sections/Services'
import Industries from '@/components/sections/Industries'
import SpeedEvidence from '@/components/sections/SpeedEvidence'
import WhyUs from '@/components/sections/WhyUs'
import Founders from '@/components/sections/Founders'
import HowToStart from '@/components/sections/HowToStart'
import Pricing from '@/components/sections/Pricing'
import Faq from '@/components/sections/Faq'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

/** The one-page site at "/". Section order matches the nav order. */
export default function Home() {
  // First visit opens with the short intro; router navigation and repeat
  // visits land on the settled page.
  const [intro] = useState(claimIntro)
  // `revealed` flips the moment the intro curtains start lifting — it cues the
  // navbar/hero entrances and mounts the sections below the hero, so their
  // whileInView entrances play as the page is actually revealed.
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
          <HowWeWork />
          <Services />
          <SpeedEvidence />
          <Industries />
          <Founders />
          <WhyUs />
          <HowToStart />
          <Pricing />
          <Faq />
          {/* Footer is nested inside the Contact section */}
          <Contact>
            <Footer />
          </Contact>
        </>
      )}
    </>
  )
}
