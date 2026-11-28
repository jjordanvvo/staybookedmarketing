/** Founder data — shared by the home section, the Team page, site search,
 *  and the prerender script. `photo` is the asset filename in src/assets;
 *  the components map it to the imported image (see founderPhotos.ts). */
export type Founder = {
  name: string
  title: string
  /** Education line, shown between the title and the bio. */
  degree?: string
  bio: string
  email?: string
  phone?: string
  photo?: string
  /** Fallback monogram for founders without a headshot yet. */
  initials?: string
}

export const FOUNDERS: Founder[] = [
  {
    name: 'Trevor Mayberry',
    title: 'Chief Financial Officer',
    degree: 'Graduated from Stanford University with a degree in Science, Technology, and Society.',
    bio: "Trevor Mayberry is the Chief Financial Officer of Stay Booked Marketing. He set up the company's entity structure and financial framework, and he runs budgeting and cash flow. He tracks every dollar across the business, from client ad spend to payroll. His job is making sure each account stays profitable as the company grows.",
    email: 'trevor@staybookedmarketing.com',
    phone: '+1 (813) 480-5818',
    photo: 'trevor',
  },
  {
    name: 'Jordan Vo',
    title: 'Founder & Chief Executive Officer',
    bio: "Jordan Vo founded Stay Booked Marketing and leads it as Chief Executive Officer. He sets the company's direction and oversees ad strategy and campaign results on every account. Clients hear from him directly, in plain-language updates they can act on. He built the client relationships the business runs on, and he keeps them going well past the first campaign.",
    email: 'jordan@staybookedmarketing.com',
    phone: '+1 (408) 712-0017',
    photo: 'jordan',
  },
  {
    name: 'Kolby McCargar',
    title: 'Chief Executive Officer & Chief Marketing Officer',
    degree: "Studied Business Marketing at Point Loma Nazarene University's Fermanian School of Business.",
    bio: "Kolby McCargar is the Chief Executive Officer and Chief Marketing Officer of Stay Booked Marketing. He builds and runs the campaigns behind every account on Meta, Google and social, from creative and targeting to budgets. He tests constantly and watches cost per lead and ad spend closely. Once a campaign is live, he keeps tightening it instead of letting it coast.",
    email: 'kolby@staybookedmarketing.com',
    phone: '+1 (916) 606-9970',
    photo: 'kolby',
  },
  {
    name: 'Austin Uke',
    title: 'Chief Technology Officer',
    degree: 'Graduated from Stanford University with a degree in Science, Technology, and Society.',
    bio: 'Austin Uke is the Chief Technology Officer of Stay Booked Marketing. He builds client websites, web apps and the automation that qualifies leads, sends follow-up and books appointments. He manages every build from the first version to launch. After launch he keeps maintaining each site and tool, with a focus on page speed, mobile performance and reliability.',
    email: 'austin@staybookedmarketing.com',
    phone: '+1 (214) 708-2025',
    photo: 'austin',
  },
  {
    name: 'Jordan Niles',
    title: 'Chief Operating Officer',
    degree: 'Graduated from the University of Pennsylvania.',
    bio: "Jordan Niles is the Chief Operating Officer of Stay Booked Marketing. He runs day-to-day operations: internal workflows, coordination across the team, and project schedules. He's the one making sure deadlines get met. As the company takes on more work, he keeps the small details from slipping.",
    email: 'jordanniles@staybookedmarketing.com',
    phone: '+1 (727) 479-3780',
    photo: 'niles',
  },
]
