import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { SectionHead } from "./ui/Brand";
import { EASE_OUT } from "@/lib/motion";

/**
 * "Why it sticks": blockers vs Shutty. Two live cards — a blocker icon that
 * jiggles, prompts "Remove?" and gets deleted on loop, against a streak that
 * climbs while kudos fly — and an animated comparison table beneath. Deep
 * panel with flowing contour lines behind. Ported from the approved prototype.
 */

const ROWS: [string, string, string][] = [
  ["How it works", "Locks your apps", "Trains your focus"],
  ["Who sees it", "Nobody", "Your circle, live"],
  ["When it's hard", "One tap to uninstall", "Friends send kudos"],
  ["Tracking", "Screen-time totals", "Phone-movement verified focus"],
  ["Proof", "Nothing to show", "Flex cards for your socials"],
  ["Why you come back", "Guilt", "Streaks, coins, perks"],
];

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT, delay: i * 0.1 } }),
};
const rowVar: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: (i: number = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.09 } }),
};

export function Comparison() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  return (
    <section
      ref={ref}
      id="difference"
      className="relative mx-3 sm:mx-4 overflow-hidden rounded-[40px] text-white"
      style={{ background: "var(--deep-2)" }}
    >
      <FlowLines run={inView && !reduced} />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 60% at 70% 0%, rgba(0,89,76,.55), transparent 70%), linear-gradient(180deg, transparent 60%, rgba(0,18,15,.9))",
        }}
      />

      <div className="wrap relative pt-28 pb-32 sm:pt-36 sm:pb-40">
        <SectionHead
          index="02"
          label="Why it sticks"
          tone="cream"
          title={
            <>
              Blockers get deleted.{" "}
              <em className="serif-italic font-normal text-lime">Friends</em> don’t.
            </>
          }
          lede="Most focus apps lock you out and leave you alone with it. The moment it gets hard, one tap undoes them. Shutty works the other way round."
        />

        {/* Versus cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <motion.div
            variants={rise}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative min-h-[330px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-7 sm:p-8"
          >
            <p className="eyebrow" style={{ color: "var(--deep-muted)" }}>Typical app blocker</p>
            <h3 className="mt-2.5 text-[24px] sm:text-[26px] font-medium tracking-[-0.03em]">A wall you can walk around.</h3>
            <p className="mt-2 max-w-[34ch] text-[14.5px] leading-relaxed" style={{ color: "var(--deep-text)" }}>
              Solo, restrictive, built on willpower. When the urge wins, it gets uninstalled.
            </p>
            <BlockerLoop run={inView && !reduced} />
          </motion.div>

          <motion.div
            variants={rise}
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative min-h-[330px] overflow-hidden rounded-[28px] border p-7 sm:p-8"
            style={{
              borderColor: "rgba(215,238,130,.35)",
              background: "linear-gradient(160deg, rgba(215,238,130,.16), rgba(0,89,76,.35))",
            }}
          >
            <p className="eyebrow text-lime">shutty</p>
            <h3 className="mt-2.5 text-[24px] sm:text-[26px] font-medium tracking-[-0.03em]">A room your friends are in.</h3>
            <p className="mt-2 max-w-[34ch] text-[14.5px] leading-relaxed" style={{ color: "var(--deep-text)" }}>
              They see you show up, cheer the streak, and notice when you don’t.
            </p>
            <StreakLoop run={inView && !reduced} />
          </motion.div>
        </div>

        {/* Table */}
        <motion.div
          className="relative mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {!reduced && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[30%]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(215,238,130,.08), transparent)" }}
              animate={{ left: ["-30%", "130%"] }}
              transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            />
          )}
          <motion.div variants={rowVar} custom={0} className="grid grid-cols-[1fr_1.3fr_1.5fr] max-sm:grid-cols-[1fr_1.15fr] items-stretch">
            <div className="k px-5 py-4 sm:px-7 max-sm:hidden" />
            <div className="px-5 py-4 sm:px-7 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--deep-muted)" }}>
              App blockers
            </div>
            <div className="px-5 py-4 sm:px-7" style={{ background: "rgba(215,238,130,.12)" }}>
              <span className="inline-flex items-baseline text-[20px] font-extrabold tracking-[-0.057em]">
                shutty<i className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-orange" />
              </span>
            </div>
          </motion.div>
          {ROWS.map(([k, them, us], i) => (
            <motion.div
              key={k}
              variants={rowVar}
              custom={i + 1}
              className="grid grid-cols-[1fr_1.3fr_1.5fr] max-sm:grid-cols-[1fr_1.15fr] items-stretch border-t border-white/[0.07]"
            >
              <div className="px-5 py-5 sm:px-7 sm:py-[22px] font-mono text-[11px] uppercase tracking-[0.12em] max-sm:hidden" style={{ color: "var(--deep-muted)" }}>
                {k}
              </div>
              <div className="flex items-center gap-2 px-4 py-4 sm:gap-2.5 sm:px-7 sm:py-[22px] text-[14px] sm:text-[16px]" style={{ color: "#8aa39e" }}>
                <svg className="h-4 w-4 sm:h-[18px] sm:w-[18px] flex-none opacity-60" viewBox="0 0 18 18" aria-hidden>
                  <path d="M4 4l10 10M14 4L4 14" stroke="#8aa39e" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] sm:hidden" style={{ color: "var(--deep-muted)" }}>{k}</span>
                  {them}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-4 sm:gap-3 sm:px-7 sm:py-[22px] text-[14px] sm:text-[16px] font-medium" style={{ background: "rgba(215,238,130,.06)" }}>
                <Tick delay={0.5 + i * 0.09} />
                <span>{us}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Tick({ delay }: { delay: number }) {
  return (
    <svg className="h-5 w-5 flex-none" viewBox="0 0 20 20" aria-hidden>
      <motion.path
        d="M4 10.5l4 4 8-9"
        fill="none"
        stroke="var(--orange)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay }}
      />
    </svg>
  );
}

/* ───────────── blocker: jiggle → "Remove?" → deleted → loop ───────────── */

type Beat = "idle" | "jiggle" | "dialog" | "pressed" | "gone";
function BlockerLoop({ run }: { run: boolean }) {
  const [beat, setBeat] = useState<Beat>("idle");
  useEffect(() => {
    if (!run) return;
    let timers: number[] = [];
    const cycle = () => {
      setBeat("idle");
      timers = [
        window.setTimeout(() => setBeat("jiggle"), 700),
        window.setTimeout(() => setBeat("dialog"), 1700),
        window.setTimeout(() => setBeat("pressed"), 2700),
        window.setTimeout(() => setBeat("gone"), 3100),
        window.setTimeout(cycle, 5200),
      ];
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [run]);
  const jig = beat === "jiggle" || beat === "dialog" || beat === "pressed";
  const dialog = beat === "dialog" || beat === "pressed";
  return (
    <div className="absolute bottom-5 left-7 h-[150px] w-[300px] sm:left-8">
      <motion.div
        className="absolute left-2.5 top-[60px] grid h-16 w-16 place-items-center rounded-2xl text-[26px]"
        style={{ background: "linear-gradient(145deg, #3b4a47, #1e2a28)", color: "#9fb2ad" }}
        animate={
          beat === "gone"
            ? { opacity: 0, scale: 0.4, rotate: 0 }
            : jig
              ? { opacity: 1, scale: 1, rotate: [-3, 3, -3] }
              : { opacity: 1, scale: 1, rotate: 0 }
        }
        transition={
          beat === "gone"
            ? { duration: 0.5, ease: EASE_OUT }
            : jig
              ? { rotate: { duration: 0.28, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } }
              : { duration: 0.3 }
        }
      >
        🔒
        <motion.span
          className="absolute -left-2 -top-2 grid h-[22px] w-[22px] place-items-center rounded-full bg-[#e9eeed] text-[13px] font-bold text-[#222]"
          animate={{ opacity: jig ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ×
        </motion.span>
      </motion.div>
      <AnimatePresence>
        {dialog && (
          <motion.div
            className="absolute left-24 top-2.5 w-[180px] rounded-[14px] px-3 pt-3.5 text-center text-[12.5px] text-[#111]"
            style={{ background: "rgba(245,247,246,.96)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <b className="mb-1 block text-[13.5px]">Remove “Blocker”?</b>
            Removing it will delete all its data.
            <div className="mt-3 flex border-t border-[#d6dbd9]">
              <span className="flex-1 py-2.5 text-[#0a64d8]">Cancel</span>
              <span
                className="flex-1 border-l border-[#d6dbd9] py-2.5 font-semibold text-[#e5372b] transition-colors"
                style={{ background: beat === "pressed" ? "#f0d6d3" : undefined, borderRadius: "0 0 14px 0" }}
              >
                Delete App
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────── shutty: streak climbs, week fills, kudos fly ───────────── */

const EMOJI = ["🔥", "👏", "💪", "⚡", "🙌"];
function StreakLoop({ run }: { run: boolean }) {
  const [streak, setStreak] = useState(1);
  const [days, setDays] = useState(0);
  const [kudos, setKudos] = useState<{ id: number; e: string; right: number; top: number }[]>([]);
  useEffect(() => {
    if (!run) return;
    setStreak(1);
    setDays(0);
    let v = 1;
    const climb = window.setInterval(() => {
      v += Math.ceil((41 - v) / 7);
      setStreak(v);
      if (v >= 41) window.clearInterval(climb);
    }, 90);
    const dayTimers = Array.from({ length: 7 }, (_, i) => window.setTimeout(() => setDays(i + 1), 300 + i * 180));
    let n = 0;
    const fly = window.setInterval(() => {
      const id = n++;
      setKudos((k) => [...k, { id, e: EMOJI[id % EMOJI.length], right: 60 + Math.random() * 180, top: 120 + Math.random() * 60 }]);
      window.setTimeout(() => setKudos((k) => k.filter((x) => x.id !== id)), 2300);
    }, 650);
    return () => {
      window.clearInterval(climb);
      window.clearInterval(fly);
      dayTimers.forEach(clearTimeout);
    };
  }, [run]);
  return (
    <>
      <div className="absolute bottom-7 left-7 flex gap-1 sm:gap-1.5 sm:left-8">
        {Array.from({ length: 7 }, (_, i) => (
          <motion.span
            key={i}
            className="h-4 w-4 rounded-[5px] sm:h-[22px] sm:w-[22px] sm:rounded-[7px]"
            animate={{ background: i < days ? "#d7ee82" : "rgba(255,255,255,.08)", scale: i < days ? 1.05 : 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          />
        ))}
      </div>
      <div className="absolute bottom-6 right-7 text-right sm:right-8">
        <div className="text-[72px] sm:text-[96px] font-medium leading-[0.9] tracking-[-0.06em] tabular-nums">{streak}</div>
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-lime">day streak</div>
      </div>
      <div className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {kudos.map((k) => (
            <motion.span
              key={k.id}
              className="absolute text-[22px]"
              style={{ right: k.right, top: k.top }}
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -60, -120], scale: [0.6, 1.1, 1, 1] }}
              transition={{ duration: 2.2, ease: EASE_OUT, times: [0, 0.2, 0.6, 1] }}
            >
              {k.e}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ───────────── background: flowing contour lines ───────────── */

function FlowLines({ run }: { run: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const c = cv.getContext("2d");
    if (!c) return;
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
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const W = cv.width, H = cv.height;
      c.clearRect(0, 0, W, H);
      c.lineWidth = 1.6;
      for (let j = 0; j < 26; j++) {
        c.strokeStyle = j % 9 === 4 ? "rgba(215,238,130,.28)" : "rgba(179,201,197,.07)";
        c.beginPath();
        for (let x = 0; x <= W; x += 24) {
          const y = H * (j / 26) + Math.sin(x * 0.0024 + t * 0.35 + j * 0.5) * 46 + Math.sin(x * 0.006 - t * 0.5 + j) * 14;
          x ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.stroke();
      }
      if (run) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [run]);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full opacity-90" />;
}
