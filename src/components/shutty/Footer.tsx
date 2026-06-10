import { useReveal } from "@/hooks/use-reveal";
import { VideoBackdrop } from "./VideoBackdrop";
import focusVideo from "@/assets/motion-focus.mp4.asset.json";

export function Footer() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 py-28">
      <VideoBackdrop src={focusVideo.url} />
      <div ref={ref} className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="reveal max-w-3xl text-left text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Stop doomscrolling.
          <br />
          <span className="text-glow-orange">Build something.</span>
        </h2>

        <div className="reveal mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#claim"
            className="group font-mono text-lg uppercase tracking-widest text-foreground transition-colors duration-300 hover:text-glow-orange"
          >
            Join the Peloton
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            SHUTTY Systems © 2026. Stand the pace.
          </p>
        </div>

        <div className="reveal mt-12 h-px w-full origin-left line-draw bg-white/15" />
        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">SHUTTY</span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange animate-blink" />
        </div>
      </div>
    </footer>
  );
}