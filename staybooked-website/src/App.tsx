import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import FreeCall from '@/pages/FreeCall'
import Healthcare from '@/pages/Healthcare'
import NicheDetail from '@/pages/NicheDetail'
import Book from '@/pages/Book'
import HowItWorks from '@/pages/HowItWorks'
import Analytics from '@/components/Analytics'
import ChatWidget from '@/components/ChatWidget'
import CallBar from '@/components/q/CallBar'
import Team from '@/pages/Team'
import NotFound from '@/pages/NotFound'

/** New pages open at the top; a /#section link scrolls to that section. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      let tries = 0
      let timer: number | undefined
      const attempt = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else if (++tries < 20) timer = window.setTimeout(attempt, 100)
      }
      attempt()
      return () => window.clearTimeout(timer)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <ChatWidget />
      <CallBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/free-call" element={<FreeCall />} />
        <Route path="/healthcare" element={<Healthcare />} />
        <Route path="/niches/:id" element={<NicheDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
