import { useCallback, useEffect, useState } from 'react'
import { Briefcase, Code2, Download, FolderGit2, Home, Mail, User } from 'lucide-react'
import HeroSection from './components/HeroSection'
import Loader from './components/Loader'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { NotchNav } from './components/ui/adaptive-notch-navigation-bar'
import { NAV_LINKS, PERSON } from './data/portfolio'

const NAV_ICONS = {
  home: Home,
  about: User,
  skills: Code2,
  projects: FolderGit2,
  experience: Briefcase,
  contact: Mail,
}

const NOTCH_ITEMS = NAV_LINKS.map((l) => ({
  id: l.id,
  label: l.label,
  icon: NAV_ICONS[l.id] || Home,
}))

export default function App() {
  // The 3D logo loader plays first; the portfolio (and the hero
  // entrance) only starts once it lifts. No deploy or session logic
  // here — the loader shows on every fresh page load.
  const [loaded, setLoaded] = useState(false)
  const handleLoaderDone = useCallback(() => setLoaded(true), [])

  // Active section tracked with IntersectionObserver, same as the old
  // nav. Sections live inside NotchNav's scroll viewport, but the
  // observer still works: they intersect the browser viewport.
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const handleActiveChange = useCallback((id) => {
    setActive(id)
    // Scrolls NotchNav's content viewport (nearest scrollable
    // ancestor). .section already has scroll-margin-top: 76px, so the
    // heading lands below the notch bar.
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // NotchNav is a full-page shell: its content viewport is the scroll
  // container. The single wrapper div must be w-full self-start — the
  // viewport is flex with items-center, and a tall centered child
  // would clip at the top and become unreachable by scrolling.
  return (
    <>
      {!loaded && <Loader onDone={handleLoaderDone} />}
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NotchNav
        items={NOTCH_ITEMS}
        activeId={active}
        position="top"
        logo={
          <span className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-lime-400 text-[15px] font-medium text-zinc-950">
              R
            </span>
            <span className="text-sm font-medium whitespace-nowrap">Rishabh Sharma</span>
          </span>
        }
        rightContent={
          <a
            href={PERSON.resumeHref}
            download="Rishabh_Sharma_Resume.pdf"
            className="inline-flex items-center gap-1.5 rounded-lg border border-lime-400/45 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-lime-400 transition-colors hover:bg-lime-400/10"
          >
            <Download size={14} aria-hidden="true" />
            Resume
          </a>
        }
        onActiveChange={handleActiveChange}
      >
        <div className="w-full self-start">
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
        </div>
      </NotchNav>
    </>
  )
}
