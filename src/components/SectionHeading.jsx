export default function SectionHeading({ id, eyebrow, title, sub }) {
  return (
    <div className="section-head">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {sub ? <p className="section-sub">{sub}</p> : null}
    </div>
  )
}
