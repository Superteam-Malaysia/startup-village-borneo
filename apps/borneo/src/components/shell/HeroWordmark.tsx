"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DECODE_CHARSET, DECODE_COLORS } from "./HeroRevealTitle";
import { STARTUP_VILLAGE_BORNEO_LOGO_PATHS } from "@/data/startup-village-borneo-logo-paths";

/** Tight crop around path bounds — drops ~150px dead space from the source 800×800 artboard. */
const LOGO_VIEWBOX = "47 144 721 477";

type PathBox = {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};

function sortRevealOrder(boxes: PathBox[]) {
  return [...boxes]
    .sort((a, b) => a.cy - b.cy || a.cx - b.cx)
    .map((box) => box.index);
}

function ScrambleGlyph({
  box,
  tick,
  index,
}: {
  box: PathBox;
  tick: number;
  index: number;
}) {
  const char = DECODE_CHARSET[(tick + index) % DECODE_CHARSET.length];
  const color = DECODE_COLORS[(tick + index * 3) % DECODE_COLORS.length];
  const fontSize = Math.max(10, Math.min(box.width, box.height) * 0.62);

  return (
    <g className="decode-svg__glyph" aria-hidden="true">
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        className="decode-svg__block"
      />
      <text
        x={box.x + box.width / 2}
        y={box.y + box.height / 2}
        fill={color}
        fontSize={fontSize}
        fontFamily="var(--font-mono)"
        fontWeight={500}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {char}
      </text>
    </g>
  );
}

function DecodeRevealLogo({
  className,
  durationMs = 1200,
}: {
  className?: string;
  durationMs?: number;
}) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [boxes, setBoxes] = useState<PathBox[]>([]);
  const [revealOrder, setRevealOrder] = useState<number[]>(() =>
    STARTUP_VILLAGE_BORNEO_LOGO_PATHS.map((_, index) => index),
  );
  const [revealedCount, setRevealedCount] = useState(0);
  const [tick, setTick] = useState(0);
  const [done, setDone] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverTick, setHoverTick] = useState(0);
  const hoverTickRef = useRef(0);

  useLayoutEffect(() => {
    const measured = pathRefs.current
      .map((element, index) => {
        if (!element) return null;
        const bounds = element.getBBox();
        return {
          index,
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          cx: bounds.x + bounds.width / 2,
          cy: bounds.y + bounds.height / 2,
        };
      })
      .filter((box): box is PathBox => box !== null);

    if (measured.length !== STARTUP_VILLAGE_BORNEO_LOGO_PATHS.length) return;

    setBoxes(measured);
    setRevealOrder(sortRevealOrder(measured));
  }, []);

  useEffect(() => {
    if (boxes.length === 0) return undefined;

    const total = STARTUP_VILLAGE_BORNEO_LOGO_PATHS.length;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealedCount(total);
      setDone(true);
      return undefined;
    }

    let raf = 0;
    let start: number | null = null;
    let frameTick = 0;

    const loop = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / durationMs);
      frameTick += 1;
      setTick(frameTick);
      setRevealedCount(Math.floor(progress * total));

      if (progress < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setRevealedCount(total);
        setDone(true);
      }
    };

    setRevealedCount(0);
    setDone(false);
    setTick(0);
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [boxes, durationMs]);

  useEffect(() => {
    if (!done || hoveredIndex === null) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    hoverTickRef.current = 0;
    setHoverTick(0);

    let raf = 0;
    const loop = () => {
      hoverTickRef.current += 1;
      setHoverTick(hoverTickRef.current);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [done, hoveredIndex]);

  const revealed = new Set(revealOrder.slice(0, revealedCount));
  const boxByIndex = new Map(boxes.map((box) => [box.index, box]));

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={[className, done ? "hero-wordmark__logo--interactive" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
      role="presentation"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {STARTUP_VILLAGE_BORNEO_LOGO_PATHS.map((d, index) => {
        const isHovered = done && hoveredIndex === index;
        const isRevealed = (done && !isHovered) || revealed.has(index);
        const box = boxByIndex.get(index);
        const showScramble = !isRevealed || isHovered;
        const scrambleTick = isHovered ? hoverTick : tick;

        return (
          <g key={index} className="decode-svg__segment">
            <path
              ref={(element) => {
                pathRefs.current[index] = element;
              }}
              d={d}
              fill="white"
              opacity={isRevealed ? 1 : 0}
              style={{ pointerEvents: done ? "none" : "auto" }}
            />
            {showScramble && box ? (
              <ScrambleGlyph box={box} tick={scrambleTick} index={index} />
            ) : null}
            {done && box ? (
              <rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill="transparent"
                className="decode-svg__hit"
                onMouseEnter={() => setHoveredIndex(index)}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function HeroWordmark({ className }: { className?: string }) {
  return (
    <h1
      className={["hero-wordmark", className].filter(Boolean).join(" ")}
      aria-label="Startup Village Borneo"
    >
      <DecodeRevealLogo className="hero-wordmark__logo" />
    </h1>
  );
}
