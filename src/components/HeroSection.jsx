import { useEffect, useRef } from 'react'
import PortfolioTypography from './PortfolioTypography'
import CharacterPortrait from './CharacterPortrait'
import FloatingLabels from './FloatingLabels'
import ExperienceBadge from './ExperienceBadge'
import SummaryCard from './SummaryCard'
import SkillTags from './SkillTags'
import DotField from './ui/dot-field'
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

  // DotField is the hero background: an interactive halftone dot membrane
  // (swipe leaves a wake, click sends a shockwave). The hero content is
  // passed as its children so pointer events bubble to the field's root.
  // className overrides the demo's light look: transparent so the hero's
  // #161513 shows through, light dots, fills the hero (z-0, behind the
  // z-1/2/3 hero layers). The hero children are absolutely positioned, so
  // the field's flex centering never moves them.
  return (
    <section ref={rootRef} className="hero" aria-label="Rishabh Sharma — Portfolio">
      <DotField
        className="absolute inset-0 z-0 min-h-0 bg-transparent text-zinc-500 dark:text-zinc-300"
        interactive
        seed={7}
      >
        <PortfolioTypography ref={wordRef} />
        <CharacterPortrait ref={portraitRef} />
        <FloatingLabels topRef={topRef} nameRef={nameRef} />
        <ExperienceBadge ref={badgeRef} />
        <SummaryCard ref={summaryRef} />
        <SkillTags ref={tagsRef} />
      </DotField>
    </section>
  )
}
