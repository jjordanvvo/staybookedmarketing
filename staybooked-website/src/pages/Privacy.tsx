import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import Footer from '@/components/sections/Footer'
import logo from '@/assets/logo-nav.webp'

const SECTIONS = [
  {
    heading: 'Information We Collect',
    body: 'When you fill out a form, book a call, or contact us, we may collect your name, email address, phone number, and any information you choose to provide about your business. We may also collect basic technical information such as your IP address, browser type, and how you interact with our site through analytics and advertising tools, including the Meta (Facebook) Pixel.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'We use your information to respond to your inquiries, schedule and conduct consultations, provide our services, improve our website and marketing, and communicate with you about our services. We do not sell your personal information to third parties.',
  },
  {
    heading: 'Advertising and Analytics',
    body: 'We use tools such as the Meta Pixel and similar technologies to measure and improve our advertising. These tools may collect information about your visit to help us show relevant ads and understand how our campaigns perform. You can manage ad preferences through your settings on platforms like Facebook and Instagram.',
  },
  {
    heading: 'How We Protect Your Information',
    body: 'We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
  },
  {
    heading: 'Sharing Your Information',
    body: 'We may share your information with trusted service providers who help us operate our business, such as scheduling, email, and advertising platforms. These providers are only permitted to use your information to perform services on our behalf.',
  },
  {
    heading: 'Your Choices',
    body: 'You may request to access, update, or delete your personal information at any time by contacting us. You may also opt out of marketing communications at any time.',
  },
]

/** Privacy Policy — clean, readable legal page in the site's editorial style. */
export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Stay Booked Marketing'
    return () => {
      document.title = 'Stay Booked Marketing | Lead Generation for Local Businesses'
    }
  }, [])

  return (
    <>
      <header className="simple-header">
        <Link to="/" className="simple-header-logo" aria-label="Stay Booked Marketing home">
          <img src={logo} alt="Stay Booked Marketing" />
        </Link>
      </header>

      <main className="legal">
        <Reveal className="legal-inner" amount={0.1}>
          <RevealItem as="h1" className="legal-title">Privacy Policy</RevealItem>
          <RevealItem as="p" className="legal-updated">Last updated: July 2026</RevealItem>

          <RevealItem as="p" className="legal-body">
            Stay Booked Marketing ("we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or contact us.
          </RevealItem>

          <RevealItem>
            {SECTIONS.map((s) => (
              <section key={s.heading} className="legal-section">
                <h2 className="legal-heading">{s.heading}</h2>
                <p className="legal-body">{s.body}</p>
              </section>
            ))}

            <section className="legal-section">
              <h2 className="legal-heading">Contact Us</h2>
              <p className="legal-body">
                If you have any questions about this Privacy Policy or your information, contact us at:
              </p>
              <p className="legal-body legal-contact">
                Stay Booked Marketing<br />
                Email: <a href="mailto:staybookedmarketing@gmail.com">staybookedmarketing@gmail.com</a><br />
                Phone: <a href="tel:+14087120017">(408) 712-0017</a>
              </p>
            </section>

            <p className="legal-body legal-closing">
              By using our website or providing your information, you agree to the terms of this Privacy Policy.
            </p>
          </RevealItem>
        </Reveal>
      </main>

      <Footer />
    </>
  )
}
