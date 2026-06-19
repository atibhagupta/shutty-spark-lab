import { useState } from "react";
import { Flame, Gift, Sparkles, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useReveal } from "@/hooks/use-reveal";

const PERKS = [
  { icon: Sparkles, text: "Free early access the moment we launch" },
  { icon: Gift, text: "Founding-member perks reserved for first users" },
  { icon: Flame, text: "Lock in your spot on the leaderboard early" },
];

export function Waitlist() {
  const ref = useReveal<HTMLDivElement>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      toast.error("Drop your name so we know who's grinding.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("That email doesn't look right.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("waitlist")
      .insert({ name: trimmedName, email: trimmedEmail });
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setJoined(true);
        toast.success("You're already on the list — see you at launch!");
        return;
      }
      toast.error("Something broke. Try again in a sec.");
      return;
    }

    setJoined(true);
    toast.success("You're in! We'll email you the moment SHUTTY drops.");
  }

  return (
    <section
      id="claim"
      className="relative overflow-hidden border-t border-white/10 py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-orange/10 blur-3xl"
      />
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2"
      >
        {/* copy */}
        <div>
          <p className="reveal mb-3 font-mono text-xs uppercase tracking-[0.3em] text-orange">
            Be early
          </p>
          <h2 className="reveal max-w-xl text-left text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Claim your streak
            <br />
            <span className="text-glow-orange">before everyone else.</span>
          </h2>
          <p className="reveal mt-6 max-w-lg text-left text-muted-foreground">
            SHUTTY is launching soon. Join the waiting list and we'll email you the
            second it goes live — with free access and perks reserved for our first
            users.
          </p>

          <ul className="reveal mt-8 space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="group flex items-center gap-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-orange/40 bg-orange/10 text-orange transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_12px_var(--orange-glow)]">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* form card */}
        <div className="reveal">
          <div className="relative rounded-2xl border border-border bg-card/60 p-7 backdrop-blur-sm sm:p-9">
            <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-blink shadow-[0_0_8px_var(--orange-glow)]" />
              Join the waiting list
            </div>

            {joined ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-orange/40 bg-orange/10 text-orange">
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  You're on the list.
                </h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  We'll email you the moment SHUTTY launches — free access and
                  first-user perks included.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="wl-name"
                    className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="wl-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={100}
                    autoComplete="name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-orange"
                  />
                </div>
                <div>
                  <label
                    htmlFor="wl-email"
                    className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="wl-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    maxLength={255}
                    autoComplete="email"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-orange"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-lg border border-orange bg-orange px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_-4px_var(--orange-glow)] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Joining…
                    </>
                  ) : (
                    <>
                      Claim Your Streak
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
                <p className="text-center font-mono text-[10px] text-muted-foreground/70">
                  No spam. One email when we launch.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
