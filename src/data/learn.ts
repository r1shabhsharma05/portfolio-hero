/** Learn page data — the post list mirrors Avi's /blog list exactly
 *  (titles, dates, types, reel markers, article links), with Rishabh's
 *  name substituted wherever Avi's appeared (one title). Rows open
 *  Rishabh's own article pages at /learn/<slug>/, same tab. */

export type LearnPostType =
  | "Roadmap"
  | "Prompt"
  | "Build"
  | "Career"
  | "Case study"
  | "About";

export interface LearnPost {
  /** As shown on the list, e.g. "15 Nov". */
  date: string;
  type: LearnPostType;
  title: string;
  /** Original article URL (Avi's blog). */
  url: string;
  hasReel: boolean;
}

export const LEARN_POSTS: LearnPost[] = [
  { date: "15 Nov", type: "Roadmap", title: "265 Topics to Master AI Engineering (and the 6-Week Order I'd Learn Them In)", url: "/learn/265-topics-to-master-ai-engineering/", hasReel: false },
  { date: "15 Nov", type: "Build", title: "I Knitted My GitHub Into a Christmas Sweater (and You Can Make Yours)", url: "/learn/github-contribution-sweater/", hasReel: false },
  { date: "14 Nov", type: "Build", title: "Made of Things: My Name Where Every Letter Turns Into Something From My Life", url: "/learn/made-of-things-type-motion/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "ASCII Reels in Python: an Eye That Zooms Into a Heart, Roses Rising and a Golden-Angle Sunflower", url: "/learn/ascii-reels-eye-roses-sunflower-python/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Exploded: A Shoe Store Where the Scroll Takes the Shoe Apart", url: "/learn/exploded-a-shoe-in-five-parts/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Front Row: A Fashion Store Where the Scroll Walks the Show", url: "/learn/front-row-a-store-on-the-runway/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Movement: A Watch Store Where the Scroll Is Time", url: "/learn/movement-a-watch-you-wind-by-scrolling/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Paint Job: A Sofa You Re-Upholster by Dropping a Swatch on It", url: "/learn/paint-job-drop-a-fabric/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Receipt: A Grocery Shop That Prints Itself as You Scroll", url: "/learn/receipt-a-shop-that-prints/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Scent Cloud: A Perfume Store Where You Can See the Spray", url: "/learn/scent-cloud-see-a-perfume/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "The Claw: A Toy Store Where You Win the Toys", url: "/learn/the-claw-a-store-you-win/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "The Tank: A Skincare Store Under Water", url: "/learn/the-tank-skincare-under-water/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Throw It On: A Streetwear Store Where the Clothes Snap Onto the Model", url: "/learn/throw-it-on-a-magnet-wardrobe/", hasReel: false },
  { date: "13 Nov", type: "Build", title: "Unboxing: A Headphone Store Whose Hero Is the Delivery", url: "/learn/unboxing-a-store-that-arrives/", hasReel: false },
  { date: "12 Nov", type: "Build", title: "Mission: NASA's Perseverance Rover, Flown to Mars by Your Scroll", url: "/learn/perseverance-mission-scroll-cad-drawing/", hasReel: false },
  { date: "12 Nov", type: "Build", title: "Toran: Five Indian Doorways You Can Walk Through", url: "/learn/toran-indian-doorways-matter-js/", hasReel: false },
  { date: "12 Nov", type: "Build", title: "Try On: A Bag Store Where One Model Wears Every Bag", url: "/learn/try-on-one-model-every-bag/", hasReel: false },
  { date: "9 Nov", type: "Build", title: "Entangled: Particles That Flow Between Two Browser Windows", url: "/learn/entangled-particles-across-two-browser-windows/", hasReel: false },
  { date: "9 Nov", type: "Build", title: "I Redesigned My GitHub Profile README With Animated SVG Cards", url: "/learn/github-profile-readme-animated-svg-cards/", hasReel: false },
  { date: "7 Nov", type: "Build", title: "Agent Crews: 48 Cursors, a Queue and a Crew for Every Block", url: "/learn/agent-crews-48-cursors-build-a-page/", hasReel: false },
  { date: "7 Nov", type: "Build", title: "Agent Sheet: A Portfolio as a Spreadsheet My Agents Fill In", url: "/learn/agent-sheet-a-portfolio-spreadsheet-agents-fill-in/", hasReel: false },
  { date: "6 Nov", type: "Case study", title: "How a Gaming Chip Built a $5 Trillion Empire: The True Story of Nvidia and CUDA", url: "/learn/how-nvidia-built-a-5-trillion-dollar-empire/", hasReel: false },
  { date: "4 Nov", type: "Build", title: "A Robot Hero That Follows Your Cursor, Made From One AI Video", url: "/learn/robot-hero-follows-your-cursor-media-io/", hasReel: false },
  { date: "3 Nov", type: "Build", title: "Agents at Work: A Page That Builds Itself, Block by Block", url: "/learn/agents-at-work-a-page-that-builds-itself/", hasReel: false },
  { date: "31 Oct", type: "Build", title: "Claude 101: How I Made the Matrix Desk Animation", url: "/learn/claude-101-matrix-desk-animation/", hasReel: false },
  { date: "30 Oct", type: "Build", title: "Wet Paint: A Gallery Where Each Painting Soaks In Over the Last", url: "/learn/wet-paint-gallery-paintings-that-soak-in/", hasReel: false },
  { date: "27 Oct", type: "Build", title: "Floating Phones: an A24-Style 3D iPhone Carousel for My Reels", url: "/learn/floating-phones-a24-style-3d-iphone-carousel/", hasReel: false },
  { date: "25 Oct", type: "Build", title: "6 Ways to Put Your GitHub Graph on Your Portfolio (Animated, With Real Data)", url: "/learn/animate-github-contribution-graph-portfolio/", hasReel: false },
  { date: "25 Oct", type: "Build", title: "Buildings That Draw Themselves: Line Art That Soaks Into an Image, Like Heron's Hero", url: "/learn/blueprint-buildings-that-draw-themselves/", hasReel: false },
  { date: "24 Oct", type: "Build", title: "I Turned Myself Into 66,000 Dots: a WebGL Point Cloud Portrait With a Real Loader", url: "/learn/made-of-dots-webgl-point-cloud-portrait/", hasReel: false },
  { date: "24 Oct", type: "Build", title: "I turned myself into a 3D character and explored the Taj Mahal", url: "/learn/taj-mahal-3d-character-tripo-threejs/", hasReel: false },
];
LEARN_POSTS.push(
  { date: "23 Oct", type: "Build", title: "I Put My WHOOP Data on My Portfolio: the WHOOP API, Explained by Building a Live Dashboard", url: "/learn/live-whoop-fitness-dashboard-nextjs/", hasReel: false },
  { date: "23 Oct", type: "Build", title: "Turn Anything into an Apple-Style 3D Website (I Did It with a Bowl of Ramen)", url: "/learn/tripo-apple-style-3d-website-ramen/", hasReel: false },
  { date: "22 Oct", type: "Prompt", title: "The Prompt Behind My Vox-Style Portfolio Page: Paper, Highlighter and a Camera That Reads It for You", url: "/learn/prompt-vox-style-explainer-page-codex-paper-assets/", hasReel: false },
  { date: "19 Oct", type: "Prompt", title: "The Prompt Behind My Second Hero: A Deck of Reels Dealt Into a Fan That Lifts Into a Turning Wheel", url: "/learn/prompt-deal-cards-hero-a-deck-that-lifts-into-a-wheel/", hasReel: false },
  { date: "18 Oct", type: "Prompt", title: "The Prompt Behind My Homepage: A Loader That Deals Cards Into a Ring, Then Opens Into the 3D Carousel Hero", url: "/learn/prompt-reel-ring-loader-that-opens-into-a-3d-carousel-hero/", hasReel: false },
  { date: "5 Oct", type: "Roadmap", title: "502 Python Interview Questions to Crack Placements in 2027", url: "/learn/502-python-interview-questions/", hasReel: false },
  { date: "5 Oct", type: "Roadmap", title: "550 Frontend Interview Questions (HTML, CSS and JavaScript) for 2027", url: "/learn/550-frontend-interview-questions-html-css-javascript/", hasReel: false },
  { date: "2 Oct", type: "Roadmap", title: "518 JavaScript Interview Questions to Crack Placements in 2027", url: "/learn/518-javascript-interview-questions/", hasReel: true },
  { date: "1 Oct", type: "Roadmap", title: "446 React Interview Questions to Crack Frontend Placements", url: "/learn/446-react-interview-questions/", hasReel: false },
  { date: "1 Oct", type: "Build", title: "At My Desk: I Turned My Real Desk Into an Interactive 3D Website With Replit", url: "/learn/at-my-desk-interactive-3d-desk-website-replit/", hasReel: true },
  { date: "30 Sep", type: "Build", title: "How I Made the \"Dumb Dumb Dumb\" Stacking Reel With Claude Code, in Full 4K HDR", url: "/learn/stacking-reel-trend-edit-with-claude-code/", hasReel: false },
  { date: "29 Sep", type: "Roadmap", title: "1,401 Free CS Courses from MIT, Stanford and IITs to Learn by 2027", url: "/learn/1401-free-cs-courses-mit-stanford-iit/", hasReel: false },
  { date: "29 Sep", type: "Roadmap", title: "760 Companies That Hire Without LeetCode in 2027", url: "/learn/760-companies-that-hire-without-leetcode/", hasReel: false },
  { date: "29 Sep", type: "Build", title: "The Descent: A Replit Site Where Scrolling Falls Through Seven Worlds Hidden Inside a Book", url: "/learn/the-descent-infinite-zoom-book-webgl-replit/", hasReel: false },
  { date: "28 Sep", type: "Roadmap", title: "1,173 Free System Design Lessons to Crack SDE Interviews in 2027", url: "/learn/1173-free-system-design-lessons/", hasReel: false },
  { date: "28 Sep", type: "Roadmap", title: "740 Free Tutorials to Build Git, Redis and Docker From Scratch Before 2027", url: "/learn/740-build-your-own-x-tutorials/", hasReel: false },
  { date: "27 Sep", type: "Roadmap", title: "106 AI Startups to Cold Email for an Internship (India, Remote and Live Openings)", url: "/learn/106-ai-startups-to-cold-email-for-internship/", hasReel: false },
  { date: "27 Sep", type: "Roadmap", title: "201 Free System Design Lessons to Crack SDE Interviews in 2027", url: "/learn/201-free-system-design-lessons/", hasReel: false },
  { date: "27 Sep", type: "Roadmap", title: "209 Free AI Projects to Build Before 2027 (Every Link, Sorted by Level)", url: "/learn/209-free-ai-projects-to-build/", hasReel: false },
  { date: "26 Sep", type: "Build", title: "AI Engineering from Scratch: 523 Free Lessons, and the 4 Phases I'd Do First", url: "/learn/ai-engineering-from-scratch-free-course/", hasReel: true },
  { date: "24 Sep", type: "Career", title: "career-ops: The Open-Source Repo That Runs Your Job Search", url: "/learn/career-ops-open-source-ai-job-search/", hasReel: false },
  { date: "24 Sep", type: "Build", title: "Claude Opus 5.5 vs GPT-6 Sol: Which One to Use for Coding", url: "/learn/claude-opus-5-5-vs-gpt-6-sol-coding/", hasReel: false },
  { date: "24 Sep", type: "Build", title: "Cosmo: The Replit Prompt I Used to Polish a 3D Robot Companion (and What Actually Shipped)", url: "/learn/cosmo-3d-robot-companion-threejs-replit/", hasReel: true },
  { date: "24 Sep", type: "Career", title: "YC Summer 2027 Internships: Where to Apply (and What to Do From India)", url: "/learn/yc-summer-2027-internships-where-to-apply/", hasReel: false },
  { date: "23 Sep", type: "Build", title: "8 GitHub Repos That Make Claude Code 10x Better", url: "/learn/github-repos-that-make-claude-code-better/", hasReel: false },
  { date: "23 Sep", type: "Build", title: "One Desk Photo, Three AI Clips: Building a Cinematic Agent Command Center With Replit's Video Generation", url: "/learn/replit-ai-video-desk-photo-agent-command-center/", hasReel: false },
  { date: "23 Sep", type: "Career", title: "What 2027 Interviews Will Actually Ask You", url: "/learn/what-2027-interviews-will-actually-ask/", hasReel: false },
  { date: "22 Sep", type: "Build", title: "ASCII Studio: Images, 3D Models and a Live Webcam Turned Into Editable ASCII", url: "/learn/ascii-studio-replit-image-3d-webcam-ascii-art/", hasReel: true },
  { date: "17 Sep", type: "Prompt", title: "The Prompt I Used to Build a pear.no-Style Scroll-Scrubbed Cinematic Site on Replit (WebP Frames, No Code)", url: "/learn/prompt-scroll-scrubbed-cinematic-site-webgl-replit/", hasReel: true },
  { date: "10 Sep", type: "Prompt", title: "The Prompt I Used to Build a Premium Property Site on Replit (Scroll as the Medium)", url: "/learn/prompt-premium-property-site-scroll-choreography-replit/", hasReel: true },
  { date: "9 Sep", type: "Build", title: "Making Rain Splash Off Your Body in Real Time", url: "/learn/rain-splashing-off-your-body-mediapipe-python/", hasReel: false },
);
LEARN_POSTS.push(
  { date: "7 Sep", type: "Build", title: "The Design Language of Era Residence: Scroll as Choreography", url: "/learn/era-residence-scroll-choreography-design-language/", hasReel: true },
  { date: "4 Sep", type: "Roadmap", title: "I Built a 3D Car Dealership Without Opening Blender", url: "/learn/3d-car-dealership-tripo-ai-threejs/", hasReel: true },
  { date: "4 Sep", type: "Build", title: "Turning Your Webcam Into Liquid Metal With 400 Lines of Python", url: "/learn/liquid-metal-webcam-python-opencv/", hasReel: true },
  { date: "1 Sep", type: "Build", title: "I Built a Rubik’s Cube Solver in One HTML File with Claude (Three.js, a Layer-by-Layer Solver, and Physics-Based Tumbles)", url: "/learn/rubiks-cube-solver-three-js-claude/", hasReel: true },
  { date: "29 Aug", type: "Prompt", title: "The Prompt I Used to Build a Fake Old Computer on Replit (Beige Plastic, a CRT Screen, and Buttons That Do Something)", url: "/learn/prompt-fake-old-hardware-crt-device-replit/", hasReel: true },
  { date: "28 Aug", type: "Build", title: "Pinch Time Travel: Scrubbing Video With Your Fingers in 300 Lines of Python", url: "/learn/pinch-time-travel-scrub-video-with-your-fingers-mediapipe/", hasReel: true },
  { date: "27 Aug", type: "About", title: "Top 5 Design Trends To Make Your Website 10x (Product and E-commerce, 2026)", url: "/learn/top-5-design-trends-website-10x-2026/", hasReel: false },
  { date: "25 Aug", type: "Build", title: "Motion Gallery: A 3D Painting Orb You Rotate With Your Hands (MediaPipe + React Three Fiber)", url: "/learn/motion-gallery-gesture-controlled-3d-painting-orb/", hasReel: true },
  { date: "19 Aug", type: "Prompt", title: "The Prompt I Used to Build the Luma Floor Lamp Hero on Replit (A Brass Switch That Lights the Whole Room)", url: "/learn/prompt-luma-floor-lamp-lit-hero-replit/", hasReel: true },
  { date: "18 Aug", type: "Prompt", title: "The Prompt I Used to Build Lumina, an Interactive Light Gallery on Replit (Pull-Chain Physics, Drag-and-Drop Rooms, and a Full Light Console)", url: "/learn/prompt-lumina-interactive-light-gallery-replit/", hasReel: true },
  { date: "13 Aug", type: "Build", title: "Turning Yourself Into Spider-Man in React (MediaPipe Pose → a Mixamo Rig in React Three Fiber)", url: "/learn/turning-yourself-into-spiderman-in-react/", hasReel: false },
  { date: "12 Aug", type: "Prompt", title: "The Prompt I Used to Build Hook Lab in Emergent (20 Scored Instagram Hooks, Biased Toward What Already Works)", url: "/learn/prompt-hook-lab-instagram-hook-generator-emergent/", hasReel: false },
  { date: "10 Aug", type: "Prompt", title: "The Prompt I Used to Build a Punch-Through Ice Wall in Three.js (Voronoi Shatter + Refracted Hero Reveal)", url: "/learn/prompt-threejs-ice-wall-punch-shatter-hero-reveal/", hasReel: true },
  { date: "5 Aug", type: "Prompt", title: "The Prompt I Used to Build a Kinetic Wind Wall in Three.js (2,000 Metal Blades, All Moved in the Vertex Shader)", url: "/learn/prompt-kinetic-wind-wall-threejs-vertex-shader/", hasReel: false },
  { date: "4 Aug", type: "Prompt", title: "The Prompt I Used to Build a Hover-Reveal Spaceship Scanner, with Higgsfield-Generated Hull Layers", url: "/learn/prompt-hover-reveal-spaceship-scanner-higgsfield/", hasReel: false },
  { date: "1 Aug", type: "Roadmap", title: "25 Projects To Build To Get Hired in 2026", url: "/learn/25-projects-to-build-to-get-hired-2026/", hasReel: false },
  { date: "30 Jul", type: "Prompt", title: "The Prompt I Used to Build Pin Board, a Single-File Sticky-Notes App (No Backend, No Build Step)", url: "/learn/prompt-pin-board-sticky-notes-single-file/", hasReel: false },
  { date: "29 Jul", type: "Prompt", title: "The Prompt I Used to Build a Fluid Ink-Reveal Homepage, with a Higgsfield-Generated Wordmark Video", url: "/learn/prompt-fluid-ink-reveal-wordmark-higgsfield/", hasReel: true },
  { date: "27 Jul", type: "Roadmap", title: "How I Rendered a Rotating 3D ASCII Wordmark That Animates on GitHub (No JavaScript)", url: "/learn/3d-ascii-wordmark-svg-github-readme/", hasReel: false },
  { date: "27 Jul", type: "Prompt", title: "The Prompt I Used to Build a Frosted-Glass Refraction Cube in Raw WebGL (One HTML File)", url: "/learn/prompt-frosted-glass-refraction-cube-webgl/", hasReel: true },
  { date: "18 Jul", type: "Build", title: "How I Built an Animated GitHub Profile README (ASCII Portrait + Neofetch Card + Live Contribution Graph)", url: "/learn/build-animated-github-profile-readme/", hasReel: false },
  { date: "18 Jul", type: "Build", title: "The Prompts I Used to Build a Drivable 3D Car Game (React Three Fiber + Rapier)", url: "/learn/build-drivable-3d-car-game-react-three-fiber/", hasReel: true },
  { date: "15 Jul", type: "Build", title: "The Prompt I Used to Build a 3D Flappy Bird Plane Game in Three.js", url: "/learn/build-3d-flappy-bird-plane-threejs/", hasReel: true },
  { date: "15 Jul", type: "Build", title: "The Prompt I Used to Build a Viral Wind Chime App in One HTML File", url: "/learn/wind-chime-effect/", hasReel: true },
  { date: "13 Jul", type: "Case study", title: "Plate OS: Case Study", url: "/learn/plate-os-case-study/", hasReel: false },
  { date: "1 Mar", type: "About", title: "Best Next.js Developers in India in 2026", url: "/learn/best-nextjs-developers-india-2026/", hasReel: false },
  { date: "1 Mar", type: "Build", title: "How I Built the Only Gesture-Controlled Developer Portfolio (MediaPipe + Three.js)", url: "/learn/gesture-controlled-portfolio-mediapipe-threejs/", hasReel: false },
  { date: "1 Mar", type: "About", title: "Top Fullstack Developers to Watch in India in 2026", url: "/learn/top-fullstack-developers-india-2026/", hasReel: false },
  // Name substituted per Rishabh's order; the article itself is Avi's.
  { date: "1 Mar", type: "About", title: "Who is Rishabh Sharma?", url: "/learn/who-is-rishabh-sharma/", hasReel: false },
);

/** Goal picker — the roadmap cards that line up for each goal, in order.
 *  Step labels and card order follow the source page; card links resolve
 *  to the matching LEARN_POSTS entry by title. */
export interface LearnGoalCard {
  step: string;
  title: string;
  kind: "Roadmap" | "Career" | "Build";
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
      { step: "YOU ARE HERE", title: "AI Engineering from Scratch: 523 Free Lessons, and the 4 Phases I'd Do First", kind: "Build" },
      { step: "THEN", title: "209 Free AI Projects to Build Before 2027 (Every Link, Sorted by Level)", kind: "Roadmap" },
      { step: "THEN", title: "8 GitHub Repos That Make Claude Code 10x Better", kind: "Build" },
      { step: "THEN", title: "740 Free Tutorials to Build Git, Redis and Docker From Scratch Before 2027", kind: "Roadmap" },
      { step: "THEN", title: "Claude Opus 5.5 vs GPT-6 Sol: Which One to Use for Coding", kind: "Build" },
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
