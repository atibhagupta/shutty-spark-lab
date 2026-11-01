import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Coffee } from "lucide-react";
import Matter from "matter-js";
import { EASE_OUT } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* The things that fall                                               */
/* ------------------------------------------------------------------ */

type Item =
  | { id: string; kind: "pill"; label: string; tone: "ink" | "lime" | "paper" | "panel" | "orange" }
  | { id: string; kind: "phone" }
  | { id: string; kind: "coin" }
  | { id: string; kind: "timer" }
  | { id: string; kind: "coffee" };

const ITEMS: Item[] = [
  { id: "phone", kind: "phone" },
  { id: "p-25", kind: "pill", label: "25 min", tone: "ink" },
  { id: "p-flow", kind: "pill", label: "Pure Flow", tone: "lime" },
  { id: "coin", kind: "coin" },
  { id: "p-code", kind: "pill", label: "Code", tone: "paper" },
  { id: "p-day", kind: "pill", label: "Day 41", tone: "orange" },
  { id: "timer", kind: "timer" },
  { id: "p-coins", kind: "pill", label: "+2,700 coins", tone: "orange" },
  { id: "p-top", kind: "pill", label: "Top 8%", tone: "ink" },
  { id: "p-study", kind: "pill", label: "Study", tone: "paper" },
  { id: "coffee", kind: "coffee" },
  { id: "p-verified", kind: "pill", label: "Verified", tone: "panel" },
  { id: "p-streak", kind: "pill", label: "12 day streak", tone: "ink" },
  { id: "p-design", kind: "pill", label: "Design", tone: "paper" },
];

const MOBILE_IDS = new Set(["phone", "p-25", "p-flow", "coin", "p-top", "timer", "p-code", "p-streak"]);

const HEADLINE = "Phone down.";

/** Glyph tops as a fraction of font-size for Helvetica-class faces, line-height 1. */
const BASELINE = 0.87;
function glyphTop(ch: string): number {
  if (ch === ".") return BASELINE - 0.11;
  if (/[A-Z]/.test(ch)) return 0.155;
  if (/[bdfhklt]/.test(ch)) return 0.135;
  return 0.352; // x-height
}
const ROUND_LETTERS = new Set(["o", "e", "c", "s", "a", "O", "C", "S", "P"]);

/* ------------------------------------------------------------------ */

/**
 * "Phone down." as a floor: the app's tokens drop onto the headline the first
 * time the section scrolls into view. Drag to throw, click the word to shake.
 */
export function GravityDrop() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const engineRef = useRef<Matter.Engine | null>(null);
  const [ready, setReady] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Stable identity: this is an effect dependency, and rebuilding the world on
  // every render (e.g. when `grabbing` flips) would drop the thing being dragged.
  const items = useMemo(() => (isMobile ? ITEMS.filter((i) => MOBILE_IDS.has(i.id)) : ITEMS), [isMobile]);

  /* ---------------- physics ---------------- */
  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const container = containerRef.current;
    const heading = headingRef.current;
    if (!container || !heading) return;

    const { Engine, Bodies, Body, Composite, Runner, Mouse, MouseConstraint, Events } = Matter;

    let runner: Matter.Runner | null = null;
    let engine: Matter.Engine | null = null;
    let running = false;
    let destroyed = false;
    let dropTimer: number | undefined;
    const bodies: { body: Matter.Body; el: HTMLDivElement; w: number; h: number }[] = [];

    const build = () => {
      if (destroyed) return;
      teardown();

      engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1.15;
      engineRef.current = engine;
      const world = engine.world;

      const W = container.clientWidth;
      const H = container.clientHeight;

      // Heading geometry via offset* (ignores the entrance transforms).
      const fs = parseFloat(getComputedStyle(heading).fontSize);
      const hTop = heading.offsetTop;
      const floorY = hTop + fs * BASELINE;

      const statics: Matter.Body[] = [];
      letterRefs.current.forEach((span, i) => {
        const ch = HEADLINE[i];
        if (!span || ch === " ") return;
        const left = span.offsetLeft;
        const width = span.offsetWidth;
        const top = hTop + fs * glyphTop(ch);
        const bearing = width * 0.07;
        const w = Math.max(8, width - bearing * 2);
        const h = Math.max(6, floorY - top);
        const round = ROUND_LETTERS.has(ch);
        statics.push(
          Bodies.rectangle(left + width / 2, top + h / 2, w, h, {
            isStatic: true,
            friction: 0.9,
            chamfer: { radius: round ? Math.min(w, h) * 0.32 : 3 },
          }),
        );
      });

      // Floor on the baseline, walls just inside the viewport, a far ceiling.
      statics.push(
        Bodies.rectangle(W / 2, floorY + 50, W * 3, 100, { isStatic: true, friction: 0.9 }),
        Bodies.rectangle(-50, H / 2, 100, H * 6, { isStatic: true }),
        Bodies.rectangle(W + 50, H / 2, 100, H * 6, { isStatic: true }),
        Bodies.rectangle(W / 2, -2600, W * 3, 100, { isStatic: true }),
      );
      Composite.add(world, statics);

      // Measure the DOM items, then give each a body spawning above the fold.
      const headingLeft = heading.offsetLeft;
      const headingWidth = heading.offsetWidth;
      items.forEach((item, i) => {
        const el = itemRefs.current[item.id];
        if (!el) return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const t = (i + 0.5) / items.length;
        const jitter = (Math.random() - 0.5) * headingWidth * 0.12;
        const x = Math.min(W - w, Math.max(w, headingLeft + headingWidth * t + jitter));
        const y = -120 - i * 95 - Math.random() * 60;
        const common = {
          friction: 0.55,
          frictionAir: 0.012,
          restitution: item.kind === "coin" ? 0.5 : 0.28,
          density: 0.0012,
          angle: (Math.random() - 0.5) * 0.6,
          sleepThreshold: 50,
        };
        let body: Matter.Body;
        if (item.kind === "coin" || item.kind === "timer") {
          body = Bodies.circle(x, y, w / 2, common);
        } else if (item.kind === "pill") {
          body = Bodies.rectangle(x, y, w, h, { ...common, chamfer: { radius: h / 2 - 1 } });
        } else {
          body = Bodies.rectangle(x, y, w, h, { ...common, chamfer: { radius: 10 } });
        }
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
        bodies.push({ body, el, w, h });
        el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${body.angle}rad)`;
      });

      // Drag to throw. Pointer only — never steal scroll or touch from the page.
      const mouse = Mouse.create(container);
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.18, damping: 0.08, render: { visible: false } },
      });
      const m = mouse as unknown as {
        mousewheel: EventListener;
        mousedown: EventListener;
        mousemove: EventListener;
        mouseup: EventListener;
      };
      container.removeEventListener("wheel", m.mousewheel);
      container.removeEventListener("touchstart", m.mousedown);
      container.removeEventListener("touchmove", m.mousemove);
      container.removeEventListener("touchend", m.mouseup);
      Composite.add(world, mc);
      Events.on(mc, "startdrag", () => setGrabbing(true));
      Events.on(mc, "enddrag", () => setGrabbing(false));

      Events.on(engine, "afterUpdate", () => {
        for (const { body, el, w, h } of bodies) {
          const { x, y } = body.position;
          el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${body.angle}rad)`;
        }
      });

      // Stagger the drop: bodies are added only once the letters have landed.
      dropTimer = window.setTimeout(() => {
        if (destroyed || !engine) return;
        Composite.add(engine.world, bodies.map((b) => b.body));
        setReady(true);
        start();
      }, 700);
    };

    const start = () => {
      if (!engine || running) return;
      runner = Runner.create({ isFixed: false, delta: 1000 / 60 });
      Runner.run(runner, engine);
      running = true;
    };
    const stop = () => {
      if (runner && running) Runner.stop(runner);
      running = false;
    };
    const teardown = () => {
      stop();
      if (dropTimer) window.clearTimeout(dropTimer);
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        engine = null;
        engineRef.current = null;
      }
      bodies.length = 0;
    };

    // Don't simulate while the hero is off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!engine) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    let resizeTimer: number | undefined;
    let lastW = container.clientWidth;
    const onResize = () => {
      if (Math.abs(container.clientWidth - lastW) < 24) return; // ignore mobile URL-bar jitter
      lastW = container.clientWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 180);
    };
    window.addEventListener("resize", onResize);

    // Nothing falls until the reader gets here.
    const arm = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        arm.disconnect();
        setArmed(true);
        const fontsReady = document.fonts?.ready ?? Promise.resolve();
        fontsReady.then(() => {
          if (!destroyed) window.setTimeout(build, 450);
        });
      },
      { threshold: 0.45 },
    );
    arm.observe(container);

    return () => {
      destroyed = true;
      arm.disconnect();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      teardown();
    };
  }, [reduced, items]);

  /** Click the headline: everything jumps. */
  const shake = () => {
    const engine = engineRef.current;
    if (!engine) return;
    for (const b of Matter.Composite.allBodies(engine.world)) {
      if (b.isStatic) continue;
      Matter.Sleeping.set(b, false);
      Matter.Body.applyForce(b, b.position, {
        x: (Math.random() - 0.5) * 0.02 * b.mass,
        y: -(0.04 + Math.random() * 0.03) * b.mass,
      });
    }
  };

  return (
    <section
      ref={containerRef}
      id="drop"
      className="relative overflow-hidden flex flex-col"
      style={{
        minHeight: "92svh",
        cursor: grabbing ? "grabbing" : undefined,
        touchAction: "pan-y",
      }}
    >
      <div className="wrap pt-24 sm:pt-32 relative z-10 pointer-events-none">
        <motion.p
          className="eyebrow flex items-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <span>Go on</span>
          <span aria-hidden="true" className="inline-block w-6 h-[2px] bg-orange" />
          <span>Throw them around</span>
        </motion.p>
        <motion.h2
          className="text-display mt-5 max-w-[17ch]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
        >
          Put it down. Watch the rest <em className="serif-italic font-normal">fall into place.</em>
        </motion.h2>
        <motion.p
          className="text-lede mt-4 text-[15px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Drag anything. Click the headline to shake it.
        </motion.p>
      </div>

      <div className="flex-1 min-h-[22vh]" />

      {/* The headline is the floor */}
      <p
        ref={headingRef}
        onClick={shake}
        title="Click to shake"
        className="wrap relative z-[1] font-bold text-ink select-none whitespace-nowrap"
        style={{
          fontSize: "clamp(56px, 15.3vw, 236px)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          paddingBottom: 0,
          marginBottom: "-0.13em",
          cursor: "pointer",
        }}
        aria-label={HEADLINE}
      >
        {HEADLINE.split("").map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block"
            style={{ width: ch === " " ? "0.22em" : undefined }}
            aria-hidden="true"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "0.35em", opacity: 0 }}
              animate={armed || reduced ? { y: 0, opacity: 1 } : { y: "0.35em", opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.05 + i * 0.035 }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          </span>
        ))}
      </p>

      {/* Falling things */}
      <div
        className={`absolute inset-0 z-[2] ${reduced ? "flex flex-wrap items-end justify-center gap-3 pb-[28vh] px-6" : ""}`}
        style={{ pointerEvents: "none", visibility: ready ? "visible" : "hidden" }}
        aria-hidden="true"
      >
        {items.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[item.id] = el;
            }}
            className={reduced ? "" : "absolute left-0 top-0"}
            style={{
              willChange: reduced ? undefined : "transform",
              pointerEvents: "auto",
              cursor: grabbing ? "grabbing" : "grab",
            }}
          >
            <FallingThing item={item} />
          </div>
        ))}
      </div>

      {/* Baseline rule the headline sits on */}
      <div aria-hidden="true" className="h-px bg-ink/80 relative z-[3]" />
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FallingThing({ item }: { item: Item }) {
  switch (item.kind) {
    case "pill": {
      const tones: Record<typeof item.tone, { background: string; color: string; ring?: string }> = {
        ink: { background: "var(--ink)", color: "var(--paper)" },
        lime: { background: "var(--lime)", color: "var(--lime-ink)" },
        paper: { background: "var(--grain)", color: "var(--ink)", ring: "inset 0 0 0 1px var(--ink)" },
        panel: { background: "var(--panel)", color: "var(--ink)" },
        orange: { background: "var(--orange)", color: "#fff" },
      };
      const tone = tones[item.tone];
      return (
        <span
          className="inline-flex items-center rounded-full font-mono uppercase whitespace-nowrap select-none"
          style={{
            background: tone.background,
            color: tone.color,
            fontSize: "clamp(11px, 0.9vw, 13px)",
            letterSpacing: "0.12em",
            padding: "clamp(9px, 0.9vw, 13px) clamp(14px, 1.4vw, 20px)",
            boxShadow: `${tone.ring ? tone.ring + "," : ""} 0 10px 24px -14px rgba(36,41,31,.5)`,
          }}
        >
          {item.label}
        </span>
      );
    }
    case "phone":
      return (
        <span
          className="grid place-items-center text-lime select-none"
          style={{
            width: "clamp(52px, 4.6vw, 70px)",
            height: "clamp(88px, 7.8vw, 118px)",
            borderRadius: 14,
            background: "var(--deep)",
            border: "3px solid #3f4e3c",
            boxShadow: "8px 10px 0 rgba(24,34,24,0.09)",
            position: "relative",
          }}
        >
          <span
            className="absolute left-1.5 top-1.5 rounded-full"
            style={{ width: 12, height: 12, border: "3px solid #87947d" }}
          />
          <span className="serif-italic" style={{ fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1 }}>
            sh.
          </span>
        </span>
      );
    case "coin":
      return (
        <span
          className="grid place-items-center rounded-full select-none font-mono"
          style={{
            width: "clamp(46px, 4vw, 60px)",
            height: "clamp(46px, 4vw, 60px)",
            background: "var(--lime)",
            color: "var(--lime-ink)",
            boxShadow: "inset 0 0 0 2px var(--lime-ink), inset 0 0 0 5px var(--lime), inset 0 0 0 6px rgba(37,50,17,.6)",
            fontSize: 12,
            letterSpacing: "0.05em",
          }}
        >
          +1
        </span>
      );
    case "timer":
      return (
        <span
          className="relative grid place-items-center rounded-full select-none"
          style={{
            width: "clamp(52px, 4.4vw, 66px)",
            height: "clamp(52px, 4.4vw, 66px)",
            background: "var(--ink)",
            boxShadow: "0 10px 24px -14px rgba(36,41,31,.6)",
          }}
        >
          <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="32"
                y1="5"
                x2="32"
                y2={i % 6 === 0 ? 11 : 8}
                stroke={i === 0 ? "var(--lime)" : "var(--deep-tick)"}
                strokeOpacity={i === 0 ? 1 : 0.55}
                strokeWidth={i === 0 ? 2.5 : 1.5}
                strokeLinecap="round"
                transform={`rotate(${i * 15} 32 32)`}
              />
            ))}
          </svg>
          <span className="font-mono text-cream relative" style={{ fontSize: 11, letterSpacing: "-0.02em" }}>
            24:53
          </span>
        </span>
      );
    case "coffee":
      return (
        <span
          className="grid place-items-center select-none text-ink"
          style={{
            width: "clamp(50px, 4.4vw, 64px)",
            height: "clamp(50px, 4.4vw, 64px)",
            borderRadius: 14,
            background: "var(--panel)",
            boxShadow: "inset 0 0 0 1px var(--line), 0 10px 24px -14px rgba(36,41,31,.5)",
          }}
        >
          <Coffee size={24} />
        </span>
      );
  }
}
