/**
 * Ambient looping motion-graphic background (CSS/SVG "video").
 * Drifting grid + scanning beam + floating data particles.
 */
export function MotionField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* scanning beam */}
      <div
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-orange/15 to-transparent"
        style={{ animation: "shutty-scan 7s linear infinite" }}
      />
      {/* radial vignette glow */}
      <div
        className="absolute -left-1/4 top-1/3 h-[40rem] w-[40rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--orange) 0%, transparent 60%)" }}
      />
      {/* drifting particles */}
      {[...Array(14)].map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-orange/50"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animation: `shutty-float ${5 + (i % 5)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}