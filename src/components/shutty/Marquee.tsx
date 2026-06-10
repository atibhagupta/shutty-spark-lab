const ITEMS = [
  "STAY SHUTTY",
  "LOCK IN",
  "BEAT YESTERDAY",
  "SHARE THE GRIND",
  "FOCUS IS A SPORT",
  "DON'T DROP OUT",
  "POST THE PROOF",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black py-5">
      <div className="flex w-max gap-8" style={{ animation: "shutty-marquee 22s linear infinite" }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          </span>
        ))}
      </div>
    </div>
  );
}