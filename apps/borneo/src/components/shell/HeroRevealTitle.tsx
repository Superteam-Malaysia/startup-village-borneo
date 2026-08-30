"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";

/** Breakpoint hero decode charset (module 37442, solana.com/breakpoint). */
export const DECODE_CHARSET =
  "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const DECODE_COLORS = [
  "var(--color-wisp)",
  "#ab66fd",
  "#14f195",
] as const;

const SPACE_BLOCK_WIDTHS = ["0.4em", "0.7em", "1em"] as const;

type DecodeFrame =
  | { kind: "break" }
  | { kind: "char"; char: string; color: string | null }
  | { kind: "block"; width: string };

function buildDecodeFrames(
  text: string,
  revealedCount: number,
  tick: number,
  done: boolean,
): DecodeFrame[] {
  if (done) {
    return Array.from(text, (char) =>
      char === "\n"
        ? { kind: "break" as const }
        : { kind: "char" as const, char, color: null },
    );
  }

  return Array.from(text, (char, index) => {
    if (char === "\n") return { kind: "break" as const };
    if (index < revealedCount) {
      return { kind: "char" as const, char, color: null };
    }
    if (char === " ") {
      return {
        kind: "block" as const,
        width: SPACE_BLOCK_WIDTHS[(tick + index) % SPACE_BLOCK_WIDTHS.length],
      };
    }
    return {
      kind: "char" as const,
      char: DECODE_CHARSET[(tick + index) % DECODE_CHARSET.length],
      color: DECODE_COLORS[(tick + 3 * index) % DECODE_COLORS.length],
    };
  });
}

export type DecodeTextProps = {
  text: string;
  durationMs?: number;
  delayMs?: number;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  /** Set false when an ancestor already labels the text for assistive tech. */
  srOnlyLabel?: boolean;
};

/** Breakpoint hero headline decode — scramble chars resolve left-to-right. */
export function DecodeText({
  text,
  durationMs = 1000,
  delayMs = 0,
  className,
  style,
  as: Tag = "span",
  srOnlyLabel = true,
}: DecodeTextProps) {
  const [frames, setFrames] = useState<DecodeFrame[]>(() =>
    buildDecodeFrames(text, 0, 0, false),
  );
  const tickRef = useRef(0);

  useEffect(() => {
    tickRef.current = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrames(buildDecodeFrames(text, text.length, 0, true));
      return undefined;
    }

    let raf = 0;
    let start: number | null = null;

    const loop = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start - delayMs;

      if (elapsed < 0) {
        tickRef.current += 1;
        setFrames(buildDecodeFrames(text, 0, tickRef.current, false));
        raf = requestAnimationFrame(loop);
        return;
      }

      const progress = Math.min(1, elapsed / durationMs);
      const revealed = Math.floor(progress * text.length);
      tickRef.current += 1;
      setFrames(buildDecodeFrames(text, revealed, tickRef.current, false));

      if (progress < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setFrames(buildDecodeFrames(text, text.length, 0, true));
      }
    };

    setFrames(buildDecodeFrames(text, 0, 0, false));
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs, delayMs]);

  return createElement(
    Tag,
    { className, style },
    srOnlyLabel ? createElement("span", { className: "sr-only" }, text) : null,
    createElement(
      "span",
      { "aria-hidden": true },
      frames.map((frame, index) => {
        if (frame.kind === "break") {
          return createElement("br", { key: index });
        }
        if (frame.kind === "block") {
          return createElement("span", {
            key: index,
            className: "decode-text__block",
            style: { width: frame.width },
          });
        }
        return createElement(
          "span",
          {
            key: index,
            className: "decode-text__char",
            style: frame.color ? { color: frame.color } : undefined,
          },
          frame.char,
        );
      }),
    ),
  );
}

const WORD_STEP_MS = 70;
const META_START_DELAY_MS = 1100;

function splitWords(text: string) {
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

type HeroRevealTitleProps = {
  lines: string[];
  className?: string;
};

export function HeroRevealTitle({ lines, className }: HeroRevealTitleProps) {
  const text = lines.join("\n");

  return (
    <DecodeText
      as="h1"
      text={text}
      durationMs={1000}
      className={["home-hero__title", className].filter(Boolean).join(" ")}
    />
  );
}

/** Meta line — word opacity stagger (Breakpoint eyebrow, module 43550). */
export function HeroRevealMeta({ text }: { text: string }) {
  const words = splitWords(text);

  return (
    <p className="home-hero__meta" aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="decode-text__word"
          aria-hidden="true"
          style={{
            animationDelay: `${(META_START_DELAY_MS + index * WORD_STEP_MS) / 1000}s`,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
