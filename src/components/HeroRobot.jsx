import { SplineScene } from './ui/splite'
import { SplineErrorBoundary } from './ui/spline-error-boundary'

// The Spline robot replaces the flat portrait in the hero — same slot
// (.hero-portrait in hero.css, same size and position), character removed.
// Scene: the 21st.dev demo scene Rishabh pasted
// (prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode), downloaded
// byte-identical 2026-11-11 (1.3MB, md5 13bd456a7a19e9f6ed74ac259b67d455)
// and self-hosted as public/robot-scene.splinecode — the Spline CDN is
// unreachable from the verification VM's Chrome, and same-origin is
// faster + immune to CDN outages. Same robot, no content change.
// Cursor tracking rotates this inner wrapper (heroTimeline.js); the outer
// .hero-portrait keeps the entrance + parallax, so the two never fight.
// The error boundary is load-bearing: if the scene CDN fails, Spline
// throws during render and React would unmount the whole app without it.
export default function HeroRobot({ ref, robotRef }) {
  return (
    <div ref={ref} className="hero-portrait" aria-hidden="true">
      <div ref={robotRef} className="hero-robot">
        <SplineErrorBoundary>
          <SplineScene
            scene="/robot-scene.splinecode"
            className="w-full h-full"
          />
        </SplineErrorBoundary>
      </div>
    </div>
  )
}
