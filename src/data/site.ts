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
  /** World the reel belongs to — drives the sentence-hover focus dim. */
  world: "build" | "brand" | "learn";
  url: string;
  thumb: string;
  /** Hover-play preview clip; null = poster-only card (no Drive video available). */
  preview: string | null;
}

/** Top 8 @cod.ehx reels by lifetime views, verified via Instagram connector 2026-11-12
 *  (total reel views 1,121 then), plus the 2 unposted Drive videos (GitHub prompt +
 *  One Prompt draft, tag NEW, no views), the posted "7 day Macbook" reel (7 views),
 *  and 2 more Drive reels added 2026-11-13: "Muse motion reel" (1,000 views) and
 *  "Kalyani — Lyric video" (5,000 views) — counts as stated by Rishabh (IG connector
 *  down, unverified); total reel views now 7,000 ("Trending model", 121 views,
 *  removed 2026-11-22 on his word). Posters: IG CDN thumbs for
 *  poster-only reels; frames cut from the Drive videos for the live ones. The 2 new
 *  videos are letterboxed 16:9 inside a 9:16 frame — posters/previews use a
 *  blurred-fill treatment so the cards read clean. 2 more Drive reels added
 *  2026-11-16 (tag NEW, no views): "Portfolio reel" (his video-editor showreel;
 *  letterboxed, blurred-fill poster/preview) and "Claude dropped five launches"
 *  (Claude Sheets / Whiteboards / Meetings / Plans explainer). 3 more Drive reels
 *  added 2026-11-20 (tag NEW, no views): "See this clip? Made by a skill" (clipping
 *  skill), "Create a digital product for your audience" (Claude business reel) and
 *  "Only One Skill" (altura website skill). 2 more Drive reels added
 *  2026-11-22 (tag NEW, no views): "Stop paying for AI videos" (free AI video
 *  tool) and "What is ROI?" (marketing/ROI explainer, landscape source,
 *  blurred-fill poster/preview). 1 more Drive reel added 2026-11-22 (tag NEW,
 *  no views): "Stop paying $200 a month for AI coding" (Devin Max free via
 *  Poke). Total 21 reels. */
export const REELS: Reel[] = [
  { id: "DfEjg7Hjghl", title: "100+ LLM apps sitting FREE on GitHub right now.", views: "206", viewsRaw: 206, world: "learn", tag: "LEARN", url: "https://www.instagram.com/reel/DfEjg7Hjghl/", thumb: "/reels/llm-apps-206.jpg", preview: null },
  { id: "DfVSuL7zIhi", title: "Gemini 4 argon ....", views: "127", viewsRaw: 127, world: "learn", tag: "LEARN", url: "https://www.instagram.com/reel/DfVSuL7zIhi/", thumb: "/reels/gemini.webp", preview: "/reels/gemini-preview.mp4" },
  { id: "De194H9DvUY", title: "PHP itself just got a remote-shell bug. No login, no plugin — one plain HTTP request.", views: "119", viewsRaw: 119, world: "learn", tag: "LEARN", url: "https://www.instagram.com/reel/De194H9DvUY/", thumb: "/reels/php-119.jpg", preview: null },
  { id: "Dfmk0MQPvFn", title: "Free claude skill", views: "117", viewsRaw: 117, world: "learn", tag: "LEARN", url: "https://www.instagram.com/reel/Dfmk0MQPvFn/", thumb: "/reels/claude-skill.webp", preview: "/reels/claude-skill-preview.mp4" },
  { id: "DfGwobiFElT", title: "Someone just turned Claude into a day-trading desk. And it's FREE.", views: "116", viewsRaw: 116, world: "learn", tag: "LEARN", url: "https://www.instagram.com/reel/DfGwobiFElT/", thumb: "/reels/trading-116.jpg", preview: null },
  { id: "DfnAhmGhVxY", title: "Claude made this one prompt", views: "108", viewsRaw: 108, world: "learn", tag: "LEARN", url: "https://www.instagram.com/reel/DfnAhmGhVxY/", thumb: "/reels/claude-prompt-108.jpg", preview: null },
  { id: "DfFAweQH_TG", title: "One prompt. Every LLM. Side by side.", views: "83", viewsRaw: 83, world: "learn", tag: "LEARN", url: "https://www.instagram.com/reel/DfFAweQH_TG/", thumb: "/reels/llm-comparison.webp", preview: "/reels/llm-comparison-preview.mp4" },
  { id: "github-prompt", title: "Upgrade your GitHub using this single prompt", views: null, viewsRaw: null, world: "brand", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/github-prompt.webp", preview: "/reels/github-prompt-preview.mp4" },
  { id: "one-prompt", title: "One Prompt", views: null, viewsRaw: null, world: "brand", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/one-prompt.webp", preview: "/reels/one-prompt-preview.mp4" },
  { id: "macbook-7day", title: "7 day Macbook", views: "7", viewsRaw: 7, world: "learn", tag: "LEARN", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/macbook-7day.webp", preview: "/reels/macbook-7day-preview.mp4" },
  { id: "alfaaz-single-prompt", title: "Alfaaz — Single prompt", views: null, viewsRaw: null, world: "learn", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/alfaaz-prompt.webp", preview: "/reels/alfaaz-prompt-preview.mp4" },
  { id: "muse-motion", title: "Muse motion reel", views: "1,000", viewsRaw: 1000, world: "learn", tag: "LEARN", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/muse-motion.webp", preview: "/reels/muse-motion-preview.mp4" },
  { id: "kalyani-lyric", title: "Kalyani — Lyric video", views: "5,000", viewsRaw: 5000, world: "learn", tag: "LEARN", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/kalyani-lyric.webp", preview: "/reels/kalyani-lyric-preview.mp4" },
  { id: "portfolio-reel", title: "Portfolio reel", views: null, viewsRaw: null, world: "learn", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/portfolio-reel.webp", preview: "/reels/portfolio-reel-preview.mp4" },
  { id: "claude-five-launches", title: "Claude dropped five launches", views: null, viewsRaw: null, world: "learn", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/claude-five-launches.webp", preview: "/reels/claude-five-launches-preview.mp4" },
  { id: "clipping-skill", title: "See this clip? Made by a skill", views: null, viewsRaw: null, world: "learn", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/clipping-skill.webp", preview: "/reels/clipping-skill-preview.mp4" },
  { id: "digital-product", title: "Create a digital product for your audience", views: null, viewsRaw: null, world: "brand", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/digital-product.webp", preview: "/reels/digital-product-preview.mp4" },
  { id: "only-one-skill", title: "Only One Skill", views: null, viewsRaw: null, world: "build", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/only-one-skill.webp", preview: "/reels/only-one-skill-preview.mp4" },
  { id: "free-ai-videos", title: "Stop paying for AI videos", views: null, viewsRaw: null, world: "learn", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/free-ai-videos.webp", preview: "/reels/free-ai-videos-preview.mp4" },
  { id: "marketing-roi", title: "What is ROI?", views: null, viewsRaw: null, world: "brand", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/marketing-roi.webp", preview: "/reels/marketing-roi-preview.mp4" },
  { id: "devin-free", title: "Stop paying $200 a month for AI coding", views: null, viewsRaw: null, world: "learn", tag: "NEW", url: "https://www.instagram.com/cod.ehx", thumb: "/reels/devin-free.webp", preview: "/reels/devin-free-preview.mp4" },
];

export const STATS = [
  { value: "221", label: "LeetCode solved" },
  { value: "1,875", label: "GitHub contributions in 2026" },
  { value: "24", label: "Pull requests merged" },
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
  { name: "RailSync 2.0", tagline: "AI-powered railway block planning.", description: "Data-driven train block scheduling.", image: "/projects/railsync.jpg", live: "https://railsync2-frontend.pages.dev/", repo: "https://github.com/r1shabhsharma05/RailSync" },
  { name: "Farmer Marketplace", tagline: "From farm to market. Without barriers.", description: "Empowering farmers, connecting markets. Escrow payments, listings, profiles.", image: "/projects/farmer.jpg", live: "https://farmer-market-place-six.vercel.app", repo: "https://github.com/r1shabhsharma05/Farmer-Market-Place" },
  { name: "LocalKart", tagline: "Good finds. Right on campus.", description: "Buy and sell pre-loved essentials within your college.", image: "/projects/localkart.jpg", live: "https://localkart-jet.vercel.app", repo: "https://github.com/r1shabhsharma05/LocalKart" },
  { name: "Healthcare Hub", tagline: "Connected healthcare for everyone.", description: "A unified digital health platform. Your health, all in one place.", image: "/projects/healthcare.jpg", repo: "https://github.com/r1shabhsharma05" },
  { name: "MorphAI", tagline: "AI-powered content tooling.", description: "Modern AI APIs for creators.", image: "/projects/morphai.jpg", repo: "https://github.com/r1shabhsharma05/MorphAi" },
  { name: "Rkhshak", tagline: "Master security skills.", description: "Master security skills — complete production-readiness security audit + minimal-code fixes. Nothing partial.", image: "/projects/rkhshak.jpg", repo: "https://github.com/r1shabhsharma05/Rkhshak" },
];

export const WORLDS = [
  {
    id: "build",
    title: "Build: products for everyone",
    body: "Idea to launch for real products: the eight products he shipped, from an AI railway planner to an emergency SOS app.",
    link: "/projects/",
    linkLabel: "See the products ↗",
  },
  {
    id: "brand",
    title: "Brand: campaigns on camera",
    body: "Real tools, built on camera — the @cod.ehx Reels brands see first. A media kit for campaigns: reach, formats, and how a collaboration works.",
    link: "/brands/",
    linkLabel: "See the media kit ↗",
  },
  {
    id: "learn",
    title: "Learn: free resources",
    body: "Roadmaps, prompts and build write-ups, each with the Reel it came from — everything he learns, shared for free.",
    link: "/learn/",
    linkLabel: "Read the write-ups ↗",
  },
];

/** Header nav worlds — Build / Brand / Learn (the reference's three worlds). */
export const NAV_WORLDS = [
  { id: "build", label: "Build", color: "#2F55FF", text: "#ffffff", href: "/projects/" },
  { id: "brand", label: "Brand", color: "#EF3B2D", text: "#ffffff", href: "/brands/" },
  { id: "learn", label: "Learn", color: "#FFC81A", text: "#111111", href: "/learn/" },
] as const;

export const LEARN_POSTS = [
  { slug: "how-i-made-a-trending-song-lyric-video-with-ai", title: "How I Made a Trending Song's Lyric Video with AI", tag: "PROMPT" },
  { slug: "round-up-micro-savings-app-india", title: "Someone Please Build This in India: The Round-Up Micro-Savings App", tag: "BUSINESS IDEA" },
  { slug: "who-is-rishabh-sharma", title: "Who is Rishabh Sharma?", tag: "ABOUT" },
];

/** Home Agent view — the 5 personas, prompt builder, endpoints and
 *  "Plug this site into your agent" section. Mirrors the reference's
 *  home agent view; every fact is Rishabh's own (verified 2026-11-12/18).
 *  Accent colours follow the reference's persona hover: Founder blue,
 *  Brand red, Student yellow, Curious + Developer black. */
export interface HomePersona {
  id: string;
  num: string;
  name: string;
  tagline: string;
  accent: string;
  prompt: string;
  example: { lead: string; text: string }[];
  quote?: string;
  curl?: string;
  footnotes: string[];
  readLabel: string;
  readHref: string;
}

export const HOME_PERSONAS: HomePersona[] = [
  {
    id: "founder",
    num: "01",
    name: "Founder",
    tagline: "Get your product idea scoped.",
    accent: "#2F55FF",
    prompt:
      "Read /llms.txt and /projects. I'm a founder. What has Rishabh built, what is he best at, and could he help me build my product? Draft a short email I can send him.",
    example: [
      {
        lead: "What he has built.",
        text: "SafeLife AI, a personal safety app with live SOS; SecureGaurd, a security platform; RailSync 2.0, AI railway planning; plus LocalKart, Farmer Marketplace and Rkhshak. {{PRS_MERGED}} open-source PRs merged. [1][2]",
      },
      {
        lead: "Where he fits.",
        text: "Taking an AI product from an idea to a first version people use. [2]",
      },
    ],
    quote: "Hi Rishabh, I'm building [your product] and want a first version by [date]. Could we talk?",
    footnotes: ["1 /LLMS.TXT", "2 /PROJECTS"],
    readLabel: "See his projects",
    readHref: "/projects/",
  },
  {
    id: "brand",
    num: "02",
    name: "Brand",
    tagline: "Get the media kit and a brief.",
    accent: "#EF3B2D",
    prompt:
      "Read /llms.txt and /brands. I run a brand. What campaigns does Rishabh make, who watches him, and can you draft a short brief I can email him?",
    example: [
      {
        lead: "What he makes.",
        text: "Short Reels where an AI tool does something worth watching twice — motion type, lyric videos, AI builds on camera. [2]",
      },
      {
        lead: "Who watches.",
        text: "7,000 views across 21 Reels on @cod.ehx, mostly students and early-career developers in India. [1][2]",
      },
    ],
    quote: "Hi Rishabh, we're [brand] and want a Reel for [launch] in [month]. What would you make?",
    footnotes: ["1 /LLMS.TXT", "2 /BRANDS"],
    readLabel: "See the media kit",
    readHref: "/brands/",
  },
  {
    id: "student",
    num: "03",
    name: "Student",
    tagline: "Find the right free roadmap.",
    accent: "#FFC81A",
    prompt:
      "Read /llms.txt and /learn. I'm a student learning to code. Which of Rishabh's free roadmaps should I start with, and why?",
    example: [
      {
        lead: "Start here.",
        text: "518 JavaScript interview questions, then 446 React questions. Both free, sorted by topic, with answers. [2]",
      },
      {
        lead: "Then go deeper.",
        text: "1,173 System Design lessons and 502 Python questions when you're ready. [2]",
      },
    ],
    footnotes: ["1 /LLMS.TXT", "2 /LEARN"],
    readLabel: "Browse the roadmaps",
    readHref: "/learn/",
  },
  {
    id: "curious",
    num: "04",
    name: "Curious",
    tagline: "Ask anything about Rishabh.",
    accent: "#111111",
    prompt:
      "Read /llms.txt and /about. Who is Rishabh Sharma, what does he build, and what is he known for?",
    example: [
      {
        lead: "Who he is.",
        text: "A CS undergrad at GLA University, Mathura, who builds AI products and shows how on Instagram. [1][2]",
      },
      {
        lead: "Known for.",
        text: "{{PRS_MERGED}} merged open-source PRs, {{CONTRIBUTIONS}} GitHub contributions in {{YEAR}}, and free roadmaps for students. [1]",
      },
    ],
    footnotes: ["1 /LLMS.TXT", "2 /ABOUT"],
    readLabel: "Read about Rishabh",
    readHref: "/about/",
  },
  {
    id: "developer",
    num: "05",
    name: "Developer",
    tagline: "Plug this site into your agent.",
    accent: "#111111",
    prompt:
      "Read /llms.txt and /openapi.json. I'm a developer. What can my agent read and ask on portfolio-hero-psi-lemon.vercel.app, and what is the first request I should make? Show it with curl.",
    example: [
      {
        lead: "What your agent can read.",
        text: "Every page as Markdown, the Learn posts, and Rishabh's AI over POST /api/chat. No keys, no signup. [1][2]",
      },
    ],
    curl: '$ curl "https://portfolio-hero-psi-lemon.vercel.app/openapi.json"',
    footnotes: ["1 /LLMS.TXT", "2 /OPENAPI.JSON"],
    readLabel: "Open the developer page",
    readHref: "/developers/",
  },
];

/** What the AI reads — the same three lines in every persona panel. */
export const HOME_AGENT_READS = [
  { label: "/llms.txt", desc: "The overview" },
  { label: "/openapi.json", desc: "Every endpoint" },
  { label: "First call", desc: "Written for you" },
];

/** "Plug this site into your agent" — the three START HERE curl boxes. */
export const HOME_AGENT_CURLS = [
  "$ curl https://portfolio-hero-psi-lemon.vercel.app/llms.txt",
  '$ curl -H "Accept: text/markdown" https://portfolio-hero-psi-lemon.vercel.app/',
  "$ curl https://portfolio-hero-psi-lemon.vercel.app/openapi.json",
];

/** Endpoint grid — only endpoints that exist on this site. */
export const HOME_AGENT_ENDPOINTS: {
  group: string;
  rows: { method: "GET" | "POST"; path: string; desc: string }[];
}[] = [
  {
    group: "READ",
    rows: [
      { method: "GET", path: "/llms.txt", desc: "Everything about Rishabh, in plain text" },
      { method: "GET", path: "/index.md", desc: "Any page as Markdown: add .md" },
      { method: "GET", path: "/openapi.json", desc: "OpenAPI 3.1" },
      { method: "GET", path: "/api/v1/stats", desc: "Live LeetCode + GitHub numbers" },
    ],
  },
  {
    group: "LEARN",
    rows: [
      { method: "GET", path: "/learn/", desc: "The roadmaps, prompts and business ideas" },
    ],
  },
  {
    group: "BUILD",
    rows: [
      { method: "GET", path: "/projects/", desc: "The shipped work" },
      { method: "GET", path: "/brands/", desc: "The media kit" },
    ],
  },
  {
    group: "ASK",
    rows: [
      { method: "POST", path: "/api/chat", desc: "Questions about Rishabh and his posts" },
    ],
  },
  {
    group: "DISCOVER",
    rows: [
      { method: "GET", path: "/sitemap.xml", desc: "Every canonical URL" },
      { method: "GET", path: "/developers", desc: "Developer portal" },
    ],
  },
];

/** "What Rishabh does" — the agent view's three-column version. */
export const HOME_AGENT_DOES = {
  intro:
    "Rishabh Sharma is a full-stack developer studying Computer Science at GLA University, Mathura. He builds AI products, contributes to open source, and writes free roadmaps for students.",
  items: [
    {
      title: "Build: products for founders",
      body: "AI products and open-source tools: SafeLife AI, SecureGaurd, RailSync 2.0, LocalKart, Farmer Marketplace and Rkhshak — plus {{PRS_MERGED}} merged open-source PRs.",
    },
    {
      title: "Brand: the media kit",
      body: "Tech Reels on @cod.ehx — 21 reels, 7,000 views: motion type, lyric videos, and AI builds on camera.",
    },
    {
      title: "Learn: free resources",
      body: "39 free roadmaps, prompts and business ideas for students learning to code.",
    },
  ],
};

/** "Work with Rishabh" — the agent view's version. */
export const HOME_AGENT_WORK =
  "Founders bring him products to build, from an MVP to an AI feature inside an existing app. Brands bring him campaigns. The best way to reach him is by email at rishabhsharma14426@gmail.com; he replies himself.";
