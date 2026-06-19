import { useReveal } from "@/hooks/use-reveal";
import atibha from "@/assets/team-atibha.jpeg.asset.json";
import yash from "@/assets/team-yash.jpeg.asset.json";
import shubham from "@/assets/team-shubham.jpeg.asset.json";

const TEAM = [
  {
    photo: atibha.url,
    name: "Atibha",
    role: "Founder",
    alias: "aka mother of shutty",
    location: "London, UK",
    bio: "A global product builder who has scaled Y-Combinator-backed startups and crafted intuitive user experiences across the world. Shutty is her brainchild, born out of the realization that her own performative habits were a universal student and professional epidemic.",
    habit:
      "Intensely reading Dostoevsky on the Tube and in public parks while conspicuously holding a Blank Street Coffee.",
  },
  {
    photo: yash.url,
    name: "Yash Pratap Singh",
    role: "CTO",
    alias: "aka the tech bro",
    location: "Bangalore, India",
    bio: "A world-class engineer, Yash specializes in building highly accessible, rock-solid platforms. Having engineered core architecture for leading global finance institutions, he's now channeling that high-security, high-scale expertise into keeping Shutty's tech bulletproof.",
    habit:
      "Unironically posting every single workout to Instagram, and strictly ordering a sugar-free Americano... right before demolishing a massive, sugary slice of chocolate cake.",
  },
  {
    photo: shubham.url,
    name: "Shubham Dilawari",
    role: "Finance Advisor & Director",
    alias: "aka the finance bro",
    location: "Delhi, India",
    bio: "A qualified CFA and published equity researcher, Shubham's insights regularly feature in leading financial magazines. He commands deep market knowledge and handles all of Shutty's strategic financial planning.",
    habit:
      "Insisting on carrying a canvas tote bag and wearing tangled, wired earphones absolutely everywhere including on his recorded Strava runs.",
  },
];

export function MeetTheTeam() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="team" className="relative border-t border-white/10 py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
          The humans behind shutty
        </p>
        <h2 className="reveal max-w-3xl text-left text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          Meet the team.
        </h2>
        <div className="reveal mt-4 h-px w-full origin-left line-draw bg-white/15" />

        <div className="mt-14 grid grid-cols-1 gap-px border-t border-white/10 md:grid-cols-3">
          {TEAM.map((m, i) => (
            <div
              key={m.name}
              className="reveal sheen group relative flex flex-col border-l-2 border-l-transparent bg-black p-8 transition-colors duration-300 hover:border-l-orange hover:bg-[#0A0A0A] md:p-10"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="mb-6 aspect-square w-full overflow-hidden rounded-md border border-white/15 bg-charcoal grayscale transition-all duration-500 group-hover:grayscale-0">
                <img
                  src={m.photo}
                  alt={`${m.name}, ${m.role} of Shutty`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-foreground">{m.name}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-orange">
                {m.role} <span className="text-foreground/40">{m.alias}</span>
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-foreground/50">
                {m.location}
              </p>

              <p className="mt-5 text-left text-sm leading-relaxed text-foreground/90">{m.bio}</p>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange">
                  Performative Habit
                </p>
                <p className="mt-2 text-left text-sm italic leading-relaxed text-foreground/70">
                  {m.habit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}