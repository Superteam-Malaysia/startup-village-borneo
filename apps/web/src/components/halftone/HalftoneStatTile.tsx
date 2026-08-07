"use client";

import { Card, Meter } from "@/halftone/react/index.js";

type HalftoneStatTileProps = {
  value: string;
  label: string;
  meter?: { value: number; max?: number; color?: "green" | "purple" | "orange" | "blue" };
  color?: "purple" | "green" | "blue" | "orange";
};

/** Pressed-paper stat tile — Halftone Card + optional Meter fill. */
export function HalftoneStatTile({
  value,
  label,
  meter,
  color = "purple",
}: HalftoneStatTileProps) {
  return (
    <Card
      className="halftone-stat-tile"
      color={color}
      screen="am"
    >
      <span className="halftone-stat-tile__value tabular-nums">{value}</span>
      <span className="halftone-stat-tile__label">{label}</span>
      {meter && (
        <Meter
          value={meter.value}
          max={meter.max ?? 1}
          color={meter.color ?? "green"}
          h={10}
          className="halftone-stat-tile__meter"
        />
      )}
    </Card>
  );
}
