"use client";

import { useCallback, useState } from "react";
import { Text } from "@/halftone/react/index.js";
import { HalftoneGhost } from "./HalftoneGhost";

/** Halftone-pressed display wordmark — Breakpoint-style CMYK press-in on load. */
export function HalftoneTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      className={["halftone-title", ready ? "halftone-title--ready" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <h1 className={ready ? "sr-only" : "halftone-title__fallback"}>{text}</h1>
      {!ready ? <HalftoneGhost variant="title" /> : null}
      <Text
        text={text}
        color="#ab66fd"
        screen="am"
        animate
        pressMs={700}
        scale={1}
        r={2.4}
        ink={1}
        wash={1}
        onReady={onReady}
        className="halftone-title__canvas"
      />
    </div>
  );
}
