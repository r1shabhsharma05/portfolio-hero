import { Sparkle } from 'lucide-react'

const TAGS = [
  { label: 'Full-Stack Development', color: '#f5e617' },
  { label: 'AI / Machine Learning', color: '#22d3ee' },
  { label: 'Cloud & DevOps', color: '#c026d3' },
  { label: 'System Design', color: '#ec4899' },
]

export default function SkillTags({ ref }) {
  return (
    <div ref={ref} className="hero-tags">
      {TAGS.map((t) => (
        <div className="skill-tag" key={t.label}>
          <span className="tag-sweep" style={{ background: t.color }} />
          <Sparkle
            className="star"
            style={{ color: t.color, fill: t.color, filter: `drop-shadow(0 0 8px ${t.color})` }}
          />
          <span className="tag-text">{t.label}</span>
          <span className="caret">|</span>
        </div>
      ))}
    </div>
  )
}
