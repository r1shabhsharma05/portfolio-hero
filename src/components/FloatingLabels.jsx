export default function FloatingLabels({ topRef, nameRef }) {
  return (
    <>
      <div ref={topRef} className="hero-top">
        <span>Software Engineer</span>
        <span className="amp">&amp;</span>
        <span>Problem Solver</span>
      </div>
      <div ref={nameRef} className="hero-name">
        <div className="iam">#I Am</div>
        <div className="name">Rishabh Sharma</div>
      </div>
    </>
  )
}
