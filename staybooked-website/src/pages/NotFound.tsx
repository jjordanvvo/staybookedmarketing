import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

/** Catch-all for unknown routes: keeps the visitor on the site with a way
 *  to book or get home, instead of a dead end. */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | Stay Booked Marketing'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    return () => {
      robots.remove()
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="nav-spacer" aria-hidden="true" />
      <section className="section section-offwhite" id="not-found">
        <div className="wrap">
          <p className="label">Page not found</p>
          <h1 className="title">This page doesn't exist.</h1>
          <p className="body lp-hook-body">
            The link may be old or mistyped. Here's where you can go from here.
          </p>
          <div className="notfound-ctas">
            <a className="contact-book-btn" href="/book">Book a Free Call</a>
            <Link className="notfound-home" to="/">Back to the homepage</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
