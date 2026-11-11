import { useEffect, useRef } from 'react'
import PortfolioTypography from './PortfolioTypography'
import HeroRobot from './HeroRobot'
import FloatingLabels from './FloatingLabels'
import ExperienceBadge from './ExperienceBadge'
import SummaryCard from './SummaryCard'
import SkillTags from './SkillTags'
import { createHeroTimeline } from '../animations/heroTimeline'

export default function HeroSection({ introReady = true }) {
  const rootRef = useRef(null)
  const wordRef = useRef(null)
  const portraitRef = useRef(null)
  const topRef = useRef(null)
  const nameRef = useRef(null)
  const badgeRef = useRef(null)
  const summaryRef = useRef(null)
  const tagsRef = useRef(null)
  // The entrance runs once, when the loader lifts (introReady flips
  // true) — never behind the loader overlay, where nobody could see it.
  const startedRef = useRef(false)

  useEffect(() => {
    if (!introReady || startedRef.current) return undefined
    startedRef.current = true
    const cleanup = createHeroTimeline({
      root: rootRef.current,
      word: wordRef.current,
      portrait: portraitRef.current,
      top: topRef.current,
      name: nameRef.current,
      badge: badgeRef.current,
      summary: summaryRef.current,
      tags: tagsRef.current,
    })
    return cleanup
  }, [introReady])

  // The dot background is site-wide now (one DotField wraps the whole
  // NotchNav shell in App.jsx), so the hero no longer needs its own
  // field — the hero section is transparent and the dots show through.
  // The hero children are absolutely positioned, anchored to the section.
  return (
    <section ref={rootRef} className="hero" aria-label="Rishabh Sharma — Portfolio">
      <PortfolioTypography ref={wordRef} />
      <HeroRobot ref={portraitRef} />
      <FloatingLabels topRef={topRef} nameRef={nameRef} />
      <ExperienceBadge ref={badgeRef} />
      <SummaryCard ref={summaryRef} />
      <SkillTags ref={tagsRef} />
    </section>
  )
}
