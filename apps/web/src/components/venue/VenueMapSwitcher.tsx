"use client";

import { useState } from "react";
import {
  BREAKPOINT_VENUE_ZONES,
  EventMap,
  SVB_VENUE_ZONES,
} from "@/components/venue";

type MapPreset = "sheraton" | "breakpoint";

const MAP_PRESETS: {
  id: MapPreset;
  label: string;
  venueName: string;
  zones: typeof SVB_VENUE_ZONES;
  defaultZoneId: string;
  caption: string;
}[] = [
  {
    id: "sheraton",
    label: "Sheraton Kuching",
    venueName: "Sheraton Kuching",
    zones: SVB_VENUE_ZONES,
    defaultZoneId: "sheraton-lobby",
    caption:
      "SVB zones on Sheraton — lobby, breakfast, evening build, and waterfront exit. Floor images are a UI placeholder until official plans arrive.",
  },
  {
    id: "breakpoint",
    label: "Breakpoint reference",
    venueName: "Breakpoint map (UI reference)",
    zones: BREAKPOINT_VENUE_ZONES,
    defaultZoneId: "touch-grass",
    caption:
      "Original Breakpoint EventMap pattern — kept as a layout reference for the interactive component.",
  },
];

export function VenueMapSwitcher() {
  const [preset, setPreset] = useState<MapPreset>("sheraton");
  const active = MAP_PRESETS.find((p) => p.id === preset) ?? MAP_PRESETS[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {MAP_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={[
              "px-4 py-2 text-label text-label-accent border transition-colors cursor-pointer",
              preset === p.id
                ? "bg-[var(--color-byte)] text-[var(--color-null)] border-[var(--color-byte)]"
                : "border-[color:var(--color-transparent-wisp-10)] text-[var(--color-wisp)]/70 hover:border-[var(--color-byte)]/40",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-[var(--color-wisp)]/50 max-w-2xl">{active.caption}</p>
      <EventMap
        key={active.id}
        venueName={active.venueName}
        zones={active.zones}
        defaultZoneId={active.defaultZoneId}
      />
    </div>
  );
}
