"use client";

import type { ReactNode } from "react";
import { HalftoneProvider } from "@/halftone/react/index.js";
import { SVB_HALFTONE_PAL } from "./halftone-tokens";

/** Shared press context for Halftone UI surfaces — SVB dark theme, fixed seed for stable grain. */
export function SvbHalftoneProvider({ children }: { children: ReactNode }) {
  return (
    <HalftoneProvider
      seed={2026}
      mode="dark"
      pal={SVB_HALFTONE_PAL}
      paletteFromCss={false}
    >
      {children}
    </HalftoneProvider>
  );
}
