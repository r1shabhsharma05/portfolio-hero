# Rishabh Sharma — Portfolio

Personal portfolio at https://portfolio-hero-psi-lemon.vercel.app — React 19 + TypeScript + Vite,
deployed on Vercel.

## What it is

A single-page portfolio with a sky hero and reel wall, a one-sentence pitch,
a Reels grid (@cod.ehx), three worlds — **Build / Open Source / Learn** —
seven shipped projects, and a developer portal for AI agents (llms.txt,
openapi.json, markdown negotiation, RSS, and an AI chat endpoint).

## Run it

```bash
npm ci
npm run dev        # Vite dev server on :3000 — /api/chat is mocked locally
npm run build      # build:pages -> tsc -> vite build
npm run preview    # serve the production build
```

## AI chat

`POST /api/chat` streams answers about Rishabh from a Groq free-tier model
(`llama-3.3-70b-versatile`). Set `GROQ_API_KEY` in the Vercel environment —
never commit a key. The endpoint is origin-locked to the site and rate limited
to 10 requests per IP per minute.

## Content

- Homepage content lives in `src/data/site.ts` (reels, stats, projects, worlds).
- Long-form pages live as markdown in `api/_content.js` — regenerate with
  `npm run build:pages` after editing; never hand-edit the generated HTML.
- Reel posters + hover-play previews live in `public/reels/` (`<slug>.webp` + `<slug>-preview.mp4`; poster-only reels use IG CDN thumbs) —
  swap the files to change covers.

## Verified facts on the site

LeetCode 212 solved · 1,153 GitHub contributions in 2026 · 14 merged / 8 open
OSS PRs · reel view counts from the Instagram connector (2026-11-12; total 1,114 across all reels). No
follower count is shown — it is unconfirmed.
