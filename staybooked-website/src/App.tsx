import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import Privacy from '@/pages/Privacy'
import FreeCall from '@/pages/FreeCall'

/** Route changes land at the top of the new page (browsers only restore
 *  scroll on history navigation, not on pushed links). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/free-call" element={<FreeCall />} />
      </Routes>
    </BrowserRouter>
  )
}
