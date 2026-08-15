import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import Privacy from '@/pages/Privacy'
import FreeCall from '@/pages/FreeCall'

/** Route changes land at the top of the new page (browsers only restore
 *  scroll on history navigation, not on pushed links). A /#section hash keeps
 *  retrying until the target exists — home mounts its sections only after the
 *  intro reveals, so the element can appear seconds after navigation. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      let tries = 0
      let timer: number | undefined
      const attempt = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView()
        else if (++tries < 60) timer = window.setTimeout(attempt, 200)
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/free-call" element={<FreeCall />} />
      </Routes>
    </BrowserRouter>
  )
}
