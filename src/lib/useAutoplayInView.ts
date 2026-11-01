import { useEffect, type RefObject } from "react";

/**
 * Plays a muted <video> only while it is on screen, pausing it otherwise so
 * off-screen clips cost nothing. Retries on `canplay`: the `autoplay`
 * attribute alone can lose the race against <source> selection, and a play()
 * fired before data is ready is silently aborted.
 */
export function useAutoplayInView(
  ref: RefObject<HTMLVideoElement | null>,
  enabled = true,
  options: IntersectionObserverInit = { threshold: 0.1 },
) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!enabled) {
      v.pause();
      return;
    }
    let visible = false;
    let wantPlaying = false;
    let resume = 0;
    const tryPlay = () => {
      if (visible && document.visibilityState === "visible" && v.paused) v.play().catch(() => {});
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wantPlaying = visible;
      if (visible) tryPlay();
      else v.pause();
    }, options);
    io.observe(v);
    // Decorative clips have no controls, so a pause we didn't ask for (the
    // browser parking a muted video while the tab is backgrounded) is resumed.
    const onPause = () => {
      if (!wantPlaying) return;
      window.clearTimeout(resume);
      resume = window.setTimeout(tryPlay, 250);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    v.addEventListener("canplay", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(resume);
      io.disconnect();
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled]);
}
