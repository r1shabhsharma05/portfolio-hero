import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProjectLinks } from './ProjectLinks'
import './ProjectCarousel.css'

/**
 * Opening-cards carousel — React port of the CodePen "timed cards" demo
 * Rishabh uploaded (Interactive Card Opening). One card expands to fill
 * the stage while the rest wait in a row at the bottom-right; the order
 * rotates on a timer and the active card's details panel crossfades.
 *
 * Adapted for the portfolio (the demo is a fullscreen page takeover):
 *  - the stage is a bounded block inside the Projects section, not the
 *    whole viewport; all layout math reads the stage's own size
 *  - desktop layout keeps the demo's numbers (200×300 cards, the row
 *    peeks past the right edge exactly like the demo); tablet and mobile
 *    use smaller cards that fit the stage
 *  - the demo's arrows were decorative; here prev/next and the thumb
 *    cards actually navigate, and each navigation restarts the timer
 *  - the demo's Google Fonts (Inter + Oswald) are NOT loaded — the
 *    portfolio self-hosts its fonts, so titles use Anton + Inter
 *  - the gold accent becomes the portfolio's lime
 *  - prefers-reduced-motion: no auto-play, no intro, instant transitions
 */
const AUTOPLAY_MS = 4500
const EASE = 'sine.inOut'

function layoutFor(width, height) {
  // Thumb rows are sized to fit fully inside the stage (the demo lets the
  // last card slide off the right edge; here that read as a broken layout).
  // offsetTop leaves the details panel clear above the row.
  if (width >= 1024) {
    return { cardW: 180, cardH: 270, gap: 28, offsetTop: height - 390, offsetLeft: width - 1032 }
  }
  if (width >= 768) {
    return { cardW: 110, cardH: 165, gap: 12, offsetTop: height - 265, offsetLeft: width - 614 }
  }
  return { cardW: 64, cardH: 96, gap: 8, offsetTop: height - 116, offsetLeft: Math.max(0, width - 360) }
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
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const detailsRef = useRef(null)
  const progressRef = useRef(null)
  const orderRef = useRef(items.map((_, i) => i))
  const timerRef = useRef(null)
  const pausedRef = useRef(false)
  const firstDetailsRef = useRef(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const reducedMotion = useRef(false)

  const applyLayout = useCallback(
    (animate) => {
      const stage = stageRef.current
      if (!stage) return
      const { cardW, cardH, gap, offsetTop, offsetLeft } = layoutFor(
        stage.clientWidth,
        stage.clientHeight,
      )
      const [active, ...rest] = orderRef.current
      const targets = new Map()
      targets.set(active, {
        x: 0,
        y: 0,
        width: stage.clientWidth,
        height: stage.clientHeight,
        borderRadius: 0,
        zIndex: 20,
      })
      rest.forEach((idx, i) => {
        targets.set(idx, {
          x: offsetLeft + i * (cardW + gap),
          y: offsetTop,
          width: cardW,
          height: cardH,
          borderRadius: 12,
          zIndex: 30,
        })
      })
      items.forEach((_, idx) => {
        const el = cardRefs.current[idx]
        const target = targets.get(idx)
        if (!el || !target) return
        if (animate && !reducedMotion.current) {
          gsap.to(el, { ...target, duration: 0.9, ease: EASE })
        } else {
          gsap.set(el, target)
        }
      })
    },
    [items],
  )

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) gsap.killTweensOf(progressRef.current)
    if (reducedMotion.current || pausedRef.current) return
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: 'none' },
      )
    }
    timerRef.current = setTimeout(() => stepRef.current(1), AUTOPLAY_MS)
  }, [])

  const stepRef = useRef(() => {})
  stepRef.current = (dir) => {
    const order = orderRef.current
    if (dir >= 0) order.push(order.shift())
    else order.unshift(order.pop())
    setActiveIndex(order[0])
    applyLayout(true)
    startTimer()
  }

  const goTo = useCallback(
    (index) => {
      const order = orderRef.current
      const pos = order.indexOf(index)
      if (pos === -1 || pos === 0) return
      for (let i = 0; i < pos; i++) order.push(order.shift())
      setActiveIndex(order[0])
      applyLayout(true)
      startTimer()
    },
    [applyLayout, startTimer],
  )

  /* Details panel crossfade on active change (skips the first paint). */
  useEffect(() => {
    if (firstDetailsRef.current) {
      firstDetailsRef.current = false
      return
    }
    if (reducedMotion.current) return
    const el = detailsRef.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
  }, [activeIndex])

  /* Init: preload photos, lay out, intro, start the timer. */
  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stage = stageRef.current
    if (!stage) return undefined
    let cancelled = false

    const pause = () => {
      pausedRef.current = true
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) gsap.killTweensOf(progressRef.current)
    }
    const resume = () => {
      pausedRef.current = false
      startTimer()
    }
    const onVisibility = () => {
      if (document.hidden) pause()
      else resume()
    }

    stage.addEventListener('mouseenter', pause)
    stage.addEventListener('mouseleave', resume)
    document.addEventListener('visibilitychange', onVisibility)

    const ro = new ResizeObserver(() => applyLayout(false))
    ro.observe(stage)

    Promise.all(items.map((item) => loadImage(item.image).catch(() => null))).then(() => {
      if (cancelled) return
      const { offsetLeft, cardW, gap } = layoutFor(stage.clientWidth, stage.clientHeight)
      const [, ...rest] = orderRef.current
      // Intro: thumbs start slid right, off their spots, then settle in.
      rest.forEach((idx, i) => {
        const el = cardRefs.current[idx]
        if (el) gsap.set(el, { x: offsetLeft + 400 + i * (cardW + gap) })
      })
      applyLayout(false)
      setReady(true)
      if (!reducedMotion.current) {
        rest.forEach((idx, i) => {
          const el = cardRefs.current[idx]
          if (!el) return
          const { offsetLeft: left, cardW: w, gap: g } = layoutFor(
            stage.clientWidth,
            stage.clientHeight,
          )
          gsap.to(el, { x: left + i * (w + g), duration: 0.9, delay: 0.6 + 0.05 * i, ease: EASE })
        })
        if (detailsRef.current) {
          gsap.from(detailsRef.current, { opacity: 0, y: 20, duration: 0.6, delay: 0.6, ease: 'power2.out' })
        }
      }
      startTimer()
    })

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
      stage.removeEventListener('mouseenter', pause)
      stage.removeEventListener('mouseleave', resume)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      gsap.killTweensOf(cardRefs.current)
      if (progressRef.current) gsap.killTweensOf(progressRef.current)
      if (detailsRef.current) gsap.killTweensOf(detailsRef.current)
    }
  }, [items, applyLayout, startTimer])

  const active = items[activeIndex]

  return (
    <div className="project-carousel-wrap">
      <div className="project-stage" ref={stageRef} role="region" aria-label="Featured projects carousel">
        <div className="project-stage-progress" aria-hidden="true">
          <div className="project-stage-progress-fill" ref={progressRef} />
        </div>

        {items.map((item, idx) => (
          <button
            key={item.name}
            ref={(el) => {
              cardRefs.current[idx] = el
            }}
            type="button"
            className={`project-stage-card${idx === activeIndex ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${item.image})`, visibility: ready ? 'visible' : 'hidden' }}
            onClick={() => goTo(idx)}
            aria-label={`Show ${item.name}`}
            aria-current={idx === activeIndex}
            tabIndex={idx === activeIndex ? -1 : 0}
          >
            {idx !== activeIndex && (
              <span className="project-stage-thumb-label">
                <span className="project-stage-thumb-rule" aria-hidden="true" />
                <span className="project-stage-thumb-place">{item.tagline}</span>
                <span className="project-stage-thumb-title">{item.name}</span>
              </span>
            )}
          </button>
        ))}

        <div className="project-stage-details" ref={detailsRef}>
          <p className="project-stage-tagline">{active.tagline}</p>
          <h3 className="project-stage-title">{active.name}</h3>
          <p className="project-stage-desc">{active.problem}</p>
          {active.features && active.features.length > 0 && (
            <ul className="project-stage-features">
              {active.features.slice(0, 2).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
          <ProjectLinks github={active.github} live={active.live} />
        </div>
      </div>

      <div className="project-stage-pagination">
        <button
          type="button"
          className="project-stage-arrow"
          onClick={() => stepRef.current(-1)}
          aria-label="Previous project"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="project-stage-arrow"
          onClick={() => stepRef.current(1)}
          aria-label="Next project"
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
        <span className="project-stage-numbers" aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
