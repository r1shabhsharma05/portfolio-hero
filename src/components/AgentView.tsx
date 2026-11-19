import { useEffect, useRef, useState, type ReactNode } from "react";
import { fillStats, useLiveStats } from "../hooks/useLiveStats";
import {
  HOME_AGENT_CURLS,
  HOME_AGENT_ENDPOINTS,
  HOME_AGENT_READS,
  HOME_PERSONAS,
  PROFILE,
} from "../data/site";

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
export function Petals() {
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
export function DevPortal() {
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
function renderExampleText(text: string, stats: ReturnType<typeof useLiveStats>): ReactNode[] {
  text = fillStats(text, stats);
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
export default function AgentView() {
  const liveStats = useLiveStats();
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
                              <span>{renderExampleText(e.text, liveStats)}</span>
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

    </>
  );
}
