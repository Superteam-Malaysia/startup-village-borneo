"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, Meter } from "@/halftone/react/index.js";
import { SvbHalftoneProvider } from "@/components/halftone";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { RaceTaskCard } from "./RaceTaskCard";
import {
  CONTENT_TASKS,
  MAX_RACE_POINTS,
  RACE_CUTOFF,
  RACE_TASKS,
  THEME_LABELS,
  THEME_ORDER,
  groupRaceTasksByTheme,
} from "@/data/race-tasks";

/** Demo intensity — fraction of max race points a motivated team might chase in one evening. */
const DEMO_INTENSITY = 0.58;

const THEME_HEADINGS: Record<string, string> = {
  food: "Eat the map",
  culture: "Heritage trail",
  waterfront: "River & skyline",
  wallet: "Solana in the wild",
};

export function RacePageContent() {
  const grouped = useMemo(() => groupRaceTasksByTheme(), []);
  const demoPoints = Math.round(MAX_RACE_POINTS * DEMO_INTENSITY);
  const completedDemo = Math.round(RACE_TASKS.length * DEMO_INTENSITY);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero */}
      <header className="relative">
        <div
          className="pointer-events-none absolute -top-8 -left-8 w-64 h-64 opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-byte), transparent 70%)" }}
        />
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--color-wisp)]/50 hover:text-[var(--color-byte)] transition-colors"
        >
          ← Startup Village Borneo
        </Link>
        <p className="text-eyebrow mt-8 mb-6">Day 1–4 · Evenings & gaps</p>
        <h1 className="hero-display max-w-4xl">
          The <span className="hero-display-accent">Amazing</span>
          <br />
          Race
        </h1>
        <p className="mt-8 max-w-2xl text-[var(--color-wisp)]/75 leading-relaxed text-lg">
          Points-weighted challenges across Kuching — food, culture, waterfront, and one wallet
          onboarding mission. Your build comes first; you won&apos;t finish everything. Choose well.
        </p>
        <div className="info-stat-grid mt-10 max-w-xl">
          <div>
            <p className="info-stat-value text-[var(--svb-color-solana-mint)]">{RACE_TASKS.length}</p>
            <p className="info-stat-label">Race tasks</p>
          </div>
          <div>
            <p className="info-stat-value">{MAX_RACE_POINTS}</p>
            <p className="info-stat-label">Max race pts</p>
          </div>
          <div>
            <p className="info-stat-value text-[var(--color-byte)]">2 × $500</p>
            <p className="info-stat-label">Race prizes</p>
          </div>
        </div>
      </header>

      {/* Cutoff banner */}
      <div className="cutoff-banner" role="status">
        <span className="text-[var(--svb-color-solana-mint)]">Hard cutoff</span>
        {" · "}
        {RACE_CUTOFF.label}
        {" · "}
        <span className="text-[var(--color-byte)]">{RACE_CUTOFF.time}</span>
        <span className="block mt-2 normal-case tracking-normal text-[var(--color-wisp)]/60 text-xs">
          Amazing Race & deck submission — nothing accepted after this time.
        </span>
      </div>

      {/* Race intensity meter */}
      <SectionArticle>
        <SectionIntro eyebrow="Race intensity" title="How deep are you going tonight?" />
        <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/70 leading-relaxed">
          Demo meter — illustrative chase intensity before regrouping. Real standings ship with the
          companion leaderboard.
        </p>
        <div className="mt-8">
          <SvbHalftoneProvider>
            <Card
              className="rounded-lg border border-[var(--color-transparent-wisp-10)] p-6 md:p-8 max-w-2xl"
              color="purple"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-[family-name:var(--font-display)] text-xl text-[var(--color-wisp)]">
                    Evening sprint
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--svb-color-solana-mint)]">
                    {demoPoints} / {MAX_RACE_POINTS} pts
                  </p>
                </div>
                <label className="flex flex-col gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-wisp)]/60">
                    Chase intensity
                  </span>
                  <Meter value={DEMO_INTENSITY} color="green" h={16} />
                </label>
                <label className="flex flex-col gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-wisp)]/60">
                    Tasks in play ({completedDemo} of {RACE_TASKS.length})
                  </span>
                  <Meter value={completedDemo} max={RACE_TASKS.length} color="purple" h={12} />
                </label>
              </div>
            </Card>
          </SvbHalftoneProvider>
        </div>
      </SectionArticle>

      {/* Content tasks */}
      <SectionArticle id="content-tasks">
        <SectionIntro eyebrow="Individual posts" title="Content tasks" />
        <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/70 leading-relaxed">
          Each team member posts on X — first impressions earn race points; final impressions feed
          the Content Award. Tag @superteamMY, @solana, and SOCOE on every post.
        </p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 list-none">
          {CONTENT_TASKS.map((task) => (
            <li key={task.id}>
              <RaceTaskCard task={task} />
            </li>
          ))}
        </ul>
      </SectionArticle>

      {/* Race tasks by theme */}
      {THEME_ORDER.map((theme) => {
        const tasks = grouped[theme];
        if (tasks.length === 0) return null;

        return (
          <SectionArticle key={theme} id={`theme-${theme}`}>
            <SectionIntro eyebrow={THEME_LABELS[theme]} title={THEME_HEADINGS[theme]} />
            {theme === "wallet" && (
              <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/70 leading-relaxed">
                Teach, don&apos;t sell. No approaching anyone about money or investments.
              </p>
            )}
            {theme === "waterfront" && (
              <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/70 leading-relaxed">
                Waterfront option tasks share a combined cap of 8 points — pick what fits your route.
              </p>
            )}
            <ul
              className={[
                "mt-10 grid gap-6 list-none",
                tasks.length === 1 ? "md:grid-cols-1 max-w-xl" : "md:grid-cols-2 lg:grid-cols-3",
              ].join(" ")}
            >
              {tasks.map((task) => (
                <li key={task.id}>
                  <RaceTaskCard task={task} />
                </li>
              ))}
            </ul>
          </SectionArticle>
        );
      })}

      {/* Submission rules */}
      <SectionArticle className="border border-[var(--color-transparent-wisp-10)] rounded-lg">
        <SectionIntro eyebrow="How to submit" title="One thread per team task" />
        <ul className="mt-8 flex flex-col gap-4 list-none max-w-2xl">
          {[
            "Race tasks: single Twitter/X thread per task, tagging every team member.",
            "Content tasks: individual member posts — each qualifying post scores for the team.",
            "Submissions timestamped; cutoff enforced at 18:00 MYT on Day 4.",
            "Build time wins — race points are bonus, not the main prize.",
          ].map((rule) => (
            <li
              key={rule}
              className="flex gap-3 text-sm leading-relaxed text-[var(--color-wisp)]/65"
            >
              <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--svb-color-solana-mint)]" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </SectionArticle>
    </div>
  );
}
