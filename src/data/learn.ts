/** Learn page data — 40 posts (roadmaps, prompts, career, case studies,
 *  about, business ideas; Build posts removed 18 Nov 2026 on Rishabh's
 *  order, plus the two single-developer profile listicles the same day),
 *  with Rishabh's name
 *  substituted wherever the reference's appeared (one title). Rows open
 *  Rishabh's own article pages at /learn/<slug>/, same tab. */

export type LearnPostType =
  | "Roadmap"
  | "Prompt"
  | "Career"
  | "Case study"
  | "About"
  | "Business idea series"
  | "Build";

export interface LearnPost {
  /** As shown on the list, e.g. "15 Nov". */
  date: string;
  type: LearnPostType;
  title: string;
  /** Original article URL (the reference blog). */
  url: string;
  hasReel: boolean;
}

export const LEARN_POSTS: LearnPost[] = [
  // Rishabh's own post (20 Nov 2026): the GTA 6 Clipper skill, step by step.
  { date: "20 Nov", type: "Build", title: "One Skill, Ten Clips: How My GTA 6 Clipper Turns One Long Video Into Vertical Shorts", url: "/learn/gta6-clipper-skill-one-video-ten-shorts/", hasReel: true },
  // Rishabh's own post (18 Nov 2026): the round-up micro-savings business idea.
  { date: "18 Nov", type: "Business idea series", title: "Someone Please Build This in India: The Round-Up Micro-Savings App", url: "/learn/round-up-micro-savings-app-india/", hasReel: true },
  // Rishabh's own post (18 Nov 2026): the Kalyani lyric video pipeline.
  { date: "18 Nov", type: "Prompt", title: "How I Made a Trending Song's Lyric Video with AI", url: "/learn/how-i-made-a-trending-song-lyric-video-with-ai/", hasReel: true },
  { date: "15 Nov", type: "Roadmap", title: "265 Topics to Master AI Engineering (and the 6-Week Order I'd Learn Them In)", url: "/learn/265-topics-to-master-ai-engineering/", hasReel: false },
  { date: "6 Nov", type: "Case study", title: "How a Gaming Chip Built a $5 Trillion Empire: The True Story of Nvidia and CUDA", url: "/learn/how-nvidia-built-a-5-trillion-dollar-empire/", hasReel: false },
];
LEARN_POSTS.push(
  { date: "22 Oct", type: "Prompt", title: "The Prompt Behind My Vox-Style Portfolio Page: Paper, Highlighter and a Camera That Reads It for You", url: "/learn/prompt-vox-style-explainer-page-codex-paper-assets/", hasReel: false },
  { date: "19 Oct", type: "Prompt", title: "The Prompt Behind My Second Hero: A Deck of Reels Dealt Into a Fan That Lifts Into a Turning Wheel", url: "/learn/prompt-deal-cards-hero-a-deck-that-lifts-into-a-wheel/", hasReel: false },
  { date: "18 Oct", type: "Prompt", title: "The Prompt Behind My Homepage: A Loader That Deals Cards Into a Ring, Then Opens Into the 3D Carousel Hero", url: "/learn/prompt-reel-ring-loader-that-opens-into-a-3d-carousel-hero/", hasReel: false },
  { date: "5 Oct", type: "Roadmap", title: "502 Python Interview Questions to Crack Placements in 2027", url: "/learn/502-python-interview-questions/", hasReel: false },
  { date: "5 Oct", type: "Roadmap", title: "550 Frontend Interview Questions (HTML, CSS and JavaScript) for 2027", url: "/learn/550-frontend-interview-questions-html-css-javascript/", hasReel: false },
  { date: "2 Oct", type: "Roadmap", title: "518 JavaScript Interview Questions to Crack Placements in 2027", url: "/learn/518-javascript-interview-questions/", hasReel: false },
  { date: "1 Oct", type: "Roadmap", title: "446 React Interview Questions to Crack Frontend Placements", url: "/learn/446-react-interview-questions/", hasReel: false },
  { date: "29 Sep", type: "Roadmap", title: "1,401 Free CS Courses from MIT, Stanford and IITs to Learn by 2027", url: "/learn/1401-free-cs-courses-mit-stanford-iit/", hasReel: false },
  { date: "29 Sep", type: "Roadmap", title: "760 Companies That Hire Without LeetCode in 2027", url: "/learn/760-companies-that-hire-without-leetcode/", hasReel: false },
  { date: "28 Sep", type: "Roadmap", title: "1,173 Free System Design Lessons to Crack SDE Interviews in 2027", url: "/learn/1173-free-system-design-lessons/", hasReel: false },
  { date: "28 Sep", type: "Roadmap", title: "740 Free Tutorials to Build Git, Redis and Docker From Scratch Before 2027", url: "/learn/740-build-your-own-x-tutorials/", hasReel: false },
  { date: "27 Sep", type: "Roadmap", title: "106 AI Startups to Cold Email for an Internship (India, Remote and Live Openings)", url: "/learn/106-ai-startups-to-cold-email-for-internship/", hasReel: false },
  { date: "27 Sep", type: "Roadmap", title: "201 Free System Design Lessons to Crack SDE Interviews in 2027", url: "/learn/201-free-system-design-lessons/", hasReel: false },
  { date: "27 Sep", type: "Roadmap", title: "209 Free AI Projects to Build Before 2027 (Every Link, Sorted by Level)", url: "/learn/209-free-ai-projects-to-build/", hasReel: false },
  { date: "24 Sep", type: "Career", title: "career-ops: The Open-Source Repo That Runs Your Job Search", url: "/learn/career-ops-open-source-ai-job-search/", hasReel: false },
  { date: "24 Sep", type: "Career", title: "YC Summer 2027 Internships: Where to Apply (and What to Do From India)", url: "/learn/yc-summer-2027-internships-where-to-apply/", hasReel: false },
  { date: "23 Sep", type: "Career", title: "What 2027 Interviews Will Actually Ask You", url: "/learn/what-2027-interviews-will-actually-ask/", hasReel: false },
  { date: "17 Sep", type: "Prompt", title: "The Prompt I Used to Build a pear.no-Style Scroll-Scrubbed Cinematic Site on Replit (WebP Frames, No Code)", url: "/learn/prompt-scroll-scrubbed-cinematic-site-webgl-replit/", hasReel: false },
  { date: "10 Sep", type: "Prompt", title: "The Prompt I Used to Build a Premium Property Site on Replit (Scroll as the Medium)", url: "/learn/prompt-premium-property-site-scroll-choreography-replit/", hasReel: false },
);
LEARN_POSTS.push(
  { date: "4 Sep", type: "Roadmap", title: "I Built a 3D Car Dealership Without Opening Blender", url: "/learn/3d-car-dealership-tripo-ai-threejs/", hasReel: false },
  { date: "29 Aug", type: "Prompt", title: "The Prompt I Used to Build a Fake Old Computer on Replit (Beige Plastic, a CRT Screen, and Buttons That Do Something)", url: "/learn/prompt-fake-old-hardware-crt-device-replit/", hasReel: false },
  { date: "27 Aug", type: "About", title: "Top 5 Design Trends To Make Your Website 10x (Product and E-commerce, 2026)", url: "/learn/top-5-design-trends-website-10x-2026/", hasReel: false },
  { date: "19 Aug", type: "Prompt", title: "The Prompt I Used to Build the Luma Floor Lamp Hero on Replit (A Brass Switch That Lights the Whole Room)", url: "/learn/prompt-luma-floor-lamp-lit-hero-replit/", hasReel: false },
  { date: "18 Aug", type: "Prompt", title: "The Prompt I Used to Build Lumina, an Interactive Light Gallery on Replit (Pull-Chain Physics, Drag-and-Drop Rooms, and a Full Light Console)", url: "/learn/prompt-lumina-interactive-light-gallery-replit/", hasReel: false },
  { date: "12 Aug", type: "Prompt", title: "The Prompt I Used to Build Hook Lab in Emergent (20 Scored Instagram Hooks, Biased Toward What Already Works)", url: "/learn/prompt-hook-lab-instagram-hook-generator-emergent/", hasReel: false },
  { date: "10 Aug", type: "Prompt", title: "The Prompt I Used to Build a Punch-Through Ice Wall in Three.js (Voronoi Shatter + Refracted Hero Reveal)", url: "/learn/prompt-threejs-ice-wall-punch-shatter-hero-reveal/", hasReel: false },
  { date: "5 Aug", type: "Prompt", title: "The Prompt I Used to Build a Kinetic Wind Wall in Three.js (2,000 Metal Blades, All Moved in the Vertex Shader)", url: "/learn/prompt-kinetic-wind-wall-threejs-vertex-shader/", hasReel: false },
  { date: "4 Aug", type: "Prompt", title: "The Prompt I Used to Build a Hover-Reveal Spaceship Scanner, with Higgsfield-Generated Hull Layers", url: "/learn/prompt-hover-reveal-spaceship-scanner-higgsfield/", hasReel: false },
  { date: "1 Aug", type: "Roadmap", title: "25 Projects To Build To Get Hired in 2026", url: "/learn/25-projects-to-build-to-get-hired-2026/", hasReel: false },
  { date: "30 Jul", type: "Prompt", title: "The Prompt I Used to Build Pin Board, a Single-File Sticky-Notes App (No Backend, No Build Step)", url: "/learn/prompt-pin-board-sticky-notes-single-file/", hasReel: false },
  { date: "29 Jul", type: "Prompt", title: "The Prompt I Used to Build a Fluid Ink-Reveal Homepage, with a Higgsfield-Generated Wordmark Video", url: "/learn/prompt-fluid-ink-reveal-wordmark-higgsfield/", hasReel: false },
  { date: "27 Jul", type: "Roadmap", title: "How I Rendered a Rotating 3D ASCII Wordmark That Animates on GitHub (No JavaScript)", url: "/learn/3d-ascii-wordmark-svg-github-readme/", hasReel: false },
  { date: "27 Jul", type: "Prompt", title: "The Prompt I Used to Build a Frosted-Glass Refraction Cube in Raw WebGL (One HTML File)", url: "/learn/prompt-frosted-glass-refraction-cube-webgl/", hasReel: false },
  { date: "13 Jul", type: "Case study", title: "Plate OS: Case Study", url: "/learn/plate-os-case-study/", hasReel: false },
  // Name substituted per Rishabh's order; the article body is the reference's.
  { date: "1 Mar", type: "About", title: "Who is Rishabh Sharma?", url: "/learn/who-is-rishabh-sharma/", hasReel: false },
);

/** Goal picker — the roadmap cards that line up for each goal, in order.
 *  Step labels and card order follow the source page; card links resolve
 *  to the matching LEARN_POSTS entry by title. */
export interface LearnGoalCard {
  step: string;
  title: string;
  kind: "Roadmap" | "Career";
}

export interface LearnGoal {
  id: string;
  label: string;
  cards: LearnGoalCard[];
}

export const LEARN_GOALS: LearnGoal[] = [
  {
    id: "placements",
    label: "crack placements",
    cards: [
      { step: "YOU ARE HERE", title: "518 JavaScript Interview Questions to Crack Placements in 2027", kind: "Roadmap" },
      { step: "THEN", title: "446 React Interview Questions to Crack Frontend Placements", kind: "Roadmap" },
      { step: "THEN", title: "1,173 Free System Design Lessons to Crack SDE Interviews in 2027", kind: "Roadmap" },
      { step: "BEFORE THE INTERVIEW", title: "What 2027 Interviews Will Actually Ask You", kind: "Career" },
      { step: "APPLY", title: "760 Companies That Hire Without LeetCode in 2027", kind: "Roadmap" },
    ],
  },
  {
    id: "frontend-job",
    label: "get a frontend job",
    cards: [
      { step: "YOU ARE HERE", title: "550 Frontend Interview Questions (HTML, CSS and JavaScript) for 2027", kind: "Roadmap" },
      { step: "THEN", title: "518 JavaScript Interview Questions to Crack Placements in 2027", kind: "Roadmap" },
      { step: "THEN", title: "446 React Interview Questions to Crack Frontend Placements", kind: "Roadmap" },
      { step: "BUILD", title: "25 Projects To Build To Get Hired in 2026", kind: "Roadmap" },
      { step: "APPLY", title: "760 Companies That Hire Without LeetCode in 2027", kind: "Roadmap" },
    ],
  },
  {
    id: "ai-projects",
    label: "build AI projects",
    cards: [
      { step: "YOU ARE HERE", title: "209 Free AI Projects to Build Before 2027 (Every Link, Sorted by Level)", kind: "Roadmap" },
      { step: "THEN", title: "740 Free Tutorials to Build Git, Redis and Docker From Scratch Before 2027", kind: "Roadmap" },
    ],
  },
  {
    id: "internship",
    label: "land an internship",
    cards: [
      { step: "YOU ARE HERE", title: "106 AI Startups to Cold Email for an Internship (India, Remote and Live Openings)", kind: "Roadmap" },
      { step: "THEN", title: "YC Summer 2027 Internships: Where to Apply (and What to Do From India)", kind: "Career" },
      { step: "THEN", title: "25 Projects To Build To Get Hired in 2026", kind: "Roadmap" },
      { step: "THEN", title: "career-ops: The Open-Source Repo That Runs Your Job Search", kind: "Career" },
      { step: "APPLY", title: "What 2027 Interviews Will Actually Ask You", kind: "Career" },
    ],
  },
];

/** Agent view — the prompt builder. The Student panel is the source page's
 *  own copy (name swapped); the other personas are written for Rishabh. */
export interface LearnPersona {
  id: string;
  num: string;
  name: string;
  prompt: string;
  example?: string;
}

export const LEARN_PERSONAS: LearnPersona[] = [
  {
    id: "founder",
    num: "01",
    name: "Founder",
    prompt:
      "Read /llms.txt. I'm a founder looking to collaborate with Rishabh Sharma. What has he shipped that is relevant to me, and why should I work with him?",
  },
  {
    id: "brand",
    num: "02",
    name: "Brand",
    prompt:
      "Read /llms.txt. I'm a brand looking to collaborate with Rishabh Sharma on a tech Reel. What is his reach, what formats does he make, and how does a campaign work?",
  },
  {
    id: "student",
    num: "03",
    name: "Student",
    prompt:
      "Read /llms.txt and /learn/. I'm a student learning to code. Which of Rishabh's free roadmaps should I start with, and why?",
    example:
      "Start with the 518 JavaScript interview questions, then 446 React questions, and finish with 1,173 System Design lessons — in that order.",
  },
  {
    id: "curious",
    num: "04",
    name: "Curious",
    prompt:
      "Read /llms.txt. I just found Rishabh Sharma's portfolio. Give me the 60-second version: who is he, what does he build, and what should I look at first?",
  },
  {
    id: "developer",
    num: "05",
    name: "Developer",
    prompt:
      "Read /llms.txt. I'm a developer. How is Rishabh Sharma's portfolio built, what can I learn from its architecture, and where is the source?",
  },
];
