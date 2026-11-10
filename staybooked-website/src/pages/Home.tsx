import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Hero from '@/components/q/Hero'
import WhatWeDo from '@/components/q/WhatWeDo'
import Finder from '@/components/q/Finder'
import Talk from '@/components/q/Talk'

/** Home: what we do, who it's for, and how to reach us. Nothing else.
 *  Detail lives on /how-it-works, /team and the industry pages. */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <Finder />
        <Talk />
      </main>
      <Footer />
    </>
  )
}
