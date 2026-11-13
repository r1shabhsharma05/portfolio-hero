import { useEffect, useRef } from "react";

/** The entrance loader — the live site's loading screen, exact. Paper
 *  overlay, serif "Rishabh." rolling up masked letter by letter top-left,
 *  "LOADING REELS" + reel count (01/12, real preload) + a rolling-odometer
 *  percent bottom-right, and a skip button bottom-left. The hero wall
 *  itself is the single scene underneath (Home's HeroScene): it shows
 *  through the paper in formation while loading and expands into the hero
 *  arc as the paper fades. At 100% the name flies onto the header wordmark
 *  (the "." fades out mid-flight). Escape / Tab skips straight to the hero,
 *  like the live site. */
function Odometer({ value }: { value: number }) {
  const digits = String(Math.min(100, Math.max(0, Math.floor(value)))).padStart(3, "0");
  return (
    <span className="loader-count" role="progressbar" aria-label="Preparing Reel previews" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(value)}>
      {digits.split("").map((d, i) => (
        <span className="loader-mask" key={i}>
          <span className="odometer" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
      <span className="loader-percent">%</span>
    </span>
  );
}

export default function Loader({ progress, leaving, loadedReels, reelTotal, onSkip }: { progress: number; leaving: boolean; loadedReels: number; reelTotal: number; onSkip: () => void }) {
  const brandRef = useRef<HTMLParagraphElement | null>(null);

  // Escape / Tab skips the entrance, like the live site.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") onSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSkip]);

  // When the load completes, fly the brand onto the header wordmark —
  // the live site's name morph is 1.3s, [.65,0,.35,1]; ours runs 1.0s,
  // faster per the faster-loader order. The trailing "." fades out
  // mid-flight; the header's "Rishabh" is underneath at the landing spot,
  // so the swap is invisible when the loader unmounts.
  useEffect(() => {
    if (!leaving) return;
    const brand = brandRef.current;
    const target = document.querySelector(".wordmark-first");
    if (!brand || !target) return;
    const r = brand.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const scale =
      parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(brand).fontSize);
    const flight = brand.animate(
      [
        { transform: "translate(0px, 0px) scale(1)" },
        { transform: `translate(${t.left - r.left}px, ${t.top - r.top}px) scale(${scale})` },
      ],
      { duration: 1000, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" },
    );
    const period = brand.querySelector(".loader-mask:last-child > span");
    const fade = period?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 500,
      fill: "forwards",
    });
    return () => {
      flight.cancel();
      fade?.cancel();
    };
  }, [leaving]);

  return (
    <>
      <p className="loader-brand" ref={brandRef} aria-hidden="true">
        {"Rishabh.".split("").map((ch, i) => (
          <span className="loader-mask" key={i}>
            <span style={{ animationDelay: `${120 + i * 55}ms` }}>{ch}</span>
          </span>
        ))}
      </p>
      <div className={`reel-loader${leaving ? " is-leaving" : ""}`} aria-hidden={leaving}>
        <div className="loader-status">
          <p className="loader-caption">Loading reels</p>
          <p className="loader-reels">
            {String(Math.min(loadedReels, reelTotal)).padStart(2, "0")} / {String(reelTotal).padStart(2, "0")}
          </p>
          <Odometer value={progress} />
        </div>
        <button type="button" className="loader-skip" aria-label="Skip entrance animation" title="Skip animation" onClick={onSkip}>
          ↗
        </button>
      </div>
    </>
  );
}
