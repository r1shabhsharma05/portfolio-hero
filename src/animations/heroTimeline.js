import { gsap } from 'gsap'

/**
 * One short hero entrance: every hero group fades and rises once,
 * then the hero stays still. No black first frame — the groups start
 * visible in markup and GSAP animates them from a small offset, so
 * the hero is never blank while fonts or the portrait load.
 * (Owner's order: the entrance always plays.)
 */
export function createHeroTimeline(refs) {
  const groups = [
    refs.word,
    refs.top,
    refs.portrait,
    refs.name,
    refs.badge,
    refs.summary,
    refs.tags,
  ].filter(Boolean)
  const tween = gsap.from(groups, {
    y: 12,
    opacity: 0,
    duration: 0.5,
    stagger: 0.06,
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    clearProps: 'all',
  })
  return () => {
    tween.kill()
  }
}
