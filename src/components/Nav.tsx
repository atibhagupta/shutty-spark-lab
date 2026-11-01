import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "./ui/Brand";
import { EASE_OUT } from "@/lib/motion";

const LINKS = [
  { href: "#why", label: "Why" },
  { href: "#how", label: "How it works" },
  { href: "#proof", label: "Proof" },
  { href: "#circle", label: "Circle" },
];

export function Nav({ onJoin, onNavigate }: { onJoin: () => void; onNavigate: (href: string) => void }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 2);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: hidden ? -96 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="wrap">
        <div
          className="mt-4 flex items-center justify-between gap-4 rounded-[16px] px-4 sm:px-5 transition-[background,box-shadow,backdrop-filter] duration-300"
          style={{
            height: 60,
            background: scrolled ? "rgba(245,243,235,0.78)" : "transparent",
            backdropFilter: scrolled ? "blur(14px) saturate(1.2)" : undefined,
            WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.2)" : undefined,
            boxShadow: scrolled ? "inset 0 0 0 1px var(--line), 0 10px 30px -24px rgba(36,41,31,.35)" : "none",
          }}
        >
          <a href="#top" onClick={(e) => { e.preventDefault(); onNavigate("#top"); }} className="inline-flex" aria-label="shutty home">
            <Wordmark size={26} />
          </a>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(l.href);
                }}
                className="px-3 py-2 rounded-lg text-[13.5px] text-muted-ink hover:text-ink hover:bg-panel transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={onJoin}
            className="btn-primary !min-h-[42px] !py-2 !px-4 !text-[13.5px] !rounded-[10px]"
          >
            <span>Open the app</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
