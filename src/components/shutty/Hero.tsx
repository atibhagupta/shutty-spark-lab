import { MotionField } from "./MotionField";
import { PhoneMockup } from "./PhoneMockup";
import { useReveal, useScrollProgress } from "@/hooks/use-reveal";

export function Hero() {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.05 });
  const { ref: scrollRef, progress } = useScrollProgress<HTMLElement>();

  return (
    <section id="top" ref={scrollRef} className="relative overflow-hidden pt-28 pb-20 sm:pt-36">
      <MotionField />
      <div
        ref={reveal}
        className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-2"
      >
        {/* left: copy */}
        <div className="reveal">
          <div className="mb-6 inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-blink" />
            Focus, but make it multiplayer
          </div>

          <h1 className="text-left text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Your attention
            <br />
            span is cooked.
            <br />
            <span className="text-muted-foreground">Tell your phone to stay </span>
            <span className="text-shimmer">Shutty.</span>
          </h1>

          <p className="mt-8 max-w-xl text-left text-base leading-relaxed text-muted-foreground sm:text-lg">
            SHUTTY is the productivity app for performative workers. Start a focus
            session, put your phone down, and race your tribe to keep your streak alive.
            Then share your sprint straight to LinkedIn and Instagram. Get more done —
            and get the credit for it.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              id="claim"
              href="#"
              className="group relative border border-orange bg-black px-7 py-4 font-mono text-sm uppercase tracking-widest text-orange transition-all duration-300 hover:bg-orange hover:text-primary-foreground hover:shadow-[0_0_30px_-4px_var(--orange-glow)]"
            >
              Claim Your Streak
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#tribes"
              className="font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              See how it works
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 font-mono text-xs text-muted-foreground">
            <span>
              <span className="text-foreground">1.2M+</span> sessions run
            </span>
            <span>
              <span className="text-foreground">340+</span> active tribes
            </span>
            <span>
              <span className="text-orange">98%</span> finish their sprint
            </span>
          </div>
        </div>

        {/* right: scroll-reactive phone */}
        <div className="relative">
          <PhoneMockup progress={progress} />
        </div>
      </div>
    </section>
  );
}