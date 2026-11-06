export default function ExperienceBadge({ ref }) {
  return (
    <div ref={ref} className="hero-badge">
      <div className="badge-card">
        <div className="badge-num">
          1+<small>years</small>
        </div>
        <div className="badge-sep" />
        <div className="badge-label">Experience</div>
      </div>
    </div>
  )
}
