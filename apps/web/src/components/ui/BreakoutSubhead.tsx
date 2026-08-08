"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Meter } from "@/halftone/react/index.js";

export type SubheadAccent = "lime" | "azure" | "byte" | "green";

/** Stipple ink — black dots on the CSS accent wash (matches byte/lime; literal hex on canvas reads cakey). */
const STIPPLE_INK = "#000";

const DEFAULT_HALFTONE = {
  screen: "stipple" as const,
  r: 3.8,
  scale: 1.08,
  ink: 1,
  seed: 2026,
};

export function BreakoutSubhead({
  children,
  accent = "lime",
}: {
  children: ReactNode;
  accent?: SubheadAccent;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [accentHeight, setAccentHeight] = useState(48);

  useLayoutEffect(() => {
    const node = labelRef.current;
    if (!node) return undefined;

    const measure = () => setAccentHeight(node.offsetHeight);
    measure();

    if (typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);

  return (
    <span className={["breakout-subhead", `breakout-subhead--${accent}`].join(" ")}>
      <span className="breakout-subhead__accent" aria-hidden="true">
        <Meter
          value={1}
          max={1}
          {...DEFAULT_HALFTONE}
          color={STIPPLE_INK}
          h={accentHeight}
          style={{ height: accentHeight }}
        />
      </span>
      <span ref={labelRef} className="breakout-subhead__label">
        {children}
      </span>
    </span>
  );
}
