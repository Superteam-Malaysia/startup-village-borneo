"use client";

import { HalftoneStatTile } from "./HalftoneStatTile";

export function HomeRaceTeaserStats() {
  return (
    <div className="hero-halftone-grid !grid-cols-1 sm:!grid-cols-3 !mt-10">
      <HalftoneStatTile
        value="10"
        label="Wallet task pts"
        color="green"
        meter={{ value: 10, max: 10, color: "green" }}
      />
      <HalftoneStatTile
        value="18:00"
        label="Day 4 cutoff"
        color="orange"
        meter={{ value: 0.72, color: "orange" }}
      />
      <HalftoneStatTile
        value="2×$500"
        label="Race prizes"
        color="purple"
        meter={{ value: 2, max: 4, color: "purple" }}
      />
    </div>
  );
}
