"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RACE_TASKS } from "@/data/race-tasks";
import { CtaButton, StatusChip } from "@/components/ui";
import { withBasePath } from "@/lib/base-path";
import type { PublicRaceSubmission } from "@/lib/race/submissions";

export type ParticipantTeamOption = {
  teamId: string;
  slug: string;
  name: string;
  role: string;
};

type RaceSubmissionsPanelProps = {
  teams: ParticipantTeamOption[];
  initialTeamSlug: string | null;
  initialSubmissions: PublicRaceSubmission[];
  cutoffPassed: boolean;
};

export function RaceSubmissionsPanel({
  teams,
  initialTeamSlug,
  initialSubmissions,
  cutoffPassed,
}: RaceSubmissionsPanelProps) {
  const [teamSlug, setTeamSlug] = useState(initialTeamSlug ?? teams[0]?.slug ?? "");
  const [submissions, setSubmissions] = useState<PublicRaceSubmission[]>(initialSubmissions);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submissionByTask = useMemo(() => {
    const map = new Map<string, PublicRaceSubmission>();
    for (const row of submissions) map.set(row.taskId, row);
    return map;
  }, [submissions]);

  async function loadTeam(nextSlug: string) {
    setError(null);
    setMessage(null);
    const res = await fetch(withBasePath(`/api/teams/${nextSlug}/submissions`));
    const data = (await res.json()) as {
      error?: string;
      submissions?: PublicRaceSubmission[];
    };
    if (!res.ok) {
      setError(data.error ?? "Could not load submissions.");
      return;
    }
    setSubmissions(data.submissions ?? []);
    setDrafts({});
  }

  async function onTeamChange(nextSlug: string) {
    setTeamSlug(nextSlug);
    await loadTeam(nextSlug);
  }

  async function saveTask(taskId: string) {
    if (!teamSlug || cutoffPassed) return;
    const threadUrl = drafts[taskId] ?? submissionByTask.get(taskId)?.threadUrl ?? "";
    if (!threadUrl.trim()) {
      setError("Paste your thread URL first.");
      return;
    }

    setSavingTaskId(taskId);
    setError(null);
    setMessage(null);

    const res = await fetch(withBasePath(`/api/teams/${teamSlug}/submissions`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, threadUrl }),
    });
    const data = (await res.json()) as {
      error?: string;
      submission?: { id: string; taskId: string; threadUrl: string; submittedAt: string };
    };

    setSavingTaskId(null);
    if (!res.ok) {
      setError(data.error ?? "Could not save submission.");
      return;
    }

    if (data.submission) {
      const task = RACE_TASKS.find((t) => t.id === taskId);
      if (task) {
        const next: PublicRaceSubmission = {
          id: data.submission.id,
          taskId: data.submission.taskId,
          threadUrl: data.submission.threadUrl,
          submittedAt: data.submission.submittedAt,
          taskTitle: task.title,
          taskNumber: task.number,
        };
        setSubmissions((prev) => {
          const rest = prev.filter((row) => row.taskId !== taskId);
          return [next, ...rest];
        });
      }
    }
    setMessage("Thread saved.");
  }

  if (!teams.length) {
    return (
      <div className="race-submissions-panel">
        <p className="text-sm text-[var(--color-wisp)]/70">
          Sign in and join a team to submit race threads.{" "}
          <Link href={withBasePath("/teams")} className="text-[var(--color-byte)] hover:underline">
            Browse teams
          </Link>
          {" · "}
          <Link href="/login" className="text-[var(--color-byte)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="race-submissions-panel">
      {teams.length > 1 ? (
        <label className="team-form__field mb-6">
          <span className="team-form__label">Submitting as</span>
          <select
            className="team-form__select"
            value={teamSlug}
            onChange={(e) => void onTeamChange(e.target.value)}
          >
            {teams.map((team) => (
              <option key={team.slug} value={team.slug}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-[var(--color-wisp)]/60 mb-4">
          Submitting for <strong className="text-[var(--color-wisp)]">{teams[0].name}</strong>
        </p>
      )}

      {cutoffPassed ? (
        <p className="team-form__error">Submissions are closed — cutoff has passed.</p>
      ) : null}
      {error ? <p className="team-form__error">{error}</p> : null}
      {message ? <p className="race-submissions-panel__success">{message}</p> : null}

      <ul className="race-submissions-panel__list list-none">
        {RACE_TASKS.map((task) => {
          const saved = submissionByTask.get(task.id);
          const draft = drafts[task.id] ?? saved?.threadUrl ?? "";
          return (
            <li key={task.id} className="race-submissions-panel__row">
              <div className="race-submissions-panel__task">
                <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-wisp)]/45">
                  #{task.number}
                </span>
                <span className="font-[family-name:var(--font-display)] text-base text-[var(--color-wisp)]">
                  {task.title}
                </span>
                {saved ? <StatusChip variant="approved">Submitted</StatusChip> : null}
              </div>
              <div className="race-submissions-panel__form">
                <input
                  type="url"
                  className="team-form__input"
                  placeholder="https://x.com/yourteam/status/…"
                  value={draft}
                  disabled={cutoffPassed}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [task.id]: e.target.value,
                    }))
                  }
                />
                <CtaButton
                  variant="byte"
                  size="sm"
                  showArrow={false}
                  disabled={cutoffPassed || savingTaskId === task.id}
                  onClick={() => void saveTask(task.id)}
                >
                  {savingTaskId === task.id ? "Saving…" : saved ? "Update" : "Save"}
                </CtaButton>
              </div>
              {saved ? (
                <a
                  href={saved.threadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="race-submissions-panel__link"
                >
                  View thread ↗
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
