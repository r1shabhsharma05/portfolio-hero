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
 *  - CARDS ARE LANDSCAPE 16:9 (Rishabh's order 2026-11-10 — long-form
 *    video ratio, NOT the demo's portrait 3:4), and the photo inside is
 *    object-fit: contain over a blurred copy of itself, so NO image is
 *    ever cropped: 16:9 photos fill the card exactly, 3:2 photos get
 *    slim blurred sides, the portrait farmer photo stands full-height
 *    with blurred sides. The fan motion math is unchanged.
 *  - the demo's own ring-and-dot cursor is NOT ported — the portfolio
 *    already has the WaterCursor; two cursors would fight
 *  - the demo listens for wheel/drag on the whole document; here both are
 *    scoped to the stage, so scrolling the rest of the page is untouched
 *  - the demo's click math (progress = i/len*100 + 10) lands one short on
 *    7 items; click-to-focus uses progress = i/(n-1)*100 instead
 *  - NO autoplay: the fan is manual by design (the old 7s timer is gone)
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
  const dragRef = useRef(null)
  const lastDragMovedRef = useRef(0)
  const lastDragEndRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [detailIndex, setDetailIndex] = useState(null)
  const detailPushedRef = useRef(false)

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

  /* Wheel + drag, scoped to the stage (the demo binds them to document).
     Drag uses window-level move/up listeners instead of pointer capture:
     with capture, the click after a drag would retarget to the stage and
     the card's own click would never fire. */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const onWheel = (e) => {
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
      stage.classList.remove('is-dragging')
      window.removeEventListener('pointermove', onPointerMove)
    }
    const onPointerDown = (e) => {
      dragRef.current = { x: e.clientX, moved: 0 }
      lastDragMovedRef.current = 0
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
  }, [setProgress])

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
    <div className="fan-wrap">
      <div
        className="fan-stage"
        ref={stageRef}
        role="region"
        aria-label="Featured projects carousel — drag, scroll or use the arrow keys to browse"
        tabIndex={0}
        onKeyDown={onKeyDown}
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
              <img className="fan-card-bg" src={item.image} alt="" draggable={false} aria-hidden="true" />
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
              onClick={() => openDetail(activeIndex)}
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
