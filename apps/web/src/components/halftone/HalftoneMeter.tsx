"use client";

import type { ComponentProps, ReactNode } from "react";
import { Meter } from "@/halftone/react/index.js";
import { HalftoneFrame } from "./HalftoneFrame";
import { HalftoneViewport, type HalftonePriority } from "./HalftoneViewport";
import { HalftoneGhost } from "./HalftoneGhost";

type MeterProps = ComponentProps<typeof Meter>;

function MeterSurface(props: MeterProps & { onReady?: () => void }) {
  return (
    <HalftoneFrame ghost="meter">
      {({ onReady }) => <Meter {...props} onReady={onReady} />}
    </HalftoneFrame>
  );
}

export function HalftoneMeter({
  priority = "deferred",
  className,
  ...props
}: MeterProps & { priority?: HalftonePriority }) {
  const surface = <MeterSurface {...props} />;

  if (priority === "immediate") {
    return <div className={className}>{surface}</div>;
  }

  return (
    <HalftoneViewport
      priority={priority}
      ghost={<HalftoneGhost variant="meter" />}
      className={className}
    >
      {surface}
    </HalftoneViewport>
  );
}
