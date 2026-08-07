"use client";

import { Button, Card, LineChart } from "@/halftone/react/index.js";
import { HalftoneBarChart, HalftoneMeter } from "@/components/halftone";

const TEAM_POINTS = [
  { label: "Mon", value: 120 },
  { label: "Tue", value: 280 },
  { label: "Wed", value: 410 },
  { label: "Thu", value: 540 },
  { label: "Fri", value: 620 },
];

/**
 * Halftone UI kit demos — print-screen meters and charts for leaderboard / race progress.
 * Layout chrome stays Breakpoint; data surfaces use halftone-kit (copy-in from ecgang/halftone-ui).
 */
export function HalftoneShowcase() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
        <Card
          className="rounded-lg border border-[color:var(--color-transparent-wisp-10)] p-6 min-h-[12rem]"
          color="purple"
        >
          <p className="text-label mb-2">Race progress</p>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-wisp)] mb-6">
            Team Borneo Builders
          </p>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm text-[var(--color-wisp)]/80">
              <span>Tasks completed</span>
              <HalftoneMeter value={6} max={12} color="green" h={14} priority="immediate" />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--color-wisp)]/80">
              <span>Cutoff window</span>
              <HalftoneMeter value={0.42} color="orange" h={14} priority="immediate" />
            </label>
          </div>
          <div className="mt-6">
            <Button color="green" className="px-4 py-2 rounded font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest">
              View submissions
            </Button>
          </div>
        </Card>

        <Card
          className="rounded-lg border border-[color:var(--color-transparent-wisp-10)] p-6"
          color="purple"
        >
          <p className="text-label mb-4">Points by day</p>
          <HalftoneBarChart
            priority="immediate"
            data={TEAM_POINTS}
            caption="Team points by conference day"
            color="green"
            h={140}
            className="text-[var(--color-wisp)]/70 text-xs"
          />
        </Card>

        <Card
          className="rounded-lg border border-[color:var(--color-transparent-wisp-10)] p-6 md:col-span-2"
          color="purple"
        >
          <p className="text-label mb-4">Leaderboard trend</p>
          <LineChart
            data={TEAM_POINTS}
            area
            caption="Cumulative race points"
            color="purple"
            h={160}
            className="text-[var(--color-wisp)]/70 text-xs"
          />
        </Card>
      </div>
  );
}
