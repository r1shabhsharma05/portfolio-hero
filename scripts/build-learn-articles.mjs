// Generate the 91 Learn article pages from Avi's post markdown.
// Source: ~/workspace/tmp-work/avi-posts/*.md (fetched 17 Nov 2026 from
// avivashishta.com/blog/<slug>.md) + avi-posts.json (dates, labels).
// Output: public/learn/<slug>/index.html, one static page per post.
// Name swap (per Rishabh's order): Avi Vashishta -> Rishabh Sharma,
// standalone Avi -> Rishabh, applied to prose only (fenced code untouched).
// Links: /blog/<slug> -> /learn/<slug>/, /lab/* demos + /fitness stay on
// avivashishta.com (absolute, open in a new tab); file assets were mirrored
// into public/ already, so their relative paths keep working.
// The who-is slug is renamed: who-is-avi-vashishta -> who-is-rishabh-sharma
// (no Avi name in folder names, per the no-name rule).
// Rendered with `marked` from node_modules (transitive dep, not in package.json).
// Run: node scripts/build-learn-articles.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "/home/hatch/workspace/tmp-work/avi-posts";
const META = JSON.parse(readFileSync("/home/hatch/workspace/tmp-work/avi-posts.json", "utf8"));
const SITE = "https://portfolio-hero-psi-lemon.vercel.app";
const AVI = "https://www.avivashishta.com";
const FILE_EXT = /\.(webp|png|jpg|jpeg|gif|svg|mp4|webm|avif)$/i;
const SLUG_RENAME = { "who-is-avi-vashishta": "who-is-rishabh-sharma" };

// List titles (learn.ts) are the source of truth for H1s.
const learnTs = readFileSync(join(ROOT, "src/data/learn.ts"), "utf8");
const listTitles = new Map();
for (const m of learnTs.matchAll(/title: "(.*)", url: "\/learn\/([^"]+)\/"/g)) {
  listTitles.set(m[2], m[1].replace(/\\"/g, '"'));
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }
  return { fm, body: m[2] };
}

function swapNames(t) {
  return t
    .replace(/Avi Vashishta/g, "Rishabh Sharma")
    .replace(/Avi's/g, "Rishabh's")
    .replace(/\bAvi\b/g, "Rishabh");
}

function rewriteLinks(t) {
  return t
    .replace(/https:\/\/www\.avivashishta\.com\/blog\/([a-z0-9-]+)\.md/g, "/learn/$1/")
    .replace(/https:\/\/www\.avivashishta\.com\/blog\/([a-z0-9-]+)/g, "/learn/$1/")
    .replace(/https:\/\/www\.avivashishta\.com\/blog/g, "/learn/")
    .replace(/https:\/\/www\.avivashishta\.com\/brands/g, "/brands/")
    .replace(/https:\/\/www\.avivashishta\.com\/projects/g, "/projects/")
    .replace(/https:\/\/www\.avivashishta\.com/g, SITE)
    // relative /blog/ links (markdown + raw html)
    .replace(/(\]\(|href=")\/blog\/([a-z0-9-]+)/g, "$1/learn/$2/")
    .replace(/(\]\(|href=")\/blog\/?(?=[")\s])/g, "$1/learn/")
    // /lab/* + /fitness + /avi-vashishta are Avi's live demos/pages: absolutize
    .replace(/(\]\(|href=")\/((?:lab|fitness|avi-vashishta)[^")\s]*)/g, (m, pre, p) =>
      FILE_EXT.test(p) ? m : `${pre}${AVI}/${p}`
    )
    .replace(/\/learn\/who-is-avi-vashishta\//g, "/learn/who-is-rishabh-sharma/");
}

function dedentHtmlLines(t) {
  // Some source files indent their raw-HTML blocks; Markdown reads 4+
  // spaces as a code block, so those paragraphs rendered as escaped source.
  // Strip leading spaces from lines that open with a tag (lists and fenced
  // code are untouched: lists don't start with "<", fences are protected).
  return t.replace(/^ +(?=<)/gm, "");
}

function transformBody(md) {
  // Protect fenced code blocks from the name swap + link rewrites.
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((part, i) => (i % 2 === 1 ? part : dedentHtmlLines(rewriteLinks(swapNames(part)))))
    .join("");
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}

function pageHtml({ title, description, label, date, bodyHtml, slug }) {
  const canon = `${SITE}/learn/${slug}/`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)} | Rishabh Sharma</title>
<meta name="description" content="${esc(description.slice(0, 160))}" />
<link rel="canonical" href="${canon}" />
<link rel="icon" href="/favicon.ico" />
<style>
:root { color-scheme: light dark; --bg:#fff; --fg:#111; --muted:#666; --line:#e5e5e5; --code:#f5f5f5; }
@media (prefers-color-scheme: dark) { :root { --bg:#0a0a0a; --fg:#f0f0f0; --muted:#a0a0a0; --line:#222; --code:#161616; } }
body { margin:0; background:var(--bg); color:var(--fg); line-height:1.65; font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
.wrap { max-width:46rem; margin:0 auto; padding:3rem 1.25rem 5rem; }
nav { display:flex; flex-wrap:wrap; gap:1.25rem; padding-bottom:1.5rem; margin-bottom:2.5rem; border-bottom:1px solid var(--line); font-size:.95rem; }
nav a { color:var(--muted); text-decoration:none; }
nav a[aria-current="page"] { color:var(--fg); }
.back { font-size:.9rem; color:var(--muted); text-decoration:none; }
.kicker { font-family:ui-monospace,monospace; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin:1.5rem 0 .5rem; }
h1 { font-size:clamp(1.9rem,5vw,2.6rem); line-height:1.15; margin:0 0 .5rem; letter-spacing:-.02em; font-family:Georgia,"Times New Roman",serif; }
.lede { font-size:1.1rem; color:var(--muted); margin:.5rem 0 2rem; }
.meta { color:var(--muted); font-size:.9rem; margin-bottom:2rem; }
h2 { font-size:1.35rem; margin:2.5rem 0 .85rem; }
h3 { font-size:1.15rem; margin:2rem 0 .75rem; }
a { color:inherit; }
img, video { max-width:100%; height:auto; border-radius:12px; }
pre { overflow-x:auto; background:var(--code); padding:16px; border-radius:12px; font-size:.85rem; line-height:1.5; }
code { font-size:.9em; }
pre code { font-size:1em; }
table { border-collapse:collapse; width:100%; margin:1.5rem 0; font-size:.9rem; display:block; overflow-x:auto; }
th, td { border:1px solid var(--line); padding:.5rem .75rem; text-align:left; }
.highlight { background:#fff7d6; border-radius:12px; padding:4px 20px; margin:24px 0; }
@media (prefers-color-scheme: dark) { .highlight { background:#2a2305; } }
ul, ol { padding-left:1.25rem; }
footer { margin-top:4rem; padding-top:1.5rem; border-top:1px solid var(--line); color:var(--muted); font-size:.9rem; display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-between; }
</style>
</head>
<body>
<div class="wrap">
<nav><a href="/">Home</a><a href="/learn/" aria-current="page">Learn</a><a href="/projects/">Build</a><a href="/brands/">Brand</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/developers">Developers</a><a href="/llms.txt">llms.txt</a></nav>
<main>
<a class="back" href="/learn/">&larr; All 91 posts</a>
<p class="kicker">Learn &middot; ${esc(label)}</p>
<h1>${esc(title)}</h1>
<p class="lede">${esc(description)}</p>
<p class="meta">${esc(date)}</p>
${bodyHtml}
</main>
<footer><span>&copy; 2026 Rishabh Sharma</span><a href="/learn/">&larr; All 91 posts</a></footer>
</div>
</body>
</html>
`;
}

let written = 0;
const missing = [];
const mismatchedTitles = [];
for (const post of META.data) {
  const slug = post.slug;
  const outSlug = SLUG_RENAME[slug] ?? slug;
  const file = join(SRC, `${slug}.md`);
  if (!existsSync(file)) { missing.push(slug); continue; }
  const { fm, body } = parseFrontmatter(readFileSync(file, "utf8"));
  const title = listTitles.get(outSlug) ?? swapNames(fm.title ?? post.title);
  if (fm.title && listTitles.get(outSlug) && fm.title !== listTitles.get(outSlug)) {
    mismatchedTitles.push(slug);
  }
  const description = swapNames(fm.description ?? post.description ?? "");
  let md = transformBody(body);
  md = md.replace(/^\s*# .+\n/, ""); // page H1 already covers a leading H1
  let html = marked.parse(md);
  // External links open in a new tab (his site stays open).
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href) =>
    href.startsWith(SITE) ? m : `<a href="${href}" target="_blank" rel="noreferrer"`
  );
  const outDir = join(ROOT, "public/learn", outSlug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "index.html"),
    pageHtml({
      title,
      description,
      label: post.label ?? fm.type ?? "Build",
      date: fmtDate(post.date ?? fm.date),
      bodyHtml: html,
      slug: outSlug,
    })
  );
  written++;
}

// Sitemap: replace any existing /learn/<slug>/ entries, then add all 91.
const sitemapPath = join(ROOT, "public/sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
sitemap = sitemap.replace(/  <url>\n    <loc>[^<]*\/learn\/[^<]+\/<\/loc>\n    <lastmod>[^<]*<\/lastmod>\n    <changefreq>[^<]*<\/changefreq>\n    <priority>[^<]*<\/priority>\n  <\/url>\n/g, "");
const entries = META.data.map((post) => {
  const outSlug = SLUG_RENAME[post.slug] ?? post.slug;
  return `  <url>\n    <loc>${SITE}/learn/${outSlug}/</loc>\n    <lastmod>${post.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
}).join("\n");
sitemap = sitemap.replace("</urlset>", `${entries}\n</urlset>`);
writeFileSync(sitemapPath, sitemap);

console.log(JSON.stringify({ written, missing, mismatchedTitles, sitemapEntries: META.data.length }, null, 2));
