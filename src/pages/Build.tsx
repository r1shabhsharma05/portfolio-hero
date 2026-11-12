import { useEffect, useMemo, useRef, useState } from "react";
import ChatModal from "../components/ChatModal";
import CursorLabel from "../components/CursorLabel";
import ReelCard from "../components/ReelCard";
import { PROFILE, PROJECTS, REELS, STATS } from "../data/site";

const WORLDS = [
  {
    id: "build",
    label: "Build",
    color: "#2F55FF",
    text: "#ffffff",
    href: "/projects",
  },
  {
    id: "open-source",
    label: "Open Source",
    color: "#EF3B2D",
    text: "#ffffff",
    href: "https://github.com/r1shabhsharma05",
  },
  {
    id: "learn",
    label: "Learn",
    color: "#FFC81A",
    text: "#111111",
    href: "/blog/",
  },
] as const;

const BUILD_STATS = [
  ...STATS,
  { value: "7", label: "Products shipped" },
];

type ShipItem = {
  name: string;
  period: string;
  description: string;
  image: string;
  live?: string;
  repo?: string;
  stats: { value: string; label: string }[];
  tags: string[];
};

const SHIPPED: ShipItem[] = [
  {
    ...PROJECTS[0],
    period: "2026 · Solo",
    stats: [
      { value: "25", label: "security fixes shipped" },
      { value: "19", label: "Supabase tables" },
    ],
    tags: ["React", "TypeScript", "Prisma", "Supabase"],
  },
  {
    ...PROJECTS[1],
    period: "2026 · Solo",
    stats: [
      { value: "331", label: "backend tests passing" },
      { value: "20", label: "days shipped of 30" },
    ],
    tags: ["React Native", "Expo", "Node.js", "Supabase"],
  },
  {
    ...PROJECTS[3],
    period: "2026 · Solo",
    stats: [
      { value: "423", label: "backend tests passing" },
      { value: "10", label: "stages live" },
    ],
    tags: ["React", "Node.js", "Supabase", "Razorpay"],
  },
];

const BUILT = [
  { ...PROJECTS[2], role: "Solo", tags: ["Python"] },
  { ...PROJECTS[4], role: "Solo", tags: ["React", "Node.js", "MongoDB"] },
  { ...PROJECTS[5], role: "Solo", tags: [] as string[] },
  { ...PROJECTS[6], role: "Solo", tags: [] as string[] },
];

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function CountUp({ value, start }: { value: string; start: boolean }) {
  const target = Number(String(value).replace(/,/g, ""));
  const [n, setN] = useState(reducedMotion() ? target : 0);
  useEffect(() => {
    if (!start) return;
    if (reducedMotion()) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 2000);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return <>{n.toLocaleString("en-IN")}</>;
}

/** Number that counts up once it scrolls into view. */
function BuildStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setStart(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="build-stat" ref={ref}>
      <span className="build-stat-num">
        <CountUp value={value} start={start} />
      </span>
      <span className="build-stat-label">{label}</span>
    </div>
  );
}

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        left: (i * 13 + 4) % 100,
        delay: (i * 1.7) % 8,
        dur: 9 + (i % 4) * 2,
        size: 8 + (i % 3) * 4,
      })),
    []
  );
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            width: p.size,
            height: p.size * 0.7,
          }}
        />
      ))}
    </div>
  );
}

function BriefForm() {
  const [project, setProject] = useState("");
  const [contact, setContact] = useState("");
  const [timeline, setTimeline] = useState("This month");
  const [ai, setAi] = useState<"claude" | "chatgpt" | null>(null);

  const briefText = () =>
    [
      "What I'm building:",
      project.trim(),
      "",
      `Name / email: ${contact.trim() || "—"}`,
      `Timeline: ${timeline}`,
    ].join("\n");

  const send = () => {
    if (!project.trim()) return;
    const subject = `Project brief — ${project.trim().slice(0, 40)}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(briefText())}`;
  };

  // The round buttons hand the brief to the visitor's own AI to refine it.
  const openAi = (which: "claude" | "chatgpt") => {
    setAi(which);
    if (which === "chatgpt") {
      window.open(
        `https://chatgpt.com/?q=${encodeURIComponent(briefText())}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <form
      className="brief-form"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <p className="brief-title">Tell me about your project</p>
      <label className="brief-field">
        <span>What are you building?</span>
        <textarea
          value={project}
          onChange={(e) => setProject(e.target.value)}
          rows={3}
          required
          placeholder="An app that…"
        />
      </label>
      <label className="brief-field">
        <span>Your name or email</span>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          type="text"
          placeholder="you@example.com"
        />
      </label>
      <fieldset className="brief-timeline">
        <legend>Timeline</legend>
        {["This week", "This month", "In 3 months"].map((t) => (
          <label key={t} className="brief-radio">
            <input
              type="radio"
              name="timeline"
              checked={timeline === t}
              onChange={() => setTimeline(t)}
            />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>
      <div className="brief-ai">
        <span>Draft it with</span>
        <button
          type="button"
          className="brief-ai-btn"
          data-on={ai === "claude" ? "" : undefined}
          onClick={() => openAi("claude")}
          aria-label="Draft with Claude"
        >
          Claude
        </button>
        <button
          type="button"
          className="brief-ai-btn"
          data-on={ai === "chatgpt" ? "" : undefined}
          onClick={() => openAi("chatgpt")}
          aria-label="Draft with ChatGPT"
        >
          ChatGPT
        </button>
      </div>
      <button type="submit" className="brief-send" disabled={!project.trim()}>
        Send
      </button>
    </form>
  );
}

/** Browser-window frame with an auto-crossfading screenshot slideshow. */
function SlideShow({
  images,
  url,
  alt,
}: {
  images: string[];
  url: string;
  alt: string;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (images.length < 2 || reducedMotion()) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % images.length),
      4000
    );
    return () => window.clearInterval(id);
  }, [images.length]);
  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  })();
  return (
    <div className="browser-frame">
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dot" />
        <span className="browser-dot" />
        <span className="browser-dot" />
        <span className="browser-url">{host}</span>
      </div>
      <div className="browser-view">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === idx ? alt : ""}
            aria-hidden={i !== idx}
            className={i === idx ? "is-active" : ""}
            loading="lazy"
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="browser-dots" aria-label="Screenshots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-selected={i === idx}
              aria-label={`Screenshot ${i + 1}`}
              className={i === idx ? "is-active" : ""}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ShipCard({ item, index }: { item: ShipItem; index: number }) {
  const open = () =>
    window.open(item.live ?? item.repo, "_blank", "noopener,noreferrer");
  return (
    <article
      className="ship-card build-card"
      style={{ "--i": index } as React.CSSProperties}
      data-cursor="Open"
      tabIndex={0}
      role="link"
      aria-label={`${item.name} — open live site`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        open();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") open();
      }}
    >
      <div className="ship-meta">
        <p className="ship-period">{item.period}</p>
        <h3>
          <span className="card-title">{item.name}</span>
        </h3>
        <p className="ship-desc">{item.description}</p>
        <div className="ship-stats">
          {item.stats.map((s) => (
            <BuildStat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
        <ul className="ship-tags">
          {item.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {item.repo && (
          <a
            className="ship-link"
            href={item.repo}
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        )}
      </div>
      <SlideShow images={[item.image]} url={item.live ?? item.repo ?? ""} alt={item.name} />
    </article>
  );
}

export default function Build() {
  const [chatOpen, setChatOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  // Brief "Opening Build" overlay only when arriving from the homepage.
  const [intro, setIntro] = useState<"show" | "fade" | "gone">(() => {
    if (typeof window === "undefined" || reducedMotion()) return "gone";
    try {
      const r = new URL(document.referrer);
      return r.origin === window.location.origin &&
        (r.pathname === "/" || r.pathname === "/index.html")
        ? "show"
        : "gone";
    } catch {
      return "gone";
    }
  });
  useEffect(() => {
    if (intro !== "show") return;
    const t1 = window.setTimeout(() => setIntro("fade"), 500);
    const t2 = window.setTimeout(() => setIntro("gone"), 1100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // Mount-only: the "fade" re-render must not cancel the unmount timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHeaderHidden(y > 140 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="build-page">
      <CursorLabel />
      {intro !== "gone" && (
        <div
          className={`build-intro${intro === "fade" ? " is-fading" : ""}`}
          aria-hidden="true"
        >
          <span>Opening Build</span>
        </div>
      )}
      <header className={`site-header${headerHidden ? " is-hidden" : ""}`}>
        <div className="site-left">
          <a className="site-mark" href="/" aria-label="Rishabh Sharma, home">
            <span className="site-wordmark" aria-hidden="true">
              <span className="wordmark-name">
                <span className="wordmark-first">Rishabh</span>
                <span className="wordmark-last"> Sharma</span>.
              </span>
              <span className="wordmark-name wordmark-line">
                I build cool things with AI.
              </span>
            </span>
          </a>
          <nav className="world-nav" aria-label="Worlds">
            {WORLDS.map((w) => (
              <span className="world-option" key={w.id}>
                <span className="mode-slash" aria-hidden="true">
                  /
                </span>
                <a
                  className="world-link"
                  style={
                    {
                      "--world": w.color,
                      "--world-text": w.text,
                    } as React.CSSProperties
                  }
                  href={w.href}
                  {...(w.id === "build" ? { "aria-current": "page" } : {})}
                >
                  {w.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
        <div
          className="mode-switch"
          data-mode="human"
          role="group"
          aria-label="View this page as"
        >
          <span className="mode-option">
            <button
              type="button"
              aria-pressed="true"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Human
            </button>
          </span>
          <span className="mode-option">
            <span className="mode-slash" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              aria-pressed="false"
              onClick={() => setChatOpen(true)}
            >
              Agent
            </button>
          </span>
        </div>
      </header>

      <main>
        <section className="build-hero" id="brief" aria-label="Build">
          <div className="build-hero-sky">
            <img
              src="/sky.jpg"
              alt=""
              aria-hidden="true"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Petals />
            <div className="build-hero-copy">
              <p className="build-eyebrow">Build — Products for founders</p>
              <h1>I take ideas from zero to a product people use.</h1>
              <p>
                Full-stack developer and AI builder studying Computer Science
                at GLA University, Mathura. Seven products shipped — safety,
                security, farming, campus, health, railways and AI tooling.
                Everything here is built, not claimed.
              </p>
            </div>
          </div>
          <BriefForm />
        </section>

        <section className="build-stats" aria-label="Numbers">
          {BUILD_STATS.map((s) => (
            <BuildStat key={s.label} value={s.value} label={s.label} />
          ))}
        </section>

        <section className="section build-shipped" aria-label="Shipped, end to end">
          <p className="section-label">Shipped — end to end</p>
          <h2 className="section-title">Shipped, end to end.</h2>
          <p className="section-body">
            Three products I took from idea to production — designed, built and
            shipped solo.
          </p>
          <div className="ship-list">
            {SHIPPED.map((s, i) => (
              <ShipCard key={s.name} item={s} index={i} />
            ))}
          </div>
        </section>

        <section className="section build-built" aria-label="Built myself">
          <p className="section-label">Built — solo</p>
          <h2 className="section-title">Built myself.</h2>
          <p className="section-body">
            Side projects that shipped — each one taught me something the big
            ones needed.
          </p>
          <div className="built-grid">
            {BUILT.map((b) => {
              const open = () =>
                window.open(b.live ?? b.repo, "_blank", "noopener,noreferrer");
              return (
                <article
                  key={b.name}
                  className="built-card build-card"
                  data-cursor="Open"
                  tabIndex={0}
                  role="link"
                  aria-label={`${b.name} — open`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a, button")) return;
                    open();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") open();
                  }}
                >
                  <img src={b.image} alt={b.name} loading="lazy" />
                  <div className="built-body">
                    <p className="built-role">{b.role}</p>
                    <h3>
                      <span className="card-title">{b.name}</span>
                    </h3>
                    <p>{b.description}</p>
                    {b.tags.length > 0 && (
                      <ul className="ship-tags">
                        {b.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                    {b.repo && (
                      <a href={b.repo} target="_blank" rel="noreferrer">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section build-experiments" aria-label="Experiments">
          <p className="section-label">Experiments</p>
          <h2 className="section-title">Experiments.</h2>
          <p className="section-body">
            Why the products ship with taste. Every product here has a Reel —
            the build, the prompt or the code, explained in 60 seconds.
          </p>
          <p>
            <a className="experiments-link" href="/blog/">
              All of them on Learn ↗
            </a>
          </p>
          <div className="experiments-panel">
            <img
              className="experiments-sky"
              src="/sky.jpg"
              alt=""
              aria-hidden="true"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Petals />
            <div className="experiments-grid">
              {REELS.map((reel, i) => {
                const col = i % 6;
                const row = Math.floor(i / 6);
                const off =
                  row * 20 +
                  Math.round(10 * (1 - Math.abs(col - 2.5) / 2.5));
                return (
                  <ReelCard
                    key={reel.id}
                    reel={reel}
                    style={
                      { "--ring-tf": `translateY(${off}px)` } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="section build-cta" aria-label="Work with Rishabh">
          <h2 className="section-title">Have something to build?</h2>
          <a className="build-cta-link" href="#brief">
            Tell me about it <span aria-hidden="true">↑</span>
          </a>
        </section>
      </main>

      <footer className="site-footer build-footer">
        <span>© 2026 Rishabh Sharma</span>
        <nav aria-label="Footer">
          <a href="https://github.com/r1shabhsharma05">GitHub</a>
          <a href="https://www.linkedin.com/in/rishabh-sharma-342575438/">
            LinkedIn
          </a>
          <a href="https://www.instagram.com/cod.ehx">Instagram</a>
          <a href="https://www.youtube.com/@UntoldHx">YouTube</a>
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/developers">Developers</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </div>
  );
}
