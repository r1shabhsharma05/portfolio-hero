import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Premium hero entrance, played once when the loader lifts: the giant
 * PORTFOLIO wordmark (halftone dots) fades in, the name words follow,
 * then portrait / badge / summary / tags cascade in.
 * The portrait also gets a gentle scroll parallax (scrub on yPercent —
 * a different transform component from the entrance y, so the two never
 * fight). Reduced motion: nothing moves, everything stays visible.
 * (Owner's order: the entrance always plays.)
 */
export function createHeroTimeline(refs) {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {}
  }
  const viewport = document.querySelector('[data-notch-viewport]')
  const scroller = viewport || undefined

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  // The word is a halftone canvas now (no text nodes to split) — the
  // whole wordmark fades in as one.
  if (refs.word) {
    tl.from(refs.word, { y: 12, opacity: 0, duration: 0.5 }, 0)
  }
  if (refs.name) {
    tl.from(refs.name, { y: 24, opacity: 0, duration: 0.6 }, 0.15)
  }
  if (refs.top) {
    tl.from(refs.top, { y: 16, opacity: 0, duration: 0.5 }, 0.2)
  }
  if (refs.portrait) {
    tl.from(
      refs.portrait,
      { y: 28, scale: 0.96, opacity: 0, duration: 0.9 },
      0.25,
    )
  }
  if (refs.badge) {
    tl.from(refs.badge, { y: 16, opacity: 0, duration: 0.5 }, 0.45)
  }
  if (refs.summary) {
    tl.from(refs.summary, { y: 20, opacity: 0, duration: 0.55 }, 0.55)
  }
  if (refs.tags) {
    tl.from(refs.tags, { y: 16, opacity: 0, duration: 0.5 }, 0.65)
  }

  // Portrait parallax: drifts down slightly as the hero scrolls away.
  let parallax = null
  if (refs.portrait && refs.root) {
    parallax = gsap.to(refs.portrait, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: refs.root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        scroller,
      },
    })
  }

  return () => {
    tl.kill()
    parallax?.scrollTrigger?.kill()
    parallax?.kill()
  }
}
