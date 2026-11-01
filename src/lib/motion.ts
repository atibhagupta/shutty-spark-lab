import type { Transition, Variants } from "framer-motion";

/** The product's one easing: a long, decelerating exhale. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const spring = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.9 } satisfies Transition,
  snappy: { type: "spring", stiffness: 260, damping: 26, mass: 0.8 } satisfies Transition,
  slow: { type: "spring", stiffness: 70, damping: 18, mass: 1.1 } satisfies Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.08 },
  }),
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const viewport = { once: true, amount: 0.3 } as const;
