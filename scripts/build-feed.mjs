// Generate the RSS feed the site advertises: public/feed.xml.
// Reads the generated Learn articles (public/learn/<slug>/index.html) so
// titles/descriptions are exactly what readers see, newest first.
// Run: node scripts/build-feed.mjs  (also runs as part of `npm run build:pages`)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://portfolio-hero-psi-lemon.vercel.app";
const META = JSON.parse(
  // Repo-committed copy of the Learn meta (scripts/avi-posts.json).
  // Never read the local ~/workspace/tmp-work/avi-posts.json here — Vercel
  // has no access to that path, and the absolute path broke every deploy
  // on 27 Nov 2026 (ENOENT in build-feed.mjs). After changing the Learn
  // meta, refresh the copy: cp ~/workspace/tmp-work/avi-posts.json scripts/avi-posts.json
  readFileSync(join(ROOT, "scripts/avi-posts.json"), "utf8")
);
const SLUG_RENAME = { "who-is-avi-vashishta": "who-is-rishabh-sharma" };
const REMOVED = new Set([
  ...META.data.filter((p) => p.type === "build").map((p) => p.slug),
  // Same two single-developer profile listicles the article generator drops.
  "best-nextjs-developers-india-2026",
  "top-fullstack-developers-india-2026",
]);
const POSTS = META.data.filter((p) => !REMOVED.has(p.slug));

const escXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const dec = (s) =>
  String(s)
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const items = [];
const missing = [];
for (const post of POSTS) {
  const outSlug = SLUG_RENAME[post.slug] ?? post.slug;
  const file = join(ROOT, "public/learn", outSlug, "index.html");
  if (!existsSync(file)) {
    missing.push(outSlug);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const title = dec(html.match(/<h1 class="title">([^<]+)<\/h1>/)?.[1] ?? post.title);
  const desc = dec(
    html.match(/<meta name="description" content="([^"]+)" \/>/)?.[1] ??
      post.description ??
      ""
  );
  const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
  items.push({ title, desc, link: `${SITE}/learn/${outSlug}`, pubDate, date: post.date });
}
items.sort((a, b) => b.date.localeCompare(a.date));
const lastBuild = items.length ? new Date(`${items[0].date}T00:00:00Z`).toUTCString() : new Date().toUTCString();

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Rishabh Sharma — Learn</title>
    <link>${SITE}/learn</link>
    <description>Free roadmaps, prompts and business ideas by Rishabh Sharma.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items
  .map(
    (i) => `    <item>
      <title>${escXml(i.title)}</title>
      <link>${i.link}</link>
      <guid>${i.link}</guid>
      <description>${escXml(i.desc)}</description>
      <pubDate>${i.pubDate}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;
writeFileSync(join(ROOT, "public/feed.xml"), feed);
console.log(`feed: ${items.length} items written, missing: ${JSON.stringify(missing)}`);
