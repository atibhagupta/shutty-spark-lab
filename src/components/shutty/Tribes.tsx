import { useEffect, useMemo, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

const TRIBES = [
  { id: "warwick", label: "Warwick University", emoji: "🎓", count: 1248, note: "students grinding right now" },
  { id: "marketing", label: "Marketing Grind", emoji: "📈", count: 612, note: "marketers shipping campaigns" },
  { id: "design", label: "Design Thinkers", emoji: "🎨", count: 489, note: "designers in deep work" },
  { id: "coders", label: "Late Night Coders", emoji: "💻", count: 873, note: "coders locked in past midnight" },
];

const NAMES = [
  "@maya.r", "@decoded", "@jonas", "@priya", "@leo.k", "@sana",
  "@theo", "@aria", "@nico", "@hana", "@dev.b", "@mira",
];

type Card = { name: string; pct: number; locked: boolean; dropMin: number };

function buildCards(seed: number): Card[] {
  return NAMES.slice(0, 6).map((name, i) => {
    const locked = (seed + i) % 4 !== 0;
    return {
      name,
      pct: 10 + ((seed * 7 + i * 23) % 85),
      locked,
      dropMin: 5 + ((seed + i) % 40),
    };
  });
}

export function Tribes() {
  const ref = useReveal<HTMLDivElement>();
  const [active, setActive] = useState(TRIBES[0]);
  const [tick, setTick] = useState(0);

  // Live feed shuffles statuses every couple seconds.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  const cards = useMemo(() => buildCards(tick + active.count), [tick, active]);

  return (
    <section id="tribes" className="relative border-t border-white/10 py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
          Find your people
        </p>
        <h2 className="reveal max-w-3xl text-left text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
          Your focus crew, live.
        </h2>
        <p className="reveal mt-4 max-w-xl text-left text-muted-foreground">
          Pick a tribe and you&apos;ll see everyone who&apos;s working right now. When friends
          can see your live status, it&apos;s a lot harder to quietly give up.
        </p>
        <div className="reveal mt-6 h-px w-full origin-left line-draw bg-white/15" />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          {/* left: tribe menu */}
          <div className="reveal flex flex-col gap-3">
            {TRIBES.map((t) => {
              const on = t.id === active.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t)}
                  className={`group flex items-center justify-between border px-4 py-4 text-left font-mono text-sm transition-all duration-300 ${
                    on
                      ? "border-orange bg-orange/10 text-orange shadow-[0_0_24px_-8px_var(--orange-glow)]"
                      : "border-white/12 text-muted-foreground hover:border-white/40 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{t.emoji}</span>
                    {t.label}
                  </span>
                  <span
                    className={`transition-transform duration-300 ${on ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* right: dynamic container */}
          <div className="relative min-h-[28rem] overflow-hidden border border-white/12 bg-charcoal/60 p-6 sm:p-8">
            {/* glowing gradient callout */}
            <div
              key={active.id}
              className="relative overflow-hidden rounded-sm border border-orange/40 p-6"
              style={{
                background:
                  "linear-gradient(110deg, rgba(255,69,0,0.22), rgba(255,69,0,0.04) 55%, transparent), #0a0a0a",
                backgroundSize: "200% 100%",
                animation: "shutty-gradient 6s ease infinite, shutty-reveal-up 0.5s ease",
              }}
            >
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
                Now grinding
              </div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {active.label} {active.emoji}{" "}
                <span className="text-glow-orange">
                  {active.count.toLocaleString()}
                </span>{" "}
                <span className="text-muted-foreground">{active.note}.</span>
              </div>
            </div>

            {/* live feed */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cards.map((c, i) => (
                <div
                  key={c.name + i}
                  className="border border-white/10 bg-black/60 p-4 transition-colors duration-300 hover:border-orange/40"
                  style={{ animation: "shutty-reveal-up 0.4s ease both", animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-xs">
                        {c.name[1]?.toUpperCase()}
                      </span>
                      <span className="font-mono text-sm text-foreground">{c.name}</span>
                    </div>
                    {c.locked ? (
                      <span
                        className="rounded-sm border border-greenlock/50 px-2 py-0.5 font-mono text-[10px] text-greenlock"
                        style={{ animation: "shutty-green-breathe 2.4s ease-in-out infinite" }}
                      >
                        🟢 LOCKED IN
                      </span>
                    ) : (
                      <span
                        className="rounded-sm border border-reddrop/50 px-2 py-0.5 font-mono text-[10px] text-reddrop"
                        style={{ animation: "shutty-red-flash 1.6s ease-in-out infinite" }}
                      >
                        🔴 DROPPED — COLLAPSED AT {c.dropMin}/45 MIN
                      </span>
                    )}
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{
                        width: `${c.locked ? c.pct : Math.min(c.pct, 35)}%`,
                        background: c.locked ? "var(--orange)" : "var(--reddrop)",
                        boxShadow: c.locked ? "0 0 10px var(--orange-glow)" : "none",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}