import { useReducedMotion } from "framer-motion";

const PHRASES = [
  "A productivity app that actually works",
  "No app blocking",
  "Phone face down, timer on",
  "Tracks every pickup",
  "See where your focus hours go",
  "Friends see your sessions",
  "Share your milestones",
  "Train focus like a muscle",
];

/** A thin mono strip under the hero. Two copies, one linear loop: seamless. */
export function Ticker({ tone = "ink" }: { tone?: "ink" | "lime" }) {
  const reduced = useReducedMotion();
  const styles =
    tone === "ink"
      ? { background: "var(--ink)", color: "var(--paper)" }
      : { background: "var(--lime)", color: "var(--lime-ink)" };
  const row = (
    <>
      {PHRASES.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-6 pr-6">
          <span>{p}</span>
          <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-orange" />
        </span>
      ))}
    </>
  );
  return (
    <div className="overflow-hidden select-none" style={styles} aria-label={PHRASES.join(". ")}>
      <div
        className={`flex w-max font-mono uppercase whitespace-nowrap py-3 ${reduced ? "" : "marquee-track"}`}
        style={{ fontSize: 11.5, letterSpacing: "0.14em", animationDuration: "48s" }}
        aria-hidden="true"
      >
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}
