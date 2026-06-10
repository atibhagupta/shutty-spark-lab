/**
 * Minimal moving orange grid backdrop (pure CSS — no video).
 * A subtle perspective floor of orange lines drifting toward the viewer.
 */
export function OrangeGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* drifting orange grid */}
      <div className="orange-grid absolute inset-0 opacity-[0.18]" />
      {/* soft fade so the grid melts into the black canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
      {/* faint orange glow pool */}
      <div
        className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--orange) 0%, transparent 65%)" }}
      />
    </div>
  );
}
