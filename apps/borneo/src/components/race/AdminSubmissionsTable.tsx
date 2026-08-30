import Link from "next/link";
import type { AdminRaceSubmission } from "@/lib/race/submissions";
import { withBasePath } from "@/lib/base-path";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuching",
  });
}

export function AdminSubmissionsTable({ submissions }: { submissions: AdminRaceSubmission[] }) {
  if (!submissions.length) {
    return (
      <p className="text-sm text-[var(--color-wisp)]/60">
        No race thread submissions yet. Teams paste links on the Amazing Race page.
      </p>
    );
  }

  return (
    <div className="admin-submissions-table-wrap">
      <table className="admin-submissions-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Task</th>
            <th>Thread</th>
            <th>Submitted by</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((row) => (
            <tr key={row.id}>
              <td>
                <Link href={withBasePath(`/teams/${row.teamSlug}`)} className="admin-submissions-table__team">
                  {row.teamName}
                </Link>
              </td>
              <td>
                <span className="admin-submissions-table__task-num">#{row.taskNumber}</span>{" "}
                {row.taskTitle}
              </td>
              <td>
                <a
                  href={row.threadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-submissions-table__thread"
                >
                  Open thread ↗
                </a>
              </td>
              <td>
                {row.submitterName ?? "—"}
                {row.submitterEmail ? (
                  <span className="admin-submissions-table__email">{row.submitterEmail}</span>
                ) : null}
              </td>
              <td className="admin-submissions-table__when">{formatWhen(row.submittedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
