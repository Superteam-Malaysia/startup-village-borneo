"use client";

import {
  HalftoneBarChart,
  HalftoneMeter,
} from "@/components/halftone";
import { MAX_RACE_POINTS, RACE_CUTOFF, SAMPLE_LEADERBOARD } from "@/data/race-tasks";
import { CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { PageHeader } from "@/components/shell";

const DAY_LABELS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

function rankAccent(rank: number) {
  if (rank === 1) return "text-[var(--color-byte)]";
  if (rank === 2) return "text-[var(--color-azure)]";
  if (rank === 3) return "text-[var(--color-mint)]";
  return "text-[var(--color-wisp)]/60";
}

export function LeaderboardPageContent() {
  const leader = SAMPLE_LEADERBOARD[0];
  const totalPoints = SAMPLE_LEADERBOARD.reduce((sum, row) => sum + row.points, 0);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <PageHeader
        title="Teams"
        lead="Team points across Kuching stations — updated live during the event via the companion dApp. Until then, explore sample standings and momentum charts below."
      />

      <div className="companion-banner" role="status">
        <span className="companion-banner__tag">Coming soon</span>
        Live team standings ship with the companion dApp — sample data below is for layout preview only.
      </div>

      <SectionArticle className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
          <SectionIntro title="Top three momentum" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SAMPLE_LEADERBOARD.slice(0, 3).map((row) => (
              <div
                key={row.team}
                className={[
                  "border border-[color:var(--color-transparent-wisp-10)] p-5 flex flex-col gap-4",
                  row.rank === 1 ? "md:-translate-y-2 bg-[var(--color-byte)]/5" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`font-[family-name:var(--font-display)] text-3xl ${rankAccent(row.rank)}`}>
                    #{row.rank}
                  </span>
                  <span className="text-label text-label-muted">
                    {row.points} pts
                  </span>
                </div>
                <p className="font-[family-name:var(--font-display)] text-xl leading-tight">{row.team}</p>
                <HalftoneBarChart
                  priority={row.rank === 1 ? "immediate" : "deferred"}
                  data={row.trend.map((v, i) => ({ label: `D${i + 1}`, value: v }))}
                  caption={`${row.team} points by day`}
                  color={row.rank === 1 ? "green" : row.rank === 2 ? "blue" : "orange"}
                  h={72}
                  className="text-[var(--color-wisp)]/50 text-[0.65rem]"
                />
              </div>
            ))}
          </div>
        </SectionArticle>

        <SectionArticle className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
          <SectionIntro title="Full standings" />
          <p className="mt-4 text-sm text-[var(--color-wisp)]/50 max-w-xl">
            {RACE_CUTOFF.label} · {RACE_CUTOFF.time} — final submissions lock the board.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left border-collapse">
              <thead>
                <tr className="text-label text-label-muted border-b border-[color:var(--color-transparent-wisp-10)]">
                  <th className="pb-3 pr-4 w-12">#</th>
                  <th className="pb-3 pr-4">Team</th>
                  <th className="pb-3 pr-4 text-right w-20">Pts</th>
                  <th className="pb-3 pr-4 w-32 hidden sm:table-cell">Share</th>
                  <th className="pb-3 min-w-[10rem]">5-day trend</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_LEADERBOARD.map((row) => {
                  const share = row.points / MAX_RACE_POINTS;
                  return (
                    <tr
                      key={row.rank}
                      className="border-b border-[color:var(--color-transparent-wisp-10)] hover:bg-[var(--color-wisp)]/[0.02] transition-colors"
                    >
                      <td className={`py-4 pr-4 font-[family-name:var(--font-display)] text-lg ${rankAccent(row.rank)}`}>
                        {row.rank}
                      </td>
                      <td className="py-4 pr-4 font-[family-name:var(--font-mono)] text-sm tracking-wide">
                        {row.team}
                      </td>
                      <td className="py-4 pr-4 text-right font-[family-name:var(--font-display)] text-xl tabular-nums">
                        {row.points}
                      </td>
                      <td className="py-4 pr-4 hidden sm:table-cell">
                        <HalftoneMeter
                          value={share}
                          color={row.rank === 1 ? "green" : "blue"}
                          h={10}
                          priority="deferred"
                          aria-label={`${Math.round(share * 100)}% of max race points`}
                        />
                      </td>
                      <td className="py-4">
                        <HalftoneBarChart
                          priority="deferred"
                          data={row.trend.map((v, i) => ({ label: DAY_LABELS[i], value: v }))}
                          caption={`${row.team} trend`}
                          color={row.rank <= 2 ? "green" : "orange"}
                          h={48}
                          labels={false}
                          className="max-w-[12rem]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionArticle>

        <SectionArticle className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
          <SectionIntro title="Cumulative race energy" />
          <p className="mt-4 text-sm text-[var(--color-wisp)]/50 max-w-xl">
            Aggregate points across all sample teams — {totalPoints} pts logged in this preview field.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-label mb-4">Day 5 totals by team</p>
              <HalftoneBarChart
                priority="deferred"
                data={SAMPLE_LEADERBOARD.map((row) => ({ label: row.team.split(" ")[0], value: row.points }))}
                caption="Team points at cutoff"
                color="green"
                h={160}
                className="text-[var(--color-wisp)]/60 text-xs"
              />
            </div>
            <div>
              <p className="text-label mb-4">Leader momentum</p>
              <HalftoneBarChart
                priority="deferred"
                data={leader.trend.map((v, i) => ({ label: `D${i + 1}`, value: v }))}
                caption={`${leader.team} — points by day`}
                color="blue"
                h={160}
                className="text-[var(--color-wisp)]/60 text-xs"
              />
            </div>
          </div>
        </SectionArticle>

      <SectionArticle>
        <SectionIntro title="Log your race tasks" />
        <p className="mt-4 max-w-xl text-[var(--color-wisp)]/70 leading-relaxed">
          Race threads and deck uploads open in the companion dApp. Review submission rules before
          you hit the streets.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <CtaButton href="/submissions" variant="byte" size="md">
            Submission guide
          </CtaButton>
          <CtaButton href="/amazing-race" variant="ghost-wisp" size="md" showArrow={false}>
            All race tasks
          </CtaButton>
        </div>
      </SectionArticle>
    </div>
  );
}
