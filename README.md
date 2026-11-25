# Rishabh Sharma — Portfolio

<p align="center">
  <a href="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=B8FF29&center=true&vCenter=true&width=600&lines=Rishabh+Sharma;React+%E2%80%A2+TypeScript+%E2%80%A2+Node.js;Open+Source+%E2%80%A2+AI+%E2%80%A2+Reels;Building+in+public+%40cod.ehx">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=B8FF29&center=true&vCenter=true&width=600&lines=Rishabh+Sharma;React+%E2%80%A2+TypeScript+%E2%80%A2+Node.js;Open+Source+%E2%80%A2+AI+%E2%80%A2+Reels;Building+in+public+%40cod.ehx" alt="Rishabh Sharma — typing animation" />
  </a>
</p>

<p align="center">
  <a href="https://portfolio-hero-psi-lemon.vercel.app"><img src="https://img.shields.io/badge/Live%20Site-portfolio--hero-B8FF29?style=for-the-badge&logo=vercel&logoColor=black" alt="Live site" /></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/GSAP-3-0AE448?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP 3" />
</p>

> Personal portfolio at **https://portfolio-hero-psi-lemon.vercel.app** — React 19 + TypeScript + Vite, deployed on Vercel. A sky hero with a reel wall, a one-sentence pitch, 22 reels, 43 Learn posts, live-updating stats, and a developer portal for AI agents.

## What it is

- **Home `/`** — sky hero, reel wall (Instagram [@cod.ehx](https://www.instagram.com/cod.ehx)), stats, shipped projects, experiments.
- **Build `/projects/`** — shipped work + open-source contributions, with live PR counts.
- **Brand `/brands/`** — media kit: reels, reach, and what a brand gets.
- **Learn `/learn/`** — 43 long-form posts: roadmaps, prompts, skills, career notes, case studies. Every post can carry its reel in a sticky side player.
- **Human / Agent switch** — every page has one. The Agent view is a single shared page (`src/components/AgentView.tsx`) shown identically from Home, Build, Brand and Learn, with `llms.txt`, `openapi.json`, markdown content negotiation, RSS, and an AI chat endpoint.
- **Slide to Confirm** — downloads the resume PDF.
- **Live stats** — LeetCode, GitHub contributions and OSS PR counts are fetched live (hourly cache, last-verified fallback) and filled into every surface: hero stats, Build stats, agent persona examples, `llms.txt`, markdown pages, `/api/v1/profile`, and the AI chat prompt. `GET /api/v1/stats` returns them as JSON.

## Verified facts on the site

LeetCode 221 solved (92 Easy, 102 Medium, 27 Hard) · 1,875 GitHub contributions in 2026 · 24 merged / 7 open OSS PRs (19 Nov 2026) · reel views total 7,000 across 22 reels (newest 7 added 20–24 Nov 2026, unposted, no counts yet; "Trending model" removed 22 Nov). No follower count is shown — it is unconfirmed. Never invent employment, internships, credentials or follower counts.

## Run it

```bash
npm ci
npm run dev        # Vite dev server on :3000 — /api/chat is mocked locally
npm run build      # build:pages -> tsc -> vite build
npm run preview    # serve the production build
```

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v4, one SCSS file (`src/styles/index.scss`) |
| Motion | GSAP, Spline robot (3D hero), neon-lime theme |
| Backend | Vercel serverless functions (`api/`), Edge Middleware (`middleware.ts`) |
| AI chat | Groq free-tier model (`llama-3.3-70b-versatile`) — see below |
| Hosting | Vercel |

## Project structure

| Path | What lives there |
| --- | --- |
| `src/` | The React app. `src/pages/Home.tsx` is the homepage; `src/pages/Build.tsx` is `/projects/`; `src/pages/Brand.tsx` is `/brands/` — **there is no client-side router**. |
| `src/data/site.ts` | Single source for homepage content: reels, stats, projects, worlds. |
| `src/data/learn.ts` | Learn post list (43 posts). |
| `src/components/ChatModal.tsx` | "Talk to my AI" chat UI (SSE to `/api/chat`). |
| `src/components/AgentView.tsx` | The shared Agent view for all four pages. |
| `src/styles/index.scss` | All styles. Design tokens measured from the live site. |
| `api/` | Vercel serverless functions. `_content.js` is a shared module, not a route (leading underscore). `chat.ts` calls Groq (`GROQ_API_KEY`), never OpenAI. `_stats.js` fetches the live stats. |
| `middleware.ts` | Vercel Edge Middleware — markdown content negotiation. Runs *before* the filesystem. |
| `public/` | Static assets, hand-written blog HTML, generated pages. `public/reels/` holds reel posters + hover-play previews (`<slug>.webp` poster + `<slug>-preview.mp4` clip; poster-only reels use IG CDN thumbs). `public/learn/<slug>/index.html` are generated articles. |
| `scripts/` | Build and verification scripts (`build-pages.mjs`, `build-learn-articles.mjs`, `verify:agentic`). |

## AI chat

`POST /api/chat` streams answers about Rishabh from a Groq free-tier model (`llama-3.3-70b-versatile`). Set `GROQ_API_KEY` in the Vercel environment — never commit a key. The endpoint is origin-locked to the site and rate limited to 10 requests per IP per minute.

## Content

- Homepage content lives in `src/data/site.ts` (reels, stats, projects, worlds).
- Learn posts live as markdown in `~/workspace/tmp-work/avi-posts/` with meta in `avi-posts.json`; regenerate articles with `scripts/build-learn-articles.mjs` (writes `public/learn/<slug>/index.html` + sitemap).
- Long-form pages live as markdown in `api/_content.js` — regenerate with `npm run build:pages` after editing; never hand-edit the generated HTML.
- Reel posters + hover-play previews live in `public/reels/` (`<slug>.webp` + `<slug>-preview.mp4`; poster-only reels use IG CDN thumbs) — swap the files to change covers.

## API

| Endpoint | What it does |
| --- | --- |
| `GET /api/v1/stats` | Live LeetCode / GitHub / OSS PR numbers as JSON |
| `GET /api/v1/profile` | Profile JSON (same live stats) |
| `POST /api/chat` | Streaming AI chat about Rishabh (SSE) |
| `GET /llms.txt` | Agent-readable site summary |
| `GET /openapi.json` | OpenAPI spec for the JSON API |
| `GET /blog/` + RSS | Learn posts feed |

## Verify after changing anything public-facing

```bash
npm run verify:agentic -- https://portfolio-hero-psi-lemon.vercel.app
```

It checks 404 behaviour, no-JS content, markdown negotiation, `Vary` headers, trust-anchor pages, JSON-LD completeness and robots policy. Latest run: **69 passed, 0 failed** (24 Nov 2026).

## GitHub stats

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=r1shabhsharma05&show_icons=true&theme=dark&hide_border=true&bg_color=0d1117&title_color=B8FF29&icon_color=B8FF29" alt="GitHub stats" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=r1shabhsharma05&layout=compact&theme=dark&hide_border=true&bg_color=0d1117&title_color=B8FF29" alt="Top languages" />
</p>

## Links

- Live site: https://portfolio-hero-psi-lemon.vercel.app
- Instagram (reels): https://www.instagram.com/cod.ehx
- YouTube (faceless history): https://www.youtube.com/@UntoldHx
- GitHub: https://github.com/r1shabhsharma05
