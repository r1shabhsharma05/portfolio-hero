import { useEffect, useRef, useState } from "react";
import { LEARN_POSTS, PROFILE, PROJECTS, REELS, STATS, WORLDS } from "../data/site";
import ReelCard from "../components/ReelCard";
import ReelRing from "../components/ReelRing";

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

/** The hero wall — the live site's reel ring. It never stops: slow
 *  auto-rotation (~1 slot per 5s), drag it to spin with momentum, scroll
 *  the wheel over it to spin it further (the wheel never scrolls the page
 *  while over the wall). A drag never follows its card link. */
function HeroWall() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [pill, setPill] = useState<{ x: number; y: number } | null>(null);
  const rotRef = useRef(0);
  const velRef = useRef(0);
  const dragRef = useRef<{ x: number; rot: number; moved: boolean } | null>(null);
  const lastMoveRef = useRef({ x: 0, t: 0 });
  const lastInteractRef = useRef(0);
  const lastPointerRef = useRef({ x: -1, y: -1 });
  const hoveredRef = useRef<Element | null>(null);
  const suppressClickRef = useRef(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Hover-play must follow the ring, not just the mouse: the ring keeps
  // moving under a stationary pointer (live site does the same check per
  // frame via elementFromPoint), so re-resolve the hovered card each frame.
  const syncHover = () => {
    const { x, y } = lastPointerRef.current;
    if (x < 0 || dragRef.current) return;
    const card = document.elementFromPoint(x, y)?.closest?.("[data-card]") as HTMLElement | null;
    const prev = hoveredRef.current as HTMLElement | null;
    if (card === prev) return;
    if (prev) {
      const v = prev.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
      prev.classList.remove("is-playing");
    }
    hoveredRef.current = card;
    if (card) {
      const v = card.querySelector("video");
      if (v) {
        if (!v.src) v.src = v.dataset.previewSrc ?? "";
        v.play().catch(() => {});
      }
      card.classList.add("is-playing");
    }
    setPill((p) => {
      const next = card ? { x, y } : null;
      if (!p && !next) return p;
      if (p && next && p.x === next.x && p.y === next.y) return p;
      return next;
    });
  };

  // Animation loop: idle auto-rotation + momentum glide.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragRef.current && !reducedRef.current) {
        const idle = now - lastInteractRef.current > 2000;
        rotRef.current += (idle ? 2.4 : 0) * dt + velRef.current * dt;
        velRef.current *= Math.pow(0.06, dt);
        if (Math.abs(velRef.current) < 0.05) velRef.current = 0;
        setRotation(rotRef.current);
      }
      syncHover();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel over the wall spins the ring instead of scrolling the page.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.max(-480, Math.min(480, Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX));
      rotRef.current += d * 0.18;
      if (!reducedRef.current) velRef.current = d * 0.18 * 2;
      lastInteractRef.current = performance.now();
      setRotation(rotRef.current);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, rot: rotRef.current, moved: false };
    lastMoveRef.current = { x: e.clientX, t: performance.now() };
    velRef.current = 0;
    lastInteractRef.current = performance.now();
    wrapRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    // Lens tilt: the wall leans toward the pointer, like the live wall.
    const lens = lensRef.current;
    if (lens) {
      const r = lens.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      lens.style.transform = `rotateY(${px * 8}deg) rotateX(${py * -5}deg)`;
    }
    // "PLAY" pill follows the pointer over a card (the live custom cursor).
    const card = (e.target as Element).closest?.("[data-card]");
    setPill(card ? { x: e.clientX, y: e.clientY } : null);
    const drag = dragRef.current;
    if (!drag) return;
    const now = performance.now();
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    const dt = Math.max(1, now - lastMoveRef.current.t) / 1000;
    velRef.current = ((e.clientX - lastMoveRef.current.x) / dt) * 0.12;
    lastMoveRef.current = { x: e.clientX, t: now };
    rotRef.current = drag.rot + dx * 0.12;
    lastInteractRef.current = now;
    setRotation(rotRef.current);
  };
  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => (suppressClickRef.current = false), 120);
    }
    if (!reducedRef.current) velRef.current = Math.max(-300, Math.min(300, velRef.current));
    else velRef.current = 0;
    dragRef.current = null;
    lastInteractRef.current = performance.now();
  };
  const onWallLeave = () => {
    if (lensRef.current) lensRef.current.style.transform = "";
    setPill(null);
  };

  return (
    <div
      className="wall-wrap"
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={onWallLeave}
      onClickCapture={(e) => {
        if (suppressClickRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="wall-lens" ref={lensRef}>
        <ReelRing rotation={rotation} />
      </div>
      {pill && (
        <span className="cursor-pill" style={{ left: pill.x, top: pill.y }}>
          Play
        </span>
      )}
    </div>
  );
}

interface Choice {
  label: string;
  sup: string;
  world: string;
  href?: string;
  action?: "chat";
}

const SENTENCE_CHOICES: Choice[] = [
  { label: "products that solve real problems", sup: "01", world: "var(--world-build)", href: "/projects" },
  { label: "open source for everyone", sup: "02", world: "var(--world-opensource)", href: "https://github.com/r1shabhsharma05" },
  { label: "free roadmaps for students", sup: "03", world: "var(--world-learn)", href: "/blog/" },
  { label: "talk to my AI", sup: "04", world: "var(--world-opensource)", action: "chat" },
];

export default function Home({ onOpenChat, entered }: { onOpenChat: () => void; entered: boolean }) {
  return (
    <>
      <header className="site-header">
        <a className="site-mark" href="/" aria-label="Rishabh Sharma — home">
          <span className="wordmark-name">
            Rishabh<span className="wordmark-last"> Sharma</span>
          </span>
        </a>
        <nav className="world-nav" aria-label="Worlds">
          <span>/</span>
          <a href="/projects">Build</a>
          <span>/</span>
          <a href="https://github.com/r1shabhsharma05">Open Source</a>
          <span>/</span>
          <a href="/blog/">Learn</a>
        </nav>
        <div className="mode-switch">
          <button data-active="true" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Human
          </button>
          <span>/</span>
          <button data-active="false" onClick={onOpenChat}>
            Agent
          </button>
        </div>
      </header>

      <main>
        {/* hero */}
        <section className="stage" aria-label="Intro">
          <div className="world-frame">
            <div className="sky-layer">
              <img src="/sky.jpg" alt="" aria-hidden="true" />
            </div>
            <div className="hero-copy">
              <h1 className="hero-name">
                <span>Rishabh.</span>
              </h1>
              <p className="hero-tagline">
                I build <em>cool things</em> with AI.
              </p>
            </div>
            <HeroWall />
            <div className="cloud-layer" aria-hidden="true" />
          </div>
        </section>

        {/* sentence + stats */}
        <section className={`below${entered ? " is-entered" : ""}`} aria-label="What Rishabh does, in one sentence">
          <p className="sentence">
            I build{" "}
            {SENTENCE_CHOICES.map((c, i) => (
              <span key={c.sup}>
                {c.action === "chat" ? (
                  <button className="choice" style={{ "--world": c.world } as React.CSSProperties} onClick={onOpenChat}>
                    <span className="choice-label">
                      {c.label}
                      <span className="underline" />
                    </span>
                    <sup>{c.sup}</sup>
                  </button>
                ) : (
                  <a className="choice" style={{ "--world": c.world } as React.CSSProperties} href={c.href}>
                    <span className="choice-label">
                      {c.label}
                      <span className="underline" />
                    </span>
                    <sup>{c.sup}</sup>
                  </a>
                )}
                {i < SENTENCE_CHOICES.length - 1 ? ", " : "."}
              </span>
            ))}
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
        </section>

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
            <strong>14 pull requests merged</strong> across Jenkins, WordPress/Gutenberg and
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
