import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Info } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import ProjectDetail from './ProjectDetail'
import './ProjectCarousel.css'

/**
 * 3D drag & wheel fan carousel — React port of the vanilla-JS demo
 * Rishabh uploaded ("Vanilla JS 3D Drag & Wheel Carousel"). Cards fan out
 * from a bottom pivot; wheel, drag, click-a-card, arrows and keyboard all
 * move the same `progress` value, and the active card's details live in a
 * panel BELOW the fan (not on the photo — that is what killed the text
 * overlap of the old timed-cards carousel).
 *
 * Adapted for the portfolio (the demo is a fullscreen page takeover):
 *  - the stage is a bounded block inside the Projects section, not 100vh;
 *    card sizes are fixed per breakpoint instead of the demo's vw clamps
 *  - the demo's white background becomes the portfolio's dark stage, its
 *    unloaded 'Orelo' font becomes Anton + Inter, its gold nothing
 *    becomes the portfolio's lime in the details panel
 *  - CARDS ARE UNIFORM 16:9 AGAIN (Rishabh's order 2026-11-10 — mixed
 *    ratios "acha nhi lga rha", all cards identical): the per-photo
 *    ratio fit (push #8) is reverted; every card is 360x203 desktop /
 *    300x169 tablet / 240x135 mobile. The fan motion math is unchanged.
 *  - PHOTOS FILL THE CARD (Rishabh's order 2026-11-10 — "image fill
 *    honi chaiye card me, space na bache"): object-fit: cover, no blurred
 *    fill behind. 16:9 photos (SecureGaurd, RailSync, the new Farmer
 *    Marketplace image) fill exactly with zero crop; the 3:2 photos
 *    (SafeLife, LocalKart, Healthcare Hub, MorphAI) fill too, losing a
 *    slim band top and bottom (~8%). The full photo is still visible on
 *    the detail page (object-fit: contain there).
 *  - the demo's own ring-and-dot cursor is NOT ported — the portfolio
 *    already has the WaterCursor; two cursors would fight
 *  - WHEEL IS FOCUS-GATED (bug found 2026-11-10 by live check, proven by
 *    local probe repro-details-drift.js): the demo binds wheel to the
 *    whole document and this port scoped it to the stage — but scrolling
 *    the PAGE with the cursor over the stage still hijacked the scroll
 *    (preventDefault) and moved the fan, so the fan drifted away from the
 *    project the user was looking at and Details opened the drifted
 *    project (wrong project, different each time — never a stale Details
 *    button; the probe went LocalKart 05/07 -> wheel-up over the stage
 *    -> RailSync 03/07 -> Details opened RailSync). Wheel now moves the
 *    fan only while the stage (or a card in it) has focus — click a card
 *    or tab into the fan first; otherwise the wheel scrolls the page and
 *    the fan stays put. Drag, click, arrows and keyboard are unchanged
 *    (keyboard already needed focus).
 *  - the Details button reads the fan's current project from a ref
 *    (activeIndexRef, updated in setProgress) instead of the render
 *    closure, so it can never open a stale project even if a re-render
 *    is still pending when it is clicked
 *  - the demo's click math (progress = i/len*100 + 10) lands one short on
 *    7 items; click-to-focus uses progress = i/(n-1)*100 instead
 *  - AUTOPLAY + SMOOTH GLIDE (Rishabh's order 2026-11-10 — "project
 *    section me smoothness nhi h... carousel chalte rehne chaiye, 1 time
 *    ho uske bad next apne aap dikhe"): the fan advances on its own
 *    every 7s (the old timed-cards carousel's interval), looping back to
 *    the first card after the last. It pauses while the user hovers the
 *    section, focuses the fan, drags, has the detail page open, or the
 *    tab is hidden — and every manual move buys a full 7s dwell before
 *    the next automatic step. The card glide is 1.1s on a soft ease
 *    (was 0.8s on the demo's snappy curve) and the details panel fades
 *    in over 0.7s, so nothing jumps. No autoplay for reduced-motion
 *    users — the fan stays manual for them.
 *  - prefers-reduced-motion: the fan still works, but cards jump cut
 *    (no 0.8s transition) and the details panel does not animate in
 *
 * Detail page: the panel under the fan has three buttons — Details opens
 * a full-screen project page (ProjectDetail.jsx), Live Demo and GitHub
 * open the project's links in a new tab. The page updates the URL to
 * ?project=<slug> (history API, no router), so it is deep-linkable and
 * the browser back button closes it; ESC closes it too.
 */

const SPEED_WHEEL = 0.02
const SPEED_DRAG = -0.1
// Autoplay interval — 7s, the old timed-cards carousel's interval.
const AUTOPLAY_MS = 7000
const CLICK_SLOP_PX = 6
// Float guard (bug found 2026-11-10 by live probe): (1/6)*100 is
// 16.666666666666664, and 16.666666666666664/100*6 is 0.9999999999999999,
// NOT 1 — a bare Math.floor strands the fan on the current card, so the
// arrows and clicks to cards 1/2/5 silently did nothing. The 1e-9 nudge
// crosses only the float error, never a real step boundary.

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default function ProjectCarousel({ items }) {
  const n = items.length
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const progressRef = useRef(0)
  // The fan's current project as a ref (updated in setProgress alongside
  // the state) — the Details button reads this, never a render closure.
  const activeIndexRef = useRef(0)
  // Wheel moves the fan only while the stage (or a card in it) has focus
  // — see the focus-gating note in the header comment.
  const stageFocusedRef = useRef(false)
  const dragRef = useRef(null)
  const lastDragMovedRef = useRef(0)
  const lastDragEndRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [detailIndex, setDetailIndex] = useState(null)
  const detailPushedRef = useRef(false)

  // Autoplay pause reasons — the fan only advances on its own while NOBODY
  // is using it: hovering the section, focus inside the fan, a drag in
  // progress, the detail page open, or the tab hidden. Any one reason
  // pauses; the timer restarts from a full AUTOPLAY_MS when the last
  // reason clears.
  const pauseReasonsRef = useRef(new Set())
  const [autoPaused, setAutoPaused] = useState(false)
  const setPauseReason = useCallback((reason, on) => {
    const reasons = pauseReasonsRef.current
    if (on) reasons.add(reason)
    else reasons.delete(reason)
    setAutoPaused(reasons.size > 0)
  }, [])
  // No autoplay for reduced-motion users — the fan stays manual for them.
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  /* Detail page (?project=<slug>): open/close + back-button support. */
  const openDetail = useCallback(
    (index) => {
      setDetailIndex(index)
      const slug = slugify(items[index].name)
      if (new URLSearchParams(window.location.search).get('project') !== slug) {
        window.history.pushState(null, '', `?project=${slug}`)
        detailPushedRef.current = true
      }
    },
    [items],
  )

  const closeDetail = useCallback(() => {
    if (detailPushedRef.current) {
      // The back button (via popstate below) does the actual close.
      detailPushedRef.current = false
      window.history.back()
    } else {
      setDetailIndex(null)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const navigateDetail = useCallback(
    (index) => {
      if (index < 0 || index >= n) return
      setDetailIndex(index)
      window.history.replaceState(null, '', `?project=${slugify(items[index].name)}`)
    },
    [items, n],
  )

  /* Deep link on load (?project=slug) + back/forward navigation. */
  useEffect(() => {
    const readParam = () => {
      const slug = new URLSearchParams(window.location.search).get('project')
      if (!slug) return null
      const idx = items.findIndex((item) => slugify(item.name) === slug)
      return idx === -1 ? null : idx
    }
    const initial = readParam()
    if (initial !== null) setDetailIndex(initial)
    const onPopState = () => {
      detailPushedRef.current = false
      setDetailIndex(readParam())
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [items])

  /* Lock page scroll while the detail page is open. */
  useEffect(() => {
    if (detailIndex === null) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [detailIndex])

  /* Autoplay pauses while the detail page is open, and while the tab is
     hidden (a hidden tab must not burn through the queue). */
  useEffect(() => {
    setPauseReason('detail', detailIndex !== null)
  }, [detailIndex, setPauseReason])

  useEffect(() => {
    const onVisibility = () => setPauseReason('hidden', document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [setPauseReason])

  const applyProgress = useCallback(() => {
    const active = Math.floor((progressRef.current / 100) * (n - 1) + 1e-9)
    items.forEach((_, index) => {
      const el = cardRefs.current[index]
      if (!el) return
      const zIndex = index === active ? n : n - Math.abs(active - index)
      el.style.setProperty('--zIndex', zIndex)
      el.style.setProperty('--active', (index - active) / n)
    })
    return active
  }, [items, n])

  const setProgress = useCallback(
    (value) => {
      progressRef.current = Math.max(0, Math.min(100, value))
      const active = applyProgress()
      activeIndexRef.current = active
      setActiveIndex((prev) => (prev === active ? prev : active))
    },
    [applyProgress],
  )

  const goTo = useCallback(
    (index) => {
      if (n <= 1) return
      setProgress((index / (n - 1)) * 100)
    },
    [n, setProgress],
  )

  const step = useCallback(
    (dir) => {
      const active = Math.floor((progressRef.current / 100) * (n - 1) + 1e-9)
      goTo(Math.max(0, Math.min(n - 1, active + dir)))
    },
    [goTo, n],
  )

  /* Autoplay: advance to the next project every AUTOPLAY_MS, looping back
     to the first card after the last. The effect re-runs (fresh full
     timer) on every navigation, so a manual click/drag/arrow always buys
     a full AUTOPLAY_MS dwell before the next automatic step. */
  const autoAdvance = useCallback(() => {
    goTo((activeIndexRef.current + 1) % n)
  }, [goTo, n])

  useEffect(() => {
    if (autoPaused || reducedMotion || n <= 1) return undefined
    const id = setInterval(autoAdvance, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [autoPaused, reducedMotion, activeIndex, autoAdvance, n])

  /* Wheel + drag, scoped to the stage (the demo binds them to document).
     Drag uses window-level move/up listeners instead of pointer capture:
     with capture, the click after a drag would retarget to the stage and
     the card's own click would never fire. */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const onWheel = (e) => {
      // Focus-gated (see header): a wheel over an unfocused stage is a
      // page scroll — let it through untouched, so the fan never drifts
      // away from the project the user is looking at.
      if (!stageFocusedRef.current) return
      e.preventDefault()
      setProgress(progressRef.current + e.deltaY * SPEED_WHEEL)
    }
    const onPointerMove = (e) => {
      const drag = dragRef.current
      if (!drag) return
      const dx = e.clientX - drag.x
      drag.moved += Math.abs(dx)
      drag.x = e.clientX
      setProgress(progressRef.current + dx * SPEED_DRAG)
    }
    const onPointerUp = () => {
      // Runs before the click event, so the card's click handler can tell
      // a drag that ended on it apart from a real click. The timestamp
      // bounds the suppression to the drag that just ended: a click
      // without a preceding pointerdown (keyboard Enter, or a synthetic
      // click) must not be killed by a stale distance from an old drag.
      if (dragRef.current) {
        lastDragMovedRef.current = dragRef.current.moved
        lastDragEndRef.current = Date.now()
      }
      dragRef.current = null
      setPauseReason('drag', false)
      stage.classList.remove('is-dragging')
      window.removeEventListener('pointermove', onPointerMove)
    }
    const onPointerDown = (e) => {
      dragRef.current = { x: e.clientX, moved: 0 }
      lastDragMovedRef.current = 0
      setPauseReason('drag', true)
      stage.classList.add('is-dragging')
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp, { once: true })
      window.addEventListener('pointercancel', onPointerUp, { once: true })
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('pointerdown', onPointerDown)
    return () => {
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [setProgress, setPauseReason])

  /* Init: preload photos, then reveal the fan. */
  useEffect(() => {
    let cancelled = false
    applyProgress()
    Promise.all(items.map((item) => loadImage(item.image).catch(() => null))).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [items, applyProgress])

  const onCardClick = (index) => {
    // A drag that ends on a card must not also count as a click on it.
    // (pointerup fires before click, so lastDragMovedRef is already set.)
    // Time-bound: only the drag that JUST ended suppresses the click.
    if (
      lastDragMovedRef.current > CLICK_SLOP_PX &&
      Date.now() - lastDragEndRef.current < 500
    )
      return
    goTo(index)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    }
  }

  const active = items[activeIndex]

  return (
    <div
      className="fan-wrap"
      onMouseEnter={() => setPauseReason('hover', true)}
      onMouseLeave={() => setPauseReason('hover', false)}
    >
      <div
        className="fan-stage"
        ref={stageRef}
        role="region"
        aria-label="Featured projects carousel — drag or use the arrow keys to browse; scrolling moves the fan once it has focus"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => {
          stageFocusedRef.current = true
          setPauseReason('focus', true)
        }}
        onBlur={() => {
          stageFocusedRef.current = false
          setPauseReason('focus', false)
        }}
        style={{ '--items': n, visibility: ready ? 'visible' : 'hidden' }}
      >
        {items.map((item, idx) => (
          <button
            key={item.name}
            ref={(el) => {
              cardRefs.current[idx] = el
            }}
            type="button"
            className={`fan-card${idx === activeIndex ? ' is-active' : ''}`}
            onClick={() => onCardClick(idx)}
            aria-label={`Show ${item.name}`}
            aria-current={idx === activeIndex}
          >
            <span className="fan-card-box">
              <img className="fan-card-img" src={item.image} alt="" draggable={false} />
              <span className="fan-card-num" aria-hidden="true">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="fan-card-title">{item.name}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="fan-footer">
        <div className="fan-details" key={activeIndex}>
          <p className="fan-details-tagline">{active.tagline}</p>
          <h3 className="fan-details-title">{active.name}</h3>
          <p className="fan-details-desc">{active.problem}</p>
          {active.features && active.features.length > 0 && (
            <ul className="fan-details-features">
              {active.features.slice(0, 2).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
          <div className="fan-actions">
            <button
              type="button"
              className="fan-action-btn fan-action-btn-primary"
              onClick={() => openDetail(activeIndexRef.current)}
            >
              <Info size={17} aria-hidden="true" />
              Details
            </button>
            {active.live ? (
              <a
                className="fan-action-btn"
                href={active.live}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} aria-hidden="true" />
                Live Demo
              </a>
            ) : null}
            <a
              className="fan-action-btn"
              href={active.github}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={17} />
              GitHub
            </a>
          </div>
        </div>

        <div className="fan-pagination">
          <button
            type="button"
            className="fan-arrow"
            onClick={() => step(-1)}
            aria-label="Previous project"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="fan-arrow"
            onClick={() => step(1)}
            aria-label="Next project"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
          <span className="fan-numbers" aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
        </div>
      </div>

      {detailIndex !== null && (
        <ProjectDetail
          project={items[detailIndex]}
          index={detailIndex}
          total={n}
          onClose={closeDetail}
          onNavigate={navigateDetail}
        />
      )}
    </div>
  )
}
