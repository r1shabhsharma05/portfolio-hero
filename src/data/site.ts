/** Site content — single source for the homepage. All numbers verified 2026-11-12. */

export const SITE_URL = "https://portfolio-hero-psi-lemon.vercel.app";

export const PROFILE = {
  name: "Rishabh Sharma",
  firstName: "Rishabh",
  tagline: "I build cool things with AI.",
  email: "rishabhsharma14426@gmail.com",
  github: "https://github.com/r1shabhsharma05",
  linkedin: "https://www.linkedin.com/in/rishabh-sharma-342575438/",
  instagram: "https://www.instagram.com/cod.ehx",
  youtube: "https://www.youtube.com/@UntoldHx",
};

export interface Reel {
  id: string;
  title: string;
  /** Display views; null = unposted/new reel — render a "New" badge, never invent a number. */
  views: string | null;
  viewsRaw: number | null;
  tag: "LEARN" | "NEW";
  url: string;
  thumb: string;
  /** Hover-play preview clip; null = poster-only card (no Drive video available). */
  preview: string | null;
}

/** Top 8 @cod.ehx reels by lifetime views, verified via Instagram connector 2026-11-12
 *  (total reel views 1,114; no reel near 1k — real numbers only), plus the 2 unposted
 *  Drive videos (GitHub prompt + One Prompt draft, tag NEW, no views). Posters: IG CDN
 *  thumbs for poster-only reels; frames cut from the Drive videos for the live ones. */
export const REELS: Reel[] = [
  { id: "DfEjg7Hjghl", title: "100+ LLM apps sitting FREE on GitHub right now.", views: "206", viewsRaw: 206, tag: "LEARN", url: "https://www.instagram.com/reel/DfEjg7Hjghl/", thumb: "/reels/llm-apps-206.jpg", preview: null },
  { id: "DfVSuL7zIhi", title: "Gemini 4 argon ....", views: "127", viewsRaw: 127, tag: "LEARN", url: "https://www.instagram.com/reel/DfVSuL7zIhi/", thumb: "/reels/gemini.webp", preview: "/reels/gemini-preview.mp4" },
  { id: "De6U9LDtLVf", title: "Trending model", views: "121", viewsRaw: 121, tag: "LEARN", url: "https://www.instagram.com/reel/De6U9LDtLVf/", thumb: "/reels/trending-121.jpg", preview: null },
  { id: "De194H9DvUY", title: "PHP itself just got a remote-shell bug. No login, no plugin — one plain HTTP request.", views: "119", viewsRaw: 119, tag: "LEARN", url: "https://www.instagram.com/reel/De194H9DvUY/", thumb: "/reels/php-119.jpg", preview: null },
  { id: "Dfmk0MQPvFn", title: "Free claude skill", views: "117", viewsRaw: 117, tag: "LEARN", url: "https://www.instagram.com/reel/Dfmk0MQPvFn/", thumb: "/reels/claude-skill.webp", preview: "/reels/claude-skill-preview.mp4" },
  { id: "DfGwobiFElT", title: "Someone just turned Claude into a day-trading desk. And it's FREE.", views: "116", viewsRaw: 116, tag: "LEARN", url: "https://www.instagram.com/reel/DfGwobiFElT/", thumb: "/reels/trading-116.jpg", preview: null },
  { id: "DfnAhmGhVxY", title: "Claude made this one prompt", views: "108", viewsRaw: 108, tag: "LEARN", url: "https://www.instagram.com/reel/DfnAhmGhVxY/", thumb: "/reels/claude-prompt-108.jpg", preview: null },
  { id: "DfFAweQH_TG", title: "One prompt. Every LLM. Side by side.", views: "83", viewsRaw: 83, tag: "LEARN", url: "https://www.instagram.com/reel/DfFAweQH_TG/", thumb: "/reels/llm-comparison.webp", preview: "/reels/llm-comparison-preview.mp4" },
  { id: "github-prompt", title: "Upgrade your GitHub using this single prompt", views: null, viewsRaw: null, tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/github-prompt.webp", preview: "/reels/github-prompt-preview.mp4" },
  { id: "one-prompt", title: "One Prompt", views: null, viewsRaw: null, tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/one-prompt.webp", preview: "/reels/one-prompt-preview.mp4" },
];

export const STATS = [
  { value: "212", label: "LeetCode solved" },
  { value: "1,253", label: "GitHub contributions in 2026" },
  { value: "20", label: "Pull requests merged" },
];

export interface Project {
  name: string;
  tagline: string;
  description: string;
  image: string;
  live?: string;
  repo: string;
}

export const PROJECTS: Project[] = [
  { name: "SecureGaurd", tagline: "Find the risk. Fix what matters.", description: "Application security for every repository.", image: "/projects/secureguard.jpg", live: "https://secureguard-main.vercel.app", repo: "https://github.com/r1shabhsharma05/SecureGaurd" },
  { name: "SafeLife", tagline: "Emergency help, faster and closer.", description: "A safety companion that connects you to nearby hospitals, emergency services and guardians.", image: "/projects/safelife.jpg", live: "https://safelife-ai.vercel.app", repo: "https://github.com/r1shabhsharma05/Saftey-App" },
  { name: "RailSync 2.0", tagline: "AI-powered railway block planning.", description: "Data-driven train block scheduling.", image: "/projects/railsync.jpg", repo: "https://github.com/r1shabhsharma05/RailSync" },
  { name: "Farmer Marketplace", tagline: "From farm to market. Without barriers.", description: "Empowering farmers, connecting markets. Escrow payments, listings, profiles.", image: "/projects/farmer.jpg", live: "https://farmer-market-place-six.vercel.app", repo: "https://github.com/r1shabhsharma05/Farmer-Market-Place" },
  { name: "LocalKart", tagline: "Good finds. Right on campus.", description: "Buy and sell pre-loved essentials within your college.", image: "/projects/localkart.jpg", live: "https://localkart-jet.vercel.app", repo: "https://github.com/r1shabhsharma05/LocalKart" },
  { name: "Healthcare Hub", tagline: "Connected healthcare for everyone.", description: "A unified digital health platform. Your health, all in one place.", image: "/projects/healthcare.jpg", repo: "https://github.com/r1shabhsharma05" },
  { name: "MorphAI", tagline: "AI-powered content tooling.", description: "Modern AI APIs for creators.", image: "/projects/morphai.jpg", repo: "https://github.com/r1shabhsharma05" },
];

export const WORLDS = [
  {
    id: "build",
    title: "Build: products for everyone",
    body: "Idea to launch for real products: the seven products he built himself, from an AI railway planner to an emergency SOS app.",
    link: "/projects",
    linkLabel: "See the products ↗",
  },
  {
    id: "open-source",
    title: "Open Source: code in the open",
    body: "20 pull requests merged and 8 open across Jenkins, WordPress/Gutenberg and other projects — small verified fixes, reproduced first, reviewed by maintainers.",
    link: "https://github.com/r1shabhsharma05",
    linkLabel: "See the contributions ↗",
  },
  {
    id: "learn",
    title: "Learn: free resources",
    body: "Roadmaps, prompts and build write-ups, each with the Reel it came from — everything he learns, shared for free.",
    link: "/blog/",
    linkLabel: "Read the write-ups ↗",
  },
];

export const LEARN_POSTS = [
  { slug: "how-i-got-14-open-source-prs-merged", title: "How I got 14 open-source PRs merged", tag: "LEARN" },
  { slug: "building-safelife-sos", title: "Building SafeLife SOS", tag: "LEARN" },
  { slug: "my-claude-code-skills-setup", title: "My Claude Code skills setup", tag: "LEARN" },
];
