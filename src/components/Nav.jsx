import { useEffect, useRef, useState } from 'react'
import { Download, Menu, X } from 'lucide-react'
import { NAV_LINKS, PERSON } from '../data/portfolio'

// Fixed nav that stays hidden at scroll-top (so the hero's top labels
// are never covered) and slides in once the user scrolls past ~100px.
// Active section is tracked with IntersectionObserver.
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.body.style.overflow = 'hidden'
    firstLinkRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = ''
    }
  }, [open ])

  const visible = scrolled || open

  return (
    <header className={`nav${visible ? ' is-visible' : ''}${open ? ' menu-open' : ''}`}>
      <div className="nav-inner">
        <a href="#home" className="nav-brand" aria-label="Rishabh Sharma — back to top">
          <span className="nav-mark" aria-hidden="true">
            R
          </span>
          <span className="nav-name">Rishabh Sharma</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? 'is-active' : ''}
              aria-current={active === l.id ? 'location' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a className="nav-resume" href={PERSON.resumeHref} download="Rishabh_Sharma_Resume.pdf">
          <Download size={15} aria-hidden="true" />
          Resume
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          ref={toggleRef}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        {NAV_LINKS.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            ref={i === 0 ? firstLinkRef : undefined}
            onClick={() => setOpen(false)}
            className={active === l.id ? 'is-active' : ''}
            aria-current={active === l.id ? 'location' : undefined}
          >
            {l.label}
          </a>
        ))}
        <a
          className="mobile-resume"
          href={PERSON.resumeHref}
          download="Rishabh_Sharma_Resume.pdf"
          onClick={() => setOpen(false)}
        >
          <Download size={16} aria-hidden="true" />
          Download Resume
        </a>
      </div>
    </header>
  )
}
