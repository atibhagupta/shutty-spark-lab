import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PhoneFrame } from "./mock/PhoneFrame";
import { Stamp } from "./ui/Brand";
import { EASE_OUT } from "@/lib/motion";
import { useAutoplayInView } from "@/lib/useAutoplayInView";

/**
 * A real screen recording of the app (public/video/hero-app.mp4): boot → name a
 * task → 45 min → Start → the focus room. Sits to the right of the hero copy,
 * tucked behind the giant headline so the falling pills pass in front of it.
 */
export function HeroPhone({ width = 272 }: { width?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useAutoplayInView(ref, !reduced);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute hidden lg:block pointer-events-none z-0"
      style={{
        top: 104,
        right: "max(clamp(20px, 4vw, 48px), calc((100% - 1240px) / 2 + clamp(20px, 4vw, 48px)))",
        width,
      }}
      initial={{ opacity: 0, y: 48, rotate: -12 }}
      animate={{ opacity: 1, y: 0, rotate: -6 }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.45 }}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1.6 }}
        className="relative"
      >
        <PhoneFrame
          width={width}
          island={false}
          frameColor="#1d231c"
          style={{ boxShadow: "0 60px 90px -40px rgba(36,41,31,0.6), 0 1px 0 rgba(36,41,31,0.08)" }}
          screen={
            <video
              ref={ref}
              className="block h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/video/hero-app-poster.jpg"
              style={{ background: "var(--deep)" }}
            >
              <source src="/video/hero-app.mp4" type="video/mp4" />
            </video>
          }
        />

        <Stamp className="absolute -left-10 top-10 rotate-[-14deg] scale-90">Actual build</Stamp>
      </motion.div>
    </motion.div>
  );
}
