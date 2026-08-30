"use client";

import { useEffect, useState } from "react";
import {
  FOOTER_SCRAMBLE_READABLE,
  FOOTER_SCRAMBLE_SEGMENTS,
  GLITCH_CHARS,
} from "@/data/footer-ticker";

function ScrambleNoise({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const id = window.setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch) =>
            Math.random() < 0.14
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : ch,
          )
          .join(""),
      );
    }, 85);

    return () => window.clearInterval(id);
  }, [text]);

  return <span className="footer-scramble__noise">{display}</span>;
}

function ScrambleCycle({ prefix }: { prefix: string }) {
  return (
    <>
      {FOOTER_SCRAMBLE_SEGMENTS.map((seg, i) =>
        seg.type === "word" ? (
          <span key={`${prefix}-w-${i}`} className="footer-scramble__word">
            {seg.text}
          </span>
        ) : (
          <ScrambleNoise key={`${prefix}-n-${i}`} text={seg.text} />
        ),
      )}
    </>
  );
}

type FooterScrambleVariant = "purple" | "azure";

/** Breakpoint-style glitch ticker — keyword highlights + decoding noise band. */
export function FooterScrambleTicker({
  className,
  variant = "purple",
}: {
  className?: string;
  variant?: FooterScrambleVariant;
}) {
  const readable = `${FOOTER_SCRAMBLE_READABLE} · ${FOOTER_SCRAMBLE_READABLE}`;

  return (
    <div
      className={[
        "footer-scramble",
        variant === "azure" ? "footer-scramble--azure" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="sr-only">{readable}</span>
      <div className="footer-scramble__viewport" aria-hidden="true">
        <div className="footer-scramble__track">
          <div className="footer-scramble__strip">
            <ScrambleCycle prefix="a" />
          </div>
          <div className="footer-scramble__strip">
            <ScrambleCycle prefix="b" />
          </div>
        </div>
      </div>
    </div>
  );
}
