<div align="center">

# Rishabh Sharma — Portfolio

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=A3E635&center=true&vCenter=true&width=650&lines=Full-Stack+Developer.;React+%2B+Vite+%2B+GSAP.;Spline+3D+robot%2C+halftone+wordmark.;Ring+carousel%2C+notch+nav%2C+dark+%2B+light.)](https://github.com/r1shabhsharma05/portfolio-hero)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?logo=vercel&logoColor=white)](https://portfolio-hero-psi-lemon.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-0AE448?logo=greensock&logoColor=black)](https://gsap.com)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-14-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Spline](https://img.shields.io/badge/Spline-3D-FF6B6B?logo=spline&logoColor=white)](https://spline.design)
[![lucide](https://img.shields.io/badge/lucide--react-Icons-F56565?logo=lucide&logoColor=white)](https://lucide.dev)

</div>

## About

A cinematic, animated portfolio hero page — built to feel like a product, not a template.

The hero opens with a 3D logo loader, then lands on a giant halftone **PORTFOLIO** wordmark, a self-hosted Spline 3D robot, and a notch-style nav. Below it: a CSS-only 3D ring carousel of projects, a live-fetched Coding section (LeetCode + GitHub), a theme toggle, and a Slide to Confirm that downloads the resume. Every animation respects `prefers-reduced-motion`.

## 🔴 Live Demo

**https://portfolio-hero-psi-lemon.vercel.app**

## Features

- 🤖 **Spline 3D robot** — replaces the old portrait in the hero slot; scene + WASM self-hosted, so it never depends on the Spline CDN. Plays its own idle animation.
- 🔤 **3D logo loader** — the 'Rishabh' logo builds in 3D, then lifts away (click to skip).
- 🔘 **Halftone PORTFOLIO wordmark** — the hero word is a dot field: pointer parts the dots, a click fires a shock ring, and it settles home in ~5s.
- 🎠 **3D ring carousel** — 7 projects on a rotating CSS-only ring (16:9, 25s rotation, hover pauses, click opens the detail view).
- 🧭 **Notch nav** — adaptive nav with scroll-spy, a Resume button, and a mobile island.
- 🌗 **Theme toggle** — dark by default, light (`#fafaf9`) toggle that persists.
- 📊 **Coding section** — LeetCode + GitHub stats fetched live, with rings, a contribution terrain, and a rating flow.
- ➡️ **Slide to Confirm** — slide to download the resume PDF (no contact form).
- ✨ **DotField + GSAP pass** — site-wide dot background and scroll animations, all gated on reduced-motion.
- 🖱️ **macOS-style cursor** and an animated 404 yeti page.

## Tech Stack

React 19, Vite 8, Tailwind CSS v4, GSAP 3.15 (SplitText), Framer Motion 14, Spline (`@splinetool/react-spline` + `@splinetool/runtime`), lucide-react.

## Project structure

```
.
├── src/
│   ├── components/
│   │   ├── HeroRobot.jsx            # Spline robot in the hero portrait slot
│   │   ├── HeroSection.jsx          # hero: wordmark, robot, badge, summary, tags
│   │   ├── PortfolioTypography.jsx  # halftone PORTFOLIO wordmark
│   │   ├── ui/
│   │   │   ├── halftone-wordmark.jsx
│   │   │   ├── splite.tsx           # SplineScene (21st.dev port)
│   │   │   └── spline-error-boundary.jsx
│   │   └── ...                      # ring carousel, notch nav, coding, 404 yeti
│   ├── animations/
│   │   └── heroTimeline.js          # hero entrance + portrait scroll parallax
│   ├── data/
│   │   └── coding.js                # live-fetched LeetCode + GitHub stats
│   └── styles/
│       └── hero.css
├── public/
│   ├── robot-scene.splinecode       # self-hosted Spline scene (1.3 MB)
│   └── spline-wasm/                 # self-hosted Spline WASM
├── package.json
└── vite.config.js
```

## Setup

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview the production build (use --host 127.0.0.1)
```

## Deployment

Deploys from `main` to Vercel. Vercel Authentication / SSO is off for this project, so the live URL is public.

## Notes

- The Spline scene and WASM are self-hosted under `public/` — the page works even when the Spline CDN is unreachable.
- The robot does not track the mouse: it plays the scene's own idle animation only.
- The Coding section numbers are fetched live from LeetCode and GitHub, so they change over time — they are not hardcoded.
