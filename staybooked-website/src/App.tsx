import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import Founders from '@/components/sections/Founders'
import WhatWeDo from '@/components/sections/WhatWeDo'
import Services from '@/components/sections/Services'
import WhyUs from '@/components/sections/WhyUs'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Founders />
      <WhatWeDo />
      <Services />
      <WhyUs />
      {/* Footer is nested inside the Contact snap screen to match the original layout */}
      <Contact>
        <Footer />
      </Contact>
    </>
  )
}
