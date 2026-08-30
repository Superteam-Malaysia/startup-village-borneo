"use client";

import type { ComponentProps } from "react";
import { BarChart } from "@/halftone/react/index.js";
import { HalftoneFrame } from "./HalftoneFrame";
import { HalftoneViewport, type HalftonePriority } from "./HalftoneViewport";
import { HalftoneGhost } from "./HalftoneGhost";

type BarChartProps = ComponentProps<typeof BarChart>;

function ChartSurface(props: BarChartProps) {
  return (
    <HalftoneFrame ghost="chart">
      {({ onReady }) => <BarChart {...props} onReady={onReady} />}
    </HalftoneFrame>
  );
}

export function HalftoneBarChart({
  priority = "deferred",
  className,
  ...props
}: BarChartProps & { priority?: HalftonePriority }) {
  const surface = <ChartSurface {...props} />;

  if (priority === "immediate") {
    return <div className={className}>{surface}</div>;
  }

  return (
    <HalftoneViewport
      priority={priority}
      ghost={<HalftoneGhost variant="chart" />}
      className={className}
    >
      {surface}
    </HalftoneViewport>
  );
}
