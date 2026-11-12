/**
 * Structured data behind the /api/v1 JSON endpoints.
 *
 * Same facts as llms.txt and the markdown pages, shaped for machine consumption
 * so an agent does not have to parse prose to answer "where does Rishabh work" or
 * "what has he built".
 */

export const API_VERSION = "v1";

/** Rate limit applied to every /api endpoint, in requests per window. */
export const RATE_LIMIT = 60;
export const RATE_WINDOW_SECONDS = 60;

export const PROFILE = {
  name: "Rishabh Sharma",
  headline: "Full-stack Developer | Open Source Contributor | Tech Creator",
  summary:
    "Full-stack developer and B.Tech Computer Science student at GLA University, Mathura (2025–2028). Builds and ships real products for web and mobile, contributes to open source, and makes tech Reels as @cod.ehx. LeetCode 212 solved.",
  url: "https://portfolio-hero-psi-lemon.vercel.app",
  email: "rishabhsharma14426@gmail.com",
  location: {
    locality: "Mathura",
    region: "Uttar Pradesh",
    country: "IN",
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    remote: true,
  },
  education: [
    {
      institution: "GLA University",
      fullName: "GLA University, Mathura",
      degree: "B.Tech",
      field: "Computer Science",
      graduationYear: 2028,
      url: "https://www.gla.ac.in",
    },
  ],
  currentRole: {
    title: "B.Tech Computer Science student",
    company: "GLA University",
    startDate: "2025-07",
    endDate: null,
  },
  experience: [
    {
      title: "Open Source Contributor",
      company: "WordPress / Gutenberg",
      startDate: "2025-10",
      endDate: null,
      summary:
        "Contributing to WordPress Gutenberg (React, TypeScript). Pull requests open and under review with code owners.",
      technologies: ["React", "TypeScript", "JavaScript", "WordPress"],
    },
    {
      title: "Open Source Contributor",
      company: "Jenkins",
      startDate: "2025-10",
      endDate: null,
      summary:
        "Merged pull requests to Jenkins plugins (batch-control-plugin). Smallest verified fixes, reproduced first, reviewed by maintainers.",
      technologies: ["Java", "Jenkins", "GitHub Actions"],
    },
  ],
  skills: {
    frontend: [
      "React",
      "Next.js",
      "React Native",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Vite",
      "Expo",
      "GSAP",
      "Framer Motion",
    ],
    backend: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "Python",
      "REST APIs",
      "Prisma",
      "Supabase",
      "PostgreSQL",
      "MongoDB",
    ],
    ai: [
      "XGBoost",
      "Machine Learning",
      "AI integrations",
      "Prompt engineering",
      "Claude Code skills",
    ],
    infrastructure: [
      "Git",
      "GitHub",
      "GitHub Actions",
      "Vercel",
      "Render",
      "Upstash",
      "QStash",
    ],
    content: ["Video Editing", "Tech Reels", "Scriptwriting"],
  },
  highlights: [
    "20 pull requests merged and 8 open across Jenkins, WordPress/Gutenberg and other projects",
    "212 LeetCode problems solved (88 Easy, 99 Medium, 25 Hard)",
    "Shipped 7 products: RailSync, SecureGaurd, SafeLife, Farmer Marketplace, LocalKart, Healthcare Hub, MorphAI",
    "Tech creator — Reels about AI tools and coding as @cod.ehx",
    "Built SafeLife: emergency SOS app with live location tracking and guardian alerts",
  ],
  availability: {
    openTo: [
      "internships",
      "open source collaboration",
      "freelance web development",
      "student projects",
    ],
    contactUrl: "https://portfolio-hero-psi-lemon.vercel.app/contact",
    preferredContact: "email",
    typicalResponseTime: "2 business days",
  },
  links: {
    website: "https://portfolio-hero-psi-lemon.vercel.app",
    github: "https://github.com/r1shabhsharma05",
    linkedin: "https://www.linkedin.com/in/rishabh-sharma-342575438/",
    instagram: "https://www.instagram.com/cod.ehx",
    youtube: "https://www.youtube.com/@UntoldHx",
    llmsTxt: "https://portfolio-hero-psi-lemon.vercel.app/llms.txt",
    blog: "https://portfolio-hero-psi-lemon.vercel.app/blog/",
  },
};

export const PROJECTS = [
  {
    id: "secureguard",
    name: "SecureGaurd",
    description:
      "Application security for every repository. Find the risk, fix what matters — automated vulnerability scanning with an AI classifier.",
    category: "web",
    technologies: ["React", "TypeScript", "Node.js", "Supabase", "Prisma"],
    url: "https://secureguard-main.vercel.app",
    repositoryUrl: "https://github.com/r1shabhsharma05/SecureGaurd",
    year: 2025,
  },
  {
    id: "safelife",
    name: "SafeLife",
    description:
      "Emergency help, faster and closer. A safety companion that connects you to nearby hospitals, emergency services and guardians, with live SOS alerts.",
    category: "mobile",
    technologies: ["React Native", "Expo", "Node.js", "Supabase", "Telegram"],
    url: "https://safelife-ai.vercel.app",
    repositoryUrl: "https://github.com/r1shabhsharma05/Saftey-App",
    year: 2025,
  },
  {
    id: "railsync",
    name: "RailSync 2.0",
    description:
      "AI-powered railway block planning. Optimises train block schedules with data-driven planning.",
    category: "web",
    technologies: ["Python", "FastAPI", "React", "XGBoost"],
    url: null,
    repositoryUrl: "https://github.com/r1shabhsharma05/RailSync",
    year: 2025,
  },
  {
    id: "farmer-marketplace",
    name: "Farmer Marketplace",
    description:
      "From farm to market, without barriers. Connects farmers directly with buyers — escrow payments, listings and profiles.",
    category: "web",
    technologies: ["React", "Node.js", "Express", "Supabase", "Razorpay"],
    url: "https://farmer-market-place-six.vercel.app",
    repositoryUrl: "https://github.com/r1shabhsharma05/Farmer-Market-Place",
    year: 2025,
  },
  {
    id: "localkart",
    name: "LocalKart",
    description:
      "Good finds, right on campus. A campus marketplace to buy and sell pre-loved essentials within your college.",
    category: "web",
    technologies: ["React", "Vite", "Node.js", "Express", "MongoDB"],
    url: "https://localkart-jet.vercel.app",
    repositoryUrl: "https://github.com/r1shabhsharma05/LocalKart",
    year: 2025,
  },
  {
    id: "healthcare-hub",
    name: "Healthcare Hub",
    description:
      "Connected healthcare for everyone. A unified digital health platform — your health, all in one place.",
    category: "web",
    technologies: ["React", "Node.js", "Supabase"],
    url: null,
    repositoryUrl: "https://github.com/r1shabhsharma05",
    year: 2025,
  },
  {
    id: "morphai",
    name: "MorphAI",
    description:
      "AI-powered content and media tooling. Built with modern AI APIs for creators.",
    category: "ai",
    technologies: ["React", "Node.js", "AI APIs"],
    url: null,
    repositoryUrl: "https://github.com/r1shabhsharma05",
    year: 2025,
  },
];

/** Standard headers every JSON API response carries. */
export function apiHeaders(res, { remaining, resetSeconds }) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Vary", "Accept, Accept-Encoding");
  res.setHeader("X-API-Version", API_VERSION);
  // RFC 9239-style rate limit signalling so agents can self-throttle.
  res.setHeader("RateLimit-Limit", String(RATE_LIMIT));
  res.setHeader("RateLimit-Remaining", String(Math.max(0, remaining)));
  res.setHeader("RateLimit-Reset", String(resetSeconds));
  res.setHeader(
    "RateLimit-Policy",
    `${RATE_LIMIT};w=${RATE_WINDOW_SECONDS}`
  );
}

/**
 * RFC 9457 problem detail. Every non-2xx response across /api uses this shape,
 * so an agent can branch on `code` without parsing prose.
 */
export function problem(res, status, code, title, detail, extra = {}) {
  res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
  return res.status(status).json({
    type: `https://portfolio-hero-psi-lemon.vercel.app/developers#${code}`,
    title,
    status,
    code,
    detail,
    instance: extra.instance,
    ...extra,
  });
}

const buckets = new Map();

/** Fixed-window limiter shared by the /api/v1 read endpoints. */
export function rateLimit(ip) {
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + RATE_WINDOW_SECONDS * 1000;
    buckets.set(ip, { count: 1, resetAt });
    return { limited: false, remaining: RATE_LIMIT - 1, resetSeconds: RATE_WINDOW_SECONDS };
  }
  entry.count++;
  const resetSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  return {
    limited: entry.count > RATE_LIMIT,
    remaining: RATE_LIMIT - entry.count,
    resetSeconds,
  };
}

export function clientIp(req) {
  return (
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}
