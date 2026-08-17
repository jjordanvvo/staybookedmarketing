import LegalPage, { type LegalSection } from '@/components/sections/LegalPage'

const SECTIONS: LegalSection[] = [
  {
    heading: '1. Information We Collect',
    paras: ['We may collect the following categories of information:'],
    list: [
      'Contact information such as your name, phone number, email address, and mailing address;',
      'Business information such as your company name, industry, and services of interest;',
      'Communications you send us, including form submissions, calls, texts, and emails;',
      'Technical information such as IP address, browser type, device information, and website usage data collected through cookies and similar technologies;',
      'Payment and billing information, where applicable, processed through secure third-party payment processors.',
    ],
  },
  {
    heading: '2. How We Collect Information',
    paras: [
      'We collect information directly from you when you fill out a form, call or text us, email us, or otherwise communicate with us. We also collect information automatically through cookies, tracking pixels, and analytics tools when you visit our website or the websites and ad campaigns we manage on behalf of clients.',
    ],
  },
  {
    heading: '3. How We Use Your Information',
    paras: ['We use the information we collect to:'],
    list: [
      'Provide, operate, and improve our marketing and lead generation services;',
      'Respond to inquiries and communicate with you about services or offers;',
      'Deliver, personalize, and measure the performance of advertising campaigns;',
      'Process payments and manage client accounts;',
      'Comply with legal obligations and enforce our agreements;',
      'Improve our website, services, and marketing effectiveness.',
    ],
  },
  {
    heading: '4. Legal Bases and Consent for Communications',
    paras: [
      'By submitting your contact information through a form, call, or text message, you consent to receive calls, texts, and emails related to the services or offers you inquired about, consistent with the Telephone Consumer Protection Act (TCPA) and other applicable law. You may withdraw consent and opt out of communications at any time by following the unsubscribe or opt-out instructions provided, or by contacting us directly.',
    ],
  },
  {
    heading: '5. How We Share Your Information',
    paras: ['We do not sell your personal information. We may share information with:'],
    list: [
      'Service providers who perform functions on our behalf, such as hosting, CRM, advertising, and analytics platforms (e.g., Meta, Google, GoHighLevel);',
      'The business or client whose services you inquired about, where your inquiry was submitted through a campaign we manage for that client;',
      'Professional advisors, such as attorneys or accountants, where necessary;',
      'Government authorities or other third parties where required by law, subpoena, or legal process, or to protect our rights, property, or safety, or that of others;',
      'A successor entity in connection with a merger, acquisition, or sale of assets.',
    ],
  },
  {
    heading: '6. Health-Related Client Engagements',
    paras: [
      'Where we provide services to clients in the healthcare industry, we do not access, collect, or store protected health information (PHI) as defined under HIPAA, and our tracking and advertising tools are configured to avoid capturing PHI. Where applicable, we enter into Business Associate Agreements (BAAs) with healthcare clients to govern the limited scope of any data handling relevant to HIPAA compliance.',
    ],
  },
  {
    heading: '7. Cookies and Tracking Technologies',
    paras: [
      'Our website and the ad campaigns we manage may use cookies, pixels, and similar tracking technologies to analyze site traffic, measure ad performance, and improve user experience. You can control cookies through your browser settings; disabling cookies may affect certain website functionality.',
    ],
  },
  {
    heading: '8. Data Retention',
    paras: [
      'We retain personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements, after which it is securely deleted or anonymized.',
    ],
  },
  {
    heading: '9. Data Security',
    paras: [
      'We implement reasonable administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, use, disclosure, or loss. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    heading: '10. Your Privacy Rights',
    paras: [
      'Depending on your state of residence, you may have rights to access, correct, delete, or obtain a copy of your personal information, and to opt out of certain uses such as targeted advertising or the sale of personal information. To exercise these rights, contact us using the information below. We will respond to verifiable requests consistent with applicable law.',
    ],
  },
  {
    heading: "11. Children's Privacy",
    paras: [
      'Our website and services are not directed to individuals under the age of 18, and we do not knowingly collect personal information from children. If we learn we have collected personal information from a child, we will take steps to delete it.',
    ],
  },
  {
    heading: '12. Third-Party Links',
    paras: [
      'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those third parties, and we encourage you to review their privacy policies before providing any personal information.',
    ],
  },
  {
    heading: '13. International Users',
    paras: [
      'Our services are directed to users located in the United States. If you access our website from outside the United States, you understand that your information will be transferred to and processed in the United States.',
    ],
  },
  {
    heading: '14. Changes to This Privacy Policy',
    paras: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the website or our services after changes are posted constitutes acceptance of the revised policy.',
    ],
  },
  {
    heading: '15. Contact Us',
    paras: [
      'If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us at:',
    ],
    contact: {
      lines: ['Stay Booked Marketing LLC', '1645 Abyss Drive, Odessa, FL 33556'],
      email: 'trevor@staybookedmarketing.com',
    },
  },
]

export default function Privacy() {
  return (
    <LegalPage
      docTitle="Privacy Policy | Stay Booked Marketing"
      title="Privacy Policy"
      effectiveDate="August 16, 2026"
      intro={[
        'Stay Booked Marketing LLC ("Stay Booked," "we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, submit an inquiry, or engage our services.',
      ]}
      sections={SECTIONS}
    />
  )
}
