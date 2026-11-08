import { useEffect, useRef } from 'react'
import PortfolioTypography from './PortfolioTypography'
import CharacterPortrait from './CharacterPortrait'
import FloatingLabels from './FloatingLabels'
import ExperienceBadge from './ExperienceBadge'
import SummaryCard from './SummaryCard'
import SkillTags from './SkillTags'
import { createHeroTimeline } from '../animations/heroTimeline'

export default function HeroSection() {
  const rootRef = useRef(null)
  const wordRef = useRef(null)
  const portraitRef = useRef(null)
  const topRef = useRef(null)
  const nameRef = useRef(null)
  const badgeRef = useRef(null)
  const summaryRef = useRef(null)
  const tagsRef = useRef(null)

  useEffect(() => {
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
  }, [])

  return (
    <section ref={rootRef} className="hero" aria-label="Rishabh Sharma — Portfolio">
      <PortfolioTypography ref={wordRef} />
      <CharacterPortrait ref={portraitRef} />
      <FloatingLabels topRef={topRef} nameRef={nameRef} />
      <ExperienceBadge ref={badgeRef} />
      <SummaryCard ref={summaryRef} />
      <SkillTags ref={tagsRef} />
    </section>
  )
}
