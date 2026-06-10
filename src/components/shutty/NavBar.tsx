import { useEffect, useState } from "react";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-black/70 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="group flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight text-foreground">SHUTTY</span>
          <span className="h-2 w-2 rounded-full bg-orange shadow-[0_0_10px_var(--orange-glow)] animate-blink" />
        </a>
        <a
          href="#claim"
          className="border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-foreground transition-colors duration-200 hover:border-orange hover:text-orange"
        >
          Deploy App
        </a>
      </nav>
    </header>
  );
}