import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { useAutoplayInView } from "@/lib/useAutoplayInView";

/**
 * The "what Shutty is" graphic: a neon-green aura ring vibrating on the page
 * (public/video/aura.mp4, white ground so it needs no box) with a live
 * countdown and a few quiet labels in the middle. The timer is HTML so it
 * stays crisp and actually counts.
 */
export function AuraRing() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplayInView(ref, !reduced, { threshold: 0.2 });

  // 24:50 counting down while on screen.
  const [sec, setSec] = useState(24 * 60 + 50);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setSec((s) => (s > 0 ? s - 1 : 25 * 60)), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[560px]"
      style={{ aspectRatio: "1 / 1" }}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE_OUT }}
    >
      <video
        ref={ref}
        className="aura-video absolute inset-0 h-full w-full object-contain"
        style={{
          // Fade the clip's white ground into the page so it has no square edge.
          maskImage: "radial-gradient(circle at 50% 50%, #000 42%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 42%, transparent 68%)",
        }}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/aura-poster.jpg"
        aria-hidden
      >
        <source src="/video/aura.mp4" type="video/mp4" />
      </video>

      {/* Centre: you, focusing */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="eyebrow text-emerald max-sm:text-[9px]">You · 25 min sprint</span>
        <span
          className="mt-3 font-medium tabular-nums text-ink"
          style={{ fontSize: "clamp(44px, 12vw, 84px)", lineHeight: 1, letterSpacing: "-0.05em" }}
        >
          {mm}:{ss}
        </span>
        <span className="eyebrow mt-3 text-muted-ink max-sm:text-[9px]">phone face down</span>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1.5 font-mono text-[11px] max-sm:text-[9px] max-sm:mt-4 uppercase tracking-[0.1em] text-ink backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
          </span>
          3 friends watching
        </span>
      </div>
    </motion.div>
  );
}
