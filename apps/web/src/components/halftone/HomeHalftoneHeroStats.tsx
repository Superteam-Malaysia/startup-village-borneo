import { PRIZE_TOTAL } from "@/data/prizes";

const HERO_STATS = [
  { value: "5–9 Sep", label: "2026 · 5 days" },
  { value: "Kuching", label: "Sheraton · Voco" },
  { value: PRIZE_TOTAL, label: "Prize pool" },
  { value: "18:00", label: "Day 4 cutoff" },
];

export function HomeHalftoneHeroStats() {
  return (
    <div className="hero-halftone-grid !mt-0" aria-label="Event at a glance">
      {HERO_STATS.map((stat) => (
        <div key={stat.label} className="halftone-stat-tile">
          <span className="halftone-stat-tile__value tabular-nums">{stat.value}</span>
          <span className="halftone-stat-tile__label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
