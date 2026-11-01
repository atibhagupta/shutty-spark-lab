import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

/* Beats of the film, in seconds. Must match /tmp render (brain.html TIMES). */
const T_CRACKED = 2.6; // caption leaves
const T_REVEAL = 4.1; // brain has slid aside; copy comes in
const T_HOLD = 5.4; // loop point: the tail is one breath, so seeking here is seamless

/**
 * The hero is a short film: a brain set in stone cracks open into a fresh one,
 * then slides aside for the headline. Only the brain is baked into the video;
 * the copy is HTML timed to playback so it stays responsive and clickable.
 * On scroll it simply dissolves: the copy drifts up a little faster than the
 * page and the film fades, so the next section takes over without a pin.
 */
export function FilmHero({ onJoin }: { onJoin: () => void }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // 0 = stone, 1 = cracked (caption gone), 2 = revealed (copy in)
  const [phase, setPhase] = useState(reduced ? 2 : 0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      return;
    }
    let fallback = 0;
    const onTime = () => {
      const t = v.currentTime;
      setPhase((p) => (t >= T_REVEAL ? 2 : t >= T_CRACKED ? Math.max(p, 1) : p));
    };
    const onEnded = () => {
      v.currentTime = T_HOLD;
      v.play().catch(() => {});
    };
    const tryPlay = () => {
      if (v.paused) v.play().catch(() => {});
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    // If autoplay is refused the poster is the final frame, so show the copy.
    const onPlaying = () => window.clearTimeout(fallback);
    fallback = window.setTimeout(() => setPhase(2), 2500);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", onVisibility);
    tryPlay();
    return () => {
      window.clearTimeout(fallback);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  /* Scroll-linked exit: as the hero scrolls off, the copy leads and the film fades. */
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end start"] });
  const filmY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const dim = useTransform(scrollYProgress, [0.2, 0.9], [0, 0.7]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const revealed = phase >= 2;
  const show = (i: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.1 + i * 0.14 },
  });

  return (
    <section ref={wrapRef} id="top" className="relative" style={{ height: "100svh" }}>
      <div className="h-[100svh] overflow-hidden">
        <div className="relative h-full w-full overflow-hidden bg-paper">
          {/* The film. Portrait cut on tall screens, landscape otherwise. */}
          <motion.video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ y: filmY }}
            muted
            playsInline
            autoPlay={!reduced}
            preload="auto"
            poster="/video/hero-film-landscape-poster.jpg"
            aria-hidden
          >
            <source src="/video/hero-film-portrait.mp4" type="video/mp4" media="(orientation: portrait)" />
            <source src="/video/hero-film-landscape.mp4" type="video/mp4" />
          </motion.video>

          {/* Caption while the brain is still stone */}
          <motion.p
            className="eyebrow absolute left-0 right-0 text-center text-muted-ink pointer-events-none portrait:bottom-[22%] landscape:bottom-[13%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 0 && !reduced ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: phase === 0 ? 0.5 : 0 }}
          >
            Your focus, set in stone.
          </motion.p>

          {/* Copy: right half in landscape, lower half in portrait */}
          <motion.div
            className="absolute inset-0 wrap flex portrait:items-end portrait:pb-[9svh] landscape:items-center"
            style={{ y: copyY, opacity: copyOpacity }}
          >
            <div className="w-full landscape:ml-auto landscape:w-[50%] landscape:max-w-[620px] landscape:pl-6">
              <motion.p className="eyebrow" {...show(0)}>
                This is what Shutty is built to do
              </motion.p>
              <motion.h1
                className="mt-5 font-medium text-ink"
                style={{ fontSize: "clamp(34px, 4.6vw, 70px)", lineHeight: 1.02, letterSpacing: "-0.05em" }}
                {...show(1)}
              >
                A productivity app that <em className="serif-italic">actually</em> works.
              </motion.h1>
              <motion.p
                className="mt-5 max-w-[46ch] text-muted-ink"
                style={{ fontSize: "clamp(15px, 1.25vw, 19px)", lineHeight: 1.5 }}
                {...show(2)}
              >
                It helps you organise your working hours — and shows you where they really went.
              </motion.p>
              <motion.div className="mt-8 flex flex-wrap items-center gap-3" {...show(3)}>
                <button type="button" onClick={onJoin} className="btn-primary min-w-[220px]">
                  <span>Open the app</span>
                  <ArrowUpRight size={19} />
                </button>
                <span className="text-[13px] text-muted-ink">Not out yet — join the waitlist.</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Dims as the page scrolls over */}
          <motion.div className="absolute inset-0 bg-paper pointer-events-none" style={{ opacity: dim }} />

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none portrait:hidden landscape:flex"
            style={{ opacity: hintOpacity }}
          >
            <span className="eyebrow text-muted-ink">Scroll</span>
            <span className="relative block w-px h-10 bg-line overflow-hidden">
              <motion.span
                className="absolute left-0 top-0 w-px h-4 bg-ink"
                animate={reduced ? undefined : { y: [-16, 40] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
