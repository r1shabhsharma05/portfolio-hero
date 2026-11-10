import portraitBody from '../assets/portrait-body.png'
import portraitHead from '../assets/portrait-head.png'

// The portrait is split into two layers from portrait.png (cut at the neck,
// y=510/1058, feathered overlap — see tmp-work/pptr/split-portrait.py): the
// body stays still, only the head turns toward the cursor (heroTimeline.js).
// At rest the two layers composite back to the original pixel-for-pixel.
export default function CharacterPortrait({ ref, headRef }) {
  return (
    <div ref={ref} className="hero-portrait" aria-hidden="true">
      <img src={portraitBody} alt="" draggable={false} />
      <img
        ref={headRef}
        src={portraitHead}
        alt=""
        draggable={false}
        className="hero-portrait-head"
      />
    </div>
  )
}
