import { Users, Timer, Bell, Trophy, Share2, Coins, Lock, Activity } from "lucide-react";
import { useReveal, useParallax, useScrollProgress } from "@/hooks/use-reveal";
import { OrangeGrid } from "./OrangeGrid";
import { TextReveal } from "./TextReveal";

const STEPS = [
  {
    icon: Users,
    no: "01",
    title: "Find your people.",
    body: "Join SHUTTY, add your friends, or find a tribe that shares your interests. Studying, creating, training — whatever you're working on, you're not alone.",
  },
  {
    icon: Timer,
    no: "02",
    title: "Start your timer.",
    body: "Pick a Pomodoro session or another timer that suits your flow. Put your phone down and give your next task your full attention.",
  },
  {
    icon: Bell,
    no: "03",
    title: "Let your circle know.",
    body: "Your friends and network get notified when you lock in. They know you're busy making progress, not leaving them on read.",
  },
  {
    icon: Trophy,
    no: "04",
    title: "Make focus count.",
    body: "Earn points for your focus sessions, keep your streak alive, and enjoy a little friendly competition. Less scrolling. More getting things done.",
  },
  {
    icon: Share2,
    no: "05",
    title: "Post the proof.",
    body: "Share your progress to your Instagram story or LinkedIn. Let people know why you were offline — and what you got done instead.",
  },
  {
    icon: Coins,
    no: "06",
    title: "Stack your rewards.",
    body: "Earn coins as you build your focus habit and redeem them later. Your time well spent comes with something to look forward to.",
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
       className="relative overflow-hidden border-t border-border py-24"
    >
      <div ref={grid.ref} style={{ transform: `translateY(${grid.offset}px)` }} className="absolute inset-0">
        <OrangeGrid />
      </div>
      {/* vertical section progress feedback */}
      <div className="absolute left-0 top-0 h-full w-px bg-foreground/5">
        <div
          className="w-full origin-top bg-orange shadow-[0_0_10px_var(--orange-glow)]"
          style={{ height: `${progress * 100}%`, transition: "height 0.1s linear" }}
        />
      </div>
      <div ref={ref} className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div ref={heading.ref} style={{ transform: `translateY(${heading.offset}px)` }}>
          <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
            How it works
          </p>
          <TextReveal
            as="h2"
            text="Go offline. Get things done. Come back with proof."
            highlight="proof"
            className="max-w-3xl text-left text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl"
          />
        </div>
        <p className="reveal mt-4 max-w-xl text-left text-muted-foreground">
          A productivity app for performative workers. Turn your focus into progress,
          keep your people in the loop, and make showing up feel rewarding.
        </p>
        <div
          ref={line.ref}
          style={{ transform: `translateY(${line.offset}px)` }}
          className="reveal mt-6 h-px w-full origin-left line-draw bg-foreground/15"
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.no}
                className="reveal sheen card-lift group relative overflow-hidden rounded-lg border border-border bg-background/70 p-6 hover:border-orange/60"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="absolute right-5 top-5 font-mono text-4xl font-bold text-foreground/10 transition-all duration-300 group-hover:scale-110 group-hover:text-orange/30">
                  {s.no}
                </div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center border border-orange/40 text-orange transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-orange group-hover:text-primary-foreground group-hover:shadow-[0_0_24px_var(--orange-glow)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-3 text-left text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
                <div className="mt-6 h-px w-0 bg-orange transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
        <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
          <div className="reveal flex items-start gap-4">
            <Lock className="mt-1 h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-orange">Optional · Advanced Locked-In filter</p>
              <h3 className="text-xl font-semibold text-foreground">Your focus. Your rules.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Want fewer temptations? Turn on app blocking with the Advanced Locked-In filter. Prefer to keep your apps available? Leave it off — you choose how you lock in.</p>
            </div>
          </div>
          <div className="reveal flex items-start gap-4">
            <Activity className="mt-1 h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-orange">Phone-pickup tracking</p>
              <h3 className="text-xl font-semibold text-foreground">Less picking up. More showing up.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Phone pickups can interrupt your flow. SHUTTY uses them to calculate an AI-generated coherence score, visible to your friends and network. Lock in to protect your streak and explore your brain rot analytics.</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Your score reflects focus patterns, not a medical assessment of your brain.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}