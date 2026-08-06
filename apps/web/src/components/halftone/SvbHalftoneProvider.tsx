"use client";

import type { ReactNode } from "react";
import { HalftoneProvider } from "@/halftone/react/index.js";

/** Shared press context for Halftone UI surfaces — SVB dark theme, fixed seed for stable grain. */
export function SvbHalftoneProvider({ children }: { children: ReactNode }) {
  return (
    <HalftoneProvider seed={2026} mode="dark">
      {children}
    </HalftoneProvider>
  );
}
