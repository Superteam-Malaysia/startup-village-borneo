"use client";

import { Text } from "@/halftone/react/index.js";

/** Halftone-pressed display wordmark — decorative canvas + accessible h1. */
export function HalftoneTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={["halftone-title", className].filter(Boolean).join(" ")}>
      <h1 className="sr-only">{text}</h1>
      <Text text={text} color="purple" screen="am" animate className="halftone-title__canvas" />
    </div>
  );
}
