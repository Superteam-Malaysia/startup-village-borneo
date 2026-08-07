"use client";

import { HalftoneStatTile } from "./HalftoneStatTile";
import { HalftoneViewport } from "./HalftoneViewport";
import { HalftoneGhost } from "./HalftoneGhost";

const TEASER_STATS = [
  {
    value: "10",
    label: "Wallet task pts",
    color: "green" as const,
    meter: { value: 10, max: 10, color: "green" as const },
  },
  {
    value: "18:00",
    label: "Day 4 cutoff",
    color: "orange" as const,
    meter: { value: 0.72, color: "orange" as const },
  },
  {
    value: "2×$500",
    label: "Race prizes",
    color: "purple" as const,
    meter: { value: 2, max: 4, color: "purple" as const },
  },
] as const;

export function HomeRaceTeaserStats() {
  return (
    <HalftoneViewport
      priority="deferred"
      ghost={
        <div className="hero-halftone-grid !grid-cols-1 sm:!grid-cols-3 !mt-10" aria-hidden>
          {TEASER_STATS.map((stat) => (
            <HalftoneGhost key={stat.label} variant="tile" />
          ))}
        </div>
      }
    >
      <div className="hero-halftone-grid !grid-cols-1 sm:!grid-cols-3 !mt-10">
        {TEASER_STATS.map((stat) => (
          <HalftoneStatTile key={stat.label} {...stat} />
        ))}
      </div>
    </HalftoneViewport>
  );
}
