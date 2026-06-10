import { ElementType } from "react";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Word-by-word reveal. Each word slides up + fades in with a tiny stagger
 * once the element scrolls into view.
 */
export function TextReveal({
  text,
  as: Tag = "span",
  className = "",
  highlight,
  highlightClassName = "text-shimmer",
  stagger = 55,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  highlight?: string;
  highlightClassName?: string;
  stagger?: number;
}) {
  const ref = useReveal<HTMLElement>();
  const words = text.split(" ");
  const hi = highlight?.toLowerCase();

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((w, i) => {
        const isHi = hi && w.toLowerCase().replace(/[^a-z]/g, "").includes(hi);
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              className="word-reveal inline-block"
              style={{ transitionDelay: `${i * stagger}ms` }}
            >
              <span className={isHi ? highlightClassName : undefined}>{w}</span>
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
