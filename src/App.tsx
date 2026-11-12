import { useEffect, useRef, useState } from "react";
import ChatModal from "./components/ChatModal";
import CursorLabel from "./components/CursorLabel";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import { REELS } from "./data/site";

/** Entrance: preload the reel posters + sky, drive the loader's odometer
 *  toward the real load fraction at ~60 points/sec (the live pace), lift
 *  the loader at 100%. The loader shows the hero wall itself drifting on
 *  the paper, and the brand flies onto the header wordmark as the paper
 *  fades. Reduced-motion skips the loader entirely. The hero renders
 *  underneath from the start, like the live site. */
const ASSETS = [...REELS.map((r) => r.thumb), "/sky.jpg"];

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "loading",
  );
  const targetRef = useRef(0);
  const progressRef = useRef(0);
  const doneRef = useRef(false);

  const finish = (immediate = false) => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (immediate) {
      // Skip: jump straight to the hero, no morph, no fade.
      setPhase("done");
      return;
    }
    // Completion: the brand morph runs 1.3s, so the loader stays mounted
    // 1.4s while the paper fades (.9s) and the name lands on the wordmark.
    setPhase("leaving");
    window.setTimeout(() => setPhase("done"), 1400);
  };

  // The header nav + Human/Agent switch fade in only once the loader is
  // gone (the live site's staggered header entrance); the wordmark itself
  // stays put — it is the loader brand's landing spot.
  useEffect(() => {
    document.body.dataset.phase = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const t0 = performance.now();
    let loaded = 0;
    for (const src of ASSETS) {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        targetRef.current = (loaded / ASSETS.length) * 100;
      };
      img.src = src;
    }
    // Safety: never stall on a hung asset.
    const safety = window.setTimeout(() => (targetRef.current = 100), 4000);
    let raf = 0;
    const tick = () => {
      const next = Math.min(targetRef.current, progressRef.current + 1.1);
      progressRef.current = next;
      setProgress(next);
      if (next >= 100 && performance.now() - t0 >= 1400) finish();
      else if (!doneRef.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <>
      <CursorLabel />
      <Home onOpenChat={() => setChatOpen(true)} entered={phase !== "loading"} />
      {phase !== "done" && <Loader progress={progress} leaving={phase === "leaving"} onSkip={() => finish(true)} />}
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </>
  );
}
