import { useReveal } from "@/hooks/use-reveal";
import shailly from "@/assets/memoji-shailly.png";
import michael from "@/assets/memoji-michael.png";
import kevin from "@/assets/memoji-kevin.png";

const PEOPLE = [
  {
    avatar: shailly,
    quote:
      "I was glued to Reels and Instagram, constantly deactivating my account just to focus — which never worked because I love the app too much. SHUTTY flipped it. It feeds my love for showing my work: I stay on Instagram, post my sprint progress to my story, and let a bit of peer pressure keep me locked in.",
    label: "Shailly // Georgia // Instagram Maximalist",
  },
  {
    avatar: michael,
    quote:
      "As a software engineer my biggest leak was texting my girlfriend and friends every random thought mid-code. SHUTTY actually fixed that. Knowing my team can see my live status creates a feedback loop that makes it really hard to wander off.",
    label: "Michael // London // Software Engineer",
  },
  {
    avatar: kevin,
    quote:
      "I'm grinding through a PhD and I stay off the usual social networks because I value my output. I use SHUTTY purely to gamify my daily work and stay loosely connected to my circle. It's a far better use of a streak than chasing meaningless ones on Snapchat.",
    label: "Kevin // Academic Cohort // PhD Candidate",
  },
];

export function Testimonials() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative border-t border-white/10 py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
          Real people, real focus
        </p>
        <h2 className="reveal max-w-3xl text-left text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
          Verified humans, locked in.
        </h2>
        <div className="reveal mt-4 h-px w-full origin-left line-draw bg-white/15" />

        <div className="mt-14 grid grid-cols-1 gap-px border-t border-white/10 md:grid-cols-3">
          {PEOPLE.map((p, i) => (
            <div
              key={i}
              className="reveal group relative border-l-2 border-l-transparent bg-black p-8 transition-colors duration-300 hover:border-l-orange hover:bg-[#0A0A0A] md:p-10"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="mb-6 h-16 w-16 overflow-hidden rounded-full border border-white/15 bg-charcoal transition-colors duration-300 group-hover:border-orange/50">
                <img
                  src={p.avatar}
                  alt={`${p.label.split(" // ")[0]} avatar`}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-left text-sm leading-relaxed text-foreground/90">{p.quote}</p>
              <p className="mt-6 font-mono text-xs uppercase tracking-wider text-orange">
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}