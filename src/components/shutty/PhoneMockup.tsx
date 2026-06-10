import { useEffect, useState } from "react";

/**
 * Live focus-session phone mockup.
 * `progress` (0..1) drives scroll-linked rotation/zoom of floating elements.
 */
export function PhoneMockup({ progress }: { progress: number }) {
  // Live ticking seconds inside the session ring.
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s + 1) % 60), 1000);
    return () => clearInterval(id);
  }, []);

  // Ring fill at 23 / 90 minutes.
  const pct = 23 / 90;
  const R = 88;
  const C = 2 * Math.PI * R;

  // Scroll-reactive transforms — elements "zoom up" toward the phone.
  const p = progress;
  const tilt = -8 + p * 14; // phone tilts upright as you scroll
  const lift = (1 - p) * 60; // floating chips fly up into the screen

  const floaters = [
    { label: "+3 streak", top: "4%", left: "-14%", delay: 0 },
    { label: "🟢 LOCKED IN", top: "30%", left: "-22%", delay: 0.1 },
    { label: "Rank #4 / 1248", top: "62%", left: "-16%", delay: 0.2 },
    { label: "🔥 Personal best", top: "12%", left: "92%", delay: 0.15 },
    { label: "Tribe online: 1.2k", top: "48%", left: "94%", delay: 0.25 },
    { label: "Phone: face down", top: "78%", left: "88%", delay: 0.35 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-sm select-none">
      {/* floating data chips that zoom toward the phone on scroll */}
      {floaters.map((f, i) => {
        const dir = parseFloat(f.left) < 50 ? -1 : 1;
        return (
          <div
            key={i}
            className="absolute z-20 hidden rounded-sm border border-orange/40 bg-black/80 px-3 py-1.5 font-mono text-[10px] tracking-wide text-orange backdrop-blur sm:block"
            style={{
              top: f.top,
              left: f.left,
              transform: `translate(${dir * (1 - p) * 90}px, ${lift}px) scale(${0.7 + p * 0.45})`,
              opacity: 0.25 + p * 0.75,
              transition: "transform 0.15s linear, opacity 0.15s linear",
              animation: `shutty-float ${4 + i}s ease-in-out ${f.delay}s infinite`,
            }}
          >
            {f.label}
          </div>
        );
      })}

      {/* phone frame */}
      <div
        className="relative z-10 overflow-hidden rounded-[2.2rem] border border-white/15 bg-black p-4 shadow-[0_0_60px_-12px_var(--orange-glow)]"
        style={{
          transform: `perspective(1200px) rotateX(${tilt}deg) rotateZ(${(1 - p) * -3}deg) scale(${0.92 + p * 0.12})`,
          transition: "transform 0.15s linear",
        }}
      >
        {/* notch */}
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/20" />

        {/* header */}
        <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Deep Work</span>
          <span className="flex items-center gap-1.5 text-greenlock">
            <span className="h-1.5 w-1.5 rounded-full bg-greenlock animate-blink" /> live
          </span>
        </div>

        {/* timer ring */}
        <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
          <span className="absolute h-44 w-44 rounded-full border border-orange/40" style={{ animation: "shutty-ring-pulse 2.8s ease-out infinite" }} />
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="var(--orange)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ filter: "drop-shadow(0 0 8px var(--orange-glow))", transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="text-center">
            <div className="font-mono text-4xl font-bold tabular-nums text-foreground">
              23<span className="text-muted-foreground">:{secs.toString().padStart(2, "0")}</span>
            </div>
            <div className="mt-1 font-mono text-xs tracking-widest text-orange">23 / 90 MIN</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              stay shutty
            </div>
          </div>
        </div>

        {/* mini live feed */}
        <div className="mt-6 space-y-2">
          {[
            { n: "@maya.r", s: "🟢 LOCKED IN", c: "text-greenlock", w: "82%" },
            { n: "@decoded", s: "🟢 LOCKED IN", c: "text-greenlock", w: "64%" },
            { n: "@jonas", s: "🔴 DROPPED", c: "text-reddrop", w: "31%" },
          ].map((u) => (
            <div key={u.n} className="rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-foreground">{u.n}</span>
                <span className={u.c}>{u.s}</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-orange" style={{ width: u.w, boxShadow: "0 0 8px var(--orange-glow)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* bottom action */}
        <div className="mt-5 rounded-sm border border-orange bg-orange/10 py-2.5 text-center font-mono text-xs tracking-widest text-orange">
          END SESSION
        </div>
      </div>

      {/* glow base */}
      <div className="absolute -bottom-10 left-1/2 h-24 w-64 -translate-x-1/2 rounded-full bg-orange/20 blur-3xl" />
    </div>
  );
}