import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import HeroStatement from '@/components/sections/HeroStatement'
import FeatureBand from '@/components/sections/FeatureBand'
import HowWeWork from '@/components/sections/HowWeWork'
import WhatWeDo from '@/components/sections/WhatWeDo'
import Services from '@/components/sections/Services'
import WhyUs from '@/components/sections/WhyUs'
import Founders from '@/components/sections/Founders'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <HeroStatement />
      <FeatureBand />
      <HowWeWork />
      <WhatWeDo />
      <Services />
      <WhyUs />
      <Founders />
      {/* Footer is nested inside the Contact section to match the original layout */}
      <Contact>
        <Footer />
      </Contact>
    </>
  )
}
