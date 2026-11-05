import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useAutoplayInView } from "@/lib/useAutoplayInView";

/**
 * Ambient loop behind the hero (public/video/hero-ambient.mp4): paper ground, the
 * 60-tick dial turning one tick per loop, a lime haze, grain. Washed back so the
 * headline and the falling pills stay the subject.
 */
export function HeroBackdrop() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplayInView(ref, !reduced);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="video/hero-ambient-poster.jpg"
      >
        <source src="video/hero-ambient.mp4" type="video/mp4" />
      </video>
      {/* Paper wash: keeps contrast for the ink headline, fades to solid at the floor. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,243,235,0.35) 0%, rgba(245,243,235,0.15) 45%, rgba(245,243,235,0.8) 85%, var(--paper) 100%)",
        }}
      />
    </div>
  );
}
