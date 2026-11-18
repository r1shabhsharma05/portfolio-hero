import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  HOME_AGENT_CURLS,
  HOME_AGENT_DOES,
  HOME_AGENT_ENDPOINTS,
  HOME_AGENT_READS,
  HOME_AGENT_WORK,
  HOME_PERSONAS,
  LEARN_POSTS,
  PROFILE,
  PROJECTS,
  REELS,
  STATS,
  WORLDS,
} from "../data/site";
import ReelCard from "../components/ReelCard";
import CurvedLensCarousel from "../components/CurvedLensCarousel";
import {
  openWorldTransition,
  preloadWorldScene,
  WORLD_SCENES,
  type WorldId,
} from "../components/WorldTransition";

/** Counts a stat up from 0 once `start` flips true — the live stats roll
 *  up for ~2s after the loader lifts. */
function CountUp({ value, start }: { value: string; start: boolean }) {
  const target = Number(value.replace(/,/g, ""));
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 2000);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return <>{n.toLocaleString("en-US")}</>;
}

/** Falling petals over the hero panels (home + agent), like the reference:
 *  ~18 small leaf/diamond shapes drifting down very slowly with a sideways
 *  sway and a gentle tumble. Deterministic (seeded PRNG, module-level) so
 *  the field never reshuffles on re-render. pointer-events: none; hidden
 *  under prefers-reduced-motion (see the .petals CSS). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const PETAL_COLORS = ["#ffc81a", "#ffd84d", "#ef3b2d", "#ff6b4a", "#fff8e7", "#f5ead6"];
const PETALS = (() => {
  const rand = mulberry32(20261118);
  return Array.from({ length: 18 }, (_, i) => ({
    left: 2 + rand() * 94,
    w: 10 + rand() * 14,
    h: 6 + rand() * 8,
    duration: 40 + rand() * 50,
    delay: -(rand() * 85),
    sway: rand() * 56 - 28,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    opacity: 0.7 + rand() * 0.25,
  }));
})();
function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.w}px`,
            height: `${p.h}px`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--sway": `${p.sway}px`,
            "--petal-opacity": p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/** Check mark, shown by the copy button after a successful copy. */
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The single shared scene: one lens, mounted once, positioned over the
 *  hero frame. During loading the cards sit in formation (small and
 *  tilted, like the reference's formation wall); at 100% the paper
 *  fades and the same wall becomes the hero arc — the same canvas,
 *  same drift, no remount, no duplicate cards. The layer tracks the
 *  frame's box (offsetTop/Left/Width/Height are relative to .stage,
 *  the positioned ancestor), so it follows resizes and scrolls with
 *  the page. */
function HeroScene({ focus, frameRef }: { focus: string | null; frameRef: React.RefObject<HTMLDivElement | null> }) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => {
      setRect({ top: frame.offsetTop, left: frame.offsetLeft, width: frame.offsetWidth, height: frame.offsetHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [frameRef]);
  const slides = useMemo(
    () =>
      REELS.map((r) => ({
        title: r.title,
        kicker: r.views ? `${r.views} views` : "New",
        caption: "Tap to watch the reel ↗",
        image: r.thumb,
        alt: r.title,
        video: r.preview ?? undefined,
        world: r.world,
      })),
    []
  );
  const onSlideClick = useCallback((i: number) => {
    window.open(`/reels/${REELS[i].id}/`, "_blank", "noopener,noreferrer");
  }, []);
  if (!rect) return null;
  return (
    <div
      className="hero-scene"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
    >
      <CurvedLensCarousel
        slides={slides}
        label="Reels — @cod.ehx"
        background="transparent"
        ink="#111111"
        height="100%"
        showCopy={false}
        focus={focus}
        onSlideClick={onSlideClick}
      />
    </div>
  );
}

interface Choice {
  label: string;
  sup: string;
  world: string;
  on: string;
  href?: string;
  action?: "chat";
}

/** The live site's sentence-hover preview: a fixed card that follows the
 *  pointer and hangs just above the sentence (its anchor y is clamped to
 *  the sentence top + 12). The featured clip of the hovered world plays
 *  live; "talk to my AI" shows the dark ask card instead. Portalled to
 *  the body so it stays sharp above the wall, like the live site. */
type PreviewEntry = {
  world: string;
  color: string;
  image: string;
  video: string | null;
  views: string | null;
  caption: string;
};

function SentencePreview({
  preview,
  isAi,
  sentenceRef,
}: {
  preview: PreviewEntry | null;
  isAi: boolean;
  sentenceRef: React.RefObject<HTMLParagraphElement | null>;
}) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: -1000, y: -1000 });
  const posRef = useRef({ x: -1000, y: -1000 });
  const active = preview !== null || isAi;
  const [displayed, setDisplayed] = useState<{ kind: "preview"; p: PreviewEntry } | { kind: "ai" } | null>(null);

  // Keep the last card mounted ~200ms after hover ends so it can fade out.
  useEffect(() => {
    if (active) {
      setDisplayed(isAi ? { kind: "ai" } : preview ? { kind: "preview", p: preview } : null);
      return;
    }
    const id = window.setTimeout(() => setDisplayed(null), 200);
    return () => window.clearTimeout(id);
  }, [active, isAi, preview]);

  useEffect(() => {
    // Track the pointer always, not just while a preview is open — the
    // jump-on-activation needs a fresh target even if the pointer has
    // already stopped on the word.
    const onMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!active) return;
    // Jump to the pointer on activation so the card never flies in from
    // off-screen, then ease after it.
    posRef.current = { ...targetRef.current };
    let raf = 0;
    const tick = () => {
      const el = anchorRef.current;
      if (!el) return;
      const t = targetRef.current;
      posRef.current.x += (t.x - posRef.current.x) * 0.18;
      posRef.current.y += (t.y - posRef.current.y) * 0.18;
      const top = sentenceRef.current?.getBoundingClientRect().top ?? Infinity;
      const y = Math.min(posRef.current.y, top + 12);
      el.style.transform = `translate3d(${posRef.current.x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, sentenceRef]);

  const card =
    displayed?.kind === "ai" ? (
      <div className="sentence-preview" data-on={active ? "" : undefined} data-ai="">
        <p className="sentence-preview-ask">What are you working on?</p>
        <p className="sentence-preview-meta">
          Rishabh&rsquo;s AI &middot; ask about a build, an open-source project or where to start learning
        </p>
      </div>
    ) : displayed?.kind === "preview" ? (
      <div
        className="sentence-preview"
        data-on={active ? "" : undefined}
        style={{ "--world": displayed.p.color } as React.CSSProperties}
      >
        <div className="sentence-preview-media">
          {displayed.p.video ? (
            <video
              key={displayed.p.video}
              src={displayed.p.video}
              poster={displayed.p.image}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : (
            <img src={displayed.p.image} alt="" />
          )}
          {displayed.p.views ? <span className="sentence-preview-views">&bull; {displayed.p.views}</span> : null}
        </div>
        <p className="sentence-preview-meta">
          <b>
            <i />
            {displayed.p.world}
          </b>{" "}
          {displayed.p.caption}
        </p>
      </div>
    ) : null;

  return createPortal(
    <div ref={anchorRef} className="sentence-preview-anchor" aria-hidden="true">
      {card}
    </div>,
    document.body
  );
}

const SENTENCE_CHOICES: Choice[] = [
  { label: "founders", sup: "01", world: "#2F55FF", on: "#FFFFFF", href: "/projects/" },
  { label: "campaigns for brands", sup: "02", world: "#EF3B2D", on: "#FFFFFF", href: "/brands/" },
  { label: "students", sup: "03", world: "#FFC81A", on: "#111111", href: "/learn/" },
  { label: "talk to my AI", sup: "04", world: "var(--color-ink)", on: "var(--color-paper)", action: "chat" },
];

type AiChoice = "claude" | "chatgpt" | "perplexity";

const AI_URLS: Record<AiChoice, string> = {
  claude: "https://claude.ai/new?q=",
  chatgpt: "https://chatgpt.com/?q=",
  perplexity: "https://www.perplexity.ai/search?q=",
};

const AI_LABELS: Record<AiChoice, string> = {
  claude: "Claude",
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
};

/** The developer portal strip — identical in the human and agent views. */
function DevPortal() {
  return (
    <section className="section" id="developers" aria-label="For developers and AI agents">
      <div className="dev-portal">
        <p className="section-label">For developers and AI agents</p>
        <h2 className="section-title">This site is machine-readable.</h2>
        <p className="section-body">
          llms.txt, a full OpenAPI spec, markdown versions of every page, an RSS feed and an
          AI chat endpoint — built so agents can answer questions about Rishabh without
          guessing.
        </p>
        <div className="dev-links">
          <a href="/developers">Developer portal</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="/openapi.json">openapi.json</a>
          <a href="/index.md">index.md</a>
          <a href="/sitemap.xml">sitemap.xml</a>
        </div>
      </div>
    </section>
  );
}

/** Copy icon shared by the agent panel and curl rows. */
function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H3.5A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Renders "[1]" footnote markers in example text as superscript numerals. */
function renderExampleText(text: string): ReactNode[] {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = /^\[(\d+)\]$/.exec(part);
    return m ? <sup key={i}>{m[1]}</sup> : part;
  });
}

/** Home Agent view — mirrors the reference's home agent view: sky hero,
 *  five persona rows (one open at a time, Founder by default), "Plug this
 *  site into your agent", "What Rishabh does", "Work with Rishabh", then
 *  the developer portal. The switch is instant (no loading screen, no
 *  stagger) and the sections appear at once on scroll, like the reference. */
function AgentView({
  openPersona,
  setOpenPersona,
  ai,
  setAi,
  copied,
  copyPrompt,
}: {
  openPersona: string | null;
  setOpenPersona: (id: string | null) => void;
  ai: AiChoice;
  setAi: (a: AiChoice) => void;
  copied: string | null;
  copyPrompt: (id: string, text: string) => void;
}) {
  // When a row opens, gently scroll it into view so the panel is visible.
  // Skipped on first render (Founder is open by default on entering the view).
  const firstOpenRef = useRef(true);
  useEffect(() => {
    if (firstOpenRef.current) {
      firstOpenRef.current = false;
      return;
    }
    if (!openPersona) return;
    document
      .querySelector(`[data-persona="${openPersona}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [openPersona]);
  return (
    <>
      <section className="home-agent-hero" aria-label="For AI agents">
        <div className="home-agent-sky" aria-hidden="true">
          <img src="/sky-agent.jpg" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <Petals />
        </div>
        <div className="home-agent-copy">
          <p className="home-agent-eyebrow">AGENT SIDE</p>
          <h1>Ask your AI about Rishabh.</h1>
          <p className="home-agent-sub">
            Pick who you are. You send one prompt, your AI reads this site, and you get an
            answer written for you.
          </p>
        </div>
      </section>

      <section className="home-agent-personas-sec" aria-label="Who are you?">
        <p className="home-agent-iam">I AM A</p>
        <p className="home-agent-five">FIVE PEOPLE,<br />FIVE ANSWERS</p>
        <div className="home-agent-personas">
          {HOME_PERSONAS.map((p) => {
            const open = p.id === openPersona;
            return (
              <div
                key={p.id}
                data-persona={p.id}
                className={open ? "home-agent-persona is-open" : "home-agent-persona"}
                style={{
                  "--persona-accent": p.accent,
                  "--persona-on-accent": p.accent.toLowerCase() === "#111111" ? "#fff" : "#111",
                } as React.CSSProperties}
              >
                <button
                  type="button"
                  className="home-agent-persona-head"
                  aria-expanded={open}
                  onClick={() => setOpenPersona(open ? null : p.id)}
                >
                  <span className="home-agent-persona-num">{p.num}</span>
                  <span className="home-agent-persona-name">{p.name}</span>
                  <span className="home-agent-persona-tag">{p.tagline}</span>
                  <span className="home-agent-persona-thumb" aria-hidden="true">
                    <img src="/sky.jpg" alt="" />
                  </span>
                  <span className="home-agent-persona-toggle">{open ? "CLOSE" : "OPEN"}</span>
                </button>
                {open && (
                  <div className="home-agent-panel">
                    <div className="home-agent-panel-left">
                      <p className="home-agent-step">1 · SEND THIS</p>
                      <div className="home-agent-prompt-head">
                        <p className="home-agent-kicker">YOUR PROMPT</p>
                        <p className="home-agent-kicker">OPENS IN A NEW TAB</p>
                      </div>
                      <p className="home-agent-prompt">{p.prompt}</p>
                      <div className="home-agent-airow">
                        <div className="home-agent-ai" role="group" aria-label="Your AI">
                          {(Object.keys(AI_URLS) as AiChoice[]).map((k) => (
                            <button
                              key={k}
                              type="button"
                              aria-pressed={ai === k}
                              className={ai === k ? "home-agent-ai-choice is-selected" : "home-agent-ai-choice"}
                              onClick={() => setAi(k)}
                            >
                              {AI_LABELS[k]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="home-agent-actions">
                        <button
                          type="button"
                          className="home-agent-copybtn"
                          aria-label="Copy prompt"
                          onClick={() => copyPrompt(`persona-${p.id}`, p.prompt)}
                        >
                          {copied === `persona-${p.id}` ? <CheckIcon /> : <CopyIcon />}
                        </button>
                        <a
                          className="home-agent-ask"
                          href={`${AI_URLS[ai]}${encodeURIComponent(p.prompt)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ask {AI_LABELS[ai]}
                        </a>
                        <a
                          className="home-agent-askarrow"
                          href={`${AI_URLS[ai]}${encodeURIComponent(p.prompt)}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Ask ${AI_LABELS[ai]} in a new tab`}
                        >
                          ↑
                        </a>
                      </div>
                      <p className="home-agent-step">2 · YOUR AI READS</p>
                      <ol className="home-agent-reads">
                        {HOME_AGENT_READS.map((r, i) => (
                          <li key={r.label}>
                            <span className="home-agent-reads-num">{String(i + 1).padStart(2, "0")}</span>
                            <span className="home-agent-reads-text">
                              <span className="home-agent-reads-label">{r.label}</span>
                              <span className="home-agent-reads-desc">{r.desc}</span>
                            </span>
                          </li>
                        ))}
                      </ol>
                      {p.curl && (
                        <div className="home-agent-curl">
                          <code>{p.curl}</code>
                          <button type="button" aria-label="Copy curl" onClick={() => copyPrompt(`curl-${p.id}`, p.curl!)}>
                            {copied === `curl-${p.id}` ? <span className="home-agent-copied-square" aria-label="Copied" /> : <CopyIcon />}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="home-agent-panel-right">
                      <img className="home-agent-panel-photo" src="/sky.jpg" alt="" aria-hidden="true" />
                      <div className="home-agent-photo-head">
                        <p className="home-agent-step">3 · YOU GET</p>
                        <div className="home-agent-photo-kickers">
                          <p className="home-agent-kicker">WHAT COMES BACK</p>
                          <p className="home-agent-kicker">EXAMPLE ANSWER</p>
                        </div>
                      </div>
                      <div className="home-agent-answer">
                        <ul className="home-agent-example">
                          {p.example.map((e) => (
                            <li key={e.lead}>
                              <b>{e.lead}</b>
                              <span>{renderExampleText(e.text)}</span>
                            </li>
                          ))}
                        </ul>
                        {p.quote && <p className="home-agent-quote">&ldquo;{p.quote}&rdquo;</p>}
                        <p className="home-agent-footnotes">{p.footnotes.join("  ")}</p>
                      </div>
                      <div className="home-agent-rather">
                        <span>RATHER READ IT YOURSELF?</span>
                        <a href={p.readHref}>{p.readLabel} ↗</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-agent-plug" aria-label="Plug this site into your agent">
        <div className="home-agent-plug-top">
          <div className="home-agent-plug-copy">
            <p className="home-agent-eyebrow">05 · DEVELOPERS</p>
            <h2>Plug this site into your agent.</h2>
            <p className="home-agent-plug-text">
              Plain text, Markdown and JSON for everything here. No keys, no signup.
            </p>
            <div className="home-agent-devrow">
              <a className="home-agent-devbtn" href="/developers">
                Open the developer page
              </a>
              <a className="home-agent-devarrow" href="/developers" aria-label="Open the developer page">
                ↗
              </a>
            </div>
          </div>
          <div className="home-agent-curlcard">
            <p className="home-agent-label">START HERE</p>
            <div className="home-agent-curls">
              {HOME_AGENT_CURLS.map((c) => (
                <div key={c} className="home-agent-curl">
                  <code>{c}</code>
                  <button type="button" aria-label="Copy" onClick={() => copyPrompt(`start-${c.slice(7, 22)}`, c)}>
                    {copied === `start-${c.slice(7, 22)}` ? <span className="home-agent-copied-square" aria-label="Copied" /> : <CopyIcon />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="home-agent-endpoints">
          {HOME_AGENT_ENDPOINTS.map((g) => (
            <div key={g.group} className="home-agent-group">
              <p className="home-agent-group-name">{g.group}</p>
              <ul>
                {g.rows.map((r) => (
                  <li key={r.path}>
                    <span className="home-agent-endpoint-top">
                      <span className={`home-agent-method${r.method === "POST" ? " is-post" : ""}`}>{r.method}</span>
                      <code>{r.path}</code>
                    </span>
                    <span className="home-agent-endpoint-desc">{r.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="home-agent-does" aria-label="What Rishabh does">
        <h2>What Rishabh does</h2>
        <p className="home-agent-does-intro">{HOME_AGENT_DOES.intro}</p>
        <div className="home-agent-does-grid">
          {HOME_AGENT_DOES.items.map((item) => (
            <div key={item.title} className="home-agent-does-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-agent-work" aria-label="Work with Rishabh">
        <h2>Work with Rishabh</h2>
        <p>{HOME_AGENT_WORK}</p>
        <a className="home-agent-work-mail" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email} ↗
        </a>
      </section>

      <DevPortal />
    </>
  );
}

export default function Home({ onOpenChat, entered }: { onOpenChat: () => void; entered: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [navWorld, setNavWorld] = useState<string | null>(null);
  const [view, setView] = useState<"human" | "agent">("human");
  const [openPersona, setOpenPersona] = useState<string | null>("founder");
  const [ai, setAi] = useState<AiChoice>("claude");
  const [copied, setCopied] = useState<string | null>(null);
  const copyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      /* clipboard unavailable: the prompt is visible to copy by hand */
    }
  };
  const sentenceRef = useRef<HTMLParagraphElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  // Sentence hover focuses one world (live site's data-focus): the wall
  // dims only the other worlds' cards; "talk to my AI" focuses nothing.
  // Hovering a header world link focuses that world too.
  const focusWorld =
    hovered === "01" ? "build" : hovered === "02" ? "brand" : hovered === "03" ? "learn" : navWorld;
  const openChat = () => {
    setHovered(null);
    setNavWorld(null);
    onOpenChat();
  };
  // Featured card per sentence word — the live site shows a curated card
  // per world, not a wall reel. Views only where verified.
  const PREVIEWS: Record<string, PreviewEntry | null> = {
    "01": { world: "BUILD", color: "#2F55FF", image: "/projects/secureguard.jpg", video: null, views: null, caption: "SecureGaurd · SafeLife · RailSync — 8 products, shipped." },
    "02": { world: "BRAND", color: "#EF3B2D", image: "/reels/portfolio-reel.webp", video: "/reels/portfolio-reel-preview.mp4", views: null, caption: "The @cod.ehx showreel — motion type, lyric videos, AI builds on camera." },
    "03": { world: "LEARN", color: "#FFC81A", image: "/reels/gemini.webp", video: "/reels/gemini-preview.mp4", views: "127", caption: "Free roadmaps, prompts and build write-ups." },
    "04": null,
  };
  const preview = hovered ? PREVIEWS[hovered] ?? null : null;

  // Sentence tokens, in order. Plain words roll up one by one after the
  // loader lifts; hovering a linked word fills it with its world colour
  // while the rest of the sentence dims — the live site's exact behaviour.
  let wordIndex = 0;
  const word = (w: string): ReactNode => {
    const d = wordIndex * 45;
    wordIndex += 1;
    return (
      <span className="wordMask" key={`w-${wordIndex}`}>
        <span style={{ "--d": `${d}ms` } as React.CSSProperties}>{w}</span>
      </span>
    );
  };
  const renderChoice = (c: Choice): ReactNode => {
    const labelWords = c.label.split(" ");
    const label = (
      <span className="choice-label">
        <span className="marker" aria-hidden="true" />
        {labelWords.map((w, j) => (
          <span key={`c-${c.sup}-${j}`}>
            {word(w)}
            {j < labelWords.length - 1 ? " " : null}
          </span>
        ))}
        <span className="underline" aria-hidden="true" />
      </span>
    );
    const props = {
      className: "choice",
      "data-active": hovered === c.sup ? "" : undefined,
      style: { "--world": c.world, "--on": c.on } as React.CSSProperties,
      onMouseEnter: () => setHovered(c.sup),
      onMouseLeave: () => setHovered(null),
      onFocus: () => setHovered(c.sup),
      onBlur: () => setHovered(null),
    };
    return c.action === "chat" ? (
      <button type="button" key={c.sup} {...props} onClick={openChat}>
        {label}
        <sup>{c.sup}</sup>
      </button>
    ) : (
      <a key={c.sup} {...props} href={c.href}>
        {label}
        <sup>{c.sup}</sup>
      </a>
    );
  };
  const sentence: ReactNode[] = [];
  const plain = (text: string) => {
    text.split(" ").forEach((w, j, arr) => {
      sentence.push(word(w));
      if (j < arr.length - 1) sentence.push(" ");
    });
  };
  plain("I build products for");
  sentence.push(" ");
  sentence.push(renderChoice(SENTENCE_CHOICES[0]));
  sentence.push(", ");
  sentence.push(renderChoice(SENTENCE_CHOICES[1]));
  sentence.push(" ");
  plain("and free roadmaps for");
  sentence.push(" ");
  sentence.push(renderChoice(SENTENCE_CHOICES[2]));
  sentence.push(". ");
  plain("Or just");
  sentence.push(" ");
  sentence.push(renderChoice(SENTENCE_CHOICES[3]));
  sentence.push(".");

  return (
    <>
      <header className="site-header" data-home>
        <div className="site-left" data-home>
          <a className="site-mark" href="/" aria-label="Rishabh Sharma, home">
            <span className="site-wordmark" aria-hidden="true">
              <span className="wordmark-name">
                <span className="wordmark-first">Rishabh</span>
                <span className="wordmark-last"> Sharma</span>.
              </span>
              <span className="wordmark-name wordmark-line">I build cool things with AI.</span>
            </span>
          </a>
          <nav className="world-nav" aria-label="Worlds">
            <span className="world-option">
              <span className="mode-slash" aria-hidden="true">/</span>
              <a className="world-link" style={{ "--world": "#2F55FF", "--world-on": "#FFFFFF" } as React.CSSProperties} href="/projects/" onMouseEnter={() => { setNavWorld("build"); preloadWorldScene(); }} onMouseLeave={() => setNavWorld(null)} onClick={(e) => { e.preventDefault(); openWorldTransition("/projects/"); }}>Build</a>
            </span>
            <span className="world-option">
              <span className="mode-slash" aria-hidden="true">/</span>
              <a className="world-link" style={{ "--world": "#EF3B2D", "--world-on": "#FFFFFF" } as React.CSSProperties} href="/brands/" onMouseEnter={() => { setNavWorld("brand"); preloadWorldScene(WORLD_SCENES.brand.scene); }} onMouseLeave={() => setNavWorld(null)} onClick={(e) => { e.preventDefault(); openWorldTransition("/brands/", "brand"); }}>Brand</a>
            </span>
            <span className="world-option">
              <span className="mode-slash" aria-hidden="true">/</span>
              <a className="world-link" style={{ "--world": "#FFC81A", "--world-on": "#111111" } as React.CSSProperties} href="/learn/" onMouseEnter={() => { setNavWorld("learn"); preloadWorldScene(WORLD_SCENES.learn.scene); }} onMouseLeave={() => setNavWorld(null)} onClick={(e) => { e.preventDefault(); openWorldTransition("/learn/", "learn"); }}>Learn</a>
            </span>
          </nav>
        </div>
        <div className="mode-switch" data-mode={view} role="group" aria-label="View this page as">
          <span className="mode-option">
            <button
              type="button"
              aria-pressed={view === "human"}
              onClick={() => {
                setView("human");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Human
            </button>
          </span>
          <span className="mode-option">
            <span className="mode-slash" aria-hidden="true">/</span>
            <button
              type="button"
              aria-pressed={view === "agent"}
              onClick={() => {
                setView("agent");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Agent
            </button>
          </span>
        </div>
      </header>

      <main>
        {view === "human" ? (
          <>
        {/* hero — one viewport: sky wall + sentence strip, like the live site */}
        <section className="stage" data-stage data-focus={focusWorld ?? undefined} aria-label="Intro">
          <div className="world-frame" ref={frameRef}>
            <div className="sky-layer">
              <img src="/sky.jpg" alt="" aria-hidden="true" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
            <div className="cloud-layer" aria-hidden="true" />
            <Petals />
          </div>
          <HeroScene focus={focusWorld} frameRef={frameRef} />
          <div className={`below${entered ? " is-entered" : ""}`} aria-label="What Rishabh does, in one sentence">
          <p className="sentence" ref={sentenceRef} data-hovering={hovered ? "" : undefined}>
            {sentence}
          </p>
          <dl className="meta">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  <CountUp value={s.value} start={entered} />
                </dd>
              </div>
            ))}
          </dl>
          </div>
        </section>
        <SentencePreview preview={preview} isAi={hovered === "04"} sentenceRef={sentenceRef} />

        {/* reels grid */}
        <section className="section" id="reels" aria-label="Reels">
          <p className="section-label">Reels — @cod.ehx</p>
          <h2 className="section-title">Tech, explained in 60 seconds.</h2>
          <p className="section-body">
            Short Reels on AI tools, open source and what is actually happening in tech — view
            counts are live totals per Reel.
          </p>
          <div className="reels-grid">
            {REELS.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </section>

        {/* what Rishabh does */}
        <section className="section" id="about" aria-label="What Rishabh does">
          <p className="section-label">What Rishabh does</p>
          <h2 className="section-title">Full-stack developer. Open-source contributor. Creator.</h2>
          <p className="section-body">
            Rishabh Sharma is a 19-year-old full-stack developer studying Computer Science at GLA
            University, Mathura. He ships real products — a safety app with live SOS, a campus
            marketplace, an escrow-backed farmer platform — and contributes to open source:{" "}
            <strong>23 pull requests merged</strong> across Jenkins, WordPress/Gutenberg and
            more. He also makes tech Reels as <strong>@cod.ehx</strong> and runs a faceless
            history channel on YouTube. No internship yet — everything here is built, not claimed.
          </p>
        </section>

        {/* worlds */}
        <section className="section" id="worlds" aria-label="Three worlds">
          <p className="section-label">Three worlds</p>
          <h2 className="section-title">Build. Brand. Learn.</h2>
          <div className="worlds-grid">
            {WORLDS.map((w) => (
              <a
                key={w.id}
                className="world-card"
                href={w.link}
                style={{ "--world": w.id === "build" ? "var(--world-build)" : w.id === "brand" ? "var(--world-brand)" : "var(--world-learn)" } as React.CSSProperties}
                onMouseEnter={() => preloadWorldScene(WORLD_SCENES[w.id as WorldId].scene)}
                onClick={(e) => { e.preventDefault(); openWorldTransition(w.link, w.id as WorldId); }}
              >
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                <span className="world-link-label">{w.linkLabel}</span>
              </a>
            ))}
          </div>
        </section>

        {/* projects */}
        <section className="section" id="projects" aria-label="Projects">
          <p className="section-label">Build — projects</p>
          <h2 className="section-title">Eight products, shipped.</h2>
          <div className="projects-grid">
            {PROJECTS.map((p) => (
              <article key={p.name} className="project-card">
                <img src={p.image} alt={p.name} loading="lazy" />
                <div className="body">
                  <h3>{p.name}</h3>
                  <p className="tagline">{p.tagline}</p>
                  <p>{p.description}</p>
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                  <a href={p.repo} target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* learn posts */}
        <section className="section" id="learn" aria-label="Learn">
          <p className="section-label">Learn — write-ups</p>
          <h2 className="section-title">What I learned, written down.</h2>
          <div className="projects-grid">
            {LEARN_POSTS.map((post) => (
              <article key={post.slug} className="project-card">
                <div className="body">
                  <p className="tagline">{post.tag}</p>
                  <h3>{post.title}</h3>
                  <a href={`/learn/${post.slug}/`}>Read the write-up ↗</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* work with Rishabh */}
        <section className="section work-with" id="contact" aria-label="Work with Rishabh">
          <p className="section-label">Work with Rishabh</p>
          <h2 className="section-title">Have something to build? Let&apos;s talk.</h2>
          <p className="section-body">
            Internships, freelance, open-source collaboration, or just a question about one of the
            products above — the fastest way to reach him is email.
          </p>
          <a className="big-cta" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email} <span className="arrow">↗</span>
          </a>
        </section>

        <DevPortal />
          </>
        ) : (
          <AgentView
            openPersona={openPersona}
            setOpenPersona={setOpenPersona}
            ai={ai}
            setAi={setAi}
            copied={copied}
            copyPrompt={copyPrompt}
          />
        )}
      </main>

      <footer className="site-footer">
        <span>© 2026 Rishabh Sharma</span>
        <nav aria-label="Footer">
          <a href="https://github.com/r1shabhsharma05">GitHub</a>
          <a href="https://www.linkedin.com/in/rishabh-sharma-342575438/">LinkedIn</a>
          <a href="https://www.instagram.com/cod.ehx">Instagram</a>
          <a href="https://www.youtube.com/@UntoldHx">YouTube</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </>
  );
}
