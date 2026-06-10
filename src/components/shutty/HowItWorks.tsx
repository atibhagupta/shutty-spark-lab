import { Lock, Trophy, Share2 } from "lucide-react";
import { useReveal, useParallax, useScrollProgress } from "@/hooks/use-reveal";
import { OrangeGrid } from "./OrangeGrid";
import { TextReveal } from "./TextReveal";

const STEPS = [
  {
    icon: Lock,
    no: "01",
    title: "Lock in.",
    body: "Start a focus session and flip your phone face down. The timer runs, distractions get blocked, and your phone stays Shutty until you're done.",
  },
  {
    icon: Trophy,
    no: "02",
    title: "Compete.",
    body: "Your tribe sees your streak live. Climb the leaderboard, beat your own best, and don't be the one who drops out mid-sprint. Focus becomes a friendly race.",
  },
  {
    icon: Share2,
    no: "03",
    title: "Flex it.",
    body: "One tap posts your finished sprint to LinkedIn and Instagram. Turn the work you actually did into content. Performative working, finally productive.",
  },
];

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>();
  const grid = useParallax<HTMLDivElement>(60);
  const heading = useParallax<HTMLDivElement>(-30);
  const line = useParallax<HTMLDivElement>(22);
  const { ref: secRef, progress } = useScrollProgress<HTMLElement>();
  return (
    <section
      id="how"
      ref={secRef}
      className="relative overflow-hidden border-t border-white/10 py-24"
    >
      <div ref={grid.ref} style={{ transform: `translateY(${grid.offset}px)` }} className="absolute inset-0">
        <OrangeGrid />
      </div>
      {/* vertical section progress feedback */}
      <div className="absolute left-0 top-0 h-full w-px bg-white/5">
        <div
          className="w-full origin-top bg-orange shadow-[0_0_10px_var(--orange-glow)]"
          style={{ height: `${progress * 100}%`, transition: "height 0.1s linear" }}
        />
      </div>
      <div ref={ref} className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={heading.ref} style={{ transform: `translateY(${heading.offset}px)` }}>
          <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
            What is SHUTTY?
          </p>
          <TextReveal
            as="h2"
            text="A focus app that turns deep work into a game you win in public."
            highlight="public"
            className="max-w-3xl text-left text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl"
          />
        </div>
        <p className="reveal mt-4 max-w-xl text-left text-muted-foreground">
          No timers you ignore. No streaks no one sees. SHUTTY makes focus social:
          you lock in, your friends watch, and you post the proof. Here&apos;s how it works.
        </p>
        <div
          ref={line.ref}
          style={{ transform: `translateY(${line.offset}px)` }}
          className="reveal mt-6 h-px w-full origin-left line-draw bg-white/15"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.no}
                className="reveal sheen card-lift group relative overflow-hidden border border-white/12 bg-black/70 p-8 hover:border-orange/60"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="absolute right-5 top-5 font-mono text-5xl font-bold text-white/5 transition-all duration-300 group-hover:scale-110 group-hover:text-orange/20">
                  {s.no}
                </div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center border border-orange/40 text-orange transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-orange group-hover:text-primary-foreground group-hover:shadow-[0_0_24px_var(--orange-glow)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-3 text-left text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
                <div className="mt-6 h-px w-0 bg-orange transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}