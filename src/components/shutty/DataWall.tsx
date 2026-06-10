import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

function CountUp({
  to,
  decimals = 0,
  suffix = "",
  active,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  active: boolean;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);
  return (
    <span className="tabular-nums">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const STATS = [
  {
    to: 97,
    decimals: 0,
    suffix: "%",
    body: "of focus sessions fall apart the moment a phone gets unlocked out of pure habit. Most of us reach for it without even noticing.",
  },
  {
    to: 5,
    decimals: 1,
    suffix: "s",
    body: "is roughly how long the average person holds attention before drifting. For context, a goldfish manages about 9.0s. We can do better.",
  },
  {
    to: 0,
    decimals: 2,
    suffix: "%",
    body: "chance you're reading this for any reason other than dodging something you should actually be doing right now. We get it. SHUTTY fixes it.",
  },
];

export function DataWall() {
  const ref = useReveal<HTMLDivElement>();
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setActive(true), obs.disconnect()),
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);

  return (
    <section className="relative border-t border-white/10 py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
          The hard numbers
        </p>
        <h2 className="reveal max-w-3xl text-left text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
          The metrics of brain rot.
        </h2>
        <div className="reveal mt-4 h-px w-full origin-left line-draw bg-white/15" />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden md:grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="reveal group relative bg-black p-8 transition-colors duration-300 hover:bg-charcoal md:p-10"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0 border-white/10 [border-right-width:1px] last:border-r-0 md:[border-bottom-width:0]" />
              <div className="relative">
                <div className="font-mono text-6xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-orange sm:text-7xl">
                  <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} active={active} />
                </div>
                <div className="mt-5 h-px w-12 origin-left bg-orange line-draw" />
                <p className="mt-5 max-w-xs text-left text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}