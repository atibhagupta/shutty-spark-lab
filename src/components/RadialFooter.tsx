import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Instagram, Linkedin, Mail } from "lucide-react";
import { Wordmark } from "./ui/Brand";
import { EASE_OUT, spring } from "@/lib/motion";

const SOCIALS = [
  { label: "X", href: "https://x.com/shuttyapp", icon: XIcon },
  { label: "Instagram", href: "https://instagram.com/shuttyapp", icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com/company/shutty", icon: Linkedin },
  { label: "Discord", href: "https://discord.gg/shutty", icon: DiscordIcon },
  { label: "Email", href: "mailto:founders@shutty.io", icon: Mail },
];

export function RadialFooter({ onJoin }: { onJoin: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <footer className="deep relative overflow-hidden">
      {/* Concentric curves, centred below the fold so only their crowns show. */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 7 }).map((_, i) => {
          const size = 520 + i * 300;
          return (
            <motion.span
              key={i}
              className="absolute left-1/2 rounded-full"
              style={{
                width: size,
                height: size,
                bottom: -size * 0.62,
                marginLeft: -size / 2,
                background: i % 2 === 0 ? "rgba(21,30,24,0.55)" : "rgba(36,48,39,0.35)",
                boxShadow: `inset 0 0 0 1px rgba(182,193,173,${0.26 - i * 0.03}), 0 -30px 80px -40px rgba(0,0,0,0.5)`,
              }}
              initial={{ scale: 0.92, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.4, ease: EASE_OUT, delay: i * 0.06 }}
            />
          );
        })}
      </div>

      <div className="wrap relative pt-28 sm:pt-40 pb-10 flex flex-col items-center text-center">
        <p className="eyebrow" style={{ color: "var(--deep-muted)" }}>
          Productivity that actually works
        </p>
        <h2
          className="mt-6 font-medium"
          style={{ color: "var(--cream)", fontSize: "clamp(40px, 7vw, 104px)", letterSpacing: "-0.055em", lineHeight: 0.98 }}
        >
          Phone down.
          <br />
          Friends <em className="serif-italic font-normal">watching.</em>
        </h2>

        {/* CTA with the hover-expanding tray */}
        <div
          className="mt-12 flex flex-col items-center"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocusCapture={() => setOpen(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
          }}
        >
          <motion.button
            type="button"
            onClick={onJoin}
            className="btn-lime !min-h-[60px] !px-7 !text-[16px] !rounded-[14px] min-w-[280px]"
            whileTap={{ scale: 0.98 }}
            layout
          >
            <span>Join the waitlist</span>
            <ArrowUpRight size={20} />
          </motion.button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="tray"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ height: spring.snappy, opacity: { duration: 0.25 } }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-1 flex flex-col items-center gap-3">
                  <span className="eyebrow" style={{ color: "var(--deep-muted)" }}>
                    or follow the build
                  </span>
                  <ul className="flex items-center gap-2">
                    {SOCIALS.map((s, i) => (
                      <motion.li
                        key={s.label}
                        initial={{ y: 10, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ ...spring.snappy, delay: 0.04 + i * 0.045 }}
                      >
                        <a
                          href={s.href}
                          target={s.href.startsWith("mailto") ? undefined : "_blank"}
                          rel="noreferrer"
                          aria-label={s.label}
                          className="icon-btn !w-12 !h-12 !border-deep-line hover:!bg-lime hover:!text-lime-ink hover:!border-transparent"
                          style={{ color: "var(--cream)" }}
                        >
                          <s.icon size={18} />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="mt-3 text-[12px]" style={{ color: "var(--deep-muted)" }}>
            Hover for socials · Free to focus. Paid for depth and perks.
          </p>
        </div>

        {/* Bottom row */}
        <div
          className="mt-28 sm:mt-36 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(182,193,173,0.18)" }}
        >
          <Wordmark size={24} color="var(--cream)" />
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]" style={{ color: "var(--deep-text)" }} aria-label="Footer">
            <a href="#why" className="hover:text-cream">Why</a>
            <a href="#how" className="hover:text-cream">How it works</a>
            <a href="#proof" className="hover:text-cream">Proof</a>
            <a href="mailto:founders@shutty.io" className="hover:text-cream">Contact</a>
            <a href="#" className="hover:text-cream">Privacy</a>
          </nav>
          <p className="font-mono text-[11px] uppercase tracking-[0.13em]" style={{ color: "var(--deep-muted)" }}>
            © {new Date().getFullYear()} shutty · the world can wait
          </p>
        </div>
      </div>
    </footer>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L22.75 22h-6.91l-5.41-7.07L4.24 22H1l8.02-9.17L.5 2h7.08l4.89 6.46L18.244 2Zm-1.21 18.1h1.8L7.05 3.8H5.12l11.914 16.3Z" />
    </svg>
  );
}

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}
