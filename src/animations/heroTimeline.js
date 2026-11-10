import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * Premium hero entrance, played once when the loader lifts: the giant
 * PORTFOLIO rises letter by letter (SplitText chars, masked), the name
 * words follow, then portrait / badge / summary / tags cascade in.
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

  const h1 = refs.word?.querySelector('h1')
  const split = h1 ? new SplitText(h1, { type: 'chars', mask: 'chars' }) : null

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  if (split) {
    tl.from(
      split.chars,
      { yPercent: 110, duration: 0.9, stagger: 0.035, ease: 'power4.out' },
      0,
    )
  } else if (refs.word) {
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

  // Cursor tracking: the portrait turns its face toward the mouse
  // while the hero is on screen. Guard is "not coarse" (not "fine"):
  // environments with no pointer at all report neither, and with no
  // cursor no mousemove ever fires, so enabling there is harmless.
  // shortcut: flat PNG — perspective tilt only, no true head turn;
  // upgrade: layered/3D portrait.
  let track = null
  if (
    refs.portrait &&
    refs.root &&
    !window.matchMedia('(pointer: coarse)').matches
  ) {
    const el = refs.portrait
    gsap.set(el, { transformPerspective: 800 })
    const rotY = gsap.quickTo(el, 'rotationY', {
      duration: 0.5,
      ease: 'power3.out',
    })
    const rotX = gsap.quickTo(el, 'rotationX', {
      duration: 0.5,
      ease: 'power3.out',
    })
    const shiftX = gsap.quickTo(el, 'x', {
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
        Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)),
      )
      rotY(nx * 14)
      rotX(ny * 9)
      shiftX(nx * 8)
    }
    const onLeave = () => {
      rotY(0)
      rotX(0)
      shiftX(0)
    }
    refs.root.addEventListener('mousemove', onMove)
    refs.root.addEventListener('mouseleave', onLeave)
    track = { onMove, onLeave }
  }

  return () => {
    tl.kill()
    parallax?.scrollTrigger?.kill()
    parallax?.kill()
    split?.revert()
    if (track && refs.root) {
      refs.root.removeEventListener('mousemove', track.onMove)
      refs.root.removeEventListener('mouseleave', track.onLeave)
    }
  }
}
