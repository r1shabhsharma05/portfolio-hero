import { Sparkle } from 'lucide-react'

const TAGS = [
  'Full-Stack Development',
  'AI / Machine Learning',
  'Cloud & DevOps',
  'System Design',
]

export default function SkillTags({ ref }) {
  return (
    <div ref={ref} className="hero-tags">
      {TAGS.map((label) => (
        <div className="skill-tag" key={label}>
          <Sparkle className="star" strokeWidth={1.5} />
          <span className="tag-text">{label}</span>
          <span className="caret">|</span>
        </div>
      ))}
    </div>
  )
}
