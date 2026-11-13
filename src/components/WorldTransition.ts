// World page transition — Avi's mechanism, adapted for our two-entry app
// (no client-side router, so the cover runs on the homepage and the reveal
// runs on /projects, keyed off document.referrer like the old intro).
//
// Click "Build" -> full-screen sky scene wipes in + "Build." slides up ->
// navigate -> on /projects the scene morphs into the hero sky panel and
// fades out while the hero content fades in. Direct loads show no transition.

export const WORLD_SCENE = "/build-sky.webp";
export const WORLD_NAME = "Build";
export const WORLD_HREF = "/projects/";

const EASE_COVER = "cubic-bezier(.65,0,.35,1)";
const EASE_SOFT = "cubic-bezier(.22,1,.36,1)";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Preload the scene image so the cover is instant (Avi preloads on hover). */
export function preloadWorldScene(): void {
  new Image().src = WORLD_SCENE;
}

/** True when arriving on /projects from the homepage (the transition trigger). */
export function shouldShowWorldTransition(): boolean {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  try {
    const r = new URL(document.referrer);
    return (
      r.origin === window.location.origin &&
      (r.pathname === "/" || r.pathname === "/index.html")
    );
  } catch {
    return false;
  }
}

function inertPage(inert: boolean): HTMLElement[] {
  const els = [
    ...document.querySelectorAll<HTMLElement>(
      "body > header, body > main, body > footer"
    ),
  ];
  els.forEach((el) => {
    el.inert = inert;
  });
  return els;
}

/**
 * Homepage side: cover the screen with the scene + "Build.", then navigate.
 * Escape cancels the cover (no navigation). Reduced motion navigates directly.
 * Returns a cancel function.
 */
export function openWorldTransition(href: string = WORLD_HREF): () => void {
  if (prefersReducedMotion()) {
    window.location.href = href;
    return () => {};
  }
  if (document.querySelector(".world-transition")) return () => {};

  const d = document.createElement("div");
  d.className = "world-transition";
  d.setAttribute("aria-hidden", "true");
  d.style.setProperty("--scene", `url("${WORLD_SCENE}")`);
  const c = document.createElement("div");
  c.className = "world-transition-scene";
  const u = document.createElement("i");
  u.className = "world-transition-light";
  const h = document.createElement("span");
  h.className = "world-transition-name";
  h.innerHTML = `<span>${WORLD_NAME}.</span>`;
  c.appendChild(h);
  d.appendChild(c);
  d.appendChild(u);
  document.body.appendChild(d);

  const p = document.createElement("span");
  p.className = "sr-only";
  p.setAttribute("role", "status");
  p.textContent = `Opening ${WORLD_NAME}`;
  document.body.appendChild(p);

  const page = inertPage(true);
  const activeEl = document.activeElement;
  document.documentElement.classList.add("world-transition-active");

  let cancelled = false;
  let navigated = false;
  const cleanup = () => {
    if (cancelled) return;
    cancelled = true;
    d.remove();
    p.remove();
    page.forEach((el) => {
      el.inert = false;
    });
    document.documentElement.classList.remove("world-transition-active");
    window.removeEventListener("keydown", onKey, true);
    window.clearTimeout(safety);
    if (activeEl instanceof HTMLElement && activeEl.isConnected) {
      activeEl.focus({ preventScroll: true });
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cleanup();
    }
  };
  window.addEventListener("keydown", onKey, true);
  const safety = window.setTimeout(cleanup, 8000);

  // Cover: scene wipes in left->right (700ms), light sweeps (820ms),
  // name slides up (700ms, 280ms delay). Navigate once covered.
  const wipe = c.animate(
    [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }],
    { duration: 700, easing: EASE_COVER, fill: "forwards" }
  );
  const light = u.animate(
    [
      { left: "-14%", opacity: 1 },
      { left: "100%", opacity: 1 },
      { left: "100%", opacity: 0 },
    ],
    { duration: 820, easing: EASE_COVER, fill: "forwards" }
  );
  const nameEl = h.firstElementChild as HTMLElement | null;
  const name = nameEl
    ? nameEl.animate(
        [{ transform: "translateY(105%)" }, { transform: "none" }],
        { duration: 700, delay: 280, easing: EASE_SOFT, fill: "forwards" }
      )
    : null;
  name?.finished.catch(() => {});
  Promise.all([wipe.finished, light.finished])
    .then(() => {
      if (!cancelled && !navigated) {
        navigated = true;
        window.location.href = href;
      }
    })
    .catch(() => {});
  return cleanup;
}

/**
 * /projects side: the overlay is already in the DOM in its covered state
 * (rendered by Build.tsx). Morph the scene into the hero sky panel, fade the
 * overlay out, fade the hero content in. Returns a cleanup function.
 */
export function revealWorldTransition(): () => void {
  const d = document.querySelector<HTMLElement>(".world-transition");
  if (!d) return () => {};
  const c = d.querySelector<HTMLElement>(".world-transition-scene");
  const h = d.querySelector<HTMLElement>(".world-transition-name");
  const hero = document.querySelector<HTMLElement>(".build-hero");
  const copy = document.querySelector<HTMLElement>(".build-hero-copy");
  const form = document.querySelector<HTMLElement>(".brief-form");
  const h1 = document.querySelector<HTMLElement>("main h1");

  // No hero to morph into: just fade the overlay out.
  if (!c || !hero) {
    const fade = d.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 380,
      delay: 120,
      easing: EASE_SOFT,
      fill: "forwards",
    });
    fade.finished.then(() => d.remove()).catch(() => {});
    return () => {
      fade.cancel();
      d.remove();
    };
  }

  // Hide the hero content; it fades in after the morph.
  const targets = [copy, form].filter(
    (el): el is HTMLElement => el !== null
  );
  targets.forEach((el) => {
    el.style.opacity = "0";
  });
  window.scrollTo(0, 0);
  const page = inertPage(true);
  document.documentElement.classList.add("world-transition-active");

  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    d.remove();
    targets.forEach((el) => {
      el.style.opacity = "";
    });
    page.forEach((el) => {
      el.inert = false;
    });
    document.documentElement.classList.remove("world-transition-active");
  };

  // Name fades out (260ms).
  const nameAnim = h
    ? h.animate(
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "translateY(-12px)" },
        ],
        { duration: 260, easing: EASE_SOFT, fill: "forwards" }
      )
    : null;

  // Scene morphs from full viewport into the hero sky panel (760ms, 120ms delay).
  const rect = hero.getBoundingClientRect();
  const radius = getComputedStyle(hero).borderTopLeftRadius;
  const morph = c.animate(
    [
      {
        top: "0px",
        left: "0px",
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        borderRadius: "0px",
      },
      {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: radius,
      },
    ],
    { duration: 760, delay: 120, easing: EASE_SOFT, fill: "forwards" }
  );

  // Partway through the morph, fade the hero content in (staggered) and the
  // overlay out; remove everything once the longest animation finishes.
  window.setTimeout(() => {
    if (done) return;
    targets.forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 720,
          delay: 40 + 70 * i,
          easing: EASE_SOFT,
          fill: "backwards",
        }
      );
      el.style.opacity = "";
    });
    const fade = d.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 260,
      easing: EASE_SOFT,
      fill: "forwards",
    });
    Promise.all([
      morph.finished,
      fade.finished,
      ...(nameAnim ? [nameAnim.finished] : []),
    ])
      .then(() => {
        cleanup();
        if (h1) {
          const t = h1.getAttribute("tabindex");
          h1.setAttribute("tabindex", "-1");
          h1.focus({ preventScroll: true });
          h1.addEventListener(
            "blur",
            () => {
              if (t === null) h1.removeAttribute("tabindex");
              else h1.setAttribute("tabindex", t);
            },
            { once: true }
          );
        }
      })
      .catch(() => {});
  }, 439);
  return cleanup;
}
