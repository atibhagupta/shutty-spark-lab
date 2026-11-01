import type { CSSProperties, ReactNode } from "react";

/**
 * A device frame that scales its content. Screens are authored at 360×780 and
 * scaled down with `transform` so type stays crisp at any size.
 */
export function PhoneFrame({
  children,
  width = 300,
  className = "",
  style,
  deep = false,
  frameColor = "#2b3129",
  island = true,
  screen,
}: {
  children?: ReactNode;
  /**
   * Unscaled layer filling the screen — for real media (<video>, <img>) that
   * must not sit under the content `transform: scale()`, which Chrome renders
   * at the wrong size for video.
   */
  screen?: ReactNode;
  width?: number;
  className?: string;
  style?: CSSProperties;
  deep?: boolean;
  /** Bezel colour; lighten it when the frame sits on a dark surface. */
  frameColor?: string;
  /** Hide the dynamic island (e.g. for real screen recordings that draw their own header). */
  island?: boolean;
}) {
  const BASE_W = 360;
  const BASE_H = 780;
  const scale = width / BASE_W;
  const height = BASE_H * scale;
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width,
        height,
        borderRadius: 44 * scale,
        background: deep ? "var(--deep)" : "var(--paper)",
        border: `${Math.max(4, 7 * scale)}px solid ${frameColor}`,
        boxShadow:
          "0 1px 0 rgba(36,41,31,0.08), 0 40px 80px -40px rgba(36,41,31,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Dynamic island */}
      {island && (
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bg-[#0d110e] rounded-full"
          style={{ top: 12 * scale, width: 104 * scale, height: 30 * scale, zIndex: 5 }}
        />
      )}
      {screen && <div className="absolute inset-0">{screen}</div>}
      {children && (
        <div
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** Shared status bar + header for the paper screens. */
export function ScreenHeader({
  right,
  deep = false,
}: {
  right?: ReactNode;
  deep?: boolean;
}) {
  const color = deep ? "var(--cream)" : "var(--ink)";
  return (
    <div className="px-6 pt-[62px] flex items-center justify-between">
      <span
        className="inline-flex items-baseline font-extrabold leading-none"
        style={{ fontSize: 26, letterSpacing: "-0.057em", color }}
      >
        shutty
        <span
          aria-hidden="true"
          className="inline-block rounded-full"
          style={{ width: 8, height: 8, marginLeft: 3, background: color }}
        />
      </span>
      <div
        className="eyebrow"
        style={{ color: deep ? "var(--deep-muted)" : undefined, fontSize: 11 }}
      >
        {right}
      </div>
    </div>
  );
}
