import { Children, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Soft dissolve between sections. Nothing pins and no scroll distance is added:
 * each section rides a little above the scroll (a few dozen pixels of parallax)
 * and eases its opacity as it enters and leaves the viewport, so the previous
 * section is already fading out while the next one is fading in. A faint
 * oversized index numeral drifts slightly slower than its section for depth.
 *
 * With reduced motion the children render in plain flow.
 */
export type Mark = { n: string; tone?: "ink" | "cream" };

export function MorphStack({ children, marks = [] }: { children: ReactNode; marks?: (Mark | null)[] }) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children);
  if (reduced) return <>{items}</>;
  return (
    <>
      {items.map((child, i) => (
        <DissolveSection key={i} first={i === 0} last={i === items.length - 1} mark={marks[i] ?? null}>
          {child}
        </DissolveSection>
      ))}
    </>
  );
}

function DissolveSection({
  children,
  first,
  last,
  mark,
}: {
  children: ReactNode;
  first: boolean;
  last: boolean;
  mark: Mark | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Enter: top edge from the viewport bottom up to 40% of the viewport.
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 0.4"] });
  // Exit: bottom edge from 60% of the viewport up to the top.
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ["end 0.6", "end start"] });
  const e = useSpring(enter, { stiffness: 120, damping: 30, mass: 0.7 });
  const x = useSpring(exit, { stiffness: 120, damping: 30, mass: 0.7 });

  const opacity = useTransform([e, x], ([ei, xi]: number[]) => {
    const inn = first ? 1 : 0.15 + 0.85 * ei;
    const out = last ? 1 : 1 - 0.8 * xi;
    return Math.min(inn, out);
  });
  const y = useTransform([e, x], ([ei, xi]: number[]) => (first ? 0 : 56 * (1 - ei)) - (last ? 0 : 40 * xi));

  // Numeral: lags a little behind the section and fades with it.
  const markY = useTransform([e, x], ([ei, xi]: number[]) => (first ? 0 : 120 * (1 - ei)) - (last ? 0 : 80 * xi));
  const markOpacity = useTransform([e, x], ([ei, xi]: number[]) => 0.07 * (first ? 1 : ei) * (1 - (last ? 0 : xi)));

  const numeral = mark && (
    <motion.span
      aria-hidden
      className="pointer-events-none select-none absolute right-[-2vw] top-[4vh] text-numeral leading-none"
      style={{
        fontSize: "clamp(180px, 30vw, 460px)",
        letterSpacing: "-0.06em",
        color: mark.tone === "cream" ? "var(--cream)" : "var(--ink)",
        y: markY,
        opacity: markOpacity,
      }}
    >
      {mark.n}
    </motion.span>
  );

  return (
    <motion.div ref={ref} className="relative" style={{ opacity, y }}>
      {mark && mark.tone !== "cream" && numeral}
      {children}
      {mark && mark.tone === "cream" && numeral}
    </motion.div>
  );
}
