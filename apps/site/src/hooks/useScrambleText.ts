"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const FPS = 30;
const ITERATIONS_PER_LETTER = 2;

/**
 * Hacker-style scramble effect: random letters resolve left-to-right to original text.
 * Based on: interval at 30fps, positions < iteration use original, else random.
 */
export function useScrambleText(
  text: string,
  options?: { playOnMount?: boolean; iterationsPerLetter?: number }
) {
  const [display, setDisplay] = useState(
    options?.playOnMount ? "" : text
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iterationsPerLetter = options?.iterationsPerLetter ?? ITERATIONS_PER_LETTER;
  const maxIterations = text.length * iterationsPerLetter;

  useEffect(() => {
    if (options?.playOnMount) replay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runTick = useCallback(
    (iter: number) => {
      const result = text
        .split("")
        .map((char, i) => {
          const threshold = (i + 1) * iterationsPerLetter;
          if (iter >= threshold) return char;
          if (char === " " || char === "\n") return char;
          return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        })
        .join("");
      setDisplay(result);
      return iter >= maxIterations;
    },
    [text, iterationsPerLetter, maxIterations]
  );

  const replay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay("");

    let iteration = 1;
    if (runTick(iteration)) return;

    intervalRef.current = setInterval(() => {
      iteration++;
      const done = runTick(iteration);
      if (done && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000 / FPS);
  }, [text, iterationsPerLetter, maxIterations, runTick]);

  return { display, replay };
}
