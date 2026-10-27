"use client";

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Content taller than this gets the toggle; anything within SLACK of it just shows in full. */
const SLACK = 24;

export function Collapsible({
  children,
  collapsedHeight = 128,
  className = "",
}: {
  children: ReactNode;
  collapsedHeight?: number;
  className?: string;
}) {
  const id = useId();
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  // null until measured; the server render stays clipped so long content never flashes open.
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setFullHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const measured = fullHeight !== null;
  const overflowing = measured && fullHeight > collapsedHeight + SLACK;
  const clipped = !expanded && (!measured || overflowing);

  function toggle() {
    if (expanded) {
      // Collapsing a long entry can leave the reader below it; bring its top back into view.
      const card = outer.current?.closest("article") ?? outer.current;
      if (card && card.getBoundingClientRect().top < 0) {
        card.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
    setExpanded(!expanded);
  }

  return (
    <div className={className}>
      <div
        ref={outer}
        id={id}
        className="relative overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
        style={{ maxHeight: clipped ? collapsedHeight : (fullHeight ?? undefined) }}
      >
        <div ref={inner}>{children}</div>
        {clipped && overflowing && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-bg to-transparent" />
        )}
      </div>
      {overflowing && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={id}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          {expanded ? "Show less" : "Read more"}
          <svg
            viewBox="0 0 24 24"
            className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}
