import { useCallback, useEffect, useState } from 'react'
import { Braces, Briefcase, Code2, Download, FolderGit2, Home, Mail, User } from 'lucide-react'
import HeroSection from './components/HeroSection'
import Loader from './components/Loader'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import CodingProfiles from './components/CodingProfiles'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import HelpfulRating from './components/ui/helpful-rating'
import SwitchButton from './components/ui/switch-button'
import { NotchNav } from './components/ui/adaptive-notch-navigation-bar'
import { NAV_LINKS, PERSON } from './data/portfolio'

const NAV_ICONS = {
  home: Home,
  about: User,
  skills: Code2,
  projects: FolderGit2,
  coding: Braces,
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

  // Theme: dark by default (the site's look); the navbar switch flips
  // the `dark` class on <html> and the choice persists in localStorage.
  // index.html restores it before first paint, so there is no flash.
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  )
  const handleThemeChange = useCallback((next) => {
    setTheme(next)
    try {
      localStorage.setItem('portfolio-theme', next)
    } catch {
      // Private mode: the theme still applies for this visit.
    }
  }, [])

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
          <img
            src="/logo.svg"
            alt="Rishabh Sharma"
            className="size-7"
            draggable={false}
          />
        }
        rightContent={
          <div className="flex items-center gap-2">
            <SwitchButton
              size="sm"
              showLabel={false}
              theme={theme}
              onThemeChange={handleThemeChange}
            />
            <a
              href={PERSON.resumeHref}
              download="Rishabh_Sharma_Resume.pdf"
              className="inline-flex items-center gap-1.5 rounded-lg border border-lime-600/45 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-lime-600 transition-colors hover:bg-lime-600/10 dark:border-lime-400/45 dark:text-lime-400 dark:hover:bg-lime-400/10"
            >
              <Download size={14} aria-hidden="true" />
              Resume
            </a>
          </div>
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
            <CodingProfiles />
            <Experience />
            <Contact />
            <section
              className="section"
              aria-label="Page feedback"
            >
              <div className="section-inner flex justify-center">
                <HelpfulRating />
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </NotchNav>
    </>
  )
}
