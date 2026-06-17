import sbmDesk from '@/assets/sbm-desk.png'
import { Reveal, RevealItem } from '@/components/ui/Reveal'

export default function WhatWeDo() {
  return (
    <section
      className="section section-photo"
      id="what"
      style={{ backgroundImage: `url(${sbmDesk})` }}
    >
      <div className="section-scrim" aria-hidden="true" />
      <Reveal className="wrap">
        <RevealItem as="p" className="label">What we do</RevealItem>
        <RevealItem as="h2" className="title">We get local businesses booked.</RevealItem>
        <RevealItem className="body-block">
          <p className="body">Stay Booked Marketing builds websites, runs ads, and handles local SEO for service businesses that want more customers. We handle the digital side so you can focus on the work.</p>
        </RevealItem>
      </Reveal>
    </section>
  )
}
