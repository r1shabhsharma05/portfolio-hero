import { useEffect, useState } from "react";
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

/** The hero wall — the CurvedLens card animation: one WebGL canvas, centre
 *  card flat, outer cards taller and bent with a chromatic fringe at the
 *  rim. Drag / flick / arrow keys / buttons, spring settle, idle
 *  auto-rotation (~1 slot / 5s), wheel spins it. Tap a card (not a drag)
 *  to open that reel on Instagram. Hover-play video lives in the reels
 *  grid below — the lens renders photos only. */
function HeroWall() {
  const slides = REELS.map((r) => ({
    title: r.title,
    kicker: r.views ? `${r.views} views` : "New",
    caption: "Tap to watch on Instagram ↗",
    image: r.thumb,
    alt: r.title,
  }));
  return (
    <div className="wall-wrap">
      <CurvedLensCarousel
        slides={slides}
        label="Reels — @cod.ehx"
        background="transparent"
        ink="#111111"
        height="100%"
        showCopy={false}
        autoAdvanceMs={5000}
        onSlideClick={(i) => window.open(REELS[i].url, "_blank", "noopener,noreferrer")}
      />
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
