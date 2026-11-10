import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Section titles rise word by word as they scroll in (SplitText + mask);
// the eyebrow and sub fade with them. Reduced motion: plain title, no split.
export default function SectionHeading({ id, eyebrow, title, sub }) {
  const rootRef = useRef(null)
  const titleRef = useRef(null)

  useGSAP(
    () => {
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return undefined
      }
      const title = titleRef.current
      if (!title) return undefined
      const viewport = document.querySelector('[data-notch-viewport]')
      const scroller = viewport || undefined
      const split = new SplitText(title, { type: 'words', mask: 'words' })
      gsap.from(split.words, {
        yPercent: 110,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 88%',
          once: true,
          scroller,
        },
      })
      gsap.from(
        rootRef.current.querySelectorAll('.section-eyebrow, .section-sub'),
        {
          y: 12,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 88%',
            once: true,
            scroller,
          },
        },
      )
    },
    { scope: rootRef },
  )

  return (
    <div className="section-head" ref={rootRef}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title" id={id} ref={titleRef}>
        {title}
      </h2>
      {sub ? <p className="section-sub">{sub}</p> : null}
    </div>
  )
}
