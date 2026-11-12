import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { LEARN_POSTS, PROFILE, PROJECTS, REELS, STATS, WORLDS } from "../data/site";
import ReelCard from "../components/ReelCard";
import CurvedLensCarousel from "../components/CurvedLensCarousel";

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

/** The single shared scene: one lens, mounted once, positioned over the
 *  hero frame. During loading it sits above the paper in formation (small
 *  and tilted, like the reference's formation wall); at 100% it expands
 *  into the hero arc as the paper fades — the same canvas, same drift, no
 *  remount, no duplicate cards. The layer tracks the frame's box
 *  (offsetTop/Left/Width/Height are relative to .stage, the positioned
 *  ancestor), so it follows resizes and scrolls with the page. */
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
        caption: "Tap to watch on Instagram ↗",
        image: r.thumb,
        alt: r.title,
        video: r.preview ?? undefined,
        world: r.world,
      })),
    []
  );
  const onSlideClick = useCallback((i: number) => {
    window.open(REELS[i].url, "_blank", "noopener,noreferrer");
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
  { label: "founders", sup: "01", world: "#2F55FF", on: "#FFFFFF", href: "/projects" },
  { label: "open source", sup: "02", world: "#EF3B2D", on: "#FFFFFF", href: "https://github.com/r1shabhsharma05" },
  { label: "students", sup: "03", world: "#FFC81A", on: "#111111", href: "/blog/" },
  { label: "talk to my AI", sup: "04", world: "var(--color-ink)", on: "var(--color-paper)", action: "chat" },
];

export default function Home({ onOpenChat, entered }: { onOpenChat: () => void; entered: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [navWorld, setNavWorld] = useState<string | null>(null);
  const sentenceRef = useRef<HTMLParagraphElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  // Sentence hover focuses one world (live site's data-focus): the wall
  // dims only the other worlds' cards; "talk to my AI" focuses nothing.
  // Hovering a header world link focuses that world too.
  const focusWorld =
    hovered === "01" ? "build" : hovered === "02" ? "open-source" : hovered === "03" ? "learn" : navWorld;
  const openChat = () => {
    setHovered(null);
    setNavWorld(null);
    onOpenChat();
  };
  const mergedPRs = STATS.find((s) => s.label.includes("Pull requests"))?.value ?? "";
  // Featured card per sentence word — the live site shows a curated card
  // per world, not a wall reel. Views only where verified.
  const PREVIEWS: Record<string, PreviewEntry | null> = {
    "01": { world: "BUILD", color: "#2F55FF", image: "/projects/secureguard.jpg", video: null, views: null, caption: "SecureGaurd · SafeLife · RailSync — 7 products, shipped." },
    "02": { world: "OPEN SOURCE", color: "#EF3B2D", image: "/reels/github-prompt.webp", video: "/reels/github-prompt-preview.mp4", views: null, caption: `${mergedPRs} PRs merged · Jenkins · WordPress/Gutenberg` },
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
  plain("for everyone and free roadmaps for");
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
              <a className="world-link" style={{ "--world": "#2F55FF", "--world-on": "#FFFFFF" } as React.CSSProperties} href="/projects" onMouseEnter={() => setNavWorld("build")} onMouseLeave={() => setNavWorld(null)}>Build</a>
            </span>
            <span className="world-option">
              <span className="mode-slash" aria-hidden="true">/</span>
              <a className="world-link" style={{ "--world": "#EF3B2D", "--world-on": "#FFFFFF" } as React.CSSProperties} href="https://github.com/r1shabhsharma05" onMouseEnter={() => setNavWorld("open-source")} onMouseLeave={() => setNavWorld(null)}>Open Source</a>
            </span>
            <span className="world-option">
              <span className="mode-slash" aria-hidden="true">/</span>
              <a className="world-link" style={{ "--world": "#FFC81A", "--world-on": "#111111" } as React.CSSProperties} href="/blog/" onMouseEnter={() => setNavWorld("learn")} onMouseLeave={() => setNavWorld(null)}>Learn</a>
            </span>
          </nav>
        </div>
        <div className="mode-switch" data-mode="human" role="group" aria-label="View this page as">
          <span className="mode-option">
            <button type="button" aria-pressed="true" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Human
            </button>
          </span>
          <span className="mode-option">
            <span className="mode-slash" aria-hidden="true">/</span>
            <button type="button" aria-pressed="false" onClick={onOpenChat}>
              Agent
            </button>
          </span>
        </div>
      </header>

      <main>
        {/* hero — one viewport: sky wall + sentence strip, like the live site */}
        <section className="stage" data-stage data-focus={focusWorld ?? undefined} aria-label="Intro">
          <div className="world-frame" ref={frameRef}>
            <div className="sky-layer">
              <img src="/sky.jpg" alt="" aria-hidden="true" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
            <div className="cloud-layer" aria-hidden="true" />
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
          <h2 className="section-title">Build. Open Source. Learn.</h2>
          <div className="worlds-grid">
            {WORLDS.map((w) => (
              <a
                key={w.id}
                className="world-card"
                href={w.link}
                style={{ "--world": w.id === "build" ? "var(--world-build)" : w.id === "open-source" ? "var(--world-opensource)" : "var(--world-learn)" } as React.CSSProperties}
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
          <h2 className="section-title">Seven products, shipped.</h2>
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
                  <a href={`/blog/${post.slug}/`}>Read the write-up ↗</a>
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

        {/* developers portal */}
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
              <a href="/blog/feed.xml">RSS feed</a>
              <a href="/sitemap.xml">sitemap.xml</a>
            </div>
          </div>
        </section>
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
