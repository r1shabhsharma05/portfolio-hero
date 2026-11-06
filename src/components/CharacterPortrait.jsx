import portrait from '../assets/portrait.png'

export default function CharacterPortrait({ ref }) {
  return (
    <div ref={ref} className="hero-portrait" aria-hidden="true">
      <div className="hero-halo" />
      <img src={portrait} alt="" draggable={false} />
    </div>
  )
}
