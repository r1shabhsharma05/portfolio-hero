import ReelRing from "./ReelRing";

/** The entrance loader — the live site's loading screen, exact. Paper
 *  overlay, serif "Rishabh." rolling up masked letter by letter top-left,
 *  the reel ring flying in from deep, "LOADING REELS" + a rolling-odometer
 *  percent bottom-right, and a skip button bottom-left. Dismisses with a
 *  fast fade once progress hits 100 (or on skip). */
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

export default function Loader({ progress, leaving, onSkip }: { progress: number; leaving: boolean; onSkip: () => void }) {
  return (
    <div className={`reel-loader${leaving ? " is-leaving" : ""}`} aria-hidden={leaving}>
      <p className="loader-brand" aria-hidden="true">
        {"Rishabh.".split("").map((ch, i) => (
          <span className="loader-mask" key={i}>
            <span style={{ animationDelay: `${120 + i * 55}ms` }}>{ch}</span>
          </span>
        ))}
      </p>
      <div className="loader-ring">
        <ReelRing rotation={0} entering />
      </div>
      <div className="loader-status">
        <p className="loader-caption">Loading reels</p>
        <Odometer value={progress} />
      </div>
      <button type="button" className="loader-skip" aria-label="Skip entrance animation" title="Skip animation" onClick={onSkip}>
        ↗
      </button>
    </div>
  );
}
