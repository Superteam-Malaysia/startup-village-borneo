"use client";

import type { ReactNode } from "react";
import { SvbHalftoneProvider } from "./SvbHalftoneProvider";

/** App-wide halftone press context — required for Card, Meter, charts, Text. */
export function HalftoneShell({ children }: { children: ReactNode }) {
  return <SvbHalftoneProvider>{children}</SvbHalftoneProvider>;
}
