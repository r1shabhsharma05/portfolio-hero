// Generate the Reel viewer pages: one static page per @editsbyhx reel.
// Clicking a hero reel opens /reels/<id>/ in a new tab and the full reel
// plays there (no Instagram redirect from the hero).
// - Reels with a specific Instagram reel URL embed the reel (full video)
//   via Instagram's official embed (blockquote + embed.js).
// - Reels with only the profile URL (no specific reel link on file) play
//   the local preview clip (looped, with controls) and link to Instagram.
// Output: public/reels/<id>/index.html, one static page per reel.
// Run: node scripts/build-reels.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://portfolio-hero-psi-lemon.vercel.app";

// --- read REELS from src/data/site.ts ---
const siteTs = readFileSync(join(ROOT, "src/data/site.ts"), "utf8");
const start = siteTs.indexOf("export const REELS");
const end = siteTs.indexOf("];", start);
const block = siteTs.slice(start, end);
const REELS = [];
for (const m of block.matchAll(/\{\s*id:\s*"([^"]+)"([\s\S]*?)\}/g)) {
  const id = m[1];
  const body = m[2];
  const get = (key) => {
    const mm = body.match(new RegExp(key + ':\\s*"([^"]*)"'));
    return mm ? mm[1] : "";
  };
  const preview = body.match(/preview:\s*"([^"]*)"/)
    ? body.match(/preview:\s*"([^"]*)"/)[1]
    : null;
  REELS.push({
    id,
    title: get("title"),
    views: get("views"),
    world: get("world"),
    tag: get("tag"),
    url: get("url"),
    thumb: get("thumb"),
    preview,
  });
}

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page(reel, prev, next) {
  // No Instagram embed: it renders a broken-link error live ("The link to
  // this photo or video may be broken, or the post may have been removed"),
  // verified 18 Nov 2026 on two reels. Play the local preview clip where
  // one exists; otherwise show the poster and link out to Instagram.
  const player = reel.preview
    ? `<video src="${esc(reel.preview)}" poster="${esc(reel.thumb)}" autoplay muted loop playsinline controls preload="metadata"></video>`
    : `<img src="${esc(reel.thumb)}" alt="${esc(reel.title)}" />`;
  const watchLink = `<a class="reel-watch" href="${esc(reel.url)}" target="_blank" rel="noreferrer">Watch the full reel on Instagram ↗</a>`;
  const nav = (r, label) =>
    r
      ? `<a class="reel-nav" href="/reels/${esc(r.id)}/"><span>${label}</span><b>${esc(r.title)}</b></a>`
      : `<span class="reel-nav is-empty"></span>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(reel.title)} — Reel | Rishabh Sharma</title>
<meta name="description" content="${esc(reel.title)} — a Reel by Rishabh Sharma (@editsbyhx)${reel.views ? ` · ${esc(reel.views)} views` : ""}." />
<link rel="canonical" href="${SITE}/reels/${esc(reel.id)}/" />
<link rel="icon" href="/favicon.ico" />
<style>
  :root { --paper: #f3f3f1; --ink: #111; --ink-soft: #6e6e73; --line: rgba(17,17,17,.12); }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink); font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif; }
  a { color: inherit; }
  .head { display: flex; align-items: baseline; gap: 16px; padding: 20px 48px; border-bottom: 1px solid var(--line); }
  .head .mark { font-family: Georgia, "Times New Roman", serif; font-size: 28px; text-decoration: none; }
  .head nav { font-family: Georgia, "Times New Roman", serif; font-size: 20px; color: var(--ink-soft); }
  .head nav a { color: var(--ink-soft); text-decoration: none; margin: 0 4px; }
  .wrap { max-width: 1240px; margin: 0 auto; padding: 48px 48px 80px; }
  .crumb { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); text-decoration: none; }
  .player { margin: 28px auto 0; max-width: 540px; }
  .player video, .player img { width: 100%; aspect-ratio: 9 / 16; object-fit: cover; display: block; border-radius: 16px; background: #111; }
  .player .instagram-media { margin: 0 auto !important; }
  .meta { max-width: 540px; margin: 28px auto 0; }
  .meta h1 { font-family: Georgia, "Times New Roman", serif; font-weight: 400; font-size: clamp(28px, 4vw, 44px); line-height: 1.05; margin: 0; }
  .meta .stats { display: flex; gap: 16px; align-items: baseline; margin-top: 14px; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-soft); }
  .meta .tag { background: #111; color: #fff; border-radius: 999px; padding: 3px 10px; font-size: 11px; }
  .reel-watch { display: inline-block; margin-top: 20px; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 13px; }
  .pager { display: flex; gap: 24px; max-width: 900px; margin: 64px auto 0; border-top: 1px solid var(--line); padding-top: 24px; }
  .reel-nav { flex: 1; min-width: 0; text-decoration: none; }
  .reel-nav span { display: block; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
  .reel-nav b { display: block; font-family: Georgia, "Times New Roman", serif; font-weight: 400; font-size: 20px; line-height: 1.2; margin-top: 6px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .reel-nav.is-empty { visibility: hidden; }
  .foot { border-top: 1px solid var(--line); padding: 20px 48px; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; letter-spacing: .08em; color: var(--ink-soft); display: flex; justify-content: space-between; }
  @media (max-width: 700px) { .head, .wrap, .foot { padding-left: 20px; padding-right: 20px; } .pager { flex-direction: column; } }
</style>
</head>
<body>
<header class="head">
  <a class="mark" href="/">Rishabh Sharma.</a>
  <nav><a href="/projects/">Build</a> / <a href="/brands/">Brand</a> / <a href="/learn/">Learn</a></nav>
</header>
<main class="wrap">
  <a class="crumb" href="/">← Home · Reels — @editsbyhx</a>
  <div class="player">${player}</div>
  <div class="meta">
    <h1>${esc(reel.title)}</h1>
    <p class="stats">${reel.tag ? `<span class="tag">${esc(reel.tag)}</span>` : ""}${reel.views ? `<span>${esc(reel.views)} views</span>` : ""}<span>@editsbyhx</span></p>
    ${watchLink}
  </div>
  <nav class="pager">${nav(prev, "← Previous reel")}${nav(next, "Next reel →")}</nav>
</main>
<footer class="foot"><span>© 2026 Rishabh Sharma</span><span><a href="/">Home</a> · <a href="/brands/">Brand</a> · <a href="/learn/">Learn</a></span></footer>
</body>
</html>
`;
}

let made = 0;
for (let i = 0; i < REELS.length; i++) {
  const reel = REELS[i];
  const dir = join(ROOT, "public/reels", reel.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(reel, REELS[i - 1] || null, REELS[i + 1] || null));
  made++;
}
// Sitemap: replace the reels block.
const smPath = join(ROOT, "public/sitemap.xml");
let sm = readFileSync(smPath, "utf8");
sm = sm.replace(/  <!-- reels -->[\s\S]*?  <!-- \/reels -->\n?/g, "");
const reelsBlock =
  "  <!-- reels -->\n" +
  REELS.map((r) => `  <url><loc>${SITE}/reels/${r.id}/</loc></url>`).join("\n") +
  "\n  <!-- /reels -->\n";
sm = sm.replace("</urlset>", reelsBlock + "</urlset>");
writeFileSync(smPath, sm);
console.log(`reels: ${made} pages written, sitemap updated`);
