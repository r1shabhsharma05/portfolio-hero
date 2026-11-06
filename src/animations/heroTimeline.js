import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

/**
 * One master GSAP timeline for the hero entrance, mirroring the
 * reference reel's sequence:
 *   1. dark bg + green radial glow
 *   2. PORTFOLIO reveals left -> right, char by char, with a light sweep
 *   3. top labels fade in
 *   4. portrait rises from below and settles in front of the type
 *   5. "#I Am" + name types in, char by char
 *   6. experience badge pops in
 *   7. summary card slides in from the left
 *   8. skill tags appear one by one with a coloured highlight sweep
 *   9. settle: slow cinematic push-in + barely-there idle float
 *
 * Returns a cleanup function (reverts the gsap context: kills the
 * timeline, idle loops and SplitText wrapping).
 */
export function createHeroTimeline(refs) {
  const ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Split the big word and the name into characters.
    const wordSplit = new SplitText(refs.word.querySelector('h1'), {
      type: 'chars',
      charsClass: 'portfolio-char',
    })
    const nameSplit = new SplitText(refs.name.querySelector('.name'), { type: 'chars' })
    const tagRows = gsap.utils.toArray(refs.tags.querySelectorAll('.skill-tag'))
    const topLabels = gsap.utils.toArray(refs.top.querySelectorAll('span'))
    const shine = refs.word.querySelector('.hero-shine')

    // Reduced motion: leave everything in its final, visible state.
    if (reduceMotion) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // PHASE 1 — background + glow
    tl.from(refs.glow, { opacity: 0, scale: 0.92, duration: 1.0 }, 0)

    // PHASE 2 — PORTFOLIO reveal, left to right
    tl.from(
      wordSplit.chars,
      {
        clipPath: 'inset(0% 100% 0% 0%)',
        opacity: 0,
        y: 26,
        duration: 0.55,
        stagger: 0.07,
      },
      0.25,
    )

    // light sweep across the word, like the reel's glow pass
    tl.fromTo(
      shine,
      { xPercent: -130, opacity: 0 },
      {
        xPercent: 130,
        opacity: 1,
        duration: 1.1,
        ease: 'power2.inOut',
        onComplete: () => gsap.to(shine, { opacity: 0, duration: 0.4 }),
      },
      0.9,
    )

    // PHASE 3 — top labels
    tl.from(topLabels, { y: -22, opacity: 0, duration: 0.6, stagger: 0.12 }, 1.5)

    // PHASE 4 — portrait rises from below
    tl.from(refs.portrait, { y: 140, opacity: 0, scale: 0.94, duration: 1.1 }, 1.8)

    // PHASE 5 — name
    tl.from(refs.name.querySelector('.iam'), { opacity: 0, y: 10, duration: 0.5 }, 2.7)
    tl.from(nameSplit.chars, { y: 24, opacity: 0, duration: 0.5, stagger: 0.03 }, 2.9)

    // PHASE 6 — experience badge
    tl.from(refs.badge, { scale: 0.7, opacity: 0, duration: 0.6 }, 3.5)

    // PHASE 7 — summary card slides in from the left
    tl.from(refs.summary, { x: -48, opacity: 0, duration: 0.8 }, 3.9)

    // PHASE 8 — skill tags, one by one, with a highlight sweep
    tagRows.forEach((row, i) => {
      const sweep = row.querySelector('.tag-sweep')
      const bits = row.querySelectorAll('.star, .tag-text, .caret')
      const at = 4.4 + i * 0.16
      tl.fromTo(sweep, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.inOut' }, at)
      tl.from(bits, { opacity: 0, duration: 0.3 }, at + 0.05)
      tl.to(sweep, { opacity: 0, duration: 0.35 }, at + 0.35)
    })

    // PHASE 9 — settle: slow cinematic push-in + barely-there idle float
    tl.to(refs.root, { scale: 1.02, duration: 9, ease: 'power2.inOut', transformOrigin: '50% 100%' }, 5.4)
    gsap.to(refs.badge, { y: -5, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 5.6 })
    gsap.to(refs.summary, { y: -4, duration: 3.0, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 5.8 })
    gsap.to(refs.portrait, { y: -4, duration: 4.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 6.0 })
  }, refs.root)

  return () => ctx.revert()
}
