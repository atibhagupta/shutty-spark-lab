import { useReveal } from "@/hooks/use-reveal";
import atibha from "@/assets/team-atibha.jpeg.asset.json";
import yash from "@/assets/team-yash.jpeg.asset.json";
import shubham from "@/assets/team-shubham.jpeg.asset.json";

const TEAM = [
  {
    photo: atibha.url,
    name: "Atibha Gupta",
    role: "Founder",
    alias: "mother of shutty",
    location: "London, UK",
    bio: "A global product builder who has scaled Y-Combinator-backed startups and crafted intuitive user experiences across the world. Shutty is her brainchild, born out of the realization that her own performative habits were a universal student and professional epidemic.",
    habit:
      "Intensely reading Dostoevsky on the Tube and in public parks while conspicuously holding a Blank Street Coffee.",
  },
  {
    photo: yash.url,
    name: "Yash Pratap Singh",
    role: "CTO",
    alias: "the tech bro",
    location: "Bangalore, India",
    bio: "A world-class engineer, Yash specializes in building highly accessible, rock-solid platforms. Having engineered core architecture for leading global finance institutions, he's now channeling that high-security, high-scale expertise into keeping Shutty's tech bulletproof.",
    habit:
      "Unironically posting every single workout to Instagram, and strictly ordering a sugar-free Americano... right before demolishing a massive, sugary slice of chocolate cake.",
  },
  {
    photo: shubham.url,
    name: "Shubham Dilawari",
    role: "Finance Advisor & Director",
    alias: "the finance bro",
    location: "Delhi, India",
    bio: "A qualified CFA and published equity researcher, Shubham's insights regularly feature in leading financial magazines. He commands deep market knowledge and handles all of Shutty's strategic financial planning.",
    habit:
      "Insisting on carrying a canvas tote bag and wearing tangled, wired earphones absolutely everywhere including on his recorded Strava runs.",
  },
];

export function MeetTheTeam() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="team" className="relative border-t border-white/10 py-20">
      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
          The humans behind shutty
        </p>
        <h2 className="reveal max-w-3xl text-left text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Meet the team.
        </h2>
        <div className="reveal mt-4 h-px w-full origin-left line-draw bg-white/15" />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TEAM.map((m, i) => (
            <article
              key={m.name}
              className="reveal group relative overflow-hidden rounded-sm border border-white/10 bg-card p-5 transition-all duration-500 hover:border-orange/40 hover:bg-secondary"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Subtle sheen sweep */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

              {/* Photo frame with Shutty accents */}
              <div className="relative mx-auto mb-5 w-fit">
                <div
                  className="relative aspect-square w-36 overflow-hidden rounded-sm border border-white/15 grayscale transition-all duration-500 group-hover:border-orange/60 group-hover:grayscale-0 group-hover:shadow-[0_0_32px_-6px_var(--orange-glow)]"
                  style={{ animation: "shutty-bob 5s ease-in-out infinite" }}
                >
                  <img
                    src={m.photo}
                    alt={`${m.name}, ${m.role} of Shutty`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Scanline overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)",
                    }}
                  />
                  {/* Corner grid accent */}
                  <div className="absolute bottom-0 left-0 h-8 w-8 border-r border-t border-orange/40 bg-black/60 backdrop-blur-sm" />
                </div>

                {/* Floating shutty dot badge */}
                <div
                  className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full border border-orange/50 bg-card text-[10px] font-bold text-orange shadow-[0_0_16px_-2px_var(--orange-glow)]"
                  style={{ animation: "shutty-breathe 2.6s ease-in-out infinite" }}
                >
                  s
                </div>
              </div>

              {/* Identity */}
              <div className="text-center">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{m.name}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-orange">
                  {m.role}{" "}
                  <span className="text-foreground/40">// {m.alias}</span>
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.location}
                </p>
              </div>

              {/* Bio */}
              <p className="mt-4 text-left text-[13px] leading-relaxed text-foreground/80">
                {m.bio}
              </p>

              {/* Performative habit */}
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
                  Performative Habit
                </p>
                <p className="mt-1.5 text-left text-[13px] italic leading-relaxed text-foreground/70">
                  “{m.habit}”
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange transition-all duration-700 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
