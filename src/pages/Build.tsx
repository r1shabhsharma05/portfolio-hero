import { useEffect, useMemo, useRef, useState } from "react";
import ChatModal from "../components/ChatModal";
import CursorLabel from "../components/CursorLabel";
import LiquidGlassCarousel, {
  type LiquidGlassCarouselItem,
} from "../components/LiquidGlassCarousel";
import ReelCard from "../components/ReelCard";
import SkillSphere from "../components/SkillSphere";
import {
  revealWorldTransition,
  shouldShowWorldTransition,
  WORLD_NAME,
  WORLD_SCENE,
} from "../components/WorldTransition";
import { PROFILE, PROJECTS, REELS, STATS } from "../data/site";

const WORLDS = [
  {
    id: "build",
    label: "Build",
    color: "#2F55FF",
    text: "#ffffff",
    href: "/projects/",
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
  images?: string[];
  live?: string;
  repo?: string;
  stats: { value: string; label: string }[];
  tags: string[];
};

const SHIPPED: ShipItem[] = [
  {
    ...PROJECTS[0],
    period: "2026 · Solo",
    images: [
      "/projects/secureguard.jpg",
      "/projects/secureguard-landing.jpg",
      "/projects/secureguard-dashboard.jpg",
    ],
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
      { value: "457", label: "backend tests passing" },
      { value: "12", label: "stages live" },
    ],
    tags: ["React", "Node.js", "Supabase", "Razorpay"],
  },
  {
    ...PROJECTS[2],
    period: "2026",
    stats: [{ value: "4", label: "PRs merged upstream" }],
    tags: ["Python", "CP-SAT"],
  },
  {
    ...PROJECTS[5],
    period: "2026",
    stats: [],
    tags: [],
  },
  {
    ...PROJECTS[4],
    period: "2026 · Solo",
    stats: [
      { value: "6", label: "live listings" },
      { value: "3", label: "upstream PRs merged" },
    ],
    tags: ["React", "Node.js", "MongoDB"],
  },
];

const BUILT = [
  { ...PROJECTS[2], role: "Solo", tags: ["Python"] },
  { ...PROJECTS[4], role: "Solo", tags: ["React", "Node.js", "MongoDB"] },
  { ...PROJECTS[5], role: "Solo", tags: [] as string[] },
  { ...PROJECTS[6], role: "Solo", tags: [] as string[] },
  { ...PROJECTS[0], role: "Solo", tags: ["React", "TypeScript", "Prisma", "Supabase"] },
  { ...PROJECTS[3], role: "Solo", tags: ["React", "Node.js", "Supabase", "Razorpay"] },
];

/** Measured image aspect (w/h) per Built-myself screenshot. */
const BUILT_ASPECT: Record<string, number> = {
  "/projects/railsync.jpg": 1600 / 900,
  "/projects/localkart.jpg": 1536 / 1024,
  "/projects/healthcare.jpg": 1536 / 1024,
  "/projects/morphai.jpg": 1536 / 1024,
  "/projects/secureguard.jpg": 1600 / 900,
  "/projects/farmer.jpg": 1600 / 900,
};

const BUILT_ITEMS: LiquidGlassCarouselItem[] = BUILT.map((b) => ({
  src: b.image,
  title: b.name,
  aspect: BUILT_ASPECT[b.image] ?? 16 / 9,
}));

const WORKED_AT = [PROJECTS[0], PROJECTS[1], PROJECTS[3]].map((p) => ({
  name: p.name,
  live: p.live ?? "",
}));

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
        top: ((i * 29 + 12) % 70) + 8,
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
            top: `${p.top}%`,
            width: p.size,
            height: p.size * 0.7,
          }}
        />
      ))}
    </div>
  );
}

const CLAUDE_PATH =
  "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";
const CHATGPT_PATH =
  "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";

function AiIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const BRIEF_WHEN = ["in 8 weeks", "in 3 months", "when it's right"];
const WHAT_PH = "an app for my business";
const WHO_PH = "my customers";

/** Sentence brief (Avi's form, Rishabh's details): the visitor fills the
 *  blanks, picks a timeline, and Send opens a pre-filled email to him. The
 *  round buttons hand the same brief to Claude / ChatGPT to draft it. */
function BriefForm() {
  const [what, setWhat] = useState("");
  const [who, setWho] = useState("");
  const [when, setWhen] = useState(0);

  const whatText = what.trim() || WHAT_PH;
  const whoText = who.trim() || WHO_PH;
  const sentence = `I'm building ${whatText} for ${whoText}, and I need it ${BRIEF_WHEN[when]}.`;
  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    `Building ${whatText}`
  )}&body=${encodeURIComponent(`Hi Rishabh,\n\n${sentence}\n\n`)}`;
  const aiPrompt = encodeURIComponent(
    `Read https://portfolio-hero-psi-lemon.vercel.app/llms.txt and https://portfolio-hero-psi-lemon.vercel.app/projects. ${sentence} Could Rishabh Sharma build it? Tell me what he has shipped that is closest. Then draft a short message I can email him at ${PROFILE.email}.`
  );

  const blank = (
    value: string,
    set: (v: string) => void,
    ph: string,
    label: string
  ) => (
    <input
      className="brief-blank"
      value={value}
      onChange={(e) => set(e.target.value)}
      placeholder={ph}
      aria-label={label}
      style={
        { "--chars": Math.max(value.length, ph.length) + 1 } as React.CSSProperties
      }
    />
  );

  return (
    <form
      className="brief-form"
      id="brief"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
    >
      <span className="brief-kicker">Tell me what you&apos;re making</span>
      <p className="brief-line">
        I&apos;m building {blank(what, setWhat, WHAT_PH, "What you're building")}{" "}
        for {blank(who, setWho, WHO_PH, "Who it's for")}, and I need it{" "}
        <span className="brief-when" role="radiogroup" aria-label="When">
          {BRIEF_WHEN.map((w, i) => (
            <span key={w}>
              {i > 0 && (
                <span className="brief-slash" aria-hidden="true">
                  {" / "}
                </span>
              )}
              <button
                type="button"
                role="radio"
                aria-checked={when === i}
                onClick={() => setWhen(i)}
              >
                {w}
              </button>
            </span>
          ))}
        </span>
        .
      </p>
      <div className="brief-foot">
        <span className="brief-kicker">
          Goes to {PROFILE.email}. Rishabh replies himself.
        </span>
        <div className="brief-actions">
          <a
            className="brief-ghost"
            href={`https://claude.ai/new?q=${aiPrompt}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask Claude about this brief"
          >
            <AiIcon path={CLAUDE_PATH} />
          </a>
          <a
            className="brief-ghost"
            href={`https://chatgpt.com/?q=${aiPrompt}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask ChatGPT about this brief"
          >
            <AiIcon path={CHATGPT_PATH} />
          </a>
          <button type="submit" className="brief-send">
            Send to Rishabh ↗
          </button>
        </div>
      </div>
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
        {item.stats.length > 0 && (
          <div className="ship-stats">
            {item.stats.map((s) => (
              <BuildStat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        )}
        {item.tags.length > 0 && (
          <ul className="ship-tags">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <p className="card-links">
          {item.live && (
            <a
              className="ship-link"
              href={item.live}
              target="_blank"
              rel="noreferrer"
            >
              Live ↗
            </a>
          )}
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
        </p>
      </div>
      <SlideShow images={item.images ?? [item.image]} url={item.live ?? item.repo ?? ""} alt={item.name} />
    </article>
  );
}

export default function Build() {
  const [chatOpen, setChatOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  // World transition (Avi's mechanism): arriving from the homepage, the
  // full-screen sky scene is already covering; it morphs into the hero.
  const [showTransition] = useState(() => shouldShowWorldTransition());
  const [builtActive, setBuiltActive] = useState(0);
  useEffect(() => {
    if (!showTransition) return;
    const cleanup = revealWorldTransition();
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

  // Scroll zoom (Avi's --hero-p): the sky inside the hero grows to 1.3x and
  // sinks 22% as the hero scrolls out; a paper veil fades in over it.
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

  return (
    <div className="build-page">
      <CursorLabel />
      {showTransition && (
        <div
          className="world-transition is-covered"
          aria-hidden="true"
          style={{ "--scene": `url("${WORLD_SCENE}")` } as React.CSSProperties}
        >
          <div className="world-transition-scene">
            <span className="world-transition-name">
              <span>{WORLD_NAME}.</span>
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
        <section
          className="build-hero"
          id="brief"
          aria-label="Build"
          data-world-hero
        >
          <Petals />
          <div className="build-hero-copy">
            <p className="build-eyebrow">Build — Products for founders</p>
            <h1>
              I take ideas from zero to a product{" "}
              <span className="build-underline">people use.</span>
            </h1>
            <p>
              Full-stack developer and AI builder studying Computer Science
              at GLA University, Mathura. Seven products shipped — safety,
              security, farming, campus, health, railways and AI tooling.
              Everything here is built, not claimed.
            </p>
          </div>
          <BriefForm />
        </section>

        <section className="build-worked" aria-label="Worked at">
          <p className="section-label">Worked at</p>
          <div className="worked-row">
            {WORKED_AT.map((w) => (
              <a
                key={w.name}
                className="worked-cell"
                href={w.live}
                target="_blank"
                rel="noreferrer"
              >
                <span className="worked-name">{w.name}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="build-stats" aria-label="Numbers">
          {BUILD_STATS.map((s) => (
            <BuildStat key={s.label} value={s.value} label={s.label} />
          ))}
        </section>

        <section className="section build-skills" aria-label="Skills">
          <p className="section-label">Skills</p>
          <h2 className="section-title">What I work with.</h2>
          <p className="section-body">
            The stack behind the seven products — drag the sphere to spin it,
            click a card to bring it to the front.
          </p>
          <div className="skill-sphere">
            <SkillSphere />
          </div>
          <p className="skill-hint">Drag · Scroll · Arrow keys</p>
        </section>

        <section className="section build-shipped" aria-label="Shipped, end to end">
          <p className="section-label">Shipped — end to end</p>
          <h2 className="section-title">Shipped, end to end.</h2>
          <p className="section-body">
            Six products I took from idea to production — designed, built and
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
          <div className="built-carousel">
            <LiquidGlassCarousel
              items={BUILT_ITEMS}
              panelHeight={340}
              background="#f3f3f1"
              onActiveChange={setBuiltActive}
            />
          </div>
          {(() => {
            const b = BUILT[builtActive] ?? BUILT[0];
            if (!b) return null;
            return (
              <div className="built-detail">
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
                <p className="card-links">
                  {b.live && (
                    <a href={b.live} target="_blank" rel="noreferrer">
                      Live ↗
                    </a>
                  )}
                  {b.repo && (
                    <a href={b.repo} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  )}
                </p>
              </div>
            );
          })()}
        </section>

        <section className="section build-experiments" aria-label="Experiments">
          <p className="section-label">Experiments</p>
          <h2 className="section-title">Experiments, for fun</h2>
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
