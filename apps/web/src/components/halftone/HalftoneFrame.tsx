"use client";

import { useCallback, useState, type ReactNode } from "react";
import { HalftoneGhost } from "./HalftoneGhost";

type GhostVariant = "tile" | "chart" | "meter" | "title";

/**
 * Coordinates ghost + content reveal so halftone ink and DOM text appear together.
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
