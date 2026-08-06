"use client";

import { useState } from "react";
import type { RaceTask, TaskCategory } from "@/data/race-tasks";
import { CATEGORY_LABELS } from "@/data/race-tasks";

const CATEGORY_STYLES: Record<
  TaskCategory,
  { chip: string; accent: string; badge: string }
> = {
  content: {
    chip: "border-[var(--color-byte)]/40 bg-[color-mix(in_srgb,var(--color-byte)_12%,transparent)] text-[var(--color-byte)]",
    accent: "hover:border-[var(--color-byte)]/50",
    badge: "bg-[var(--color-byte)] text-[var(--color-null)]",
  },
  race: {
    chip: "border-[var(--svb-color-solana-mint)]/40 bg-[color-mix(in_srgb,var(--svb-color-solana-mint)_10%,transparent)] text-[var(--svb-color-solana-mint)]",
    accent: "hover:border-[var(--svb-color-solana-mint)]/50",
    badge: "bg-[var(--svb-color-solana-mint)] text-[var(--color-null)]",
  },
  wallet: {
    chip: "border-[var(--color-azure)]/40 bg-[color-mix(in_srgb,var(--color-azure)_12%,transparent)] text-[var(--color-azure)]",
    accent: "hover:border-[var(--color-azure)]/50",
    badge: "bg-[var(--color-azure)] text-[var(--color-null)]",
  },
};

function formatPoints(task: RaceTask): string {
  if (task.pointsNote) return task.pointsNote;
  if (task.pointsMax && task.pointsMax !== task.pointsBase) {
    return `${task.pointsBase}–${task.pointsMax} pts`;
  }
  if (task.pointsBase === 0) return "Content Award";
  return `${task.pointsBase} pts`;
}

function pointsBadgeValue(task: RaceTask): string {
  if (task.pointsBase === 0) return "★";
  if (task.pointsMax && task.pointsMax !== task.pointsBase) {
    return `${task.pointsBase}–${task.pointsMax}`;
  }
  return String(task.pointsBase);
}

export function RaceTaskCard({ task }: { task: RaceTask }) {
  const [expanded, setExpanded] = useState(false);
  const styles = CATEGORY_STYLES[task.category];

  return (
    <article
      className={[
        "race-task-card group relative flex flex-col rounded-lg",
        styles.accent,
      ].join(" ")}
    >
      <div
        className="h-px w-full opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-byte) 30%, var(--svb-color-solana-mint) 70%, transparent)",
        }}
      />

      <div className="flex flex-col gap-4 p-5 md:p-6">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex items-center rounded px-2 py-0.5 font-[family-name:var(--font-mono)]",
                "text-[0.65rem] uppercase tracking-[0.12em]",
                styles.chip,
              ].join(" ")}
            >
              {CATEGORY_LABELS[task.category]}
            </span>
            {task.location && (
              <span
                className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-wisp)]/45"
              >
                {task.location}
              </span>
            )}
          </div>

          <div
            className={[
              "flex shrink-0 flex-col items-center justify-center rounded-md px-2.5 py-1.5 min-w-[3.25rem]",
              "font-[family-name:var(--font-mono)] text-sm font-bold leading-none tracking-tight",
              styles.badge,
            ].join(" ")}
            title={formatPoints(task)}
          >
            <span>{pointsBadgeValue(task)}</span>
            {task.pointsBase > 0 && (
              <span className="mt-0.5 text-[0.55rem] uppercase tracking-widest opacity-80">pts</span>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-2">
          <p
            className="font-[family-name:var(--font-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-wisp)]/50"
          >
            Task {String(task.number).padStart(2, "0")}
          </p>
          <h3
            className="font-[family-name:var(--font-display)] text-xl md:text-2xl leading-tight tracking-[0.02em] text-[var(--color-wisp)]"
          >
            {task.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-wisp)]/70">{task.shortDescription}</p>
        </div>

        {task.deadline && (
          <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-byte)]">
            Due {task.deadline}
          </p>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={[
            "flex items-center justify-between gap-2 w-full pt-2",
            "font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em]",
            "text-[var(--color-wisp)]/60 hover:text-[var(--color-byte)] transition-colors cursor-pointer",
          ].join(" ")}
        >
          <span>{expanded ? "Hide details" : "Task details"}</span>
          <span
            className={[
              "relative shrink-0 size-6 border border-[var(--color-transparent-wisp-10)]",
              "flex items-center justify-center transition-colors",
              expanded ? "border-[var(--color-byte)]/40" : "",
            ].join(" ")}
          >
            <span
              className={[
                "absolute h-px w-2.5 bg-current transition-transform duration-300",
                expanded ? "rotate-0" : "rotate-90",
              ].join(" ")}
            />
            <span className="absolute h-px w-2.5 bg-current" />
          </span>
        </button>

        {expanded && (
          <div
            className="flex flex-col gap-3 border-t border-[var(--color-transparent-wisp-10)] pt-4 animate-[accordion-slide-down_0.2s_linear]"
          >
            <ul className="flex flex-col gap-2.5 list-none">
              {task.details.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--color-wisp)]/65"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--color-byte)]/60" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-wisp)]/40">
              {formatPoints(task)}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
