import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Scroll reveal, now GSAP-driven (was IntersectionObserver + CSS): the same
// API (children, className, delay) so every section keeps working unchanged.
// Transform + opacity only, fires once. The page scrolls inside the
// NotchNav viewport, not the window, so the trigger uses that scroller.
// Under prefers-reduced-motion no tween is created, so content stays
// visible — never left at opacity 0 waiting for a tween that won't run.
export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return undefined
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return undefined
      }
      const viewport = document.querySelector('[data-notch-viewport]')
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: 0.8,
        delay: delay / 1000,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
          scroller: viewport || undefined,
        },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
