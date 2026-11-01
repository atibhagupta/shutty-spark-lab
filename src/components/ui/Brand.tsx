import type { HTMLAttributes, ReactNode } from "react";

/** "shutty" with its ink full stop. `size` is the font size in px. */
export function Wordmark({
  size = 28,
  className = "",
  color,
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  const dot = Math.max(5, Math.round(size * 0.32));
  return (
    <span
      className={`inline-flex items-baseline font-sans font-extrabold leading-none select-none ${className}`}
      style={{ fontSize: size, letterSpacing: "-0.057em", color: color ?? "var(--ink)" }}
      aria-label="shutty"
    >
      shutty
      <span
        aria-hidden="true"
        className="inline-block rounded-full"
        style={{
          width: dot,
          height: dot,
          marginLeft: Math.round(size * 0.12),
          background: "var(--orange)",
        }}
      />
    </span>
  );
}

/** Monospace small caps: the product's system voice. */
export function Eyebrow({
  children,
  className = "",
  as: Tag = "p",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "h2" | "h3" | "div" | "label";
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">) {
  return (
    <Tag className={`eyebrow ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Stamp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`stamp ${className}`}>{children}</span>;
}

/** Numbered section opener: "03 · The problem" + a balanced headline. */
export function SectionHead({
  index,
  label,
  title,
  lede,
  align = "left",
  tone = "ink",
  className = "",
}: {
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "cream";
  className?: string;
}) {
  const cream = tone === "cream";
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      <p
        className="eyebrow flex items-center gap-3"
        style={{
          color: cream ? "var(--deep-muted)" : undefined,
          justifyContent: align === "center" ? "center" : undefined,
        }}
      >
        <span>{index}</span>
        <span aria-hidden="true" className="inline-block w-6 h-[2px] bg-orange" />
        <span>{label}</span>
      </p>
      <h2
        className="text-display mt-5"
        style={{ color: cream ? "var(--cream)" : undefined }}
      >
        {title}
      </h2>
      {lede && (
        <p
          className="text-lede mt-5 text-[17px] max-w-xl"
          style={{
            color: cream ? "var(--deep-text)" : undefined,
            marginInline: align === "center" ? "auto" : undefined,
          }}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

export function Ruler({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`ruler ${className}`} />;
}
