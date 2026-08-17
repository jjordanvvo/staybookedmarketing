import LegalPage, { type LegalSection } from '@/components/sections/LegalPage'

const SECTIONS: LegalSection[] = [
  {
    heading: '1. Our Services',
    paras: [
      'Stay Booked provides marketing and lead generation services for small businesses, helping them attract and convert more customers through digital advertising, campaign management, and related marketing services ("Services"). Details of specific Services are set out in the applicable client agreement or proposal.',
    ],
  },
  {
    heading: '2. Eligibility',
    paras: [
      'You must be at least 18 years old and able to form a legally binding contract to use our website or engage our Services. By using our website or Services, you represent that you meet these requirements.',
    ],
  },
  {
    heading: '3. Client Accounts and Information',
    paras: [
      'If you engage us as a client, you agree to provide accurate, current, and complete information as needed to perform the Services. You are responsible for maintaining the confidentiality of any account credentials and for all activity under your account.',
    ],
  },
  {
    heading: '4. Use of the Website',
    paras: ['You agree not to:'],
    list: [
      'Use the website for any unlawful purpose or in violation of these Terms;',
      'Attempt to gain unauthorized access to any portion of the website or our systems;',
      'Interfere with or disrupt the operation of the website;',
      'Copy, reproduce, or distribute website content without our prior written consent.',
    ],
  },
  {
    heading: '5. Intellectual Property',
    paras: [
      'All content on this website, including text, graphics, logos, and marketing materials, is the property of Stay Booked Marketing LLC or its licensors and is protected by applicable intellectual property laws. You may not use our name, logo, or content without our prior written permission.',
    ],
  },
  {
    heading: '6. Fees and Payment',
    paras: [
      "Fees for Services are set out in the applicable client agreement or proposal. Unless otherwise stated, invoices are due upon the terms specified in that agreement. Late payments may result in suspension of Services, accrual of interest at the maximum rate permitted by law, and referral to collections, with the client responsible for any associated collection costs and reasonable attorneys' fees.",
    ],
  },
  {
    heading: '7. No Guarantee of Results',
    paras: [
      'While we work to deliver effective marketing and lead generation campaigns, we do not guarantee specific results, lead volumes, conversion rates, or revenue outcomes, as these depend on factors outside our control, including market conditions, client responsiveness, and third-party advertising platforms.',
    ],
  },
  {
    heading: '8. Communications and Consent',
    paras: [
      'By providing your phone number or email address to us or to a Stay Booked client through a form, call, or text message, you consent to receive calls, texts, and emails related to the services or offers you inquired about, in accordance with applicable law, including the Telephone Consumer Protection Act (TCPA). You may opt out of communications at any time by following the unsubscribe or opt-out instructions provided.',
    ],
  },
  {
    heading: '9. Third-Party Links, Platforms, and Services',
    paras: [
      'Our website or Services may reference, link to, or rely upon third-party websites, platforms, or advertising networks (such as Meta or Google Ads). We are not responsible for the content, policies, practices, availability, or performance of any third party, and we are not liable for any losses arising from changes to, restrictions on, suspension of, or outages affecting any third-party platform used in delivering the Services.',
    ],
  },
  {
    heading: '10. Client Compliance Responsibilities',
    paras: [
      'Clients are solely responsible for ensuring that their own products, services, business practices, and any content or claims they provide to us for use in advertising or marketing materials comply with all applicable federal, state, and local laws and industry-specific regulations, including but not limited to healthcare advertising and privacy laws where applicable. Stay Booked is not responsible for verifying the legality of client-provided claims, testimonials, or representations, though we will flag known compliance concerns where identified.',
    ],
  },
  {
    heading: '11. Limitation of Liability',
    paras: [
      'To the fullest extent permitted by law, Stay Booked Marketing LLC, its members, officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or any loss of profits, revenue, data, or goodwill, arising out of or related to your use of the website or Services, even if advised of the possibility of such damages. Our total aggregate liability for any and all claims arising out of or relating to the Services, regardless of the form of action, shall not exceed the amount paid by you to us in the three (3) months preceding the event giving rise to the claim.',
    ],
  },
  {
    heading: '12. Disclaimer of Warranties',
    paras: [
      'The website and Services are provided on an "as is" and "as available" basis, without warranties of any kind, whether express, implied, or statutory, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the website or Services will be uninterrupted, error-free, or secure.',
    ],
  },
  {
    heading: '13. Force Majeure',
    paras: [
      'Stay Booked shall not be liable for any delay or failure to perform its obligations under these Terms resulting from causes beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, labor disputes, internet or telecommunications failures, changes to or outages of third-party advertising or software platforms, government action, or pandemic.',
    ],
  },
  {
    heading: '14. Indemnification',
    paras: [
      "You agree to indemnify, defend, and hold harmless Stay Booked Marketing LLC, its members, officers, employees, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the website or Services; (b) your violation of these Terms; (c) your violation of any applicable law or regulation; or (d) any content, claims, or representations you provide to us for use in marketing or advertising materials.",
    ],
  },
  {
    heading: '15. Termination',
    paras: [
      'We reserve the right to suspend or terminate your access to the website or Services at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Provisions of these Terms that by their nature should survive termination, including but not limited to Sections 11 through 14 and 17, shall survive.',
    ],
  },
  {
    heading: '16. Dispute Resolution and Arbitration',
    paras: [
      'Any dispute, claim, or controversy arising out of or relating to these Terms or the Services shall be resolved exclusively through final and binding arbitration administered in accordance with the rules of the American Arbitration Association, conducted in Hillsborough County, Florida, rather than in court, except that either party may seek injunctive relief in court for actual or threatened infringement of intellectual property rights. Each party shall bear its own costs of arbitration unless the arbitrator determines otherwise. You and Stay Booked each waive the right to a jury trial and the right to participate in a class action.',
    ],
  },
  {
    heading: '17. Governing Law',
    paras: [
      'These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law principles. Subject to Section 16, any disputes arising under these Terms shall be resolved in the state or federal courts located in Hillsborough County, Florida.',
    ],
  },
  {
    heading: '18. Severability and Waiver',
    paras: [
      'If any provision of these Terms is held invalid or unenforceable, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect. No waiver of any provision of these Terms shall be deemed a further or continuing waiver of that provision or any other provision.',
    ],
  },
  {
    heading: '19. Entire Agreement',
    paras: [
      'These Terms, together with any applicable client agreement or proposal, constitute the entire agreement between you and Stay Booked regarding the subject matter herein and supersede all prior agreements or understandings, whether written or oral.',
    ],
  },
  {
    heading: '20. Changes to These Terms',
    paras: [
      'We may update these Terms from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the website or Services after changes are posted constitutes acceptance of the revised Terms.',
    ],
  },
  {
    heading: '21. Contact Us',
    paras: ['If you have questions about these Terms, please contact us at:'],
    contact: {
      lines: ['Stay Booked Marketing LLC', '1645 Abyss Drive, Odessa, FL 33556'],
      email: 'staybookedmarketing@gmail.com',
    },
  },
]

export default function Terms() {
  return (
    <LegalPage
      docTitle="Terms of Service | Stay Booked Marketing"
      title="Terms of Service"
      effectiveDate="August 16, 2026"
      intro={[
        'These Terms of Service ("Terms") govern your access to and use of the website and services provided by Stay Booked Marketing LLC ("Stay Booked," "we," "us," or "our"). By accessing our website or using our services, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.',
      ]}
      sections={SECTIONS}
    />
  )
}
