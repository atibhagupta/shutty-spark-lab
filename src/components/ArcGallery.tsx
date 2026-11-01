import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, Coffee, Flame, Sparkles, Users } from "lucide-react";
import { SectionHead } from "./ui/Brand";
import { PhoneFrame } from "./mock/PhoneFrame";
import { EASE_OUT } from "@/lib/motion";
import { useAutoplayInView } from "@/lib/useAutoplayInView";

/* ------------------------------------------------------------------ */
/* Tiles: the artifacts a finished sprint produces                     */
/* ------------------------------------------------------------------ */

const TILES = [
  { id: "flex", node: <FlexTile /> },
  { id: "perk", node: <PerkTile /> },
  { id: "kudos", node: <KudosTile /> },
  { id: "tribe", node: <TribeTile /> },
  { id: "streak", node: <StreakTile /> },
  { id: "proof", node: <ProofTile /> },
  { id: "wave", node: <WaveTile /> },
  { id: "rank", node: <RankTile /> },
];

const N = TILES.length;

/** Arc geometry per breakpoint: slot spacing, half-width of the visible arc, how far the edges recede. */
type Geo = { gap: number; halfW: number; depth: number; tilt: number; phone: number };
const GEO: Record<"sm" | "md" | "lg", Geo> = {
  sm: { gap: 150, halfW: 340, depth: 260, tilt: 28, phone: 200 },
  md: { gap: 200, halfW: 520, depth: 360, tilt: 32, phone: 250 },
  lg: { gap: 236, halfW: 760, depth: 460, tilt: 34, phone: 280 },
};

export function ArcGallery() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });
  // Position along the arc, in tile slots. Fractional; wraps modulo N.
  const offset = useMotionValue(0);
  const [geo, setGeo] = useState<Geo>(GEO.lg);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      setGeo(w < 640 ? GEO.sm : w < 1024 ? GEO.md : GEO.lg);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Slow idle drift while on screen; pauses on hover / off screen.
  useEffect(() => {
    if (reduced || !inView || paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(48, t - last);
      last = t;
      offset.set(offset.get() + dt * 0.00012);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, inView, paused, offset]);

  const stepBy = (dir: 1 | -1) => {
    const target = Math.round(offset.get()) + dir;
    animate(offset, target, { type: "spring", stiffness: 90, damping: 18 });
  };

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="deep relative overflow-hidden mt-28 sm:mt-36"
    >
      <GlowPath reduced={!!reduced} />

      <div className="wrap relative pt-24 sm:pt-32 pb-10">
        <SectionHead
          index="05"
          label="Share it"
          tone="cream"
          align="center"
          title={
            <>
              Milestones worth{" "}
              <em className="serif-italic font-normal">posting.</em>
            </>
          }
          lede="Streaks, rank, perks and kudos — every one becomes a card you can share."
        />
      </div>

      <div
        className="relative overflow-hidden"
        style={{ height: "min(720px, 86vh)", perspective: 1400, perspectiveOrigin: "50% 40%" }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        {/* Arc */}
        <div
          className="absolute left-1/2 top-[42%]"
          style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
        >
          {TILES.map((t, i) => (
            <ArcTile key={t.id} index={i} offset={offset} geo={geo}>
              {t.node}
            </ArcTile>
          ))}
        </div>

        {/* Centre device: always in front of the arc */}
        <motion.div
          className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <PhoneFrame width={geo.phone} frameColor="#3a4638" deep screen={<StoryFilm reduced={!!reduced} />} />
        </motion.div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3" style={{ zIndex: 30 }}>
          <button
            type="button"
            onClick={() => stepBy(-1)}
            aria-label="Previous"
            className="icon-btn !border-deep-line hover:!bg-deep-2"
            style={{ color: "var(--cream)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <span className="eyebrow" style={{ color: "var(--deep-muted)" }}>
            drag · hover to pause
          </span>
          <button
            type="button"
            onClick={() => stepBy(1)}
            aria-label="Next"
            className="icon-btn !border-deep-line hover:!bg-deep-2"
            style={{ color: "var(--cream)" }}
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Drag surface */}
        <motion.div
          className="absolute inset-0"
          style={{ zIndex: 10, cursor: "grab", touchAction: "pan-y" }}
          onPan={(_, info) => offset.set(offset.get() - info.delta.x / geo.gap)}
          onPanEnd={(_, info) => {
            const target = Math.round(offset.get() - (info.velocity.x / geo.gap) * 0.25);
            animate(offset, target, { type: "spring", stiffness: 80, damping: 20 });
          }}
          whileTap={{ cursor: "grabbing" }}
        />
      </div>
    </section>
  );
}

/**
 * The centre phone's screen: a stories tray, a tap on your story, and it blooms
 * into the real Shutty share card — a laptop in a café — with story chrome.
 */
function StoryFilm({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplayInView(ref, !reduced, { threshold: 0.2 });
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
      poster="/video/story-poster.jpg"
      aria-label="Tapping your story opens the Shutty share card over a photo of a laptop in a café"
    >
      <source src="/video/story.mp4" type="video/mp4" />
    </video>
  );
}

/**
 * One square on the arc. Its slot `t` (in tile units, centred on 0) comes from
 * the shared offset; x spreads linearly, z recedes as a parabola, and the tile
 * yaws to face the centre. Slots sit at half-integers so nothing hides behind
 * the phone, and tiles wrap at the edges where they've already faded out.
 */
function ArcTile({
  index,
  offset,
  geo,
  children,
}: {
  index: number;
  offset: MotionValue<number>;
  geo: Geo;
  children: React.ReactNode;
}) {
  const slot = useTransform(offset, (o) => {
    const raw = (((index + o) % N) + N) % N; // 0..N
    return raw - N / 2 + 0.5; // -N/2+0.5 .. N/2+0.5
  });
  const transform = useTransform(slot, (t) => {
    const x = t * geo.gap;
    const u = Math.max(-1.3, Math.min(1.3, x / geo.halfW)); // normalised distance from centre
    const z = -geo.depth * u * u - 40;
    const ry = -u * geo.tilt;
    const s = 1 - Math.abs(u) * 0.12;
    return `translate3d(${x}px, 0, ${z}px) rotateY(${ry}deg) scale(${s})`;
  });
  const opacity = useTransform(slot, (t) => {
    const edge = N / 2 - 0.5; // last visible slot
    const d = Math.abs(t);
    return d <= edge - 0.8 ? 1 : Math.max(0, 1 - (d - (edge - 0.8)) / 1.1);
  });
  const zIndex = useTransform(slot, (t) => 10 - Math.round(Math.abs(t)));

  return (
    <motion.div
      className="absolute"
      style={{ transform, opacity, zIndex, transformStyle: "preserve-3d", width: 0, height: 0 }}
    >
      <div
        className="rounded-[20px] overflow-hidden"
        style={{
          width: "clamp(140px, 15vw, 200px)",
          height: "clamp(140px, 15vw, 200px)",
          boxShadow: "0 30px 60px -30px rgba(0,0,0,.6), 0 0 0 1px rgba(182,193,173,0.08)",
          marginLeft: "calc(clamp(140px, 15vw, 200px) / -2)",
          marginTop: "calc(clamp(140px, 15vw, 200px) / -2)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Neon trail: a blurred wide stroke under a crisp thin one, both      */
/* dashed with pathLength and swept via pathOffset.                     */
/* ------------------------------------------------------------------ */
function GlowPath({ reduced }: { reduced: boolean }) {
  const d =
    "M -80 520 C 180 420, 320 700, 560 560 S 900 300, 1140 440 S 1500 720, 1760 520";
  const sweep = reduced
    ? {}
    : { animate: { pathOffset: [0, 1] }, transition: { duration: 7, ease: "linear" as const, repeat: Infinity } };
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1680 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="trail" x1="0" x2="1">
          <stop offset="0" stopColor="#d7ee82" stopOpacity="0" />
          <stop offset="0.5" stopColor="#d7ee82" />
          <stop offset="1" stopColor="#d7ee82" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* faint full path so the trail has a track */}
      <path d={d} fill="none" stroke="#64715b" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 10" />
      <motion.path
        d={d}
        fill="none"
        stroke="#d7ee82"
        strokeWidth="22"
        strokeLinecap="round"
        filter="url(#glow)"
        style={{ pathLength: 0.22, pathSpacing: 0.78, opacity: 0.7 }}
        {...sweep}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#f1ffbd"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ pathLength: 0.22, pathSpacing: 0.78 }}
        {...sweep}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tile contents                                                       */
/* ------------------------------------------------------------------ */

function TileShell({ bg, color, children }: { bg: string; color: string; children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full p-4 flex flex-col overflow-hidden" style={{ background: bg, color }}>
      {children}
    </div>
  );
}

function FlexTile() {
  return (
    <TileShell bg="#151e18" color="var(--cream)">
      <img src="/img/alps.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(21,30,24,0.25), rgba(21,30,24,0.1) 45%, rgba(21,30,24,0.85))" }}
      />
      <span className="eyebrow relative" style={{ color: "rgba(245,243,235,0.85)" }}>shutty // day 41</span>
      <span className="text-numeral mt-auto relative" style={{ fontSize: 56, color: "var(--cream)" }}>92</span>
      <span className="eyebrow relative" style={{ color: "var(--lime)" }}>min · design · top 8%</span>
    </TileShell>
  );
}
function PerkTile() {
  return (
    <TileShell bg="var(--lime)" color="var(--lime-ink)">
      <Coffee size={30} />
      <span className="eyebrow mt-auto !text-lime-ink/70">partner perk</span>
      <span className="font-medium mt-1 leading-tight" style={{ fontSize: 20, letterSpacing: "-0.03em" }}>
        Free cold brew
      </span>
      <span className="text-[11px] opacity-70 mt-1">Unlocks at 2 h of focus</span>
    </TileShell>
  );
}
function KudosTile() {
  return (
    <TileShell bg="var(--grain)" color="var(--ink)">
      <div className="flex -space-x-2">
        {["P", "M", "I"].map((c, i) => (
          <span
            key={c}
            className="grid place-items-center rounded-full font-semibold border-2 border-grain"
            style={{ width: 30, height: 30, fontSize: 12, background: i === 1 ? "var(--lime)" : "var(--panel)" }}
          >
            {c}
          </span>
        ))}
      </div>
      <Sparkles size={18} className="mt-3 text-ink" />
      <span className="font-medium mt-auto leading-tight" style={{ fontSize: 18, letterSpacing: "-0.03em" }}>
        Priya, Marcus & Ines gave you kudos
      </span>
    </TileShell>
  );
}
function TribeTile() {
  return (
    <TileShell bg="var(--panel)" color="var(--ink)">
      <Users size={24} />
      <span className="eyebrow mt-auto">tribe</span>
      <span className="font-medium mt-1 leading-tight" style={{ fontSize: 20, letterSpacing: "-0.03em" }}>
        Indie Hackers
      </span>
      <span className="inline-flex items-center gap-1.5 text-[11px] mt-1 text-muted-ink">
        <span className="w-1.5 h-1.5 rounded-full bg-lime ring-1 ring-ink/60" /> 48 sprinting now
      </span>
    </TileShell>
  );
}
function StreakTile() {
  return (
    <TileShell bg="var(--ink)" color="var(--paper)">
      <Flame size={24} className="text-lime" />
      <span className="text-numeral mt-auto" style={{ fontSize: 60, color: "var(--paper)" }}>12</span>
      <span className="eyebrow" style={{ color: "var(--deep-muted)" }}>day streak · ×1.5</span>
    </TileShell>
  );
}
function ProofTile() {
  return (
    <TileShell bg="var(--grain)" color="var(--ink)">
      <BadgeCheck size={24} />
      <span className="eyebrow mt-auto">verified</span>
      <span className="font-mono text-[11px] mt-1 break-all leading-snug text-muted-ink">
        sha256 · 9f3a…c41e
      </span>
      <span className="text-[11px] mt-1">shutty.io/sprint/proof</span>
    </TileShell>
  );
}
function WaveTile() {
  const pts = [92, 95, 96, 90, 84, 86, 90, 93, 95, 96, 94];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 160} ${60 - (p - 80) * 2.6}`).join(" ");
  return (
    <TileShell bg="var(--deep)" color="var(--cream)">
      <span className="eyebrow" style={{ color: "var(--deep-muted)" }}>focus wave</span>
      <svg viewBox="0 0 160 64" className="mt-3 w-full h-auto" aria-hidden="true">
        <path d={d} fill="none" stroke="var(--lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`${d} L 160 64 L 0 64 Z`} fill="var(--lime)" fillOpacity="0.12" />
      </svg>
      <span className="text-numeral mt-auto" style={{ fontSize: 44, color: "var(--cream)" }}>94</span>
      <span className="eyebrow" style={{ color: "var(--lime)" }}>coherence · pure flow</span>
    </TileShell>
  );
}
function RankTile() {
  return (
    <TileShell bg="var(--paper)" color="var(--ink)">
      <span className="eyebrow">this week</span>
      <span className="text-numeral mt-auto" style={{ fontSize: 56 }}>#2</span>
      <span className="text-[12px] text-muted-ink">of 48 · Indie Hackers · resets Monday</span>
    </TileShell>
  );
}
