import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PHONE_TEL } from '@/lib/content'

/** Phones only: a slim call / book bar that appears once the hero is behind
 *  you, and steps aside near the contact section. */
export default function CallBar() {
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const contact = document.getElementById('contact')
      const nearEnd = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.9 : false
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (pathname === '/book') return null
  return (
    <div className={`q-callbar${show ? ' is-on' : ''}`} aria-hidden={!show}>
      <a href={PHONE_TEL} tabIndex={show ? 0 : -1}>Call us</a>
      <Link to="/book" tabIndex={show ? 0 : -1}>Book a call</Link>
    </div>
  )
}
