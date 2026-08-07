"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type HalftonePriority = "immediate" | "deferred";

/**
 * Mount halftone children only when near the viewport (or immediately for above-fold).
 * Shows a ghost placeholder until mounted so layout never collapses.
 */
export function HalftoneViewport({
  children,
  ghost,
  priority = "deferred",
  className,
  rootMargin = "240px 0px",
}: {
  children: ReactNode;
  ghost: ReactNode;
  priority?: HalftonePriority;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(priority === "immediate");

  useEffect(() => {
    if (priority === "immediate" || mounted) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority, mounted, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {mounted ? children : ghost}
    </div>
  );
}
