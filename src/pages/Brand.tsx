import { useCallback, useEffect, useRef, useState } from "react";
import CursorLabel from "../components/CursorLabel";
import AgentView from "../components/AgentView";
import {
  openAgentTransition,
  openWorldTransition,
  preloadWorldScene,
  revealWorldTransition,
  shouldShowWorldTransition,
  WORLD_SCENES,
} from "../components/WorldTransition";
import { NAV_WORLDS, PROFILE, type Reel } from "../data/site";
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
  BRAND_WORK,
} from "../data/brand";
import { AiIcon, CHATGPT_PATH, CLAUDE_PATH } from "./Build";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts a value up from 0 once `start` flips true. */
function CountUp({
  value,
  start,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  start: boolean;
  decimals?: number;
  suffix?: string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reducedMotion()) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 2000);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);
  return (
    <>
      {n.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

function BrandStat({
  value,
  label,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  label: string;
  decimals?: number;
  suffix?: string;
}) {
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
        <CountUp value={value} start={start} decimals={decimals} suffix={suffix} />
      </span>
      <span className="brand-stat-label">{label}</span>
    </div>
  );
}

const FAN_SECONDS = 10;

/** True once the element has scrolled into view — once, never re-runs. */
function useInViewOnce<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Fan of the best Reels — the front card plays its preview video, muted,
 *  and the fan advances every 10s on a timer (not on video end). Hovering
 *  the front card pauses the video and the timer; hovering a side card
 *  offers PICK, and clicking it brings that Reel to the front. */
function FanCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = BRAND_TOP_REELS.length;
  const reel = BRAND_TOP_REELS[index];
  const timerRef = useRef<number | null>(null);
  const deadlineRef = useRef(0);
  const remainingRef = useRef(FAN_SECONDS * 1000);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const go = useCallback(
    (i: number) => {
      remainingRef.current = FAN_SECONDS * 1000;
      deadlineRef.current = Date.now() + FAN_SECONDS * 1000;
      setIndex(((i % total) + total) % total);
    },
    [total]
  );
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    if (reducedMotion()) return;
    if (paused) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      remainingRef.current = Math.max(1500, deadlineRef.current - Date.now());
      return;
    }
    const delay = remainingRef.current;
    deadlineRef.current = Date.now() + delay;
    timerRef.current = window.setTimeout(() => {
      remainingRef.current = FAN_SECONDS * 1000;
      setIndex((i) => (i + 1) % total);
    }, delay);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, paused, total]);

  // A fresh front video must not play while the fan is hover-paused.
  useEffect(() => {
    if (paused) videoRef.current?.pause();
  }, [index, paused]);

  const pauseFront = () => {
    videoRef.current?.pause();
    setPaused(true);
  };
  const resumeFront = () => {
    videoRef.current?.play().catch(() => {});
    setPaused(false);
  };

  return (
    <div className="brand-hero-carousel">
      <div className="brand-fan" role="group" aria-label="Best Reels">
        {BRAND_TOP_REELS.map((r, i) => {
          const offset = ((i - index + Math.floor(total / 2)) % total) - Math.floor(total / 2);
          const abs = Math.abs(offset);
          const style = {
            transform: `translateX(${offset * 62}px) rotate(${offset * 9}deg) translateY(${abs * 10}px) scale(${1 - abs * 0.06})`,
            zIndex: 10 - abs,
          } as React.CSSProperties;
          const media =
            offset === 0 && r.preview && !reducedMotion() ? (
              <video
                ref={videoRef}
                src={r.preview}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
              />
            ) : (
              <img src={r.thumb} alt="" loading="lazy" />
            );
          return offset === 0 ? (
            <a
              key={r.id}
              className="brand-fan-card is-front"
              href={r.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="PLAY"
              aria-label={`${r.title} — ${r.views ?? ""} views`}
              style={style}
              onMouseEnter={pauseFront}
              onMouseLeave={resumeFront}
            >
              {media}
            </a>
          ) : (
            <button
              key={r.id}
              type="button"
              className="brand-fan-card"
              data-cursor="PICK"
              aria-label={`Bring ${r.title} to the front`}
              style={style}
              onClick={() => go(i)}
            >
              {media}
            </button>
          );
        })}
        {BRAND_HERO.stickers.map((s, i) => (
          <span
            key={s.k}
            className={`brand-sticker st-${i}`}
            aria-hidden="true"
          >
            <span className="brand-sticker-k">{s.k}</span>
            <span className="brand-sticker-v">{s.v}</span>
          </span>
        ))}
        <span className="brand-sticker st-this" aria-hidden="true">
          <span className="brand-sticker-k">This Reel · {reel.title}</span>
          <span className="brand-sticker-v is-red">{reel.views}</span>
        </span>
      </div>
      <p className="brand-fan-nav">
        <button type="button" className="is-prev" onClick={prev} aria-label="Previous Reel">
          ←
        </button>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button type="button" className="is-next" onClick={next} aria-label="Next Reel">
          →
        </button>
      </p>
      <p className="brand-fan-caption">{BRAND_HERO.caption}</p>
    </div>
  );
}

/** One Reel's fan inside its case-study article — the video loops in place,
 *  the fan itself is manual (one Reel per article, no arrows or counter). */
function ArticleFan({ reel }: { reel: Reel }) {
  return (
    <div className="brand-article-fan">
      <a
        href={reel.url}
        target="_blank"
        rel="noreferrer"
        className="brand-article-fan-card is-front"
        data-cursor="PLAY"
        aria-label={`${reel.title} — ${reel.views} views`}
      >
        {reel.preview && !reducedMotion() ? (
          <video src={reel.preview} muted loop playsInline autoPlay preload="metadata" />
        ) : (
          <img src={reel.thumb} alt="" loading="lazy" />
        )}
      </a>
      <p className="brand-article-fan-caption">
        <b>{reel.title}</b>
      </p>
      <p className="brand-article-fan-pills">
        <span>{reel.views} views</span>
        <a href={reel.url} target="_blank" rel="noreferrer">
          Instagram ↗
        </a>
      </p>
    </div>
  );
}

const MONTHS = ["this month", "next month", "we're flexible"] as const;
const PRODUCT_EXAMPLE = "an AI coding tool";
const AUDIENCE_EXAMPLE = "developers in India";

/** One reach card — the reference's behavior: the poster clip plays muted on hover
 *  and pauses (frozen) on leave; the whole card links the IG Reel in a
 *  new tab. Poster-only reels (no preview clip) show the still. */
function ReachCard({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  return (
    <a
      className="brand-reach-card"
      href={reel.url}
      target="_blank"
      rel="noreferrer"
      data-cursor="▶ PLAY"
      aria-label={`${reel.title} — ${reel.views} views`}
      onMouseEnter={() => void videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      <span className="brand-reach-poster">
        {reel.preview ? (
          <video
            ref={videoRef}
            src={reel.preview}
            poster={reel.thumb}
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <img src={reel.thumb} alt="" loading="lazy" />
        )}
      </span>
      <span className="brand-reach-line">
        <span className="brand-reach-line-title">▶ {reel.title}</span>
        <span className="brand-reach-line-views">{reel.views}</span>
      </span>
    </a>
  );
}

export default function Brand() {
  const [view, setView] = useState<"human" | "agent">("human");
  const [headerHidden, setHeaderHidden] = useState(false);
  // World transition (the reference's mechanism): arriving from the homepage, the
  // full-screen seascape scene is already covering; it morphs into the hero.
  const [showTransition] = useState(() => shouldShowWorldTransition());
  const [product, setProduct] = useState(PRODUCT_EXAMPLE);
  const [audience, setAudience] = useState(AUDIENCE_EXAMPLE);
  const [month, setMonth] = useState<(typeof MONTHS)[number]>("this month");
  // Numbers count up per block, each when that block itself scrolls in.
  const [leftRef, leftIn] = useInViewOnce<HTMLDivElement>();
  const [rightRef, rightIn] = useInViewOnce<HTMLDivElement>();
  const [derivedRef, derivedIn] = useInViewOnce<HTMLDivElement>();
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

  // Scroll zoom (the reference's --hero-p): the seascape inside the hero grows to 1.3x
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

  const brief = `We're launching ${product} for ${audience}, and want it live ${month}.`;
  const sendBrief = () => {
    const subject = encodeURIComponent(`Brand campaign: ${product || "new launch"}`);
    const body = encodeURIComponent(`${brief}\n\n— via rishabhsharma.in/brands`);
    window.location.href = `mailto:${BRAND_CTA_EMAIL}?subject=${subject}&body=${body}`;
  };
  const aiPrompt = encodeURIComponent(
    `Read https://portfolio-hero-psi-lemon.vercel.app/llms.txt and https://portfolio-hero-psi-lemon.vercel.app/brands. ${brief} Would Rishabh Sharma be a good fit to make a Reel about it, and what kind of build would work? Then draft a short message I can email him at ${BRAND_CTA_EMAIL}.`
  );

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
                  style={{ "--world": w.color, "--world-on": w.text } as React.CSSProperties}
                  href={w.href}
                  {...(w.id === "brand" ? { "aria-current": "page" } : {})}
                  onMouseEnter={() => preloadWorldScene(WORLD_SCENES[w.id].scene)}
                  onClick={(e) => {
                    if (w.id === "brand") return;
                    e.preventDefault();
                    openWorldTransition(w.href, w.id);
                  }}
                >
                  {w.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
        <div className="mode-switch" data-mode={view} role="group" aria-label="View this page as" style={{ "--world": "#EF3B2D" } as React.CSSProperties}>
          <span className="mode-option">
            <button type="button" aria-pressed={view === "human"} onClick={() => { setView("human"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              Human
            </button>
          </span>
          <span className="mode-option">
            <span className="mode-slash" aria-hidden="true">
              /
            </span>
            <button type="button" aria-pressed={view === "agent"} onClick={() => { if (view !== "agent") openAgentTransition(() => setView("agent")); }} onMouseEnter={() => preloadWorldScene("/sky-agent.jpg")}>
              Agent
            </button>
          </span>
        </div>
      </header>

      <main>
        {view === "human" ? (
          <>
        {/* hero — seascape panel + best-Reels fan (the reference's media-kit hero) */}
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

        {/* case studies — one article per top Reel, his own numbers */}
        <section className="section" id="selected-work" aria-label="Selected work">
          <h2 className="section-title">What they wanted, what I made, what happened.</h2>
          <p className="section-body">
            Every Reel below is something I built and filmed myself — no client briefs yet, no
            staged demos. Each one dealt as a hand of cards, with its numbers from @editsbyhx.
          </p>
          <div className="brand-articles">
            {BRAND_WORK.map(({ reel, wanted, made, pills }) => (
              <article key={reel.id} className="brand-article" id={reel.id}>
                <div className="brand-article-top">
                  <img src={reel.thumb} alt="" loading="lazy" className="brand-article-logo" />
                  <h3 className="brand-article-title">
                    <span>{reel.title}</span>
                  </h3>
                </div>
                <div className="brand-article-cols">
                  <div>
                    <p className="brand-article-label">They wanted</p>
                    <p className="brand-article-serif">{wanted}</p>
                  </div>
                  <div>
                    <p className="brand-article-label">I made</p>
                    <p className="brand-article-serif">{made}</p>
                    <p className="brand-article-pills">
                      {pills.map((p) => (
                        <span key={p} className="brand-pill">
                          {p}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div>
                    <p className="brand-article-label">What happened</p>
                    <div className="brand-article-big">
                      <BrandStat value={reel.viewsRaw ?? 0} label="views" />
                    </div>
                    <p className="brand-article-sub">Views · 1 Reel</p>
                  </div>
                </div>
                <ArticleFan reel={reel} />
              </article>
            ))}
          </div>
        </section>

        {/* numbers */}
        <section className="section brand-numbers" id="numbers" aria-label="The numbers">
          <div className="brand-numbers-head">
            <h2 className="section-title">The numbers</h2>
            <p className="brand-numbers-note">{BRAND_NUMBERS.note}</p>
          </div>
          <div className="brand-panels">
            <div className="brand-panel brand-panel-dark" ref={leftRef}>
              <p className="brand-panel-label">{BRAND_NUMBERS.left.label}</p>
              <ul className="brand-panel-rows">
                {BRAND_NUMBERS.left.rows.map((r) => (
                  <li key={r.label}>
                    <span>{r.label}</span>
                    <b className={r.highlight ? "is-highlight" : undefined}>
                      <CountUp value={r.value} start={leftIn} />
                    </b>
                  </li>
                ))}
              </ul>
            </div>
            <div className="brand-panel brand-panel-light" ref={rightRef}>
              <p className="brand-panel-label">{BRAND_NUMBERS.right.label}</p>
              <p className="brand-panel-sub">{BRAND_NUMBERS.right.sub}</p>
              <ul className="brand-panel-rows">
                {BRAND_NUMBERS.right.rows.map((r) => (
                  <li key={r.label}>
                    <span>{r.label}</span>
                    <b>
                      <CountUp value={r.value} start={rightIn} />
                    </b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="brand-derived" ref={derivedRef}>
            {BRAND_NUMBERS.derived.map((d) => (
              <div key={d.label} className="brand-derived-cell">
                <b>
                  <CountUp value={d.value} start={derivedIn} decimals={d.decimals} suffix={d.suffix} />
                </b>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* who watches */}
        <section className="section" id="audience" aria-label="Who watches">
          <p className="section-label">Who watches</p>
          <h2 className="section-title">{BRAND_AUDIENCE.intro}</h2>
          <div className="brand-pills">
            {BRAND_AUDIENCE.pills.map((p) => (
              <span key={p} className="brand-pill">
                {p}
              </span>
            ))}
          </div>
        </section>

        {/* reach — heading above the banner, three straight poster cards
          * on the seascape. Likes/shares pills are NOT rendered: no verified
          * likes/shares figures exist for these Reels (views only). */}
        <section className="section" aria-label="For a sense of reach">
          <div className="brand-reach-head">
            <h2 className="section-title">For a sense of reach</h2>
            <p className="brand-reach-note">
              My three most watched Reels of the last 6 months.
              <br />
              @editsbyhx
            </p>
          </div>
          <div className="brand-reach-banner">
            {BRAND_WORK.slice(0, 3).map(({ reel }) => (
              <ReachCard key={reel.id} reel={reel} />
            ))}
          </div>
        </section>

        {/* formats + how it works */}
        <section className="section" id="formats" aria-label="Formats and how it works">
          <div className="brand-split">
            <div>
              <h2 className="section-title">Formats</h2>
              <ul className="brand-rows brand-rows-formats">
                {BRAND_FORMATS.map((f) => (
                  <li key={f.title}>
                    <h3>
                      <span>{f.title}</span>
                    </h3>
                    <p>{f.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="section-title">How it works</h2>
              <ol className="brand-rows brand-rows-steps">
                {BRAND_STEPS.map((s) => (
                  <li key={s.n}>
                    <span className="brand-step-n">{s.n}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* included + rates */}
        <section className="section" id="included" aria-label="Included and rates">
          <div className="brand-split">
            <div>
              <h2 className="section-title">Included as standard</h2>
              <ul className="brand-checks">
                {BRAND_INCLUDED.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                    <span className="brand-tag brand-tag-included">Included</span>
                  </li>
                ))}
                {BRAND_NEGOTIABLE.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                    <span className="brand-tag brand-tag-negotiable">Negotiable</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="brand-rates-card">
              <h2 className="section-title">Rates</h2>
              <p className="section-body">{BRAND_RATES}</p>
              <p>
                <a className="brand-rates-ask" href={BRAND_HERO.ratesHref}>
                  Ask for rates ↗
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* campaign CTA */}
        <section className="section" id="campaign" aria-label="Start a campaign">
          <div className="brand-cta">
            <div className="brand-cta-card">
              <h2 className="section-label">Start a campaign</h2>
              <p className="brand-cta-sentence">
                We&rsquo;re launching{" "}
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  aria-label="What are you launching?"
                  style={{ "--chars": Math.max(product.length, 1) + 1 } as React.CSSProperties}
                />{" "}
                for{" "}
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  aria-label="Who is it for?"
                  style={{ "--chars": Math.max(audience.length, 1) + 1 } as React.CSSProperties}
                />
                , and want it live{" "}
                <span className="brand-months" role="radiogroup" aria-label="When">
                  {MONTHS.map((m, i) => (
                    <span key={m}>
                      {i > 0 && (
                        <span className="brand-slash" aria-hidden="true">
                          {" / "}
                        </span>
                      )}
                      <button
                        type="button"
                        role="radio"
                        aria-checked={month === m}
                        className={`brand-month${month === m ? " is-selected" : ""}`}
                        onClick={() => setMonth(m)}
                      >
                        {m}
                      </button>
                    </span>
                  ))}
                </span>
                .
              </p>
              <div className="brand-cta-foot">
                <p className="brand-cta-note">
                  Goes to {BRAND_CTA_EMAIL}. Rishabh replies himself.
                </p>
                <div className="brand-cta-actions">
                  <a
                    className="brand-ai"
                    href={`https://claude.ai/new?q=${aiPrompt}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ask Claude about this brief"
                  >
                    <AiIcon path={CLAUDE_PATH} />
                  </a>
                  <a
                    className="brand-ai"
                    href={`https://chatgpt.com/?q=${aiPrompt}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ask ChatGPT about this brief"
                  >
                    <AiIcon path={CHATGPT_PATH} />
                  </a>
                  <button type="button" className="brand-send" onClick={sendBrief}>
                    Send to Rishabh ↗
                  </button>
                </div>
              </div>
            </div>
            <p className="brand-cta-below">
              Prefer email? <a href={`mailto:${BRAND_CTA_EMAIL}`}>{BRAND_CTA_EMAIL}</a> · Based in
              India, working with brands anywhere · All brand content is on{" "}
              <a href="/brands/">/brands</a>
            </p>
          </div>
        </section>
      </>
        ) : (
          <AgentView />
        )}
      </main>

      {view === "human" && (
      <footer className="site-footer build-footer">
        <span>© 2026 Rishabh Sharma</span>
        <nav aria-label="Footer">
          <a href="https://www.instagram.com/editsbyhx">Instagram</a>
          <a href="https://www.youtube.com/@UntoldHx">YouTube</a>
          <a href="https://www.linkedin.com/in/rishabh-sharma-342575438/">LinkedIn</a>
          <a href="https://github.com/r1shabhsharma05">GitHub</a>
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href="/privacy">Privacy</a>
          <a href="/developers">Developers</a>
        </nav>
      </footer>
      )}
    </div>
  );
}
