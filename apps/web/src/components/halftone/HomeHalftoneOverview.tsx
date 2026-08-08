import { PRIZE_TOTAL } from "@/data/prizes";

const OVERVIEW_STATS = [
  { value: "5", label: "Days", meter: { value: 5, max: 5, tone: "azure" as const } },
  {
    value: PRIZE_TOTAL,
    label: "Prize pool",
    meter: { value: 1, max: 1, tone: "byte" as const },
  },
  {
    value: "15+",
    label: "Race stations",
    meter: { value: 15, max: 17, tone: "azure" as const },
  },
  {
    value: "18:00",
    label: "Day 4 cutoff",
    meter: { value: 0.72, max: 1, tone: "byte" as const },
  },
];

const PRIZE_PREVIEW = [
  { label: "1st", value: 3000 },
  { label: "2nd", value: 2000 },
  { label: "3rd", value: 1000 },
  { label: "Tracks", value: 4000 },
];

const MAX_PRIZE = Math.max(...PRIZE_PREVIEW.map((item) => item.value));

function StatMeter({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone: "azure" | "byte";
}) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className="overview-stat-meter" aria-hidden>
      <div
        className={`overview-stat-meter__fill overview-stat-meter__fill--${tone}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function HomeHalftoneOverview() {
  return (
    <div className="home-halftone-overview">
      <div className="home-halftone-overview__stats">
        {OVERVIEW_STATS.map((stat) => (
          <div key={stat.label} className="halftone-stat-tile">
            <span className="halftone-stat-tile__value tabular-nums">{stat.value}</span>
            <span className="halftone-stat-tile__label">{stat.label}</span>
            <StatMeter {...stat.meter} />
          </div>
        ))}
      </div>

      <div className="home-halftone-overview__chart">
        <p className="text-label mb-4">Prize pool split</p>
        <div
          className="overview-prize-chart"
          role="img"
          aria-label="USD prize allocation preview"
        >
          {PRIZE_PREVIEW.map((item) => (
            <div key={item.label} className="overview-prize-chart__item">
              <div className="overview-prize-chart__bar-wrap">
                <div
                  className="overview-prize-chart__bar"
                  style={{ height: `${(item.value / MAX_PRIZE) * 100}%` }}
                />
              </div>
              <span className="overview-prize-chart__label">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="overview-prize-chart__caption">USD prize allocation preview</p>
      </div>
    </div>
  );
}
