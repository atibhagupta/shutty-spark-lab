import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { Eyebrow, SectionHead, Stamp, Wordmark } from "./ui/Brand";
import { existingWaitlistEntry, joinWaitlist } from "@/lib/waitlist";
import { EASE_OUT, spring } from "@/lib/motion";

const INTENTS = ["Code", "Design", "Study", "Write", "Build"];

export type WaitlistHandle = { focus: () => void };

export const Waitlist = forwardRef<WaitlistHandle, { nudged: boolean }>(function Waitlist({ nudged }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("Code");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus({ preventScroll: true }),
  }));

  useEffect(() => {
    const existing = existingWaitlistEntry();
    if (existing) {
      setEmail(existing.email);
      setIntent(existing.intent);
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("busy");
    const res = await joinWaitlist(email, intent);
    if (!res.ok) {
      setError(res.error);
      setState("idle");
      return;
    }
    setPosition(res.position);
    setState("done");
  };

  const inviteLink = `https://shutty.io/invite/@${email.split("@")[0] || "you"}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="waitlist" className="relative pt-28 sm:pt-40 pb-28 sm:pb-36">
      <div className="wrap grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
        <div>
          <SectionHead
            index="07"
            label="The waitlist"
            title={
              <>
                Get it{" "}
                <em className="serif-italic font-normal">first.</em>
              </>
            }
            lede="One email when we launch. Founding badge for the first thousand."
          />

          <AnimatePresence mode="wait" initial={false}>
            {state !== "done" ? (
              <motion.form
                key="form"
                onSubmit={submit}
                className="mt-12 max-w-lg"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.label
                  className="block"
                  animate={nudged ? { x: [0, -4, 4, -2, 2, 0] } : {}}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <Eyebrow as="span" className="block">
                    Email
                  </Eyebrow>
                  <input
                    ref={inputRef}
                    className="field mt-1"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.label>

                <Eyebrow className="mt-8">What will you lock in on?</Eyebrow>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Intent">
                  {INTENTS.map((it) => (
                    <button
                      key={it}
                      type="button"
                      role="radio"
                      aria-checked={intent === it}
                      data-on={intent === it ? "true" : undefined}
                      onClick={() => setIntent(it)}
                      className="chip"
                    >
                      {it}
                    </button>
                  ))}
                </div>

                {error && (
                  <p role="alert" className="mt-5 px-3.5 py-3 rounded-[9px] text-[13px]" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={state === "busy"} className="btn-primary w-full mt-8 disabled:opacity-70" style={{ background: "var(--orange)" }}>
                  <span>{state === "busy" ? "Saving your spot…" : "Join the waitlist"}</span>
                  {state === "busy" ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={19} />}
                </button>
                <p className="mt-3 text-center text-[12px] text-muted-ink">
                  No spam. One email at launch. Unsubscribe with a tap.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                className="mt-12 max-w-lg"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <p className="text-title">You’re on the list.</p>
                <p className="text-lede mt-2">
                  Move up by bringing a friend. Each one who joins pulls you forward by 100.
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <code className="flex-1 min-w-0 truncate font-mono text-[13px] px-3.5 py-3 rounded-[9px] bg-panel text-ink">
                    {inviteLink}
                  </code>
                  <button type="button" onClick={copy} className="icon-btn !w-12 !h-12" aria-label="Copy invite link">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The receipt, before and after */}
        <div className="relative lg:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="receipt max-w-[420px] mx-auto"
          >
            <div className="receipt-top">
              <Wordmark size={21} />
              <Eyebrow as="span">Waitlist receipt</Eyebrow>
            </div>
            <div className="pt-5 flex items-baseline">
              <motion.span
                key={position ?? "none"}
                className="text-numeral tabular"
                style={{ fontSize: 84 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring.snappy}
              >
                {position ? `#${position.toLocaleString()}` : "#—"}
              </motion.span>
            </div>
            <Eyebrow className="mt-1">Your place in line</Eyebrow>
            <div className="mt-5 receipt-row">
              <span>Intent</span>
              <strong>{intent}</strong>
            </div>
            <div className="receipt-row">
              <span>Founding badge</span>
              <strong>
                {!position
                  ? "First 1,000"
                  : position <= 1000
                    ? "Reserved"
                    : `${Math.ceil((position - 1000) / 100)} invites away`}
              </strong>
            </div>
            <div className="receipt-row">
              <span>Status</span>
              <strong>{state === "done" ? "Confirmed" : "Pending"}</strong>
            </div>
            <div className="receipt-row">
              <span>Platform</span>
              <strong>iOS · Android · Web</strong>
            </div>
            <div className="mt-5 h-8">
              <AnimatePresence>
                {state === "done" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
                    animate={{ opacity: 1, scale: 1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    style={{ transformOrigin: "left center" }}
                  >
                    <Stamp className="!rotate-0">You’re on the list</Stamp>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <p className="serif-italic text-ink text-center mt-8 text-[18px]" style={{ transform: "rotate(-4deg)" }}>
            the world can wait.
          </p>
        </div>
      </div>
    </section>
  );
});
