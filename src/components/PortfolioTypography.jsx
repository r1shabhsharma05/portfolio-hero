import HalftoneWordmark from './ui/halftone-wordmark'

// The PORTFOLIO wordmark, printed as halftone dots (the footer's text
// animation): dots sized by letter coverage, parting around the pointer
// on springs and warming toward the page foreground, click fires a shock
// ring. The h1 stays for screen readers / SEO; the canvas is the visual.
export default function PortfolioTypography({ ref }) {
  return (
    <div ref={ref} className="hero-word">
      <h1 className="hw-sr">PORTFOLIO</h1>
      <HalftoneWordmark word="PORTFOLIO" fill={0.87} />
    </div>
  )
}
