import { useEffect, useState, type ReactNode } from "react";
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
  on: string;
  href?: string;
  action?: "chat";
}

const SENTENCE_CHOICES: Choice[] = [
  { label: "founders", sup: "01", world: "#2F55FF", on: "#FFFFFF", href: "/projects" },
  { label: "open source", sup: "02", world: "#EF3B2D", on: "#FFFFFF", href: "https://github.com/r1shabhsharma05" },
  { label: "students", sup: "03", world: "#FFC81A", on: "#111111", href: "/blog/" },
  { label: "talk to my AI", sup: "04", world: "var(--color-ink)", on: "var(--color-paper)", action: "chat" },
];

export default function Home({ onOpenChat, entered }: { onOpenChat: () => void; entered: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);

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
      <button type="button" key={c.sup} {...props} onClick={onOpenChat}>
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
              <a className="world-link" style={{ "--world": "#2F55FF", "--world-on": "#FFFFFF" } as React.CSSProperties} href="/projects">Build</a>
            </span>
            <span className="world-option">
              <span className="mode-slash" aria-hidden="true">/</span>
              <a className="world-link" style={{ "--world": "#EF3B2D", "--world-on": "#FFFFFF" } as React.CSSProperties} href="https://github.com/r1shabhsharma05">Open Source</a>
            </span>
            <span className="world-option">
              <span className="mode-slash" aria-hidden="true">/</span>
              <a className="world-link" style={{ "--world": "#FFC81A", "--world-on": "#111111" } as React.CSSProperties} href="/blog/">Learn</a>
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
        <section className="stage" data-stage aria-label="Intro">
          <div className="world-frame">
            <div className="sky-layer">
              <img src="/sky.jpg" alt="" aria-hidden="true" />
            </div>
            <HeroWall />
            <div className="cloud-layer" aria-hidden="true" />
          </div>
          <div className={`below${entered ? " is-entered" : ""}`} aria-label="What Rishabh does, in one sentence">
          <p className="sentence" data-hovering={hovered ? "" : undefined}>
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
