import { PROFILE, REELS, type Reel } from "./site";

/** Brand page (/brands) — Avi's media-kit structure, Rishabh's numbers only.
 *  No brand deals exist yet, so there is no worked-with strip and no client
 *  case studies: the work shown is his own Reels, with his stated view counts.
 *  Nothing here is invented — every figure comes from site.ts. */

/** Top Reels by views (his stated counts) — the hero fan + reach section. */
export const BRAND_TOP_REELS: Reel[] = [...REELS]
  .filter((r) => r.viewsRaw != null)
  .sort((a, b) => (b.viewsRaw ?? 0) - (a.viewsRaw ?? 0))
  .slice(0, 6);

export const BRAND_TOP_THREE: Reel[] = BRAND_TOP_REELS.slice(0, 3);

/** Selected work — one article per top Reel: what he made, what happened. */
export const BRAND_WORK = [
  {
    reel: BRAND_TOP_REELS[0],
    made: "A lyric video for Kalyani — kinetic type set to the song, cut frame by frame.",
  },
  {
    reel: BRAND_TOP_REELS[1],
    made: "A kinetic-type Reel on Muse — the tool, in motion, built on camera.",
  },
  {
    reel: BRAND_TOP_REELS[2],
    made: "A Reel on the free LLM apps sitting on GitHub — what they do, where to find them.",
  },
];

export const BRAND_HERO = {
  label: "Brand: Media Kit · 16 November 2026",
  headline: "Brands don't just get a Reel. They get the product, on camera.",
  sub1: "I build the thing first, then film it. That's why it lands.",
  sub2: "My Reels are free builds — real tools, on camera, start to finish. Your product could be next.",
  ratesHref: `mailto:${PROFILE.email}?subject=Rates`,
  stickers: [
    { k: "Reels", v: "16" },
    { k: "Views", v: "7,121" },
    { k: "Instagram", v: "@cod.ehx" },
  ],
};

export const BRAND_NUMBERS = {
  intro: "Running totals from @cod.ehx, added up on 16 November 2026.",
  stats: [
    { value: "16", label: "Reels" },
    { value: "7,121", label: "Views" },
    { value: "5,000", label: "Most-watched Reel" },
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
  "Usage rights on your own channels",
];

export const BRAND_NEGOTIABLE = ["Whitelisting and paid amplification", "Extra Reels in the same month"];

export const BRAND_RATES =
  "Shared on request, and they scale with volume. Several Reels booked in the same month come at a lower rate per Reel.";

export const BRAND_CTA_EMAIL = PROFILE.email;
