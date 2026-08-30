"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { HalftoneGhost } from "./HalftoneGhost";

type GhostVariant = "tile" | "chart" | "meter" | "title";

const REVEAL_FALLBACK_MS = 32;

/**
 * Coordinates ghost + content reveal so halftone ink and DOM text appear together.
 * Falls back to visible content if onReady does not fire (should be immediate after mount).
 */
export function HalftoneFrame({
  children,
  ghost = "tile",
  className,
}: {
  children: (api: { onReady: () => void }) => ReactNode;
  ghost?: GhostVariant;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={["halftone-frame", ready ? "halftone-frame--ready" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {!ready ? <HalftoneGhost variant={ghost} /> : null}
      <div className="halftone-frame__content" aria-hidden={!ready}>
        {children({ onReady })}
      </div>
    </div>
  );
}
