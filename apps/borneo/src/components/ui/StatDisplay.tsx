import type { ReactNode } from "react";

export function StatDisplay({
  value,
  label,
  className,
}: {
  value: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div className={["flex flex-col gap-2 items-center text-center", className].filter(Boolean).join(" ")}>
      <span className="stat-display">{value}</span>
      {label && (
        <span className="text-label text-[var(--color-text-secondary)]">
          {label}
        </span>
      )}
    </div>
  );
}
