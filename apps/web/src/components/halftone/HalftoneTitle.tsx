"use client";

import { useCallback, useEffect, useState } from "react";
import { Text } from "@/halftone/react/index.js";
import { HalftoneGhost } from "./HalftoneGhost";

/** Halftone-pressed display wordmark — CSS fallback until canvas is ready. */
export function HalftoneTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 32);
    return () => window.clearTimeout(timer);
  }, []);

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
        color="purple"
        screen="am"
        animate={false}
        onReady={onReady}
        className="halftone-title__canvas"
      />
    </div>
  );
}
