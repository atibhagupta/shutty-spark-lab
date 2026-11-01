import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHead } from "./ui/Brand";
import { AuraRing } from "./AuraRing";
import { EASE_OUT, viewport } from "@/lib/motion";

/** Runs `draw(t)` on a DPR-scaled canvas while it's on screen. */
function useCanvasLoop(draw: (c: CanvasRenderingContext2D, w: number, h: number, t: number) => void, run: boolean) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    let raf = 0;
    let visible = false;
    const t0 = performance.now();
    const frame = (now: number) => {
      draw(ctx, cv.width, cv.height, (now - t0) / 1000);
      if (visible && run) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [draw, run]);
  return ref;
}

function drawRings(c: CanvasRenderingContext2D, w: number, h: number, t: number) {
  c.clearRect(0, 0, w, h);
  c.strokeStyle = "#e0e6e4";
  c.lineWidth = 2;
  const unit = Math.max(w, h) / 1.6;
  for (let i = 0; i < 7; i++) {
    const r = ((i / 7 + t * 0.03) % 1) * unit + 60;
    c.globalAlpha = Math.max(0, 1 - r / unit) * 0.9;
    c.beginPath();
    c.arc(w * 0.78, h * 0.5, r, 0, Math.PI * 2);
    c.stroke();
  }
  c.globalAlpha = 1;
}

/** "What Shutty is": an advanced pomodoro your circle can see. */
export function WhatIsShutty() {
  const reduced = useReducedMotion();
  const ringsRef = useCanvasLoop(drawRings, !reduced);

  return (
    <div className="relative overflow-hidden pt-24 pb-24 sm:pt-32">
      <canvas
        ref={ringsRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ maskImage: "linear-gradient(180deg, #000 60%, transparent)", WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent)" }}
      />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <SectionHead
            index="01"
            label="What Shutty is"
            title={
              <>
                Coworking, minus the <em className="serif-italic font-normal">strangers.</em>
              </>
            }
            lede="An advanced pomodoro timer your circle can see. Start a session and your friends watch the clock run — the accountability of a coworking room, without sitting next to randoms."
          />
          <motion.div
            className="mt-8 flex flex-wrap gap-2.5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
          >
            {["Pomodoro, upgraded", "Visible to your circle"].map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                {c}
              </span>
            ))}
            <span className="rounded-full bg-lime px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-lime-ink">
              Share it anywhere
            </span>
          </motion.div>
        </div>

        <AuraRing />
      </div>
    </div>
  );
}
