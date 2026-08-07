"use client";

import { Card, Meter } from "@/halftone/react/index.js";
import { HalftoneFrame } from "./HalftoneFrame";

type HalftoneStatTileProps = {
  value: string;
  label: string;
  meter?: { value: number; max?: number; color?: "green" | "purple" | "orange" | "blue" };
  color?: "purple" | "green" | "blue" | "orange";
};

/** Pressed-paper stat tile — ghost + ink reveal in sync. */
export function HalftoneStatTile({
  value,
  label,
  meter,
  color = "purple",
}: HalftoneStatTileProps) {
  return (
    <HalftoneFrame ghost="tile">
      {({ onReady }) => (
        <Card
          className="halftone-stat-tile"
          color={color}
          screen="am"
          surfaceH={104}
          onReady={onReady}
        >
          <span className="halftone-stat-tile__value tabular-nums">{value}</span>
          <span className="halftone-stat-tile__label">{label}</span>
          {meter ? (
            <Meter
              value={meter.value}
              max={meter.max ?? 1}
              color={meter.color ?? "green"}
              h={10}
              className="halftone-stat-tile__meter"
            />
          ) : null}
        </Card>
      )}
    </HalftoneFrame>
  );
}
