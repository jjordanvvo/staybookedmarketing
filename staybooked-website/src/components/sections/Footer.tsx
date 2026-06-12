import logo from '@/assets/logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer-logo" src={logo} alt="Stay Booked Marketing" />
      <span className="footer-domain">staybookedmarketing.com</span>
      <span className="footer-phone">(916) 606-9970</span>
    </footer>
  )
}
