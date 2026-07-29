import logo from '@/assets/logo-nav.webp'

export default function Navbar() {
  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-left">
        <a href="#hero" className="nav-logo-link" aria-label="Stay Booked Marketing home">
          <img className="nav-logo" src={logo} alt="Stay Booked Marketing" />
        </a>
        <span className="nav-wordmark">staybookedmarketing.com</span>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="#founders">Founders</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a className="nav-cta" href="#contact">Let's Talk</a>
      </div>
    </nav>
  )
}
