import { useEffect, useMemo, useState } from "react";
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
import {
  LEARN_GOALS,
  LEARN_POSTS,
  type LearnPostType,
} from "../data/learn";
import { NAV_WORLDS, PROFILE } from "../data/site";

type View = "human" | "agent";
type Filter = "all" | LearnPostType;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Roadmap", label: "Roadmaps" },
  { id: "Prompt", label: "Prompts" },
  { id: "Career", label: "Career" },
  { id: "Business idea series", label: "Business ideas" },
  { id: "Build", label: "Builds" },
  { id: "Voice", label: "Voices" },
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
      Build: 0,
      Voice: 0,
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
                  style={{ "--world": w.color, "--world-on": w.text } as React.CSSProperties}
                  href={w.href}
                  {...(w.id === "learn" ? { "aria-current": "page" } : {})}
                  onMouseEnter={() => preloadWorldScene(WORLD_SCENES[w.id].scene)}
                  onClick={(e) => {
                    if (w.id === "learn") return;
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
              onClick={() => { if (view !== "agent") openAgentTransition(() => setView("agent")); }}
              onMouseEnter={() => preloadWorldScene("/sky-agent.jpg")}
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
                    placeholder={`Search ${LEARN_POSTS.length} posts…`}
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
          <AgentView />
        )}
      </main>

      {view === "human" && (
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
      )}
    </div>
  );
}
