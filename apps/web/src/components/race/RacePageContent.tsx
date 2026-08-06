"use client";

import { BarChart, Meter } from "@/halftone/react/index.js";
import { SvbHalftoneProvider } from "@/components/halftone";
import {
  CONTENT_TASKS,
  RACE_CUTOFF,
  RACE_SUBMISSION_RULES,
  SAMPLE_LEADERBOARD,
  THEME_LABELS,
  THEME_ORDER,
  groupRaceTasksByTheme,
} from "@/data/race-tasks";
import { RaceTaskCard } from "./RaceTaskCard";
import { SectionArticle, SectionIntro } from "@/components/ui";

export function RacePageContent() {
  const themed = groupRaceTasksByTheme();

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <header>
        <p className="text-eyebrow mb-6">Points-weighted · evenings & gaps</p>
        <h1 className="hero-display max-w-4xl">
          The <span className="hero-display-accent">Amazing</span>
          <br />
          Race
        </h1>
        <p className="mt-8 max-w-2xl text-[var(--color-wisp)]/75 leading-relaxed text-lg">
          Kuching is the course — laksa pilgrimages, waterfront sampan rides, cat statues, and a
          wallet mission that teaches real users. You may not finish every station. Choose well.
        </p>
      </header>

      <div className="cutoff-banner">
        {RACE_CUTOFF.label} · {RACE_CUTOFF.time} — Amazing Race & deck cutoff. Nothing after.
      </div>

      <SvbHalftoneProvider>
        <SectionArticle className="border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-8">
          <SectionIntro eyebrow="Live preview" title="Race intensity & standings" />
          <p className="mt-4 text-sm text-[var(--color-wisp)]/50 max-w-xl">
            Sample data — full leaderboard ships with the companion dApp backend.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-eyebrow !ms-0 mb-4">Top team momentum</p>
              <BarChart
                data={SAMPLE_LEADERBOARD[0].trend.map((v, i) => ({
                  label: `D${i + 1}`,
                  value: v,
                }))}
                caption="Borneo Builders points by day"
                color="green"
                h={140}
                className="text-[var(--color-wisp)]/60 text-xs"
              />
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-sm text-[var(--color-wisp)]/70">
                Cutoff window (illustrative)
                <Meter value={0.58} color="orange" h={14} className="mt-2" />
              </label>
              <label className="text-sm text-[var(--color-wisp)]/70">
                Stations completed (sample)
                <Meter value={7} max={15} color="green" h={14} className="mt-2" />
              </label>
            </div>
          </div>
          <ol className="mt-10 grid gap-2 list-none font-[family-name:var(--font-mono)] text-sm">
            {SAMPLE_LEADERBOARD.map((row) => (
              <li
                key={row.rank}
                className="flex justify-between border-b border-[color:var(--color-transparent-wisp-10)] py-2"
              >
                <span>
                  <span className="text-[var(--color-byte)]">#{row.rank}</span> {row.team}
                </span>
                <span>{row.points} pts</span>
              </li>
            ))}
          </ol>
        </SectionArticle>
      </SvbHalftoneProvider>

      <SectionArticle>
        <SectionIntro eyebrow="Content tasks" title="Individual X posts" />
        <p className="mt-4 text-sm text-[var(--color-wisp)]/60">
          Tag @superteamMY, @solana, SOCOE on every post.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 list-none">
          {CONTENT_TASKS.map((task) => (
            <li key={task.id}>
              <RaceTaskCard task={task} />
            </li>
          ))}
        </ul>
      </SectionArticle>

      {THEME_ORDER.map((theme) => {
        const tasks = themed[theme];
        if (!tasks.length) return null;
        return (
          <SectionArticle key={theme}>
            <SectionIntro eyebrow="Stations" title={THEME_LABELS[theme]} />
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 list-none">
              {tasks.map((task) => (
                <li key={task.id}>
                  <RaceTaskCard task={task} />
                </li>
              ))}
            </ul>
          </SectionArticle>
        );
      })}

      <SectionArticle>
        <SectionIntro eyebrow="Submission" title="How to play" />
        <ul className="mt-6 flex flex-col gap-3 list-disc list-inside text-[var(--color-wisp)]/75">
          {RACE_SUBMISSION_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </SectionArticle>
    </div>
  );
}
