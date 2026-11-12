import { useEffect, useRef, useState } from "react";
import ChatModal from "./components/ChatModal";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import { REELS } from "./data/site";

/** Entrance: preload the reel posters + sky, drive the loader's odometer
 *  toward the real load fraction at ~60 points/sec (the live pace), lift
 *  the loader at 100%. Reduced-motion skips the loader entirely. The hero
 *  renders underneath from the start, like the live site. */
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

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("leaving");
    window.setTimeout(() => setPhase("done"), 650);
  };

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
      <Home onOpenChat={() => setChatOpen(true)} entered={phase !== "loading"} />
      {phase !== "done" && <Loader progress={progress} leaving={phase === "leaving"} onSkip={finish} />}
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </>
  );
}
