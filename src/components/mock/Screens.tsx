import { ArrowUpRight, Minus, Plus, Target, Users, Wallet, User } from "lucide-react";
import { ScreenHeader } from "./PhoneFrame";

/* ------------------------------------------------------------------ */
/* Setup: "One thing. Your full attention."                            */
/* ------------------------------------------------------------------ */
export function SetupScreen({ task = "Write the launch post" }: { task?: string }) {
  return (
    <div className="h-full flex flex-col bg-paper text-ink">
      <ScreenHeader right="0 COINS" />
      <div className="px-6 pt-8 flex-1">
        <h1
          className="font-medium"
          style={{ fontSize: 40, lineHeight: 1.02, letterSpacing: "-0.055em" }}
        >
          One thing.
          <br />
          Your full attention.
        </h1>
        <p className="eyebrow mt-8">What are you working on?</p>
        <div
          className="mt-2 pb-3 border-b border-ink"
          style={{ fontSize: 19, letterSpacing: "-0.02em" }}
        >
          {task}
        </div>

        <div className="mt-10 flex items-end justify-between">
          <div className="flex items-baseline">
            <span className="text-numeral" style={{ fontSize: 76 }}>
              25
            </span>
            <span className="font-medium ml-1" style={{ fontSize: 24, letterSpacing: "-0.03em" }}>
              min
            </span>
          </div>
          <div className="flex gap-2 mb-2">
            <span className="icon-btn">
              <Minus size={16} />
            </span>
            <span className="icon-btn">
              <Plus size={16} />
            </span>
          </div>
        </div>
        <div className="ruler mt-1" />
        <div className="mt-5 flex gap-2">
          {["15", "25", "45", "60", "90"].map((v) => (
            <span key={v} className="chip" data-on={v === "25" ? "true" : undefined} style={{ minWidth: 52 }}>
              {v}
            </span>
          ))}
        </div>

        <div className="mt-8 py-4 border-y border-line flex items-center justify-between">
          <span className="font-medium" style={{ fontSize: 15 }}>
            Make it yours
          </span>
          <span className="text-muted-ink" style={{ fontSize: 14 }}>
            Code ⌄
          </span>
        </div>

        <div className="btn-primary w-full mt-8">
          <span>Start 25 minutes</span>
          <ArrowUpRight size={18} />
        </div>
        <p className="text-center text-muted-ink mt-3" style={{ fontSize: 12 }}>
          Give it a name, then turn your phone face down.
        </p>
      </div>
      <BottomNav active={0} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Active vault: the deep room                                        */
/* ------------------------------------------------------------------ */
export function ActiveScreen({
  remaining = "24:53",
  task = "Write the launch post",
  progress = 0.08,
}: {
  remaining?: string;
  task?: string;
  progress?: number;
}) {
  const ticks = Array.from({ length: 60 });
  return (
    <div className="deep h-full flex flex-col">
      <div className="pt-[62px]" />
      <div className="flex-1 flex flex-col items-center px-6">
        <p className="eyebrow mt-20" style={{ color: "var(--deep-muted)" }}>
          25 min sprint
        </p>
        <div className="relative mt-10" style={{ width: 290, height: 290 }}>
          {ticks.map((_, i) => {
            const angle = (i / ticks.length) * 360;
            const major = i % 5 === 0;
            const lit = i / ticks.length <= progress;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 2,
                  height: major ? 14 : 8,
                  marginLeft: -1,
                  marginTop: -145,
                  transformOrigin: "50% 145px",
                  transform: `rotate(${angle}deg)`,
                  background: lit ? "var(--lime)" : "var(--deep-line)",
                  borderRadius: 2,
                  opacity: lit ? 1 : major ? 0.9 : 0.55,
                }}
              />
            );
          })}
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div
                className="text-numeral tabular"
                style={{ fontSize: 74, color: "var(--cream)", letterSpacing: "-0.05em" }}
              >
                {remaining}
              </div>
              <p className="eyebrow mt-3" style={{ color: "var(--deep-muted)" }}>
                remaining
              </p>
            </div>
          </div>
        </div>
        <p className="mt-10" style={{ fontSize: 15, color: "var(--deep-text)" }}>
          {task}
        </p>
        <p className="serif-italic mt-2" style={{ fontSize: 34, color: "var(--cream)" }}>
          The world can wait.
        </p>
        <p className="mt-2" style={{ fontSize: 14, color: "var(--deep-muted)" }}>
          Phone down. You've got this.
        </p>
        <div className="flex-1" />
        <div
          className="w-full rounded-[12px] text-center py-4 font-semibold mb-3"
          style={{ border: "1px solid var(--deep-line)", color: "var(--cream)", fontSize: 15 }}
        >
          Taking a call
        </div>
        <p className="mb-10" style={{ fontSize: 14, color: "var(--deep-text)" }}>
          End sprint
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Receipt: "You showed up."                                          */
/* ------------------------------------------------------------------ */
export function ReceiptScreen({
  minutes = 45,
  task = "Ship the auth flow",
  coins = "+2,700",
  coherence = "94 · Pure Flow",
  streak = "12 days",
  stamp = "Pure Flow",
}: {
  minutes?: number;
  task?: string;
  coins?: string;
  coherence?: string;
  streak?: string;
  stamp?: string;
}) {
  return (
    <div className="h-full flex flex-col bg-paper text-ink">
      <ScreenHeader right="Time well spent." />
      <div className="px-6 pt-8">
        <h1 className="font-medium" style={{ fontSize: 40, lineHeight: 1.02, letterSpacing: "-0.055em" }}>
          You showed up.
        </h1>
        <p className="text-lede mt-3" style={{ fontSize: 14 }}>
          Forty-five minutes, phone face down. Your streak is safe and the feed knows.
        </p>
        <div className="receipt mt-7">
          <div className="receipt-top">
            <span className="inline-flex items-baseline font-extrabold" style={{ fontSize: 20, letterSpacing: "-0.057em" }}>
              shutty
              <span className="inline-block rounded-full ml-0.5 bg-orange" style={{ width: 6, height: 6 }} />
            </span>
            <span className="eyebrow">Your focus receipt</span>
          </div>
          <div className="pt-5 flex items-baseline">
            <span className="text-numeral" style={{ fontSize: 78 }}>
              {minutes}
            </span>
            <span className="font-medium ml-1" style={{ fontSize: 24, letterSpacing: "-0.03em" }}>
              min
            </span>
          </div>
          <p className="eyebrow mt-1">Focused, verified</p>
          <p className="font-medium mt-4 mb-2" style={{ fontSize: 20, letterSpacing: "-0.03em" }}>
            {task}
          </p>
          <div className="receipt-row">
            <span>Session</span>
            <strong>Completed</strong>
          </div>
          <div className="receipt-row">
            <span>Coins earned</span>
            <strong>{coins}</strong>
          </div>
          <div className="receipt-row">
            <span>Coherence</span>
            <strong>{coherence}</strong>
          </div>
          <div className="receipt-row">
            <span>Streak</span>
            <strong>{streak}</strong>
          </div>
          <div className="mt-4">
            <span className="stamp">{stamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flex card: the 9:16 share card with the user's photo behind it      */
/* ------------------------------------------------------------------ */
export function FlexCard({
  photo = "/img/alps.jpg",
  minutes = 92,
  tag = "Design",
  day = 41,
  rank = "Top 8%",
  stamp = "Pure Flow",
  className = "",
  style,
}: {
  photo?: string;
  minutes?: number;
  tag?: string;
  day?: number;
  rank?: string;
  stamp?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden text-cream ${className}`}
      style={{ aspectRatio: "9 / 16", borderRadius: 22, ...style }}
    >
      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(21,30,24,0.35) 0%, rgba(21,30,24,0) 35%, rgba(21,30,24,0.15) 60%, rgba(21,30,24,0.88) 100%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col p-5">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-baseline font-extrabold" style={{ fontSize: 20, letterSpacing: "-0.057em" }}>
            shutty
            <span className="inline-block rounded-full ml-0.5 bg-orange" style={{ width: 6, height: 6 }} />
          </span>
          <span className="eyebrow" style={{ color: "rgba(245,243,235,0.8)", fontSize: 10 }}>
            day {day}
          </span>
        </div>
        <div className="mt-auto">
          <span className="eyebrow" style={{ color: "var(--lime)", fontSize: 10 }}>
            {tag} · phone face down
          </span>
          <div className="flex items-baseline mt-1">
            <span className="text-numeral" style={{ fontSize: 84, color: "var(--cream)" }}>
              {minutes}
            </span>
            <span className="font-medium ml-1.5" style={{ fontSize: 22, letterSpacing: "-0.03em" }}>
              min
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span style={{ fontSize: 13, color: "rgba(245,243,235,0.85)" }}>{rank} this week</span>
            <span className="stamp" style={{ transform: "rotate(-6deg)", fontSize: 10 }}>
              {stamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlexCardScreen() {
  const actions = ["Story", "LinkedIn", "Copy link", "Save"];
  return (
    <div className="h-full flex flex-col bg-paper text-ink">
      <ScreenHeader right="Share" />
      <div className="px-6 pt-5 flex-1 flex flex-col">
        <h1 className="font-medium" style={{ fontSize: 30, lineHeight: 1.04, letterSpacing: "-0.05em" }}>
          Post it.
        </h1>
        <p className="text-lede mt-1.5" style={{ fontSize: 13.5 }}>
          Your card, your photo behind it.
        </p>
        <div className="my-auto mx-auto" style={{ width: 262, boxShadow: "0 30px 60px -30px rgba(36,41,31,0.6)", borderRadius: 22 }}>
          <FlexCard />
        </div>
        <div className="pb-6 grid grid-cols-4 gap-2">
          {actions.map((a, i) => (
            <div key={a} className="flex flex-col items-center gap-1.5">
              <span
                className={`grid h-11 w-11 place-items-center rounded-full ${i === 0 ? "bg-ink text-paper" : "bg-panel text-ink"}`}
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                {a[0]}
              </span>
              <span style={{ fontSize: 11 }} className="text-muted-ink">
                {a}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rank: "Verified minutes."                                           */
/* ------------------------------------------------------------------ */
const ROWS = [
  { name: "Priya", min: 312, tag: "Pure Flow ×4", me: false },
  { name: "You", min: 287, tag: "Top 8%", me: true },
  { name: "Marcus", min: 240, tag: "9 day streak", me: false },
  { name: "Ines", min: 205, tag: "Flawless", me: false },
  { name: "Tomas", min: 180, tag: "Design", me: false },
  { name: "Aiko", min: 165, tag: "Study", me: false },
];

export function RankScreen() {
  return (
    <div className="h-full flex flex-col bg-paper text-ink">
      <ScreenHeader right="2,700 COINS" />
      <div className="px-6 pt-6 flex-1">
        <div className="flex gap-5 border-b border-line pb-3" style={{ fontSize: 15 }}>
          <span className="text-muted-ink">You</span>
          <span className="text-muted-ink">Your time</span>
          <span className="font-medium relative">
            Rank
            <span className="absolute -bottom-[13px] left-0 right-0 h-px bg-ink" />
          </span>
          <span className="text-muted-ink">Tribes</span>
        </div>
        <div className="flex justify-between mt-6">
          <span className="eyebrow">Weekly rank</span>
          <span className="eyebrow">Resets Monday</span>
        </div>
        <h1 className="font-medium mt-2" style={{ fontSize: 38, lineHeight: 1.02, letterSpacing: "-0.055em" }}>
          Verified minutes.
        </h1>
        <div className="mt-5 flex gap-2">
          <span className="chip" data-on="true">Friends</span>
          <span className="chip" style={{ borderColor: "transparent" }}>Tribe</span>
          <span className="chip" style={{ borderColor: "transparent" }}>Global</span>
        </div>
        <div className="mt-6">
          {ROWS.map((r, i) => (
            <div
              key={r.name}
              className="flex items-center gap-3 py-3 border-b border-line"
              style={{ background: r.me ? "var(--panel)" : undefined, marginInline: r.me ? -8 : 0, paddingInline: r.me ? 8 : 0, borderRadius: 8 }}
            >
              <span className="font-mono text-muted-ink tabular w-5" style={{ fontSize: 12 }}>
                {i + 1}
              </span>
              <span
                className="grid place-items-center rounded-full font-semibold"
                style={{
                  width: 34,
                  height: 34,
                  fontSize: 13,
                  background: r.me ? "var(--lime)" : "var(--panel)",
                  color: r.me ? "var(--lime-ink)" : "var(--ink)",
                }}
              >
                {r.name[0]}
              </span>
              <span className="flex-1">
                <span className="block" style={{ fontSize: 14 }}>
                  {r.name}
                </span>
                <span className="block text-muted-ink" style={{ fontSize: 11 }}>
                  {r.tag}
                </span>
              </span>
              <span className="font-mono tabular" style={{ fontSize: 13 }}>
                {r.min} min
              </span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active={3} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function BottomNav({ active }: { active: number }) {
  const items = [
    { icon: Target, label: "Focus" },
    { icon: Users, label: "Circle" },
    { icon: Wallet, label: "Wallet" },
    { icon: User, label: "You" },
  ];
  return (
    <div className="border-t border-line px-6 pt-3 pb-7 flex justify-between bg-paper">
      {items.map((it, i) => (
        <span
          key={it.label}
          className="flex flex-col items-center gap-1"
          style={{ color: i === active ? "var(--ink)" : "var(--muted)", fontSize: 10 }}
        >
          <it.icon size={20} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
