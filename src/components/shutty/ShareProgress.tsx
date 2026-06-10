import { Linkedin, Instagram, Heart, MessageCircle, Repeat2, Flame } from "lucide-react";
import { useReveal, useParallax } from "@/hooks/use-reveal";
import shailly from "@/assets/memoji-shailly.png";

export function ShareProgress() {
  const ref = useReveal<HTMLDivElement>();
  const copy = useParallax<HTMLDivElement>(-22);
  const cards = useParallax<HTMLDivElement>(30);
  return (
    <section id="share" className="relative overflow-hidden border-t border-white/10 py-24">
      <div ref={ref} className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        {/* copy */}
        <div ref={copy.ref} style={{ transform: `translateY(${copy.offset}px)` }}>
          <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
            Built for performative workers
          </p>
          <h2 className="reveal max-w-xl text-left text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            You were going to post anyway.
            <br />
            <span className="text-glow-orange">Post the proof.</span>
          </h2>
          <p className="reveal mt-6 max-w-lg text-left text-muted-foreground">
            Finish a sprint and SHUTTY builds a clean, shareable card with your focus
            minutes, streak, and rank. One tap sends it straight to LinkedIn and your
            Instagram story. Your audience sees the grind — and the grind keeps you honest.
          </p>

          <ul className="reveal mt-8 space-y-3">
            {[
              "Auto-generated sprint recap cards",
              "Share to LinkedIn & Instagram in one tap",
              "Streaks and rank baked into every post",
            ].map((t) => (
              <li
                key={t}
                className="group flex items-center gap-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_10px_var(--orange-glow)]" />
                {t}
              </li>
            ))}
          </ul>

          <div className="reveal mt-9 flex gap-4">
            <button className="group flex items-center gap-2 border border-white/20 px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-orange hover:text-orange">
              <Linkedin className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Share to LinkedIn
            </button>
            <button className="group flex items-center gap-2 border border-white/20 px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-orange hover:text-orange">
              <Instagram className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Post to Story
            </button>
          </div>
        </div>

        {/* animated share cards */}
        <div ref={cards.ref} style={{ transform: `translateY(${cards.offset}px)` }} className="relative h-[30rem]">
          {/* LinkedIn card */}
          <div
            className="absolute left-0 top-2 w-72 border border-white/12 bg-charcoal p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-all duration-500 hover:z-20 hover:-translate-y-2 hover:rotate-0 hover:border-orange/50 sm:w-80"
            style={{ transform: "rotate(-4deg)", animation: "shutty-float 7s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-3">
              <img src={shailly} alt="Shailly avatar" width={512} height={512} loading="lazy" className="h-11 w-11 rounded-full border border-white/15 object-cover" />
              <div>
                <div className="text-sm font-semibold text-foreground">Shailly · 1st</div>
                <div className="font-mono text-[10px] text-muted-foreground">Creator · just now</div>
              </div>
              <Linkedin className="ml-auto h-4 w-4 text-orange" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              Just closed a <span className="text-orange">90-min</span> deep-work sprint on
              SHUTTY. Day <span className="text-orange">24</span> locked in. 🔒
            </p>
            <div className="mt-4 border border-orange/30 bg-black/60 p-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>focus today</span>
                <span className="flex items-center gap-1 text-orange"><Flame className="h-3 w-3" /> 24 streak</span>
              </div>
              <div className="mt-2 font-mono text-3xl font-bold text-orange">90:00</div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[92%] rounded-full bg-orange" style={{ boxShadow: "0 0 8px var(--orange-glow)" }} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-1.5 text-xs"><Heart className="h-4 w-4" /> 248</span>
              <span className="flex items-center gap-1.5 text-xs"><MessageCircle className="h-4 w-4" /> 31</span>
              <span className="flex items-center gap-1.5 text-xs"><Repeat2 className="h-4 w-4" /> 12</span>
            </div>
          </div>

          {/* Instagram story card */}
          <div
            className="absolute bottom-0 right-0 w-56 overflow-hidden rounded-2xl border border-white/12 p-1 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-all duration-500 hover:z-20 hover:-translate-y-2 hover:rotate-0 hover:border-orange/60 sm:w-64"
            style={{ transform: "rotate(5deg)", animation: "shutty-float 6s ease-in-out 0.6s infinite" }}
          >
            <div
              className="relative rounded-xl p-5"
              style={{ background: "linear-gradient(160deg, #1a0a00, #000)" }}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-orange to-reddrop text-[10px] font-bold text-primary-foreground">S</span>
                <span className="font-mono text-[10px] text-foreground">shailly.focus</span>
                <Instagram className="ml-auto h-4 w-4 text-foreground" />
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/3 rounded-full bg-foreground" />
              </div>

              <div className="mt-10 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange">stayed shutty</div>
                <div className="mt-2 font-mono text-5xl font-semibold text-foreground">90<span className="text-orange">m</span></div>
                <div className="mt-1 font-mono text-[10px] text-muted-foreground">rank #4 of 1,248</div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-2 rounded-full border border-orange bg-orange/10 py-2 font-mono text-[10px] uppercase tracking-widest text-orange">
                <Flame className="h-3 w-3" /> 24-day streak
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/15 blur-3xl" />
        </div>
      </div>
    </section>
  );
}