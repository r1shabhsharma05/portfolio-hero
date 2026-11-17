import { useEffect, useRef, useState } from "react";
import ChatModal from "../components/ChatModal";
import CursorLabel from "../components/CursorLabel";
import {
  revealWorldTransition,
  shouldShowWorldTransition,
  WORLD_SCENES,
} from "../components/WorldTransition";
import { NAV_WORLDS, PROFILE } from "../data/site";
import {
  BRAND_AUDIENCE,
  BRAND_CTA_EMAIL,
  BRAND_FORMATS,
  BRAND_HERO,
  BRAND_INCLUDED,
  BRAND_NEGOTIABLE,
  BRAND_NUMBERS,
  BRAND_RATES,
  BRAND_STEPS,
  BRAND_TOP_REELS,
  BRAND_TOP_THREE,
  BRAND_WORK,
} from "../data/brand";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts a value up from 0 once `start` flips true. */
function CountUp({ value, start }: { value: string; start: boolean }) {
  const target = Number(value.replace(/,/g, ""));
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reducedMotion()) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 2000);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return <>{n.toLocaleString("en-IN")}</>;
}

function BrandStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
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
    <div className="brand-stat" ref={ref}>
      <span className="brand-stat-num">
        <CountUp value={value} start={start} />
      </span>
      <span className="brand-stat-label">{label}</span>
    </div>
  );
}

/** Fan of the best Reels — one per card, front card in red. */
function FanCarousel() {
  const [index, setIndex] = useState(0);
  const total = BRAND_TOP_REELS.length;
  const reel = BRAND_TOP_REELS[index];
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  return (
    <div className="brand-hero-carousel" data-reveal>
      <div className="brand-fan" role="group" aria-label="Best Reels">
        {BRAND_TOP_REELS.map((r, i) => {
          const offset = ((i - index + Math.floor(total / 2)) % total) - Math.floor(total / 2);
          const abs = Math.abs(offset);
          return (
            <a
              key={r.id}
              className={`brand-fan-card${offset === 0 ? " is-front" : ""}`}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${r.title} — ${r.views ?? ""} views`}
              style={{
                transform: `translateX(${offset * 62}px) rotate(${offset * 9}deg) translateY(${abs * 10}px) scale(${1 - abs * 0.06})`,
                zIndex: 10 - abs,
              }}
            >
              <img src={r.thumb} alt="" loading="lazy" />
              <span className="brand-fan-play">Play</span>
            </a>
          );
        })}
        {BRAND_HERO.stickers.map((s, i) => (
          <span key={s.k} className="brand-sticker" style={{ "--i": i } as React.CSSProperties}>
            {s.k} {s.v}
          </span>
        ))}
      </div>
      <div className="brand-fan-meta">
        <p>
          <b>This Reel · {reel.title}</b>
        </p>
        <p className="brand-fan-pills">
          <span>{reel.views} views</span>
          <a href={reel.url} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </p>
        <p className="brand-fan-nav">
          <button type="button" onClick={prev} aria-label="Previous Reel">
            ←
          </button>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button type="button" onClick={next} aria-label="Next Reel">
            →
          </button>
        </p>
      </div>
    </div>
  );
}

const MONTHS = ["this month", "next month", "we're flexible"] as const;

export default function Brand() {
  const [chatOpen, setChatOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  // World transition (Avi's mechanism): arriving from the homepage, the
  // full-screen seascape scene is already covering; it morphs into the hero.
  const [showTransition] = useState(() => shouldShowWorldTransition());
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [month, setMonth] = useState<(typeof MONTHS)[number]>("this month");
  const [copied, setCopied] = useState("");
  useEffect(() => {
    if (!showTransition) return;
    const cleanup = revealWorldTransition({
      hero: ".brand-hero",
      copy: ".brand-hero-copy",
      form: ".brand-hero-carousel",
    });
    return cleanup;
    // Mount-only: the reveal runs once, on arrival.
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

  // Scroll zoom (Avi's --hero-p): the seascape inside the hero grows to 1.3x
  // and sinks 22% as the hero scrolls out; a paper veil fades in over it.
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-world-hero]");
    if (!hero || reducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      hero.style.setProperty("--hero-p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Reveal on scroll: sections fade/slide in as they enter the viewport.
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (reducedMotion()) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const brief = `We're launching ${product || "___"} for ${audience || "___"}, and want it live ${month}.`;
  const sendBrief = () => {
    const subject = encodeURIComponent(`Brand campaign: ${product || "new launch"}`);
    const body = encodeURIComponent(`${brief}\n\n— via rishabhsharma.in/brands`);
    window.location.href = `mailto:${BRAND_CTA_EMAIL}?subject=${subject}&body=${body}`;
  };
  const askAi = async (where: "claude" | "chatgpt") => {
    try {
      await navigator.clipboard.writeText(
        `I'm planning a brand campaign with Rishabh Sharma (@cod.ehx). Brief: ${brief} His media kit is at https://portfolio-hero-psi-lemon.vercel.app/brands/ — what should I ask him, and is this a good fit?`
      );
      setCopied(where);
      window.setTimeout(() => setCopied(""), 2500);
    } catch {
      /* clipboard unavailable — the site still opens */
    }
    window.open(where === "claude" ? "https://claude.ai/new" : "https://chat.openai.com/", "_blank");
  };

  return (
    <div className="brand-page">
      <CursorLabel />
      {showTransition && (
        <div
          className="world-transition is-covered"
          aria-hidden="true"
          style={{ "--scene": `url("${WORLD_SCENES.brand.scene}")` } as React.CSSProperties}
        >
          <div className="world-transition-scene">
            <span className="world-transition-name">
              <span>Brand.</span>
            </span>
          </div>
          <i className="world-transition-light" />
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
              <span className="wordmark-name wordmark-line">I build cool things with AI.</span>
            </span>
          </a>
          <nav className="world-nav" aria-label="Worlds">
            {NAV_WORLDS.map((w) => (
              <span className="world-option" key={w.id}>
                <span className="mode-slash" aria-hidden="true">
                  /
                </span>
                <a
                  className="world-link"
                  style={{ "--world": w.color, "--world-text": w.text } as React.CSSProperties}
                  href={w.href}
                  {...(w.id === "brand" ? { "aria-current": "page" } : {})}
                >
                  {w.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
        <div className="mode-switch" data-mode="human" role="group" aria-label="View this page as">
          <span className="mode-option">
            <button type="button" aria-pressed="true" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Human
            </button>
          </span>
          <span className="mode-option">
            <span className="mode-slash" aria-hidden="true">
              /
            </span>
            <button type="button" aria-pressed="false" onClick={() => setChatOpen(true)}>
              Agent
            </button>
          </span>
        </div>
      </header>

      <main>
        {/* hero — seascape panel + best-Reels fan (Avi's media-kit hero) */}
        <section className="brand-hero" data-world-hero aria-label="Brand media kit">
          <div className="brand-hero-copy">
            <p className="brand-eyebrow">{BRAND_HERO.label}</p>
            <h1>
              Brands don&rsquo;t just get a Reel. They get the product,{" "}
              <span className="brand-underline">on camera.</span>
            </h1>
            <p>{BRAND_HERO.sub1}</p>
            <p>{BRAND_HERO.sub2}</p>
            <p className="brand-hero-links">
              <a href={BRAND_HERO.ratesHref}>Ask for rates ↗</a>
              <a href="#numbers">See the results ↓</a>
            </p>
          </div>
          <FanCarousel />
        </section>

        {/* selected work — his own Reels, with his real numbers */}
        <section className="section" id="selected-work" aria-label="Selected work" data-reveal>
          <p className="section-label">Selected work</p>
          <h2 className="section-title">What I made, what happened.</h2>
          <p className="section-body">
            Every Reel below is something I built and filmed myself — no client briefs yet, no
            staged demos. Click a card to watch it on Instagram.
          </p>
          <div className="brand-articles">
            {BRAND_WORK.map(({ reel, made }) => (
              <article key={reel.id} className="brand-article">
                <a href={reel.url} target="_blank" rel="noreferrer" className="brand-article-media">
                  <img src={reel.thumb} alt="" loading="lazy" />
                  <span className="brand-fan-play">Play</span>
                </a>
                <div className="brand-article-body">
                  <p className="brand-article-kicker">
                    <b>{reel.title}</b> · @cod.ehx
                  </p>
                  <p className="brand-article-label">I made</p>
                  <p className="brand-article-serif">{made}</p>
                  <p className="brand-article-label">What happened</p>
                  <p className="brand-article-big">
                    <BrandStat value={reel.viewsRaw?.toLocaleString("en-IN") ?? "0"} label="views" />
                  </p>
                  <a href={reel.url} target="_blank" rel="noreferrer">
                    Watch on Instagram ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* numbers */}
        <section className="section brand-numbers" id="numbers" aria-label="The numbers" data-reveal>
          <p className="section-label">The numbers</p>
          <h2 className="section-title">Running totals.</h2>
          <p className="section-body">{BRAND_NUMBERS.intro}</p>
          <div className="brand-stats">
            {BRAND_NUMBERS.stats.map((s) => (
              <BrandStat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </section>

        {/* who watches */}
        <section className="section" id="audience" aria-label="Who watches" data-reveal>
          <p className="section-label">Who watches</p>
          <h2 className="section-title">Who watches.</h2>
          <p className="section-body">{BRAND_AUDIENCE.intro}</p>
          <div className="brand-pills">
            {BRAND_AUDIENCE.pills.map((p) => (
              <span key={p} className="brand-pill">
                {p}
              </span>
            ))}
          </div>
        </section>

        {/* reach */}
        <section className="section" aria-label="For a sense of reach" data-reveal>
          <div className="brand-reach">
            <p className="section-label">For a sense of reach</p>
            <h2 className="section-title">My three most watched Reels of the last 6 months. @cod.ehx</h2>
            <div className="brand-fan brand-fan-static">
              {BRAND_TOP_THREE.map((r, i) => (
                <a
                  key={r.id}
                  className="brand-fan-card"
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${r.title} — ${r.views} views`}
                  style={{
                    transform: `translateX(${(i - 1) * 62}px) rotate(${(i - 1) * 9}deg) translateY(${Math.abs(i - 1) * 10}px)`,
                    zIndex: 10 - Math.abs(i - 1),
                  }}
                >
                  <img src={r.thumb} alt="" loading="lazy" />
                  <span className="brand-fan-play">▶</span>
                  <span className="brand-fan-views">{r.views} views</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* formats + how it works */}
        <section className="section" id="formats" aria-label="Formats and how it works" data-reveal>
          <div className="brand-split">
            <div>
              <p className="section-label">Formats</p>
              <h2 className="section-title">What a campaign looks like.</h2>
              <ul className="brand-rows">
                {BRAND_FORMATS.map((f) => (
                  <li key={f.title}>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="section-label">How it works</p>
              <h2 className="section-title">Four steps, no surprises.</h2>
              <ol className="brand-rows">
                {BRAND_STEPS.map((s) => (
                  <li key={s.n}>
                    <h3>
                      {s.n} · {s.title}
                    </h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* included + rates */}
        <section className="section" id="included" aria-label="Included and rates" data-reveal>
          <div className="brand-split">
            <div>
              <p className="section-label">Included as standard</p>
              <h2 className="section-title">Every campaign includes.</h2>
              <ul className="brand-checks">
                {BRAND_INCLUDED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                {BRAND_NEGOTIABLE.map((item) => (
                  <li key={item}>
                    {item} <span className="brand-tag">Negotiable</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="section-label">Rates</p>
              <h2 className="section-title">Rates, on request.</h2>
              <p className="section-body">{BRAND_RATES}</p>
              <p>
                <a href={BRAND_HERO.ratesHref}>Ask for rates ↗</a>
              </p>
            </div>
          </div>
        </section>

        {/* campaign CTA */}
        <section className="section" id="campaign" aria-label="Start a campaign" data-reveal>
          <div className="brand-cta">
            <p className="section-label">Start a campaign</p>
            <h2 className="section-title">Let&rsquo;s make something people watch twice.</h2>
            <p className="brand-cta-sentence">
              We&rsquo;re launching{" "}
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="an AI coding tool"
                aria-label="What are you launching?"
              />{" "}
              for{" "}
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="developers in India"
                aria-label="Who is it for?"
              />
              , and want it live{" "}
              {MONTHS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`brand-month${month === m ? " is-selected" : ""}`}
                  aria-pressed={month === m}
                  onClick={() => setMonth(m)}
                >
                  {m}
                </button>
              ))}
              .
            </p>
            <p className="brand-cta-note">
              Goes to {BRAND_CTA_EMAIL}. Rishabh replies himself.
            </p>
            <div className="brand-cta-actions">
              <button type="button" onClick={() => askAi("claude")}>
                {copied === "claude" ? "Brief copied ✓" : "Ask Claude about this brief"}
              </button>
              <button type="button" onClick={() => askAi("chatgpt")}>
                {copied === "chatgpt" ? "Brief copied ✓" : "Ask ChatGPT about this brief"}
              </button>
              <button type="button" className="brand-send" onClick={sendBrief}>
                Send to Rishabh ↗
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer build-footer">
        <span>© 2026 Rishabh Sharma</span>
        <nav aria-label="Footer">
          <a href="https://github.com/r1shabhsharma05">GitHub</a>
          <a href="https://www.linkedin.com/in/rishabh-sharma-342575438/">LinkedIn</a>
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
