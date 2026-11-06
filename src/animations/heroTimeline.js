import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import portraitSrc from '../assets/portrait.png'

gsap.registerPlugin(SplitText)

/**
 * One master GSAP timeline for the hero entrance, mirroring the
 * reference reel's sequence:
 *   1. dark bg + green radial glow
 *   2. PORTFOLIO reveals left -> right, char by char, with a light sweep
 *   3. top labels fade in
 *   4. portrait rises from below and settles in front of the type
 *   5. "#I Am" + name types in, char by char
 *   6. experience badge settles in
 *   7. summary card slides in from the left
 *   8. skill tags appear one by one with a coloured highlight sweep
 *   9. settle: slow cinematic push-in, running under the whole entrance
 *
 * Smoothness first (owner's order, 2026-11-07 — match the reference
 * video's motion): professional easings (expo.out for entrances,
 * power2.inOut for sweeps and the push-in), gentle moves with no abrupt
 * jumps, transform + opacity only (never layout properties), GPU
 * compositing via translate3d (force3D), fonts + portrait preloaded
 * before the entrance starts (capped at 2s so a slow network never
 * holds the hero blank), no continuous idle motion, and the push-in
 * skipped when the OS asks for reduced motion. The entrance itself
 * ALWAYS plays, per the owner's explicit order — his laptop has
 * reduce-motion on and the entrance must show there.
 *
 * Returns a cleanup function (kills the timeline, reverts the SplitText
 * wrapping and the gsap context).
 */
export function createHeroTimeline(refs) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let cancelled = false

  const wordSplit = new SplitText(refs.word.querySelector('h1'), {
    type: 'chars',
    charsClass: 'portfolio-char',
  })
  const nameSplit = new SplitText(refs.name.querySelector('.name'), { type: 'chars' })
  const tagRows = gsap.utils.toArray(refs.tags.querySelectorAll('.skill-tag'))
  const topLabels = gsap.utils.toArray(refs.top.querySelectorAll('span'))
  const shine = refs.word.querySelector('.hero-shine')
  const iam = refs.name.querySelector('.iam')

  const ctx = gsap.context(() => {
    // Hidden initial states, set at once: the hero never flashes in its
    // final state while fonts / the portrait are still loading.
    gsap.set(refs.glow, { opacity: 0, scale: 0.92 })
    gsap.set(wordSplit.chars, { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, y: 16 })
    gsap.set(shine, { xPercent: -130, opacity: 0 })
    gsap.set(topLabels, { y: -14, opacity: 0 })
    gsap.set(refs.portrait, { y: 120, opacity: 0, scale: 0.96 })
    gsap.set(iam, { opacity: 0, y: 10 })
    gsap.set(nameSplit.chars, { y: 16, opacity: 0 })
    gsap.set(refs.badge, { scale: 0.85, opacity: 0 })
    gsap.set(refs.summary, { x: -32, opacity: 0 })
    tagRows.forEach((row) => {
      gsap.set(row.querySelector('.tag-sweep'), { scaleX: 0 })
      gsap.set(row.querySelectorAll('.star, .tag-text, .caret'), { opacity: 0 })
    })
    gsap.set(refs.root, { scale: 1 })

    // Fonts + portrait first, then the entrance. Never wait forever.
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load('400 100px Anton'),
          document.fonts.load('italic 900 100px "Playfair Display"'),
          document.fonts.load('italic 500 100px "Playfair Display"'),
          document.fonts.load('600 100px Inter'),
        ]).catch(() => {})
      : Promise.resolve()
    const portrait = new Promise((resolve) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = resolve
      img.src = portraitSrc
      if (img.complete) resolve()
    })
    const timeout = new Promise((resolve) => setTimeout(resolve, 2000))
    Promise.race([Promise.all([fonts, portrait]), timeout]).then(() => {
      if (cancelled) return
      ctx.add(buildTimeline)
    })
  }, refs.root)

  function buildTimeline() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', force3D: true } })

    // PHASE 1 — background + glow
    tl.to(refs.glow, { opacity: 1, scale: 1, duration: 1.2 }, 0)

    // PHASE 2 — PORTFOLIO reveal, left to right. The clipPath is cleared
    // as each char finishes so it can never clip the glyphs afterwards.
    tl.to(
      wordSplit.chars,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        clearProps: 'clipPath',
      },
      0.25,
    )

    // light sweep across the word, like the reel's glow pass
    tl.fromTo(
      shine,
      { xPercent: -130, opacity: 0 },
      { xPercent: 130, opacity: 1, duration: 1.8, ease: 'power2.inOut' },
      0.9,
    )
    tl.to(shine, { opacity: 0, duration: 0.4 }, 2.7)

    // PHASE 3 — top labels
    tl.to(topLabels, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 1.5)

    // PHASE 4 — portrait rises from below
    tl.to(refs.portrait, { y: 0, opacity: 1, scale: 1, duration: 1.4 }, 1.8)

    // PHASE 5 — name
    tl.to(iam, { opacity: 1, y: 0, duration: 0.8 }, 2.7)
    tl.to(nameSplit.chars, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04 }, 2.9)

    // PHASE 6 — experience badge
    tl.to(refs.badge, { scale: 1, opacity: 1, duration: 0.9 }, 3.5)

    // PHASE 7 — summary card slides in from the left
    tl.to(refs.summary, { x: 0, opacity: 1, duration: 1.0 }, 3.9)

    // PHASE 8 — skill tags, one by one, with a highlight sweep
    tagRows.forEach((row, i) => {
      const sweep = row.querySelector('.tag-sweep')
      const bits = row.querySelectorAll('.star, .tag-text, .caret')
      const at = 4.4 + i * 0.18
      tl.to(sweep, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, at)
      tl.to(bits, { opacity: 1, duration: 0.35 }, at + 0.05)
      tl.to(sweep, { opacity: 0, duration: 0.4 }, at + 0.4)
    })

    // PHASE 9 — slow cinematic push-in, running under the whole entrance
    // like the reel's continuous zoom. Skipped when the OS asks for
    // reduced motion (the entrance itself still plays).
    if (!reduceMotion) {
      tl.to(
        refs.root,
        { scale: 1.03, duration: 12, ease: 'power2.inOut', transformOrigin: '50% 100%' },
        0,
      )
    }
  }

  return () => {
    cancelled = true
    ctx.revert()
    wordSplit.revert()
    nameSplit.revert()
  }
}
