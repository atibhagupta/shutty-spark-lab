import { useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Eyebrow, SectionHead } from "./ui/Brand";
import { PhoneFrame } from "./mock/PhoneFrame";
import { ActiveScreen, FlexCardScreen, ReceiptScreen, SetupScreen } from "./mock/Screens";
import { EASE_OUT, spring, viewport } from "@/lib/motion";

type Step = {
  id: string;
  n: string;
  title: string;
  kicker: string;
  body: string;
  details: string[];
  screen: ReactNode;
  deep?: boolean;
};

const STEPS: Step[] = [
  {
    id: "target",
    n: "01",
    title: "Pick a task and a time",
    kicker: "What are you working on?",
    body: "Type what you’re doing, choose 25 to 90 minutes, tag it — Code, Study, Design.",
    details: ["25 / 45 / 60 / 90 min", "Split sessions with breaks", "Tags feed your analytics"],
    screen: <SetupScreen task="Read forty pages" />,
  },
  {
    id: "present",
    n: "02",
    title: "Put the phone face down",
    kicker: "The timer runs. The sensors watch.",
    body: "Pick it up and the app notices. Leave for more than 60 seconds and the session ends.",
    details: ["Movement tracked by the sensors", "60 s grace if you need it", "Calls pause the timer"],
    screen: <ActiveScreen task="Read forty pages" remaining="38:12" progress={0.15} />,
    deep: true,
  },
  {
    id: "receipt",
    n: "03",
    title: "See how you did",
    kicker: "Minutes, pickups and a focus score",
    body: "Every session gets a receipt. Over time you see which tasks and hours get your best focus.",
    details: ["Focus score out of 100", "Coins for every focused minute", "Weekly analytics by task and time of day"],
    screen: <ReceiptScreen />,
  },
  {
    id: "share",
    n: "04",
    title: "Your friends see it",
    kicker: "Working hours, streaks and milestones — shared",
    body: "Friends see your sessions as they happen. Hit a milestone and share the card.",
    details: ["Weekly board with friends", "Kudos in one tap", "Streak multipliers for showing up"],
    screen: <FlexCardScreen />,
  },
];

export function HowItWorks() {
  const [open, setOpen] = useState<string>(STEPS[0].id);

  return (
    <section id="how" className="relative">
      <div className="wrap pt-28 sm:pt-36">
        <SectionHead
          index="03"
          label="How it works"
          title={
            <>
              Four steps.{" "}
              <em className="serif-italic font-normal">Thirty</em> seconds to start.
            </>
          }
          lede="Tap a step to see the screen."
        />

        <LayoutGroup>
          <motion.ul
            className="mt-14 border-t border-ink/80"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            {STEPS.map((step) => {
              const isOpen = open === step.id;
              return (
                <motion.li
                  key={step.id}
                  layout
                  transition={spring.soft}
                  className="border-b border-ink/80 overflow-hidden"
                  style={{ borderRadius: 0 }}
                >
                  <motion.button
                    layout="position"
                    type="button"
                    onClick={() => setOpen(isOpen ? "" : step.id)}
                    aria-expanded={isOpen}
                    aria-controls={`step-${step.id}`}
                    className="w-full grid grid-cols-[48px_1fr_44px] sm:grid-cols-[72px_1fr_56px] items-center gap-4 py-6 sm:py-8 text-left group"
                  >
                    <span className="font-mono text-muted-ink tabular text-[13px] group-hover:text-ink transition-colors">
                      {step.n}
                    </span>
                    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-5 min-w-0">
                      <span
                        className="font-medium text-ink transition-colors"
                        style={{ fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
                      >
                        {step.title}
                      </span>
                      <span className="text-muted-ink text-[13.5px] mt-1 sm:mt-0 truncate">
                        {step.kicker}
                      </span>
                    </span>
                    <PlusMinus open={isOpen} />
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`step-${step.id}`}
                        key="content"
                        layout
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { ...spring.soft },
                          opacity: { duration: 0.35, ease: EASE_OUT },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 pb-10 sm:pb-14 pl-[64px] sm:pl-[88px]">
                          <motion.div
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.08 }}
                            className="max-w-md"
                          >
                            <p className="text-ink text-[17px] leading-relaxed">{step.body}</p>
                            <ul className="mt-6 grid gap-2.5">
                              {step.details.map((d) => (
                                <li key={d} className="flex items-center gap-3 text-[14px] text-ink">
                                  <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-lime ring-1 ring-ink/70" />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: 48, rotate: 2 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            exit={{ opacity: 0, x: 24 }}
                            transition={{ ...spring.soft, delay: 0.05 }}
                            className="relative flex justify-center lg:justify-end pr-2"
                          >
                            <div
                              className="relative rounded-[22px] p-5 sm:p-7 overflow-hidden w-full max-w-[460px]"
                              style={{ background: step.deep ? "var(--deep)" : "var(--panel)" }}
                            >
                              <Eyebrow
                                className="absolute left-5 top-5"
                                style={{ color: step.deep ? "var(--deep-muted)" : undefined }}
                              >
                                Step {step.n}
                              </Eyebrow>
                              <div className="flex justify-center pt-8">
                                <PhoneFrame width={236} deep={step.deep} frameColor={step.deep ? "#44533f" : undefined}>
                                  {step.screen}
                                </PhoneFrame>
                              </div>
                              <div
                                aria-hidden="true"
                                className="absolute -bottom-10 inset-x-0 h-28"
                                style={{
                                  background: `linear-gradient(to top, ${step.deep ? "var(--deep)" : "var(--panel)"}, transparent)`,
                                }}
                              />
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  );
}

/** "+" that rotates 180° and collapses its vertical bar into "−". */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <motion.span
      className="icon-btn justify-self-end !w-11 !h-11 sm:!w-14 sm:!h-14 relative"
      animate={{ rotate: open ? 180 : 0, background: open ? "var(--ink)" : "rgba(0,0,0,0)" }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      aria-hidden="true"
    >
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1.5px] w-[16px] sm:w-[20px] rounded-full"
        animate={{ background: open ? "var(--paper)" : "var(--ink)" }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-[16px] sm:h-[20px] rounded-full"
        style={{ originY: 0.5 }}
        animate={{ scaleY: open ? 0 : 1, background: open ? "var(--paper)" : "var(--ink)" }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      />
    </motion.span>
  );
}
