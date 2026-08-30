import type { RaceTask } from "@/data/race-tasks";
import { CATEGORY_LABELS } from "@/data/race-tasks";
import { StatusChip } from "@/components/ui";

function pointsLabel(task: RaceTask): string {
  if (task.pointsNote) return task.pointsNote;
  if (task.pointsMax && task.pointsMax !== task.pointsBase) {
    return `${task.pointsBase}–${task.pointsMax} pts`;
  }
  if (task.pointsBase === 0) return "Award";
  return `${task.pointsBase} pts`;
}

export function RaceTaskCard({ task }: { task: RaceTask }) {
  return (
    <article className="race-task-card" data-theme={task.theme}>
      <div className="flex items-start justify-between gap-3">
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-wisp)]/40">
          #{task.number}
        </span>
        <span className="race-points-badge">{pointsLabel(task)}</span>
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-xl leading-snug text-[var(--color-wisp)]">
        {task.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        <StatusChip variant={task.category === "wallet" ? "approved" : "pending"}>
          {CATEGORY_LABELS[task.category]}
        </StatusChip>
        {task.location && (
          <span className="text-label text-label-muted text-label-sm">
            {task.location}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--color-wisp)]/70 leading-relaxed">{task.shortDescription}</p>
      <ul className="text-xs text-[var(--color-wisp)]/55 flex flex-col gap-1 list-disc list-inside">
        {task.details.slice(0, 3).map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      {task.deadline && (
        <p className="text-label text-label-accent">
          Due: {task.deadline}
        </p>
      )}
    </article>
  );
}
