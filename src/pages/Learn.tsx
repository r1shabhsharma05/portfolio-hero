import { useEffect, useMemo, useState } from "react";
import CursorLabel from "../components/CursorLabel";
import {
  revealWorldTransition,
  shouldShowWorldTransition,
  WORLD_SCENES,
} from "../components/WorldTransition";
import {
  LEARN_GOALS,
  LEARN_PERSONAS,
  LEARN_POSTS,
  type LearnPostType,
} from "../data/learn";
import { NAV_WORLDS, PROFILE } from "../data/site";

type View = "human" | "agent";
type Filter = "all" | LearnPostType;
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

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Roadmap", label: "Roadmaps" },
  { id: "Prompt", label: "Prompts" },
  { id: "Career", label: "Career" },
  { id: "Business idea series", label: "Business ideas" },
];

const DONE_KEY = "learn-done-v1";

function loadDone(): Set<string> {
  try {
    const raw = window.localStorage.getItem(DONE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function postUrl(title: string): string {
  return LEARN_POSTS.find((p) => p.title === title)?.url ?? "/learn/";
}

const LEAVES = [8, 22, 38, 55, 70, 84];

export default function Learn() {
  const [showTransition] = useState(() => shouldShowWorldTransition());
  const [view, setView] = useState<View>("human");
  const [goal, setGoal] = useState(LEARN_GOALS[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [done, setDone] = useState<Set<string>>(() => loadDone());
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [openPersona, setOpenPersona] = useState("student");
  const [ai, setAi] = useState<AiChoice>("claude");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!showTransition) return;
    const cleanup = revealWorldTransition({
      hero: ".learn-hero",
      copy: ".learn-hero-copy",
    });
    return cleanup;
    // Mount-only: the reveal runs once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: LEARN_POSTS.length,
      Roadmap: 0,
      Prompt: 0,
      Career: 0,
      "Case study": 0,
      About: 0,
      "Business idea series": 0,
    };
    for (const p of LEARN_POSTS) c[p.type] += 1;
    return c;
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LEARN_POSTS.filter(
      (p) =>
        (filter === "all" || p.type === filter) &&
        (q === "" || p.title.toLowerCase().includes(q))
    );
  }, [filter, query]);

  const activeGoal =
    LEARN_GOALS.find((g) => g.id === goal) ?? LEARN_GOALS[0];

  const toggleDone = (url: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      try {
        window.localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      } catch {
        /* private mode: the tick just doesn't persist */
      }
      return next;
    });
  };

  const copyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      /* clipboard unavailable: the prompt is visible to copy by hand */
    }
  };

  const heading = query.trim()
    ? `${shown.length} POSTS FOR \u201C${query.trim().toUpperCase()}\u201D`
    : `${shown.length} POSTS`;

  return (
    <div className="learn-page">
      <CursorLabel />
      {showTransition && (
        <div
          className="world-transition is-covered"
          aria-hidden="true"
          style={{ "--scene": `url("${WORLD_SCENES.learn.scene}")` } as React.CSSProperties}
        >
          <div className="world-transition-scene">
            <span className="world-transition-name">
              <span>Learn.</span>
            </span>
          </div>
          <i className="world-transition-light" />
        </div>
      )}
      <header className="site-header">
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
                  {...(w.id === "learn" ? { "aria-current": "page" } : {})}
                >
                  {w.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
        <div
          className="mode-switch"
          data-mode={view}
          role="group"
          aria-label="View this page as"
          style={{ "--world": "#FFC81A" } as React.CSSProperties}
        >
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
            <span className="mode-slash" aria-hidden="true">
              /
            </span>
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
            <section className="learn-hero">
              {LEAVES.map((left, i) => (
                <i
                  key={left}
                  className="world-transition-leaf"
                  style={{
                    left: `${left}%`,
                    animationDelay: `${i * 0.35}s`,
                    background: i % 2 ? "#e63b2e" : "#ffc81a",
                  }}
                />
              ))}
              <div className="learn-hero-copy">
                <p className="learn-kicker">
                  LEARN · 39 FREE ROADMAPS, PROMPTS AND BUSINESS IDEAS
                </p>
                <h1>Tell me where you&rsquo;re headed.</h1>
                <p className="learn-sub">
                  Pick a goal and the roadmaps line up in order. Tick each
                  one off as you go; your place is saved in this browser.
                </p>
                <div className="learn-goal-picker">
                  <span className="learn-goal-label">I want to</span>
                  <div
                    className="learn-goals"
                    role="radiogroup"
                    aria-label="Pick a goal"
                  >
                    {LEARN_GOALS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        role="radio"
                        aria-checked={goal === g.id}
                        className={
                          goal === g.id ? "learn-goal is-selected" : "learn-goal"
                        }
                        onClick={() => setGoal(g.id)}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="learn-track" aria-hidden="true">
                  {activeGoal.cards.map((c, i) => (
                    <span
                      key={c.title}
                      className={
                        i === 0 || done.has(postUrl(c.title))
                          ? "learn-node is-done"
                          : "learn-node"
                      }
                    />
                  ))}
                </div>
                <div className="learn-roadmap-cards">
                  {activeGoal.cards.map((c) => (
                    <a
                      key={c.title}
                      className="learn-roadmap-card"
                      href={postUrl(c.title)}
                      data-cursor="OPEN"
                    >
                      <span className="learn-roadmap-step">{c.step}</span>
                      <span className="learn-roadmap-title">{c.title}</span>
                      <span className="learn-roadmap-kind">
                        {c.kind === "Roadmap"
                          ? "ROADMAP · FREE"
                          : c.kind === "Career"
                            ? "CAREER · FREE"
                            : "BUILD · FREE"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section className="learn-posts" aria-label="All posts">
              <div className="learn-posts-head">
                <h2>{heading}</h2>
                <div
                  className="learn-filters"
                  role="group"
                  aria-label="Filter posts"
                >
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={filter === f.id}
                      className={
                        filter === f.id
                          ? "learn-filter is-selected"
                          : "learn-filter"
                      }
                      onClick={() => setFilter(f.id)}
                    >
                      {f.label} {counts[f.id]}
                    </button>
                  ))}
                </div>
                <label className="learn-search">
                  <span className="sr-only">Search posts</span>
                  <input
                    type="search"
                    value={query}
                    placeholder="Search 39 posts…"
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>
              <div className="learn-posts-layout">
                <ul className="learn-list">
                  {shown.map((p) => {
                    const isDone = done.has(p.url);
                    return (
                      <li key={p.url} className="learn-row">
                        <a
                          className="learn-row-link"
                          href={p.url}
                          data-cursor="READ"
                          onMouseEnter={() => setActiveRow(p.url)}
                        >
                          <span className="learn-row-date">{p.date}</span>
                          <span className="learn-row-type">{p.type}</span>
                          <span
                            className={
                              activeRow === p.url
                                ? "learn-title is-active"
                                : "learn-title"
                            }
                          >
                            {p.title}
                          </span>
                          {p.hasReel && (
                            <span
                              className="learn-row-reel"
                              aria-label="Has a reel"
                            >
                              ▶
                            </span>
                          )}
                        </a>
                        <button
                          type="button"
                          className={
                            isDone ? "learn-done is-done" : "learn-done"
                          }
                          onClick={() => toggleDone(p.url)}
                          aria-pressed={isDone}
                        >
                          {isDone ? "DONE ✓" : "MARK DONE ✓"}
                        </button>
                      </li>
                    );
                  })}
                  {shown.length === 0 && (
                    <li className="learn-empty">No posts match.</li>
                  )}
                </ul>
                <aside className="learn-panel" aria-label="Featured reel">
                  <video
                    src="/reels/kalyani-lyric-preview.mp4"
                    poster="/reels/kalyani-lyric.webp"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                  <p className="learn-panel-caption">
                    Kalyani — Lyric video · 5,000 views
                  </p>
                </aside>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="learn-hero learn-hero-agent">
              <div className="learn-hero-copy">
                <p className="learn-kicker">
                  LEARN · FOR AGENTS
                </p>
                <h1>Ask your AI about Rishabh.</h1>
                <p className="learn-sub">
                  Pick who you are. You send one prompt, your AI reads this
                  site, and you get an answer written for you.
                </p>
              </div>
            </section>

            <section className="learn-personas" aria-label="Who are you?">
              {LEARN_PERSONAS.map((persona) => {
                const open = persona.id === openPersona;
                const reads =
                  persona.id === "student"
                    ? [
                        "/llms.txt",
                        "/learn/",
                        "/learn/518-javascript-interview-questions/",
                      ]
                    : ["/llms.txt", "/learn/"];
                return (
                  <div
                    key={persona.id}
                    className={
                      open ? "learn-persona is-open" : "learn-persona"
                    }
                  >
                    <button
                      type="button"
                      className="learn-persona-head"
                      aria-expanded={open}
                      onClick={() =>
                        setOpenPersona(open ? "" : persona.id)
                      }
                    >
                      <span className="learn-persona-num">{persona.num}</span>
                      <span className="learn-persona-name">
                        {persona.name}
                      </span>
                      <span className="learn-persona-toggle" aria-hidden="true">
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open && (
                      <div className="learn-persona-body">
                        <p className="learn-agent-step">1 · THE PROMPT</p>
                        <p className="learn-agent-prompt">{persona.prompt}</p>
                        <button
                          type="button"
                          className="learn-copy"
                          onClick={() => copyPrompt(persona.id, persona.prompt)}
                        >
                          {copied === persona.id ? "Copied ✓" : "Copy prompt"}
                        </button>
                        <p className="learn-agent-step">2 · YOUR AI READS</p>
                        <ul className="learn-reads">
                          {reads.map((r) => (
                            <li key={r}>
                              <a
                                href={
                                  r.startsWith("http")
                                    ? r
                                    : `https://portfolio-hero-psi-lemon.vercel.app${r}`
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                {r}
                              </a>
                            </li>
                          ))}
                        </ul>
                        <p className="learn-agent-step">3 · ASK YOUR AI</p>
                        <div
                          className="learn-ai-choices"
                          role="group"
                          aria-label="Choose your AI"
                        >
                          {(Object.keys(AI_URLS) as AiChoice[]).map((k) => (
                            <button
                              key={k}
                              type="button"
                              aria-pressed={ai === k}
                              className={
                                ai === k
                                  ? "learn-ai-choice is-selected"
                                  : "learn-ai-choice"
                              }
                              onClick={() => setAi(k)}
                            >
                              {AI_LABELS[k]}
                            </button>
                          ))}
                        </div>
                        <a
                          className="learn-ask"
                          href={`${AI_URLS[ai]}${encodeURIComponent(persona.prompt)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ask {AI_LABELS[ai]} ↗
                        </a>
                        {persona.example && (
                          <>
                            <p className="learn-agent-step">
                              EXAMPLE ANSWER
                            </p>
                            <p className="learn-agent-example">
                              {persona.example}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            <section className="learn-dev" aria-label="Plug this site into your agent">
              <h2>Plug this site into your agent.</h2>
              <ul className="learn-endpoints">
                <li>
                  <span className="learn-endpoint-name">READ</span>
                  <a href="/llms.txt">/llms.txt</a>
                  <span>Everything about Rishabh, in one file.</span>
                </li>
                <li>
                  <span className="learn-endpoint-name">LEARN</span>
                  <a href="/learn/">/learn/</a>
                  <span>The roadmaps, prompts and builds.</span>
                </li>
                <li>
                  <span className="learn-endpoint-name">BUILD</span>
                  <a href="/projects/">/projects/</a>
                  <span>The shipped work.</span>
                </li>
                <li>
                  <span className="learn-endpoint-name">ASK</span>
                  <a href="/api/chat">/api/chat</a>
                  <span>Ask the site, get an answer.</span>
                </li>
                <li>
                  <span className="learn-endpoint-name">DISCOVER</span>
                  <a href="/sitemap.xml">/sitemap.xml</a>
                  <span>Every page on this site.</span>
                </li>
              </ul>
              <p className="learn-dev-note">
                No keys. No signup.{" "}
                <a href="/developers">Developer portal ↗</a>
              </p>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer build-footer">
        <span>© 2026 Rishabh Sharma</span>
        <nav aria-label="Footer">
          <a href="https://www.instagram.com/cod.ehx">Instagram</a>
          <a href="https://www.youtube.com/@UntoldHx">YouTube</a>
          <a href="https://www.linkedin.com/in/rishabh-sharma-342575438/">LinkedIn</a>
          <a href="https://github.com/r1shabhsharma05">GitHub</a>
          <a href={`mailto:${PROFILE.email}`}>Email</a>
          <a href="/privacy">Privacy</a>
          <a href="/developers">Developers</a>
        </nav>
      </footer>
    </div>
  );
}
