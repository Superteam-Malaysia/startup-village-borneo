"use client";

import { useMemo, useRef, useState } from "react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { IconClose, IconResetZoom, IconSearch, IconZoomIn, IconZoomOut } from "../ui/icons";
import {
  BREAKPOINT_VENUE_ZONES,
  FLOOR_CONFIG,
  type FloorId,
  type MapZone,
} from "./event-map-data";

function MapSearch({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={["relative w-full", className].filter(Boolean).join(" ")}>
      <input
        type="text"
        placeholder="Search locations..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 pr-10 bg-[var(--map-surface)] border border-[color:var(--color-transparent-wisp-10)] text-white placeholder:text-[color:var(--color-wisp)]/40 focus:outline-none focus:border-[var(--color-byte)]/50 transition-colors font-[family-name:var(--font-sans)]"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-wisp)]/40">
        <IconSearch />
      </div>
    </div>
  );
}

function FloorTabsMobile({
  active,
  onChange,
}: {
  active: FloorId;
  onChange: (id: FloorId) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--map-surface)] border border-[color:var(--color-transparent-wisp-10)]">
      {FLOOR_CONFIG.map((floor) => (
        <button
          key={floor.id}
          type="button"
          onClick={() => onChange(floor.id)}
          className={[
            "w-full py-2 font-[family-name:var(--font-sans)] text-xs transition-all cursor-pointer",
            active === floor.id
              ? "bg-[var(--color-byte)] text-[var(--color-null)]"
              : "text-[var(--color-wisp)] hover:bg-[color:var(--color-transparent-wisp-10)]",
          ].join(" ")}
        >
          {floor.label}
        </button>
      ))}
    </div>
  );
}

function FloorListDesktop({
  active,
  onChange,
}: {
  active: FloorId;
  onChange: (id: FloorId) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h5 className="text-[var(--color-wisp)]/60 text-sm font-medium mb-1">Levels</h5>
      {FLOOR_CONFIG.map((floor) => {
        const isActive = floor.id === active;
        return (
          <button
            key={floor.id}
            type="button"
            onClick={() => onChange(floor.id)}
            className={[
              "w-full px-4 py-3 font-[family-name:var(--font-sans)] text-left transition-all cursor-pointer flex items-center justify-between border-b border-t",
              isActive
                ? "bg-[var(--color-byte)]/20 border-[var(--color-byte)]/50 text-[var(--color-byte)]"
                : "bg-[var(--map-surface)] border-[color:var(--color-transparent-wisp-10)] text-[var(--color-wisp)] hover:bg-[color:var(--color-transparent-wisp-10)]",
            ].join(" ")}
          >
            <span>{floor.label}</span>
            <span
              className={[
                "text-[12px] px-2 py-0.5",
                isActive ? "bg-[var(--color-byte)]/30" : "bg-[color:var(--color-transparent-wisp-10)]",
              ].join(" ")}
            >
              {floor.locationCount} locations
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ZoneCallout({
  zone,
  onClose,
  compact,
}: {
  zone: MapZone;
  onClose: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col gap-3 bg-[var(--map-surface)] border border-[var(--color-byte)]/50 p-4",
        compact ? "" : "flex-1 overflow-y-auto max-h-80",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={[
              "inline-flex items-center justify-center rounded font-bold bg-[var(--color-byte)] text-[var(--color-null)]",
              compact ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-xs",
            ].join(" ")}
          >
            {zone.number}
          </span>
          <h5 className="text-[var(--color-byte)] font-medium text-sm sm:text-base">{zone.name}</h5>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--color-wisp)]/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <IconClose />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {zone.locations.map((loc) => (
          <div
            key={loc}
            className="px-3 py-2 bg-[color:var(--color-transparent-wisp-10)] rounded-md text-xs sm:text-sm text-[var(--color-wisp)]/80"
          >
            {loc}
          </div>
        ))}
      </div>
    </div>
  );
}

function MapPins({
  zones,
  selectedId,
  onSelect,
}: {
  zones: MapZone[];
  selectedId: string | null;
  onSelect: (zone: MapZone) => void;
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 20 }}
    >
      {zones.map((zone) => {
        const isSelected = zone.id === selectedId;
        const fill = isSelected ? "var(--map-pin-mint)" : "var(--color-null)";
        const textFill = isSelected ? "var(--color-null)" : "#fff";
        return (
          <g key={zone.id}>
            <path
              d={`M ${zone.x} ${zone.y} L ${zone.x} ${zone.y + 20}`}
              fill="none"
              stroke="var(--map-pin-mint-40)"
              strokeWidth="0.35"
              strokeLinecap="square"
            />
            <g
              className="pointer-events-auto cursor-pointer"
              onClick={() => onSelect(zone)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(zone);
              }}
            >
              {isSelected && (
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={3}
                  fill="none"
                  stroke="var(--map-pin-mint)"
                  strokeWidth="0.3"
                  className="map-pin-pulse"
                  style={{ transformOrigin: `${zone.x}px ${zone.y}px` }}
                />
              )}
              <circle
                cx={zone.x}
                cy={zone.y}
                r={3}
                fill={fill}
                stroke="var(--map-pin-mint-40)"
                strokeWidth="0.3"
                className="transition-all duration-300"
              />
              <text
                x={zone.x}
                y={zone.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textFill}
                fontSize="2.2"
                fontWeight="bold"
                fontFamily="var(--font-sans)"
                className="select-none transition-all duration-300"
              >
                {zone.number}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

function MapViewport({
  floor,
  zones,
  selectedId,
  onSelect,
  transformRef,
}: {
  floor: FloorId;
  zones: MapZone[];
  selectedId: string | null;
  onSelect: (zone: MapZone) => void;
  transformRef: React.RefObject<ReactZoomPanPinchRef | null>;
}) {
  return (
    <div
      className="event-map-container relative w-full aspect-video box-border overflow-hidden touch-pan-x touch-pan-y"
      style={{ touchAction: "pan-x pan-y pinch-zoom" }}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        doubleClick={{ disabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
              <div className="relative w-full h-full min-h-[280px]">
                {FLOOR_CONFIG.map((f) => (
                  <img
                    key={f.id}
                    src={f.image}
                    alt={f.label}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-500 ease-in-out"
                    style={{
                      opacity: f.id === floor ? 1 : 0.1,
                      zIndex: f.id === floor ? 10 : 2,
                    }}
                  />
                ))}
                <MapPins zones={zones} selectedId={selectedId} onSelect={onSelect} />
              </div>
            </TransformComponent>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => zoomIn()}
                className="w-7 h-7 bg-[var(--map-surface)]/50 border border-[color:var(--color-transparent-wisp-10)] text-white/70 hover:text-white hover:bg-[color:var(--color-transparent-wisp-10)] transition-colors flex items-center justify-center cursor-pointer"
              >
                <IconZoomIn />
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => zoomOut()}
                className="w-7 h-7 bg-[var(--map-surface)]/50 border border-[color:var(--color-transparent-wisp-10)] text-white/70 hover:text-white hover:bg-[color:var(--color-transparent-wisp-10)] transition-colors flex items-center justify-center cursor-pointer"
              >
                <IconZoomOut />
              </button>
              <button
                type="button"
                aria-label="Reset zoom"
                onClick={() => resetTransform()}
                className="w-7 h-7 bg-[var(--map-surface)]/50 border border-[color:var(--color-transparent-wisp-10)] text-white/70 hover:text-white hover:bg-[color:var(--color-transparent-wisp-10)] transition-colors flex items-center justify-center cursor-pointer"
              >
                <IconResetZoom />
              </button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export type EventMapProps = {
  venueName?: string;
  zones?: MapZone[];
  defaultZoneId?: string;
};

/** EL-51–62 — Interactive venue map (reverse-engineered from Breakpoint EventMap). */
export function EventMap({
  venueName = "Etihad Arena",
  zones = BREAKPOINT_VENUE_ZONES,
  defaultZoneId,
}: EventMapProps) {
  const [floor, setFloor] = useState<FloorId>("ground");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MapZone | null>(
    () => zones.find((z) => z.id === defaultZoneId) ?? zones[0] ?? null,
  );
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  const floorZones = useMemo(() => zones.filter((z) => z.floor === floor), [zones, floor]);

  const filteredZones = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return floorZones;
    return floorZones.filter(
      (z) =>
        z.name.toLowerCase().includes(q) ||
        z.locations.some((l) => l.toLowerCase().includes(q)),
    );
  }, [floorZones, search]);

  const visiblePins = search.trim() ? filteredZones : floorZones;

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-12">
        <div className="col-span-full md:col-span-8 relative">
          <div className="md:hidden mb-4">
            <MapSearch value={search} onChange={setSearch} />
          </div>
          <MapViewport
            floor={floor}
            zones={visiblePins}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            transformRef={transformRef}
          />
          <div className="mt-4 md:hidden flex flex-col gap-4">
            <FloorTabsMobile active={floor} onChange={setFloor} />
            {selected && selected.floor === floor && (
              <ZoneCallout zone={selected} onClose={() => setSelected(null)} compact />
            )}
          </div>
        </div>

        <div className="hidden md:flex md:col-span-4 flex-col gap-4">
          <MapSearch value={search} onChange={setSearch} />
          <FloorListDesktop active={floor} onChange={setFloor} />
          {selected && selected.floor === floor ? (
            <ZoneCallout zone={selected} onClose={() => setSelected(null)} />
          ) : (
            <p className="text-sm text-[var(--color-wisp)]/60 font-[family-name:var(--font-sans)]">
              Select a numbered zone on the {venueName} map.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
