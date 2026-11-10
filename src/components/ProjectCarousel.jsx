import { useCallback, useEffect, useRef, useState } from 'react'
import ProjectDetail from './ProjectDetail'
import './ProjectCarousel.css'

/**
 * CSS-only 3D ring carousel — React port of the CodePen demo
 * "CSS Only 3D Image Carousel" by NiklasKnaack
 * (codepen.io/NiklasKnaack/pen/abrOMLY), uploaded by Rishabh as a zip
 * (workspace/user/files/css-only-3d-image-carousel.zip).
 *
 * The demo is a fullscreen page of 11 portrait Unsplash photos on a
 * black background. Adapted for the portfolio:
 *  - 7 items, not 11 — Rishabh's own projects, landscape 16:9 cards
 *    (20rem x 11.25rem) so his 16:9 photos fill with zero crop
 *  - local photos (src/assets/projects/*), not Unsplash URLs
 *  - the demo's black background becomes the portfolio's warm dark
 *    #161513, its white hover glow becomes the portfolio's lime #a3e635
 *  - the demo's hidden link label becomes a visible caption strip with
 *    the project name — a portfolio carousel without names is useless
 *  - clicking a card opens the full project detail page (ProjectDetail),
 *    same ?project=<slug> deep links, ESC and back-button close as the
 *    old fan carousel had
 *  - the demo's :root variables are scoped to .ring-carousel so they
 *    cannot leak into the rest of the site; the demo's global resets
 *    (* margin/padding, body flex, :focus outline removal) are NOT
 *    ported — they would break the whole page
 *  - prefers-reduced-motion: the ring stops rotating (still clickable)
 *
 * What the old fan carousel had that is GONE with it (Rishabh's order
 * 2026-11-10 — "purane project layout ko hta dena"): drag, wheel,
 * arrows, pagination numbers, the details panel under the fan, and the
 * 7s autoplay stepper. The ring rotates continuously on its own
 * (25s per revolution, the demo's pace), pauses on hover, and the two
 * triangles at the sides flip the rotation direction — that is the
 * demo's own control, kept as-is.
 */

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProjectCarousel({ items }) {
  const n = items.length
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

  return (
    <div className="ring-wrap">
      <div
        className="ring-carousel"
        role="region"
        aria-label="Featured projects — 3D rotating carousel. Click a project to open its details."
      >
        <div className="ring-control-button left">
          <input
            type="radio"
            name="ring-control-input"
            aria-label="Rotate carousel left"
          />
        </div>
        <div className="ring-control-button right">
          <input
            type="radio"
            name="ring-control-input"
            aria-label="Rotate carousel right"
            defaultChecked
          />
        </div>

        <div className="ring-rotation-direction">
          <ul className="ring-item-wrapper" style={{ '--_num-elements': n }}>
            {items.map((item, idx) => (
              <li
                key={item.name}
                className="ring-item"
                style={{
                  '--_index': idx + 1,
                  '--_image-url': `url(${item.image})`,
                }}
              >
                <button
                  type="button"
                  className="ring-card"
                  onClick={() => openDetail(idx)}
                  aria-label={`Open ${item.name} details`}
                >
                  <span className="ring-card-face" aria-hidden="true" />
                  <span className="ring-card-label">{item.name}</span>
                </button>
              </li>
            ))}

            <li className="ring-ground" aria-hidden="true" />
          </ul>
        </div>
      </div>

      <p className="ring-hint">
        Click a project to open its details — hover pauses the ring, the
        side triangles flip its direction.
      </p>

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
