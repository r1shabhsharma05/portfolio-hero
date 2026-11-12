import { useRef } from "react";
import type { Reel } from "../data/site";

/** Reel card: poster img + hover-play preview video (live-site mechanism — the
 *  video has no src until hover, then loads from data-preview-src, plays muted
 *  on loop; pause + reset on leave). Poster-only reels have no video element.
 *  Grid cards lay flat; the hero wall renders its own WebGL cards. */
export default function ReelCard({ reel, style }: { reel: Reel; style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = videoRef.current;
    if (!v || !reel.preview) return;
    if (!v.src) v.src = v.dataset.previewSrc ?? "";
    v.play().catch(() => {});
    v.closest(".reel-card")?.classList.add("is-playing");
  };
  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    v.closest(".reel-card")?.classList.remove("is-playing");
  };

  return (
    <a
      className="reel-card"
      href={reel.url}
      target="_blank"
      rel="noreferrer"
      data-card=""
      data-cursor="Play"
      style={style}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      <img className="reel-poster" src={reel.thumb} alt={reel.title} loading="lazy" draggable={false} />
      {reel.preview && (
        <video
          ref={videoRef}
          className="reel-preview"
          data-preview-src={reel.preview}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      <span className="reel-views">{reel.views ? `${reel.views} views` : "New"}</span>
      <span className="reel-meta">
        <span className="reel-tag">{reel.tag}</span>
        <span className="reel-title">{reel.title}</span>
      </span>
    </a>
  );
}
