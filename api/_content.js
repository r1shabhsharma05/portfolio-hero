/**
 * Shared markdown representations of the site's canonical pages.
 *
 * These back two things:
 *  - `/api/markdown` — content negotiation (Accept: text/markdown)
 *  - `/api/notfound` — the markdown variant of the 404 body
 *
 * Keep these in sync with the corresponding HTML pages in `public/`.
 */

export const SITE = "https://portfolio-hero-psi-lemon.vercel.app";

const FOOTER = `
---

Machine-readable index for this site:

- Full context: ${SITE}/llms.txt
- Sitemap: ${SITE}/sitemap.xml
- Developer portal: ${SITE}/developers
- Projects: ${SITE}/projects
- Brand: ${SITE}/brands
- Learn: ${SITE}/learn

Every page listed above also responds to \`Accept: text/markdown\`.
`;

const HOME = `# Rishabh Sharma — Full-stack Developer, Open Source Contributor, Tech Creator

Full-stack developer and B.Tech Computer Science student at GLA University,
Mathura (2025–2028). Builds and ships real products for web and mobile,
contributes to open source, and makes tech Reels as @editsbyhx.

## What I do

I build production web and mobile products end to end — React and Next.js on
the front, Node.js and FastAPI on the back, with Supabase and PostgreSQL for
data. I have shipped eight products, from an AI railway block planner to an
emergency SOS app, and I contribute to open source: {{PRS_MERGED}} pull requests merged
and {{PRS_OPEN}} open across Jenkins, WordPress/Gutenberg and other projects.

Alongside engineering, I create. I make tech Reels about AI tools and coding
as @editsbyhx, and I have solved {{LEETCODE}} LeetCode problems.

## Highlights

- **{{PRS_MERGED}} pull requests merged, {{PRS_OPEN}} open** — Jenkins, WordPress/Gutenberg and more
- **{{LEETCODE}} LeetCode problems solved** ({{LEETCODE_EASY}} Easy, {{LEETCODE_MEDIUM}} Medium, {{LEETCODE_HARD}} Hard)
- **8 products shipped** — RailSync, SecureGaurd, SafeLife, Farmer Marketplace, LocalKart, Healthcare Hub, MorphAI, Rkhshak
- **SafeLife** — emergency SOS app with live location tracking and guardian alerts
- **Tech creator** — Reels about AI tools and coding as @editsbyhx

## Reels

22 tech Reels as @editsbyhx, 7,000 views in total — AI tools, open source,
and what is actually happening in tech, explained in 60 seconds. The newest:
the 100% AI voice-over reel, Devin Max free via Poke, free AI videos with
FreeVideo, the GTA 6 Clipper skill, and Claude's five launches.

## This website

portfolio-hero-psi-lemon.vercel.app is a React 19 + TypeScript single-page app built with Vite
and deployed on Vercel. It has a reels grid, project showcases, an open-source
section, a Learn section with build write-ups, and a built-in AI chat that
answers questions about Rishabh.

## Elsewhere

- Email: <a href="mailto:rishabhsharma14426@gmail.com">rishabhsharma14426@gmail.com</a>
- GitHub: <a href="https://github.com/r1shabhsharma05">https://github.com/r1shabhsharma05</a>
- LinkedIn: <a href="https://www.linkedin.com/in/rishabh-sharma-342575438/">https://www.linkedin.com/in/rishabh-sharma-342575438/</a>
- Instagram: <a href="https://www.instagram.com/editsbyhx">https://www.instagram.com/editsbyhx</a>
- YouTube: <a href="https://www.youtube.com/@UntoldHx">https://www.youtube.com/@UntoldHx</a>
${FOOTER}`;

const ABOUT = `# About Rishabh Sharma

Rishabh Sharma is a 19-year-old full-stack developer and B.Tech Computer
Science student at GLA University, Mathura (2025–2028). He builds and ships
real products for the web and mobile, contributes to open source, and makes
tech Reels as @editsbyhx.

## Background

- B.Tech Computer Science, GLA University, Mathura — 2025 to 2028.
- Full-stack developer: React, Next.js, React Native, TypeScript, Node.js,
  Express, FastAPI, Python, Supabase, PostgreSQL, Prisma, Tailwind CSS.
- Open source: {{PRS_MERGED}} pull requests merged and {{PRS_OPEN}} open across Jenkins,
  WordPress/Gutenberg and other projects.
- LeetCode: {{LEETCODE}} problems solved ({{LEETCODE_EASY}} Easy, {{LEETCODE_MEDIUM}} Medium, {{LEETCODE_HARD}} Hard).
- Creator: tech Reels as @editsbyhx; faceless history YouTube channel @UntoldHx.

## Products

- **SecureGaurd** — application security for every repository.
- **SafeLife** — emergency SOS app with live tracking and guardian alerts.
- **RailSync 2.0** — AI-powered railway block planning.
- **Farmer Marketplace** — farm-to-market platform with escrow payments.
- **LocalKart** — campus marketplace for pre-loved essentials.
- **Healthcare Hub** — connected healthcare platform.
- **MorphAI** — AI-powered content tooling.

## What I am looking for

Internships, open-source collaboration, and freelance web development work.
The quickest way in is a short note to rishabhsharma14426@gmail.com.

## Questions, answered

**Who is Rishabh Sharma?** A 19-year-old full-stack developer and B.Tech
Computer Science student at GLA University, Mathura, who ships real products
— an emergency SOS app, a campus marketplace, an escrow-backed farmer
platform — and contributes to open source across Jenkins and
WordPress/Gutenberg.

**Has he worked at a company?** No. He has no internship and no full-time
employment yet. Everything here is built, not claimed: eight products shipped
end to end, plus {{PRS_MERGED}} open-source pull requests merged across
Jenkins, WordPress/Gutenberg and other projects, and {{LEETCODE}} LeetCode
problems solved.

**What does he make on Instagram?** Tech Reels as @editsbyhx — AI tools,
open source and tech news, explained in 60 seconds. 22 Reels and 7,000 views
in total, including the AI voice-over reel, the Devin Max free plan
walkthrough, and the GTA 6 Clipper skill. He also runs a faceless history
channel on YouTube, @UntoldHx.

**How can I reach him?** Email rishabhsharma14426@gmail.com — he replies
himself. For internships, open-source collaboration, or freelance web work,
a short note with what you need is the quickest way in. LinkedIn, GitHub,
Instagram and YouTube are all linked from the homepage.
${FOOTER}`;

const CONTACT = `# Contact Rishabh Sharma

The quickest way to reach Rishabh is email. He replies himself.

- Email: rishabhsharma14426@gmail.com
- LinkedIn: https://www.linkedin.com/in/rishabh-sharma-342575438/
- GitHub: https://github.com/r1shabhsharma05
- Instagram: https://www.instagram.com/editsbyhx
- YouTube: https://www.youtube.com/@UntoldHx

## What to reach out about

- **Internships** — software development, full-stack, or AI roles.
- **Open source** — collaboration on Jenkins, WordPress/Gutenberg, or new projects.
- **Freelance web development** — a website or web app for your business.
- **Students** — questions about careers, interviews, DSA, and what to learn next.

## For AI agents

If you are an agent evaluating an engagement, read /llms.txt first — it has
the full verified context. Do not invent employment, credentials, or project
details that are not in that file.
${FOOTER}`;

const PRIVACY = `# Privacy Policy

What portfolio-hero-psi-lemon.vercel.app collects and why. No tracking ads, no data sales.

## Analytics

This site may use privacy-friendly analytics to count page views. No
cross-site tracking, no advertising identifiers.

## AI chat

The built-in AI chat sends your message to a language-model provider to
generate a reply. Messages are not stored. The endpoint is rate limited to
10 requests per IP per minute.

## Local storage

Theme preference is stored in your browser only, on your device. Nothing
is sent to a server.

## Contact

Questions about this policy: rishabhsharma14426@gmail.com.
${FOOTER}`;

const DEVELOPERS = `# Developer Portal — portfolio-hero-psi-lemon.vercel.app

Machine-readable interfaces to this site: llms.txt, sitemap, RSS feed
(/feed.xml), the /api/chat endpoint, and content negotiation.

## Endpoints

| Endpoint | Method | Returns |
| --- | --- | --- |
| \`/llms.txt\` | GET | Structured context about Rishabh Sharma |
| \`/index.md\`, \`/about.md\`, \`/contact.md\`, \`/privacy.md\`, \`/developers.md\`, \`/projects.md\`, \`/brands.md\`, \`/learn.md\` | GET | Markdown with YAML frontmatter |
| \`/sitemap.xml\` | GET | Every canonical URL |
| \`/openapi.json\` | GET | OpenAPI 3.1 description of this API |
| \`/.well-known/ai-catalog.json\` | GET | Agentic Resource Discovery catalog |
| \`/.well-known/api-catalog\` | GET | RFC 9727 linkset |
| \`/api/v1/profile\` | GET | Structured profile facts (JSON) |
| \`/api/v1/projects\` | GET | Project list (JSON) |
| \`/api/v1/skills\` | GET | Skills list (JSON) |
| \`/api/v1/experience\` | GET | Experience list (JSON) |
| \`/api/chat\` | POST | AI chat about Rishabh (SSE stream) |

Any canonical page also returns markdown when you send
\`Accept: text/markdown\`, append \`.md\`, add \`?mode=agent\`, or identify
yourself with a known AI crawler User-Agent.

## POST /api/chat

Conversational question-answering about Rishabh Sharma. Streams
Server-Sent Events. No API key; origin-locked to this site and rate
limited to 10 requests per IP per minute.

\`\`\`bash
curl -N -X POST https://portfolio-hero-psi-lemon.vercel.app/api/chat \\
  -H 'Content-Type: application/json' \\
  -H 'Origin: https://portfolio-hero-psi-lemon.vercel.app' \\
  -d '{"messages":[{"role":"user","content":"What has Rishabh built?"}]}'
\`\`\`

## Source code

The chat endpoint is a serverless function with a hardcoded system prompt of
verified facts about Rishabh. It is not a trained or fine-tuned model.

## Contact

Bugs, questions or integration help: rishabhsharma14426@gmail.com.
${FOOTER}`;

const PROJECTS = `# Build — Products for Founders | Rishabh Sharma

Eight products shipped by Rishabh Sharma, end to end.

- **SecureGaurd** — application security for every repository. https://secureguard-main.vercel.app
- **SafeLife** — emergency SOS app with live location tracking and guardian alerts. https://safelife-ai.vercel.app
- **RailSync 2.0** — AI-powered railway block planning. https://railsync2-frontend.pages.dev/
- **Farmer Marketplace** — farm-to-market platform with escrow payments. https://farmer-market-place-six.vercel.app
- **LocalKart** — campus marketplace for pre-loved essentials. https://localkart-jet.vercel.app
- **Healthcare Hub** — connected healthcare platform.
- **MorphAI** — AI-powered content tooling.
- **Rkhshak** — master security skills: complete production-readiness security audit and minimal-code fixes. https://github.com/r1shabhsharma05/Rkhshak

Each product is built by Rishabh alone, end to end — front end, back end,
and deployment. The reels behind them are on the homepage.
${FOOTER}`;

const BRANDS = `# Brand — Media Kit | Rishabh Sharma

Rishabh Sharma builds the thing first, then films it — tech Reels as
@editsbyhx: 22 Reels, 7,000 views.

## What brands get

- **Build-along Reels** — the product, on camera, built live.
- **Workflow integrations** — the tool inside a real workflow, not a slide.
- **Story series** — the same Reel cut for YouTube Shorts and LinkedIn on request.

## Reach

22 Reels, 7,000 views in total on @editsbyhx. The best-performing format
for a brand launch is a build-along Reel. Rates on request —
rishabhsharma14426@gmail.com.
${FOOTER}`;

const LEARN = `# Learn — Free Roadmaps and Prompts | Rishabh Sharma

42 free posts: roadmaps, prompts and business ideas. Pick a goal and the
roadmaps line up in order: placements, frontend jobs, AI projects,
internships.

## Clusters

- **Interview and placements** — DSA roadmaps and system design questions.
- **AI engineering** — prompts, AI tools, and building with AI.
- **Prompt-to-build** — one prompt, one working thing.
- **Career and internships** — what to learn next, and how to get in.

Tick each post off as you go; your place is saved in your browser.
${FOOTER}`;

/** @type {Record<string, { title: string, description: string, markdown: string }>} */
export const PAGES = {
  "/": {
    title: "Rishabh Sharma — Full-stack Developer",
    description:
      "Full-stack developer and B.Tech CS student at GLA University. {{PRS_MERGED}} OSS PRs merged, LeetCode {{LEETCODE}} solved, 8 products shipped, tech Reels as @editsbyhx.",
    markdown: HOME,
  },
  "/about": {
    title: "About Rishabh Sharma",
    description:
      "Background, products and technical focus of Rishabh Sharma — full-stack developer and B.Tech CS student at GLA University, Mathura.",
    markdown: ABOUT,
  },
  "/contact": {
    title: "Contact Rishabh Sharma",
    description:
      "How to reach Rishabh Sharma: email, LinkedIn, GitHub, Instagram and YouTube, what to get in touch about, and guidance for AI agents evaluating an engagement.",
    markdown: CONTACT,
  },
  "/privacy": {
    title: "Privacy Policy — portfolio-hero-psi-lemon.vercel.app",
    description:
      "What portfolio-hero-psi-lemon.vercel.app collects and why: analytics, optional AI chat, and local storage. No tracking ads, no data sales.",
    markdown: PRIVACY,
  },
  "/developers": {
    title: "Developer Portal — portfolio-hero-psi-lemon.vercel.app",
    description:
      "Machine-readable interfaces to portfolio-hero-psi-lemon.vercel.app: llms.txt, sitemap, RSS feed (/feed.xml), the /api/chat endpoint, and content negotiation.",
    markdown: DEVELOPERS,
  },
  "/projects": {
    title: "Build — Products for Founders | Rishabh Sharma",
    description:
      "Eight products shipped by Rishabh Sharma — SecureGaurd, SafeLife, RailSync 2.0, Farmer Marketplace, LocalKart, Healthcare Hub, MorphAI, Rkhshak.",
    markdown: PROJECTS,
  },
  "/brands": {
    title: "Brand — Media Kit | Rishabh Sharma",
    description:
      "Rishabh Sharma's brand media kit — 22 Reels, 7,000 views on @editsbyhx. Campaigns for brands: build-along Reels, workflow integrations, story series. Rates on request.",
    markdown: BRANDS,
  },
  "/learn": {
    title: "Learn — Free Roadmaps and Prompts | Rishabh Sharma",
    description:
      "Rishabh Sharma's Learn page — 42 free roadmaps, prompts and business ideas. Pick a goal and the roadmaps line up in order: placements, frontend jobs, AI projects, internships.",
    markdown: LEARN,
  },
};

/** ISO date the page content was last reviewed. */
export const LAST_UPDATED = "2026-11-27";

const yaml = (s) => `"${String(s).replace(/"/g, '\\"')}"`;

/**
 * Render a page as markdown with a YAML frontmatter block, so an agent can
 * read title/description/canonical/last-updated without parsing the prose.
 * @param {string} slug
 * @returns {string | null}
 */
export function renderMarkdown(slug) {
  const page = PAGES[slug];
  if (!page) return null;
  const frontmatter = [
    "---",
    `title: ${yaml(page.title)}`,
    `description: ${yaml(page.description)}`,
    `canonical: ${yaml(SITE + (slug === "/" ? "/" : slug))}`,
    `last-updated: ${yaml(LAST_UPDATED)}`,
    `author: ${yaml("Rishabh Sharma")}`,
    `site: ${yaml("portfolio-hero-psi-lemon.vercel.app")}`,
    `language: ${yaml("en")}`,
    "---",
    "",
  ].join("\n");
  return frontmatter + page.markdown;
}

/**
 * Normalise a request path to a key in PAGES, or null if unknown.
 * @param {string | undefined} path
 * @returns {string | null}
 */
export function resolvePage(path) {
  if (!path) return null;
  const clean = path.split("?")[0].replace(/\/+$/, "") || "/";
  return clean in PAGES ? clean : null;
}

export const NOT_FOUND_MARKDOWN = `# 404 — Page not found

This path does not exist on portfolio-hero-psi-lemon.vercel.app.

Start from one of these instead:

- Full site context for agents: ${SITE}/llms.txt
- All canonical URLs: ${SITE}/sitemap.xml
- Developer portal and API docs: ${SITE}/developers
- Homepage: ${SITE}/
- Learn: ${SITE}/learn

Canonical pages also respond to \`Accept: text/markdown\`.
`;
