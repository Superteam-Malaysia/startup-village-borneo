"use client";

import { BarChart, Card } from "@/halftone/react/index.js";
import { PRIZE_TOTAL } from "@/data/prizes";
import { HalftoneStatTile } from "./HalftoneStatTile";
import { HalftoneViewport } from "./HalftoneViewport";
import { HalftoneGhost } from "./HalftoneGhost";
import { HalftoneFrame } from "./HalftoneFrame";

const OVERVIEW_METERS = [
  { value: "5", label: "Days", meter: { value: 5, max: 5, color: "blue" as const } },
  {
    value: PRIZE_TOTAL,
    label: "Prize pool",
    meter: { value: 1, max: 1, color: "green" as const },
  },
  { value: "15+", label: "Race stations", meter: { value: 15, max: 17, color: "purple" as const } },
  { value: "18:00", label: "Day 4 cutoff", meter: { value: 0.72, color: "orange" as const } },
];

const PRIZE_PREVIEW = [
  { label: "1st", value: 3000 },
  { label: "2nd", value: 2000 },
  { label: "3rd", value: 1000 },
  { label: "Tracks", value: 4000 },
];

export function HomeHalftoneOverview() {
  return (
    <HalftoneViewport
      priority="deferred"
      ghost={
        <div className="home-halftone-overview" aria-hidden>
          <div className="home-halftone-overview__stats">
            {OVERVIEW_METERS.map((stat) => (
              <HalftoneGhost key={stat.label} variant="tile" />
            ))}
          </div>
          <HalftoneGhost variant="chart" />
        </div>
      }
    >
      <div className="home-halftone-overview">
        <div className="home-halftone-overview__stats">
          {OVERVIEW_METERS.map((stat) => (
            <HalftoneStatTile key={stat.label} {...stat} color="purple" />
          ))}
        </div>
        <HalftoneFrame ghost="chart">
          {({ onReady }) => (
            <Card
              className="home-halftone-overview__chart"
              color="green"
              screen="lines"
              surfaceH={192}
              onReady={onReady}
            >
              <p className="text-label mb-4">Prize pool split</p>
              <BarChart
                data={PRIZE_PREVIEW}
                caption="USD prize allocation preview"
                color="green"
                h={120}
                className="text-[var(--color-wisp)]/60 text-xs"
              />
            </Card>
          )}
        </HalftoneFrame>
      </div>
    </HalftoneViewport>
  );
}
