import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { Nav } from "./components/Nav";
import { FilmHero } from "./components/FilmHero";
import { Ticker } from "./components/Ticker";
import { Facts } from "./components/Facts";
import { Comparison } from "./components/Comparison";
import { HowItWorks } from "./components/HowItWorks";
import { MockupCards } from "./components/MockupCards";
import { ArcGallery } from "./components/ArcGallery";
import { GravityDrop } from "./components/GravityDrop";
import { MorphStack } from "./components/MorphStack";
import { Waitlist, type WaitlistHandle } from "./components/Waitlist";
import { RadialFooter } from "./components/RadialFooter";
import { EASE_OUT } from "./lib/motion";

export default function App() {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const waitlistRef = useRef<WaitlistHandle>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [nudged, setNudged] = useState(false);

  // Smooth scroll. Lenis only drives the wheel; everything else is native.
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = useCallback((target: string, offset = -24) => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /** "Open the app" — there's no app yet, so this is the waitlist with a nudge. */
  const goToWaitlist = useCallback(() => {
    scrollTo("#waitlist", -72);
    setToast("The app isn’t out yet. Save a spot and we’ll send one email.");
    setNudged(false);
    window.setTimeout(() => {
      waitlistRef.current?.focus();
      setNudged(true);
    }, reduced ? 50 : 1300);
    window.setTimeout(() => setToast(null), 4200);
  }, [scrollTo, reduced]);

  return (
    <div className="relative min-h-dvh grain-overlay">
      <Nav onJoin={goToWaitlist} onNavigate={(href) => scrollTo(href, href === "#top" ? 0 : -72)} />

      <main className="overflow-x-clip">
        <FilmHero onJoin={goToWaitlist} />
        <Ticker />
        <MorphStack
          marks={[
            { n: "01" },
            null,
            { n: "03" },
            { n: "04" },
            { n: "05", tone: "cream" },
            { n: "06" },
            { n: "07" },
          ]}
        >
          <Facts />
          <Comparison />
          <HowItWorks />
          <MockupCards onJoin={goToWaitlist} />
          <ArcGallery />
          <GravityDrop />
          <Waitlist ref={waitlistRef} nudged={nudged} />
        </MorphStack>
      </main>

      <RadialFooter onJoin={goToWaitlist} />

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed left-1/2 bottom-6 z-[60] -translate-x-1/2 px-4 py-3 rounded-[12px] bg-ink text-paper text-[13.5px] shadow-[0_18px_40px_-20px_rgba(36,41,31,.6)] max-w-[calc(100vw-32px)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime mr-2.5 align-middle" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
