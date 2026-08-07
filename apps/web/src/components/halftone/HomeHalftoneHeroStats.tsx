"use client";

import { HalftoneStatTile } from "./HalftoneStatTile";
import { HalftoneViewport } from "./HalftoneViewport";
import { HalftoneGhost } from "./HalftoneGhost";
import { PRIZE_TOTAL } from "@/data/prizes";

const HERO_STATS = [
  { value: "5–9 Sep", label: "2026 · 5 days", color: "purple" as const },
  { value: "Kuching", label: "Sheraton · Voco", color: "blue" as const },
  {
    value: PRIZE_TOTAL,
    label: "Prize pool",
    color: "green" as const,
    meter: { value: 1, max: 1, color: "green" as const },
  },
  {
    value: "18:00",
    label: "Day 4 cutoff",
    color: "orange" as const,
    meter: { value: 0.72, color: "orange" as const },
  },
];

export function HomeHalftoneHeroStats() {
  return (
    <HalftoneViewport
      priority="immediate"
      ghost={
        <div className="hero-halftone-grid" aria-hidden>
          {HERO_STATS.map((stat) => (
            <HalftoneGhost key={stat.label} variant="tile" />
          ))}
        </div>
      }
    >
      <div className="hero-halftone-grid" aria-label="Event at a glance">
        {HERO_STATS.map((stat) => (
          <HalftoneStatTile key={stat.label} {...stat} />
        ))}
      </div>
    </HalftoneViewport>
  );
}
