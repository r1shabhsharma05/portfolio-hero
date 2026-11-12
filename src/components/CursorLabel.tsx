import { useEffect, useRef } from "react";

/** Custom cursor label — the live site's "PLAY" pill. A fixed pill follows
 *  the pointer (lerp .22, like the live site) and shows the text of the
 *  nearest [data-cursor] ancestor ("Play" over a reel card). Fine pointers
 *  only; hidden on touch and reduced-motion, like the live site. */
export default function CursorLabel() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
      const t = e.target instanceof Element ? e.target : null;
      const o = t?.closest("[data-cursor]");
      if (o) {
        el.textContent = (o as HTMLElement).dataset.cursor ?? "";
        el.dataset.on = "";
      } else {
        delete el.dataset.on;
      }
    };
    const onLeave = () => {
      delete el.dataset.on;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-label" aria-hidden="true" />;
}
