export default function BackgroundGlow({ ref }) {
  return (
    <div ref={ref} className="hero-glow" aria-hidden="true">
      <div className="hero-glow-a" />
      <div className="hero-glow-b" />
      <div className="hero-glow-c" />
    </div>
  )
}
