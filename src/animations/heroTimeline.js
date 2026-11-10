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

  // Cursor tracking: ONLY the head turns toward the mouse — the body never
  // moves. The portrait is two layers (see CharacterPortrait.jsx); the head
  // rotates around the neck cut (transformOrigin 50% 48% = y=510/1058) with
  // the face centre (29% down the head layer) as the look origin. Guard is
  // "not coarse": environments with no pointer report neither, and with no
  // cursor no mousemove ever fires, so enabling there is harmless. Ranges
  // stay small so the neck seam stays hidden.
  // shortcut: flat PNG layers — the painted eyes can't move on their own;
  // upgrade: real 3D head model.
  let track = null
  if (
    refs.head &&
    refs.root &&
    !window.matchMedia('(pointer: coarse)').matches
  ) {
    const el = refs.head
    gsap.set(el, { transformPerspective: 800, transformOrigin: '50% 48%' })
    const rotY = gsap.quickTo(el, 'rotationY', {
      duration: 0.5,
      ease: 'power3.out',
    })
    const rotX = gsap.quickTo(el, 'rotationX', {
      duration: 0.5,
      ease: 'power3.out',
    })
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const nx = Math.max(
        -1,
        Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)),
      )
      const ny = Math.max(
        -1,
        Math.min(
          1,
          (e.clientY - (r.top + r.height * 0.29)) / (r.height / 2),
        ),
      )
      rotY(nx * 12)
      rotX(ny * 8)
    }
    const onLeave = () => {
      rotY(0)
      rotX(0)
    }
    refs.root.addEventListener('mousemove', onMove)
    refs.root.addEventListener('mouseleave', onLeave)
    track = { onMove, onLeave }
  }

  return () => {
    tl.kill()
    parallax?.scrollTrigger?.kill()
    parallax?.kill()
    if (track && refs.root) {
      refs.root.removeEventListener('mousemove', track.onMove)
      refs.root.removeEventListener('mouseleave', track.onLeave)
    }
  }
}
