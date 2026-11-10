import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Site-wide GSAP: the scroll progress bar and the footer entrance.
 * Called once in App, scoped to the NotchNav content wrapper.
 *
 * The page scrolls inside the NotchNav viewport, NOT the window, so every
 * ScrollTrigger here gets `scroller: [data-notch-viewport]`. Under
 * prefers-reduced-motion nothing is created — the bar stays at scaleX 0
 * (invisible) and the footer stays visible.
 */
export function useSiteAnimations(contentRef, progressRef) {
  useGSAP(
    () => {
      if (reducedMotion()) return undefined
      const viewport = document.querySelector('[data-notch-viewport]')
      const scroller = viewport || undefined

      // Scroll progress: lime bar across the top, driven by the viewport scroll.
      if (progressRef.current && contentRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.3,
              scroller,
            },
          },
        )
      }

      // Footer: gentle rise when it scrolls in.
      const footer = contentRef.current?.querySelector('footer')
      if (footer) {
        gsap.from(footer, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: footer,
            start: 'top 94%',
            once: true,
            scroller,
          },
        })
      }

      // Layout settles after fonts/images load (loader, portrait) — re-measure.
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      if (document.fonts?.ready) document.fonts.ready.then(refresh)
      return () => window.removeEventListener('load', refresh)
    },
    { scope: contentRef },
  )
}
