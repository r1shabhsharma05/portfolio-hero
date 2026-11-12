import { REELS } from "../data/site";
import ReelCard from "./ReelCard";

/** The reel ring — the live site's hero wall. Cards sit on a shallow arc
 *  (centre far/small/high, ends near/large/low, tilted outward) and ride
 *  around it as `rotation` changes. The reel list is rendered twice so the
 *  arc never runs out of cards: rotation wraps over the full 240° span while
 *  only the middle ~108° is visible, cards fading at the edges. */
const STEP = 12; // degrees between adjacent cards
const SPAN = REELS.length * 2 * STEP; // 240° for the doubled list
const HALF_WINDOW = 54; // visible half-width of the arc, degrees

function wrap(a: number) {
  return ((((a + SPAN / 2) % SPAN) + SPAN) % SPAN) - SPAN / 2;
}

export default function ReelRing({ rotation, entering = false }: { rotation: number; entering?: boolean }) {
  const cards = [...REELS, ...REELS];
  return (
    <div className={`ring${entering ? " ring-entering" : ""}`} aria-label="Latest reels">
      {cards.map((reel, i) => {
        const a = wrap(i * STEP + rotation);
        const rad = (a * Math.PI) / 180;
        const x = 640 * Math.sin(rad);
        const y = 150 * (1 - Math.cos(rad));
        const z = 160 * (1 - Math.cos(rad));
        const scale = 0.78 + 0.22 * (Math.abs(a) / HALF_WINDOW);
        const ry = a * 0.45;
        // Fade out toward the arc ends so the wrap is invisible.
        const fade = Math.max(0, Math.min(1, (HALF_WINDOW - Math.abs(a)) / 9));
        const visible = fade > 0.02;
        return (
          <ReelCard
            key={`${reel.id}-${i}`}
            reel={reel}
            style={
              {
                "--ring-tf": `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                "--ring-o": fade.toFixed(3),
                "--i": i % REELS.length,
                pointerEvents: visible ? undefined : "none",
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
