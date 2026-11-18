// Generate the Learn article pages from the source post markdown, in the
// reference rendered article design (post-module CSS, tokens + rules copied
// from the reference live site 18 Nov 2026: paper #f3f3f1, ink #111, learn
// yellow #ffc81a, tech blue #2f55ff, Instrument Serif + Geist stacks,
// 1240px grid with a 340px sticky aside, yellow-sweep TOC / Keep Reading,
// scroll-progress bar).
// Source: ~/workspace/tmp-work/avi-posts/*.md (fetched 17 Nov 2026) +
// avi-posts.json (dates, labels).
// Output: public/learn/<slug>/index.html, one static page per post.
// Name swap (per Rishabh's order): the source author's name -> Rishabh
// Sharma, standalone first name -> Rishabh, the source author's IG handle
// -> @cod.ehx, applied to prose only (fenced code untouched).
// Links: /blog/<slug> -> /learn/<slug>/; the source site's /lab/* demos +
// /fitness pages are dropped (their links become plain text, 18 Nov 2026).
// No reels are shown on article pages (removed 18 Nov 2026, Rishabh's
// order); the mirrored reel media in public/reels/ was deleted with them.
// Exception: Rishabh's OWN reel is shown on his own new post (frontmatter
// `reel: kalyani-lyric`), using his reel media in public/reels/.
// The live-output window is a link card, NOT a live iframe: the source
// /lab pages send X-Frame-Options: SAMEORIGIN + frame-ancestors 'self', so
// no other origin can frame them — and /lab outputs are not emitted at all.
// The who-is slug is renamed: who-is-avi-vashishta -> who-is-rishabh-sharma
// (no source-author name in folder names, per the no-name rule).
// Rendered with `marked` from node_modules (transitive dep, not in package.json).
// Run: node scripts/build-learn-articles.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "/home/hatch/workspace/tmp-work/avi-posts";
const META = JSON.parse(readFileSync("/home/hatch/workspace/tmp-work/avi-posts.json", "utf8"));
// Build posts + the two single-developer profile listicles were removed
// from Learn on 18 Nov 2026 (Rishabh's order): they are not generated, not
// linked, and not listed in the sitemap.
const REMOVED = new Set([
  ...META.data.filter((p) => p.type === "build").map((p) => p.slug),
  "best-nextjs-developers-india-2026",
  "top-fullstack-developers-india-2026",
]);
const POSTS = META.data.filter((p) => !REMOVED.has(p.slug));
const SITE = "https://portfolio-hero-psi-lemon.vercel.app";
const SLUG_RENAME = { "who-is-avi-vashishta": "who-is-rishabh-sharma" };
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.7 0 0 0 -.6'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// List titles (learn.ts) are the source of truth for H1s.
const learnTs = readFileSync(join(ROOT, "src/data/learn.ts"), "utf8");
const listTitles = new Map();
for (const m of learnTs.matchAll(/title: "(.*)", url: "\/learn\/([^"]+)\/"/g)) {
  listTitles.set(m[2], m[1].replace(/\\"/g, '"'));
}
// API order, for stable same-date ordering in Keep Reading.
const apiIndex = new Map(META.data.map((p, i) => [p.slug, i]));

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
    .replace(/\bAvi\b/g, "Rishabh")
    .replace(/AVI VASHISHTA/g, "RISHABH SHARMA")
    .replace(/\bAVI\b/g, "RISHABH")
    .replace(/AVIVASHISHTA29/g, "r1shabhsharma05")
    .replace(/avi_vashishta29/g, "cod.ehx")
    // The 3D-ASCII wordmark spells the author's name; the new name is one
    // character longer, so the article's character count follows it.
    .replace(/thirteen characters/g, "fourteen characters");
}

function rewriteLinks(t) {
  return t
    // The source site's /lab/* + /fitness + /avi-vashishta links become
    // plain text (markdown + raw HTML, relative or absolute) — nothing on
    // the live site may link to the source site (Rishabh's order, 18 Nov).
    .replace(/\[([^\]]+)\]\((?:https?:\/\/[^/]+)?\/?(?:lab|fitness|avi-vashishta)[^)\s]*\)/g, "$1")
    .replace(/<a[^>]*href="(?:https?:\/\/[^/]+)?\/?(?:lab|fitness|avi-vashishta)[^"]*"[^>]*>([\s\S]*?)<\/a>/g, "$1")
    .replace(/https:\/\/www\.avivashishta\.com\/blog\/([a-z0-9-]+)\.md/g, "/learn/$1/")
    .replace(/https:\/\/www\.avivashishta\.com\/blog\/([a-z0-9-]+)/g, "/learn/$1/")
    .replace(/https:\/\/www\.avivashishta\.com\/blog/g, "/learn/")
    .replace(/https:\/\/www\.avivashishta\.com\/brands/g, "/brands/")
    .replace(/https:\/\/www\.avivashishta\.com\/projects/g, "/projects/")
    .replace(/https:\/\/www\.avivashishta\.com/g, SITE)
    .replace(/https:\/\/avivashishta\.com/g, SITE)
    .replace(/linkedin\.com\/in\/avivashishta/g, "linkedin.com/in/rishabh-sharma-342575438")
    // relative /blog/ links (markdown + raw html)
    .replace(/(\]\(|href=")\/blog\/([a-z0-9-]+)/g, "$1/learn/$2/")
    .replace(/(\]\(|href=")\/blog\/?(?=[")\s])/g, "$1/learn/")
    .replace(/\/learn\/who-is-avi-vashishta\//g, "/learn/who-is-rishabh-sharma/")
    // Any remaining mention of the source domain as link text (e.g. a
    // homepage link whose href was already re-pointed) shows his domain.
    .replace(/avivashishta\.com/g, "portfolio-hero-psi-lemon.vercel.app");
}

function dedentHtmlLines(t) {
  // Some source files indent their raw-HTML blocks; Markdown reads 4+
  // spaces as a code block, so those paragraphs rendered as escaped source.
  // Strip leading spaces from lines that open with a tag (lists and fenced
  // code are untouched: lists don't start with "<", fences are protected).
  return t.replace(/^ +(?=<)/gm, "");
}

function wrapBarePrompts(t) {
  // <div class="prompt"> blocks that already sit inside a .promptbox (with
  // their own COPY button) stay untouched; bare ones get a promptbox + a
  // "Copy prompt" button, matching the rendered design.
  const boxes = [];
  t = t.replace(/<div class="promptbox">[\s\S]*?<\/div>\s*<\/div>/g, (m) => {
    boxes.push(m);
    return `\u0000PB${boxes.length - 1}\u0000`;
  });
  t = t.replace(/<div class="prompt">([\s\S]*?)<\/div>/g,
    `<div class="promptbox"><button class="copybtn" type="button" data-copy>Copy prompt</button><div class="prompt">$1</div></div>`);
  return t.replace(/\u0000PB(\d+)\u0000/g, (_, i) => boxes[Number(i)]);
}

function transformBody(md) {
  // Protect fenced code blocks from the name swap + link rewrites.
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((part, i) => (i % 2 === 1 ? part : wrapBarePrompts(dedentHtmlLines(rewriteLinks(swapNames(part))))))
    .join("");
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).toUpperCase();
}

function slugify(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// H2s get ids (explicit ones kept, the rest slugified) and feed the TOC.
function addH2Ids(html) {
  const toc = [];
  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (m, attrs, inner) => {
    const idMatch = attrs.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : slugify(inner);
    toc.push({ id, text: inner.replace(/<[^>]+>/g, "") });
    return idMatch ? m : `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  return { html, toc };
}

function readMins(html) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.floor(words / 200));
}

// Keep Reading = the 3 newest posts of the same type, excluding this one
// (verified against the reference live pages: 265 -> 502/550/518, who-is ->
// the other profile post + newest). Fill with newest of any type when a
// type is short.
function keepReading(post) {
  const byDate = (a, b) => b.date.localeCompare(a.date) || apiIndex.get(a.slug) - apiIndex.get(b.slug);
  const picks = POSTS.filter((p) => p.slug !== post.slug && p.label === post.label).sort(byDate).slice(0, 3);
  if (picks.length < 3) {
    const rest = POSTS.filter((p) => p.slug !== post.slug && !picks.includes(p)).sort(byDate);
    picks.push(...rest.slice(0, 3 - picks.length));
  }
  return picks;
}

function outputHtml(fm) {
  if (!fm.output) return "";
  const out = fm.output;
  // Only same-site outputs are emitted; the source site's /lab demos are
  // not linked (Rishabh's order, 18 Nov 2026).
  if (out !== "/") return "";
  const href = `${SITE}/`;
  const display = "portfolio-hero-psi-lemon.vercel.app";
  return `<figure class="output"><figcaption><span>The output, live</span><span class="outputUrl">${esc(display)}</span></figcaption><a class="outputWindow" href="${esc(href)}" target="_blank" rel="noreferrer"><span class="outputCardUrl">${esc(display)}</span><span class="outputOpen">Open the live page ↗</span></a></figure>`;
}

// Rishabh's own reel on his own post only (frontmatter `reel:`). Other
// posts show no reel.
const REELS = {
  "kalyani-lyric": { video: "/reels/kalyani-lyric-preview.mp4", poster: "/reels/kalyani-lyric.webp", caption: "Kalyani — Lyric video · 5,000 views" },
};
function reelHtml(fm) {
  const r = fm.reel && REELS[fm.reel];
  if (!r) return "";
  return `<figure class="reel"><video src="${r.video}" poster="${r.poster}" muted loop autoplay playsinline controls preload="metadata"></video><figcaption>${esc(r.caption)}</figcaption></figure>`;
}

// A link card to Rishabh's own Instagram reel (frontmatter `reelLink:`),
// used when there is no local video file for the reel.
function reelLinkHtml(fm) {
  if (!fm.reelLink) return "";
  return `<figure class="reel"><a class="reelLink" href="${esc(fm.reelLink)}" target="_blank" rel="noreferrer"><span class="reelLinkHook">Someone please build this in India</span><span class="reelLinkOpen">Watch the reel on Instagram ↗</span></a><figcaption>Round-Up Micro-Savings App · 1 idea</figcaption></figure>`;
}

function tocHtml(toc) {
  if (!toc.length) return "";
  const items = toc.map((h, i) =>
    `<li><a href="#${h.id}"><i>${String(i + 1).padStart(2, "0")}</i><b>${esc(h.text)}</b></a></li>`).join("");
  return `<nav class="toc" aria-label="On this page"><span>On this page</span><ol>${items}</ol></nav>`;
}

function pageHtml({ title, description, label, date, mins, bodyHtml, slug, toc, keep, output, reel, reelLink }) {
  const canon = `${SITE}/learn/${slug}/`;
  const keepItems = keep.map((p) => {
    const t = listTitles.get(SLUG_RENAME[p.slug] ?? p.slug) ?? swapNames(p.title);
    return `<li><a href="/learn/${SLUG_RENAME[p.slug] ?? p.slug}/"><span>${esc(t)}</span></a></li>`;
  }).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)} | Rishabh Sharma</title>
<meta name="description" content="${esc(description.slice(0, 160))}" />
<link rel="canonical" href="${canon}" />
<link rel="icon" href="/favicon.ico" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
:root { --paper:#f3f3f1; --paper-deep:#e7e7e3; --ink:#111; --ink-soft:#6e6e73; --learn:#ffc81a; --line:#1111111a; --surface:#fff; --tech:#2f55ff; --serif:"Instrument Serif",Georgia,"Times New Roman",serif; --sans:"Geist",Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; --mono:"Geist Mono","JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace; --grain:${GRAIN}; }
* { box-sizing:border-box; }
body { margin:0; background-color:var(--paper); color:var(--ink); font-family:var(--sans); line-height:1.7; }
/* Paper grain, kept faint (low opacity). */
body::before { content:""; position:fixed; inset:0; z-index:100; pointer-events:none; background-image:var(--grain); opacity:.3; }
a { color:inherit; text-decoration:none; }
#progress { position:fixed; top:0; left:0; height:3px; background:var(--learn); width:0; z-index:50; }
.site-head { max-width:1240px; margin:0 auto; padding:20px clamp(16px,4vw,48px); display:flex; align-items:baseline; justify-content:space-between; gap:24px; }
.logo { font-family:var(--serif); font-size:22px; }
.worlds { display:flex; gap:10px; align-items:baseline; font-family:var(--serif); font-size:18px; }
.worlds .sep { color:var(--ink-soft); }
.worlds a[aria-current="page"] { border-bottom:3px solid var(--learn); padding-bottom:2px; }
.view-toggle { display:flex; gap:14px; font-family:var(--mono); font-size:12px; letter-spacing:.04em; }
.view-toggle .on { border-bottom:2px solid var(--learn); padding-bottom:2px; }
.view-toggle a { color:var(--ink-soft); }
.wrap { display:grid; grid-template-columns:minmax(0,1fr) 340px; gap:clamp(32px,5vw,80px); max-width:1240px; margin:0 auto; padding:36px clamp(16px,4vw,48px) 0; }
.meta { font-family:var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); font-size:11px; margin:0 0 14px; }
.meta a { color:var(--ink); }
.meta a:hover { text-underline-offset:3px; text-decoration:underline; }
.title { font-family:var(--serif); letter-spacing:-.03em; margin:14px 0 0; font-size:clamp(40px,5vw,72px); font-weight:400; line-height:1; text-wrap:balance; }
.lede { max-width:720px; color:var(--ink-soft); margin:20px 0 0; font-size:19px; line-height:1.6; }
.output { max-width:760px; margin:32px 0 0; }
.output figcaption { font-family:var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--ink); display:flex; justify-content:space-between; gap:12px; padding-bottom:10px; font-size:11px; }
.outputUrl { color:var(--ink-soft); text-transform:none; letter-spacing:.02em; }
.outputWindow { aspect-ratio:1440/900; background:var(--paper-deep) var(--grain); box-shadow:0 0 0 1px var(--line),0 30px 60px -30px #0007; border-radius:12px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.outputCardUrl { font-family:var(--mono); font-size:13px; letter-spacing:.02em; color:var(--ink-soft); }
.outputOpen { background:var(--ink); color:var(--paper); border-radius:8px; padding:9px 14px; font-size:13px; font-weight:500; transition:transform .3s cubic-bezier(.22,1,.36,1); position:absolute; bottom:12px; right:12px; }
.outputWindow:hover .outputOpen { transform:translateY(-2px); }
.post { max-width:760px; margin-top:36px; color:var(--ink); font-family:var(--sans); line-height:1.7; }
.post a { color:var(--tech); }
.post h1 { font-size:1.6rem; margin-bottom:.5rem; line-height:1.25; }
.post h2 { font-family:var(--serif); letter-spacing:-.02em; font-size:clamp(28px,2.6vw,38px); font-weight:400; line-height:1.1; margin-top:2.5rem; padding-bottom:8px; scroll-margin-top:24px; background:linear-gradient(var(--learn),var(--learn)) 0 100%/0 4px no-repeat; transition:background-size .7s cubic-bezier(.22,1,.36,1); }
.post h2[data-current] { background-size:64px 4px; }
.post h3 { font-family:var(--serif); letter-spacing:-.01em; font-size:24px; font-weight:400; margin-top:1.75rem; margin-bottom:.25rem; }
.post p { margin:1rem 0; }
.post ul, .post ol { margin:1rem 0; padding-left:1.4rem; }
.post li { margin:.5rem 0; }
.post code { background:#11111114; background:color-mix(in srgb, var(--ink) 8%, transparent); border-radius:4px; padding:1px 5px; font-family:var(--mono); font-size:.9em; }
.post pre { color:#e0e0e0; background:#1a1a1a; border-radius:8px; padding:20px; font-size:.88rem; line-height:1.6; overflow-x:auto; }
.post pre code { color:inherit; background:transparent; padding:0; }
.post .prompt, .post .code { color:#e6e6e6; white-space:pre-wrap; background:#1a1a1a; border-radius:10px; margin:1.5rem 0; padding:20px 22px; font-family:var(--mono); font-size:.78rem; line-height:1.6; overflow-x:auto; }
.post .promptbox { margin:1.5rem 0; position:relative; }
.post .promptbox .prompt { margin:0; padding-top:52px; }
.post .copybtn { z-index:2; position:absolute; top:10px; right:10px; letter-spacing:.08em; text-transform:uppercase; color:#e6e6e6; cursor:pointer; background:#2b2b2b; border:1px solid #3d3d3d; border-radius:6px; min-height:34px; padding:9px 14px; font:600 .72rem/1 var(--mono); }
.post .copybtn:hover { background:#3a3a3a; }
.post .copybtn.done { color:#7ee39a; border-color:#2f6b41; }
.post .highlight, .post blockquote { background:var(--paper-deep); border-left:4px solid var(--learn); border-radius:0 8px 8px 0; margin:1.5rem 0; padding:16px 20px; }
.post blockquote { color:#333; padding:4px 20px; font-style:italic; }
.post .tldr { background:var(--paper-deep); border-left:4px solid var(--learn); border-radius:0 8px 8px 0; margin:1.5rem 0; padding:16px 20px; }
.post .card { background:#f8f8f8; border-left:4px solid #000; border-radius:0 8px 8px 0; margin:24px 0; padding:20px 24px; }
.post .developer-card { background:#f8f8f8; border-left:4px solid #06c; border-radius:0 8px 8px 0; margin:24px 0; padding:20px 24px; }
.post .developer-card h3 { margin:0 0 8px; font-size:1.3rem; }
.post .stat { color:#06c; font-weight:700; }
.post .stars { letter-spacing:.06em; color:#444; vertical-align:middle; background:#f2f2f2; border:1px solid #e2e2e2; border-radius:6px; margin-left:6px; padding:5px 9px; font:600 .72rem/1 var(--mono); }
.post .tag { color:#1a56db; background:#e8f0fe; border-radius:12px; margin:2px; padding:2px 10px; font-size:.8rem; display:inline-block; }
.post .tier-note { color:#666; margin-top:-.25rem; font-style:italic; }
.post .signal, .post .check { color:#0a7d33; font-weight:600; }
.post .signal { margin:.5rem 0 0; }
.post .check { margin:.75rem 0 0; }
.post .qnum { color:#06c; font-variant-numeric:tabular-nums; }
.post .q { border-left:3px solid #e8e8e8; margin:1.6rem 0; padding-left:14px; }
.post .q p { margin:.4rem 0; }
.post .q .ask { font-size:1.02rem; font-weight:600; }
.post .q .prep { color:#444; font-size:.95rem; }
.post .q .prep strong { color:#1a1a1a; }
.post .week { margin:1.1rem 0; }
.post .src { font-size:.9rem; }
.post .repo-link { word-break:break-all; font-family:var(--mono); font-size:.85rem; }
.post .tech-stack { flex-wrap:wrap; gap:8px; margin:1rem 0; display:flex; }
.post .tech-stack span { background:#f0f0f0; border-radius:20px; padding:4px 12px; font-size:.85rem; font-weight:500; }
.post .sw { vertical-align:-1px; border-radius:2px; width:10px; height:10px; margin-right:8px; display:inline-block; }
.post .tablewrap { margin:1.5rem 0; overflow-x:auto; }
.post table { border-collapse:collapse; width:100%; margin:1.25rem 0; font-size:.9rem; }
.post th { text-align:left; background:#f0f0f0; color:#444; font-weight:600; padding:10px 14px; }
.post td { text-align:left; vertical-align:top; border-bottom:1px solid #eee; padding:10px 14px; }
.post img, .post video { max-width:100%; height:auto; border-radius:12px; }
.reel { margin:0 0 22px; }
.reel video { width:100%; display:block; border-radius:12px; box-shadow:0 0 0 1px var(--line),0 30px 60px -30px #0007; }
.reel figcaption { font-family:var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); font-size:11px; margin-top:10px; }
.reelLink { display:flex; flex-direction:column; gap:10px; background:#1a1a1a; color:#f3f3f1; border-radius:12px; padding:22px; box-shadow:0 0 0 1px var(--line),0 30px 60px -30px #0007; }
.reelLinkHook { font-family:var(--serif); font-size:24px; line-height:1.2; }
.reelLinkOpen { font-family:var(--mono); font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--learn); }
.aside { scrollbar-width:none; flex-direction:column; align-self:start; gap:22px; max-height:calc(100svh - 48px); display:flex; position:sticky; top:24px; overflow-y:auto; }
.toc { flex-direction:column; gap:6px; display:flex; }
.toc > span { font-family:var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); font-size:11px; }
.toc ol { list-style:none; margin:0; padding:0; }
.toc a { border-top:1px solid var(--line); grid-template-columns:30px 1fr; align-items:baseline; padding:10px 0; display:grid; }
.toc i { font-family:var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); font-size:11px; font-style:normal; }
.toc b { font-family:var(--serif); background:linear-gradient(var(--learn),var(--learn)) 0 0/0 100% no-repeat; justify-self:start; margin:0 -.12em; padding:0 .12em; font-size:20px; font-weight:400; line-height:1.2; transition:background-size .5s cubic-bezier(.22,1,.36,1); }
.toc a:hover b, .toc a[aria-current] b { background-size:100% 100%; }
.keep { max-width:1240px; margin:72px auto 0; padding:28px clamp(16px,4vw,48px) 0; }
.keep h2 { font-family:var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); font-size:11px; font-weight:400; margin:0; }
.keep ul { margin-top:10px; list-style:none; padding:0; }
.keep li a { border-top:1px solid var(--line); font-family:var(--serif); padding:14px 0; font-size:26px; line-height:1.2; display:block; }
.keep li a span { background:linear-gradient(var(--learn),var(--learn)) 0 0/0 100% no-repeat; margin:0 -.12em; padding:0 .12em; transition:background-size .5s cubic-bezier(.22,1,.36,1); }
.keep li a:hover span { background-size:100% 100%; }
footer { max-width:1240px; margin:0 auto; padding:48px clamp(16px,4vw,48px); border-top:1px solid var(--line); display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:32px; }
footer .f-col { display:flex; flex-direction:column; gap:6px; }
footer strong { font-family:var(--serif); font-size:20px; font-weight:400; }
footer .f-label { font-family:var(--mono); letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); font-size:11px; margin-bottom:4px; }
footer span, footer a { font-size:14px; }
footer a:hover { text-decoration:underline; text-underline-offset:3px; }
@media (max-width:860px) {
  .site-head { padding-left:12px; padding-right:12px; gap:16px; }
  .wrap { grid-template-columns:1fr; }
  .aside { order:-1; max-height:none; position:static; }
  .toc { display:none; }
  .toc b, .keep li a span { transition:none; }
  .outputOpen { transition:none; }
  footer { grid-template-columns:1fr; }
}
</style>
</head>
<body>
<div id="progress"></div>
<header class="site-head">
<a class="logo" href="/">Rishabh.</a>
<nav class="worlds"><span class="sep">/</span><a href="/projects/">Build</a><span class="sep">/</span><a href="/brands/">Brand</a><span class="sep">/</span><a href="/learn/" aria-current="page">Learn</a></nav>
<div class="view-toggle"><span class="on">Human</span><a href="/llms.txt">Agent</a></div>
</header>
<div class="wrap">
<main>
<p class="meta"><a href="/learn/">&larr; Learn</a> &middot; ${esc(label.toUpperCase())} &middot; ${esc(date)} &middot; ${mins} min</p>
<h1 class="title">${esc(title)}</h1>
<p class="lede">${esc(description)}</p>
${output}
<div class="post">
${bodyHtml}
</div>
</main>
<aside class="aside">
${reel}${reelLink}${toc}
</aside>
</div>
<aside class="keep"><h2>Keep reading</h2><ul>${keepItems}</ul></aside>
<footer>
<div class="f-col"><strong>Rishabh Sharma</strong><span>Building in public.</span><span>&copy; 2026 Rishabh Sharma</span></div>
<div class="f-col"><span class="f-label">Elsewhere</span><a href="https://www.instagram.com/cod.ehx" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.youtube.com/@UntoldHx" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.linkedin.com/in/rishabh-sharma-342575438/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/r1shabhsharma05" target="_blank" rel="noreferrer">GitHub</a><a href="mailto:rishabhsharma14426@gmail.com">rishabhsharma14426@gmail.com</a><a href="/blog/feed.xml">RSS</a></div>
<div class="f-col"><span class="f-label">More</span><a href="/privacy/">Privacy</a><a href="/developers/">Developers</a></div>
</footer>
<script>
(function () {
  var bar = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var f = max > 0 ? h.scrollTop / max : 0;
    bar.style.width = Math.max(24, f * window.innerWidth) + "px";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  // Scroll-spy: TOC highlight + the H2's yellow underline.
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  var heads = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && heads.length) {
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (current) current.removeAttribute("data-current");
          current = e.target;
          current.setAttribute("data-current", "");
          links.forEach(function (a) {
            if (a.getAttribute("href") === "#" + current.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    heads.forEach(function (h) { io.observe(h); });
  }
  // Reel video: play when first scrolled into view (autoplay can be
  // blocked in some browsers), then leave it to the user (native controls).
  var reelVideo = document.querySelector(".reel video");
  if (reelVideo && "IntersectionObserver" in window) {
    var reelPlayed = false;
    var ro = new IntersectionObserver(function (entries) {
      if (!reelPlayed && entries[0].isIntersecting) {
        reelPlayed = true;
        var p = reelVideo.play();
        if (p) p.catch(function () {});
        ro.disconnect();
      }
    }, { threshold: 0.25 });
    ro.observe(reelVideo);
  }
  // COPY buttons in prompt boxes.
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".promptbox");
      var prompt = box && box.querySelector(".prompt");
      if (!prompt) return;
      var done = function () {
        btn.textContent = "Copied \u2713";
        btn.classList.add("done");
        setTimeout(function () { btn.textContent = btn.dataset.label || "Copy prompt"; btn.classList.remove("done"); }, 2000);
      };
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(prompt.textContent.trim()).then(done, done);
      } else done();
    });
  });
})();
</script>
</body>
</html>
`;
}

let written = 0;
const missing = [];
const mismatchedTitles = [];
const readTimes = {};
for (const post of POSTS) {
  const slug = post.slug;
  const outSlug = SLUG_RENAME[slug] ?? slug;
  const file = join(SRC, `${slug}.md`);
  if (!existsSync(file)) { missing.push(slug); continue; }
  const { fm, body } = parseFrontmatter(readFileSync(file, "utf8"));
  const title = listTitles.get(outSlug) ?? swapNames(fm.title ?? post.title);
  if (fm.title && listTitles.get(outSlug) && fm.title !== listTitles.get(outSlug)) {
    mismatchedTitles.push(slug);
  }
  const description = rewriteLinks(swapNames(fm.description ?? post.description ?? ""));
  let md = transformBody(body);
  md = md.replace(/^\s*# .+\n/, ""); // page H1 already covers a leading H1
  let html = marked.parse(md);
  // External links open in a new tab (his site stays open).
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href) =>
    href.startsWith(SITE) ? m : `<a href="${href}" target="_blank" rel="noreferrer"`
  );
  // Links to removed Build posts become plain text (no dead links).
  const removedRe = new RegExp(
    `<a href="/learn/(${[...REMOVED].join("|")})/"[^>]*>([\\s\\S]*?)</a>`,
    "g"
  );
  html = html.replace(removedRe, "$2");
  // Tables get a horizontal-scroll wrapper on narrow screens.
  html = html.replace(/<table>/g, '<div class="tablewrap"><table>').replace(/<\/table>/g, "</table></div>");
  const { html: bodyHtml, toc } = addH2Ids(html);
  const mins = readMins(bodyHtml);
  readTimes[outSlug] = mins;
  const outDir = join(ROOT, "public/learn", outSlug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "index.html"),
    pageHtml({
      title,
      description,
      label: post.label ?? fm.type ?? "Build",
      date: fmtDate(post.date ?? fm.date),
      mins,
      bodyHtml,
      slug: outSlug,
      toc: tocHtml(toc),
      keep: keepReading(post),
      output: outputHtml(fm),
      reel: reelHtml(fm),
      reelLink: reelLinkHtml(fm),
    })
  );
  written++;
}

// Sitemap: replace any existing /learn/<slug>/ entries, then add the current posts.
const sitemapPath = join(ROOT, "public/sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
sitemap = sitemap.replace(/  <url>\n    <loc>[^<]*\/learn\/[^<]+\/<\/loc>\n    <lastmod>[^<]*<\/lastmod>\n    <changefreq>[^<]*<\/changefreq>\n    <priority>[^<]*<\/priority>\n  <\/url>\n/g, "");
const entries = POSTS.map((post) => {
  const outSlug = SLUG_RENAME[post.slug] ?? post.slug;
  return `  <url>\n    <loc>${SITE}/learn/${outSlug}/</loc>\n    <lastmod>${post.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
}).join("\n");
sitemap = sitemap.replace("</urlset>", `${entries}\n</urlset>`);
writeFileSync(sitemapPath, sitemap);

console.log(JSON.stringify({ written, removed: REMOVED.size, missing, mismatchedTitles, sitemapEntries: POSTS.length, readTimes }, null, 2));
