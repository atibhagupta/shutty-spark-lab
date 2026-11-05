import { cloneElement, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "./ui/Brand";
import { PhoneFrame } from "./mock/PhoneFrame";
import { ActiveScreen } from "./mock/Screens";
import { EASE_OUT } from "@/lib/motion";
import { useAutoplayInView } from "@/lib/useAutoplayInView";

const RISE = { type: "spring", stiffness: 64, damping: 16, mass: 1.15 } as const;

export function MockupCards({ onJoin }: { onJoin: () => void }) {
  const reduced = useReducedMotion();
  return (
    <section className="relative">
      <div className="wrap pt-28 sm:pt-36">
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {/* The focus room */}
          <Card
            tone="deep"
            mockup={
              <Mockup reduced={!!reduced} deep>
                <ActiveScreen progress={0.42} remaining="14:31" task="Finish chapter three" />
              </Mockup>
            }
          >
            <Eyebrow style={{ color: "var(--deep-muted)" }}>The timer</Eyebrow>
            <h3
              className="mt-4 font-medium"
              style={{ color: "var(--cream)", fontSize: "clamp(30px, 3.2vw, 44px)", letterSpacing: "-0.045em", lineHeight: 1.02 }}
            >
              Trains focus like a{" "}
              <em className="serif-italic font-normal">muscle.</em>
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed" style={{ color: "var(--deep-text)" }}>
              Nothing to tap, nothing to scroll. Each session you sit through makes the next
              one easier.
            </p>
          </Card>

          {/* The receipt */}
          <Card tone="lime" mockup={<ReceiptFilm reduced={!!reduced} />}>
            <Eyebrow className="!text-lime-ink/70">The analytics</Eyebrow>
            <h3
              className="mt-4 font-medium text-lime-ink"
              style={{ fontSize: "clamp(30px, 3.2vw, 44px)", letterSpacing: "-0.045em", lineHeight: 1.02 }}
            >
              Know where your focus{" "}
              <em className="serif-italic font-normal">goes.</em>
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-lime-ink/80">
              Every session is logged: minutes, pickups, focus score. See your best hours,
              your best tasks, and share the milestones.
            </p>
          </Card>
        </div>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-t border-ink/80 pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="text-lede text-[15px] max-w-lg">
            Tracking is honest: if your device has no motion sensor, the session is just marked{" "}
            <span className="font-mono text-[12px] uppercase tracking-wider text-ink">unverified</span>.
            You never lose minutes.
          </p>
          <button type="button" onClick={onJoin} className="btn-secondary self-start sm:self-auto">
            Get early access
            <ArrowUpRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * The card owns the in-view trigger: the mockup itself is mostly clipped while
 * hidden, so observing it directly would never cross the threshold.
 */
function Card({
  tone,
  children,
  mockup,
}: {
  tone: "deep" | "lime";
  children: React.ReactNode;
  mockup: React.ReactElement<{ inView?: boolean }>;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.article
      ref={ref}
      className={`relative overflow-hidden rounded-[24px] p-7 sm:p-10 min-h-[640px] sm:min-h-[720px] ${tone === "deep" ? "deep" : "bg-lime"}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    >
      {children}
      {cloneElement(mockup, { inView })}
    </motion.article>
  );
}

/**
 * The analytics card's film: a phone prints focus receipts that tear off and
 * land on a stack. The clip's background is the card's lime, so it has no edges.
 */
function ReceiptFilm({ reduced, inView = false }: { reduced: boolean; inView?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplayInView(ref, !reduced, { threshold: 0.2 });
  const shown = reduced || inView;
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "64%" }}>
      <motion.video
        ref={ref}
        className="h-full w-full object-contain object-bottom"
        style={{
          maskImage: "linear-gradient(180deg, transparent, #000 30%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, #000 30%)",
        }}
        initial={false}
        animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 40 }}
        transition={reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }}
        muted
        loop
        playsInline
        preload="metadata"
        poster="video/receipts-poster.jpg"
        aria-label="A phone printing focus receipts that pile up on a stack"
      >
        <source src="video/receipts.mp4" type="video/mp4" />
      </motion.video>
    </div>
  );
}

/** Slides up from the card's bottom edge into view once the card is on screen. */
function Mockup({
  children,
  reduced,
  deep,
  inView = false,
}: {
  children: React.ReactNode;
  reduced: boolean;
  deep?: boolean;
  inView?: boolean;
}) {
  const shown = reduced || inView;
  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none" style={{ height: "58%" }}>
      <motion.div
        className="relative"
        initial={false}
        animate={{ y: shown ? "0%" : "70%" }}
        transition={reduced ? { duration: 0 } : RISE}
        style={{ willChange: "transform" }}
      >
        <PhoneFrame
          width={300}
          deep={deep}
          frameColor={deep ? "#44533f" : undefined}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 0 }}
        >
          {children}
        </PhoneFrame>
      </motion.div>
    </div>
  );
}
