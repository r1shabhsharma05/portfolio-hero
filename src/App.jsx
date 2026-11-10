import { useCallback, useState } from 'react'
import HeroSection from './components/HeroSection'
import Loader from './components/Loader'
import Nav from './components/Nav'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WaterCursor from './components/WaterCursor'

export default function App() {
  // The 3D logo loader plays first; the portfolio (and the hero
  // entrance) only starts once it lifts. No deploy or session logic
  // here — the loader shows on every fresh page load.
  const [loaded, setLoaded] = useState(false)
  const handleLoaderDone = useCallback(() => setLoaded(true), [])

  return (
    <>
      {!loaded && <Loader onDone={handleLoaderDone} />}
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <div id="home">
          <HeroSection introReady={loaded} />
        </div>
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <WaterCursor />
    </>
  )
}
