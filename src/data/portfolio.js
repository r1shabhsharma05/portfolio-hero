// Single source of truth for every fact on this portfolio.
// Every string here is verified — nothing is invented. See the task
// fact sheet. If a URL does not resolve, the link is omitted, never faked.

export const PERSON = {
  name: 'Rishabh Sharma',
  role: 'Software Engineer',
  title: 'Full-Stack Developer',
  location: 'Bulandshahr, Uttar Pradesh, India',
  email: 'rishabhsharma14426@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rishabh-sharma-342575438/',
  github: 'https://github.com/r1shabhsharma05',
  resumeHref: '/Rishabh_Sharma_Resume.pdf',
}

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'coding', label: 'Coding' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export const SKILL_GROUPS = [
  {
    title: 'Programming Languages',
    icon: 'Code2',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java'],
  },
  {
    title: 'Frontend Development',
    icon: 'Layers',
    items: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'Vite', 'Expo'],
  },
  {
    title: 'Backend Development',
    icon: 'Server',
    items: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'Prisma'],
  },
  {
    title: 'Databases',
    icon: 'Database',
    items: ['Supabase', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    title: 'AI / Machine Learning',
    icon: 'Brain',
    items: ['Python', 'XGBoost', 'Machine Learning', 'Artificial Intelligence'],
  },
  {
    title: 'Developer Tools & DevOps',
    icon: 'Wrench',
    items: [
      'Git',
      'GitHub',
      'GitHub Actions',
      'Vercel',
      'Render',
      'Upstash',
      'QStash',
      'Apache Kafka',
      'Load Balancing',
      'CDN',
      'DevOps',
    ],
  },
]

export const FEATURED_PROJECTS = [
  {
    name: 'SecureGaurd',
    icon: 'ShieldCheck',
    tagline: 'Live vulnerability scanner with ML triage',
    problem:
      'Security scanners drown teams in false positives. SecureGaurd pairs custom detection rules with an ML model that separates real findings from noise, so the first thing you see is worth fixing.',
    stack: ['React 19', 'Vite', 'TypeScript', 'Tailwind', 'Express', 'Prisma', 'FastAPI', 'XGBoost', 'Supabase / PostgreSQL'],
    features: [
      '222 real findings triaged — 38 real, 184 false positives',
      'ML model v3_real: 0.9556 first-pass / 1.0 second-pass test accuracy on a 45-finding held-out split',
      'Severity ranker, Spearman 0.9446',
      'NodeGoat live scan surfaced 4 custom findings',
      'Custom YAML rules, SSO/OIDC, workspaces, on-prem package, CI/CD',
    ],
    github: 'https://github.com/r1shabhsharma05/SecureGaurd',
    live: 'https://secureguard-main.vercel.app',
  },
  {
    name: 'SafeLife',
    icon: 'HeartPulse',
    tagline: 'One-tap SOS with live tracking',
    problem:
      'In an emergency, help needs one tap, not a form. SafeLife sends an SOS with live GPS to emergency contacts — even offline, queued and delivered when the connection returns.',
    stack: ['React Native', 'Expo', 'Node.js', 'Express', 'Supabase', 'Telegram alerts'],
    features: [
      'SOS confirmed working on real phones',
      '162/162 backend tests passing',
      'Offline SOS queue with live GPS tracking',
      'Safe-places engine and Telegram alerts',
    ],
    github: 'https://github.com/r1shabhsharma05/Saftey-App',
    live: 'https://safelife-ai.vercel.app',
  },
  {
    name: 'RailSync 2.0',
    icon: 'TrainFront',
    tagline: 'ML-assisted railway block planning',
    problem:
      'Planning railway blocks by hand is slow and error-prone. RailSync 2.0 (a team project) plans blocks from real timetable data with an ML module that keeps the schedule consistent.',
    stack: ['React', 'FastAPI', 'Python ML'],
    features: [
      '40+ timetable entries across 4 data sources',
      'ML-assisted block planning',
      'Team project',
    ],
    github: 'https://github.com/r1shabhsharma05/RailSync',
    live: null,
  },
  {
    name: 'Farmer Marketplace',
    icon: 'ShoppingBag',
    tagline: 'Two-sided marketplace with escrow checkout',
    problem:
      'Farmers selling direct need trust on both sides. Farmer Marketplace pairs buyers and farmers with escrow checkout, so payment is only released when the order is right.',
    stack: ['React', 'Vite', 'Express', 'Escrow service'],
    features: [
      'Two-sided marketplace — buyer and farmer flows',
      'Escrow checkout service',
      'Group buying, community deals and reward points',
    ],
    github: 'https://github.com/r1shabhsharma05/Farmer-Market-Place',
    live: 'https://farmer-market-place-six.vercel.app',
  },
]

// Every project now has a photo and lives in the carousel; GLA Nexus was
// removed from the section on Rishabh's order (2026-11-10). The block
// renders only when this list is non-empty (see Projects.jsx).
export const MORE_PROJECTS = []

export const EDUCATION = [
  {
    school: 'GLA University, Mathura',
    degree: 'B.Tech, Computer Science',
    period: 'Jul 2025 – Jul 2028',
    status: 'Pursuing — completes 2028',
    detail: 'CGPA 6.64/10',
  },
  {
    school: 'Janta Polytechnic',
    degree: 'Diploma, Computer Science (Associate degree)',
    period: 'Completed Jun 2025',
    status: 'Completed',
    detail: 'Grade 7.35/10',
  },
]

export const OPEN_SOURCE = {
  summary:
    '14 pull requests merged and 8 open across Jenkins, WordPress/Gutenberg, MergeShip, UltimateHealth, RailSync, Termux and other open-source projects (verified 2026-11-04).',
  highlight: 'Jenkins batch-control PR #112 — merged 2026-11-05.',
}

export const SIMULATIONS = [
  { org: 'Deloitte', area: 'Technology' },
  { org: 'JPMorgan Chase', area: 'Software Engineering' },
  { org: 'BCG X', area: 'GenAI' },
]
