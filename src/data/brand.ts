import { PROFILE, REELS, type Reel } from "./site";

/** Brand page (/brands) — Avi's media-kit structure, Rishabh's numbers only.
 *  No brand deals exist yet, so there is no worked-with strip and no client
 *  case studies: the work shown is his own Reels, with his stated view counts.
 *  Nothing here is invented — every figure comes from site.ts or is arithmetic
 *  on those figures (averages, shares). */

/** Top Reels by views (his stated counts) — the hero fan + reach section. */
export const BRAND_TOP_REELS: Reel[] = [...REELS]
  .filter((r) => r.viewsRaw != null)
  .sort((a, b) => (b.viewsRaw ?? 0) - (a.viewsRaw ?? 0))
  .slice(0, 6);

export const BRAND_TOP_THREE: Reel[] = BRAND_TOP_REELS.slice(0, 3);

/** Case studies — one article per top Reel. "They wanted" states each Reel's
 *  own goal (there is no client brief); "I made" describes the Reel itself. */
export const BRAND_WORK = [
  {
    reel: BRAND_TOP_REELS[0],
    wanted: "Kalyani as a lyric video — the song, on screen, word by word.",
    made: "Kinetic type set to the song, cut frame by frame.",
    pills: ["Instagram Reel"],
  },
  {
    reel: BRAND_TOP_REELS[1],
    wanted: "Muse, in motion — the tool working, on camera.",
    made: "A kinetic-type Reel on Muse, built on camera.",
    pills: ["Instagram Reel"],
  },
  {
    reel: BRAND_TOP_REELS[2],
    wanted: "The free LLM apps on GitHub, in one Reel.",
    made: "A Reel on the free LLM apps sitting on GitHub — what they do, where to find them.",
    pills: ["Instagram Reel"],
  },
  {
    reel: BRAND_TOP_REELS[3],
    wanted: "Gemini 4, shown working in one Reel.",
    made: "A Reel on Gemini 4.",
    pills: ["Instagram Reel"],
  },
  {
    reel: BRAND_TOP_REELS[4],
    wanted: "The trending model, explained in one Reel.",
    made: "A Reel on the trending model.",
    pills: ["Instagram Reel"],
  },
  {
    reel: BRAND_TOP_REELS[5],
    wanted: "A PHP remote-shell bug, explained in one Reel.",
    made: "A Reel on the PHP bug — no login, no plugin, one plain HTTP request.",
    pills: ["Instagram Reel"],
  },
];

export const BRAND_HERO = {
  label: "Brand: Media Kit · 16 November 2026",
  headline: "Brands don't just get a Reel. They get the product, on camera.",
  sub1: "I build the thing first, then film it. That's why it lands.",
  sub2: "My Reels are free builds — real tools, on camera, start to finish. Your product could be next.",
  ratesHref: `mailto:${PROFILE.email}?subject=Rates`,
  /** Global stickers around the fan — a fourth, per-Reel "This Reel" sticker
   *  is rendered by the component from the front Reel. */
  stickers: [
    { k: "Views", v: "7,121" },
    { k: "Instagram", v: "@cod.ehx" },
    { k: "Reels", v: "16" },
  ],
  caption:
    "Every Reel I made myself, dealt as a hand of cards with its numbers from @cod.ehx.",
};

export const BRAND_NUMBERS = {
  note: "Running totals from @cod.ehx, added up on 16 November 2026. Each check adds the new days on top, so they only go up.",
  left: {
    label: "All time",
    rows: [
      { label: "Views", value: 7121, highlight: true },
      { label: "Reels", value: 16, highlight: false },
      { label: "Most-watched Reel", value: 5000, highlight: false },
      { label: "Views, top 6 Reels", value: 6573, highlight: false },
      { label: "Reels over 1K views", value: 2, highlight: false },
    ],
  },
  right: {
    label: "Top Reels",
    sub: "By views",
    rows: [
      { label: "Kalyani — Lyric video", value: 5000 },
      { label: "Muse motion reel", value: 1000 },
      { label: "100+ LLM apps", value: 206 },
      { label: "Gemini 4", value: 127 },
      { label: "Trending model", value: 121 },
    ],
  },
  /** Arithmetic on the verified totals above. */
  derived: [
    { value: 70.2, decimals: 1, suffix: "%", label: "of views from the top Reel" },
    { value: 92.3, decimals: 1, suffix: "%", label: "of views from the top 6 Reels" },
    { value: 445, decimals: 0, suffix: "", label: "average views per Reel" },
    { value: 12.5, decimals: 1, suffix: "%", label: "of Reels over 1,000 views" },
  ],
};

export const BRAND_AUDIENCE = {
  intro:
    "Young developers, CS students, indie hackers and early founders. They watch to learn, then they try it.",
  pills: ["AI and agents", "Building and shipping products", "Coding tools", "Side projects"],
};

export const BRAND_FORMATS = [
  {
    title: "Build-along Reel",
    body: "A real project from empty file to shipped, with your tool on camera. My best format, and the one brands ask for again.",
  },
  {
    title: "Workflow integration",
    body: "Your product inside my actual working setup, not a standalone demo.",
  },
  {
    title: "Story series",
    body: "A walkthrough across frames with link stickers.",
  },
  {
    title: "Desk setup feature",
    body: "Hardware placed in a full setup build, with a desk tour and stories.",
  },
  {
    title: "Write-up on Learn",
    body: "The prompt or the code on this site, linked from the Reel, so it keeps working after the feed moves on.",
  },
  {
    title: "Cross-posts",
    body: "The same Reel on YouTube Shorts and LinkedIn.",
  },
];

export const BRAND_STEPS = [
  {
    n: "01",
    title: "Brief",
    body: "You tell me the product, the audience and the moment: a launch, a feature, a new model.",
  },
  {
    n: "02",
    title: "Concept",
    body: "I pitch a build people will want to copy, and the hook that sells it.",
  },
  {
    n: "03",
    title: "Build, on camera",
    body: "I make the thing with your product for real, including the parts that need a second try. Nothing staged.",
  },
  {
    n: "04",
    title: "Post and report",
    body: "The Reel goes live with the write-up on Learn, and you get the numbers after 7 and 30 days.",
  },
];

export const BRAND_INCLUDED = [
  "A dedicated Reel on @cod.ehx",
  "Story frames with a link sticker",
  "A performance report after 7 and 30 days",
];

export const BRAND_NEGOTIABLE = ["Usage rights on your own channels", "Whitelisting and paid amplification"];

export const BRAND_RATES =
  "Shared on request, and they scale with volume. Several Reels booked in the same month come at a lower rate per Reel. Happy to start with one paid piece and let the numbers decide whether we go further.";

export const BRAND_CTA_EMAIL = PROFILE.email;
