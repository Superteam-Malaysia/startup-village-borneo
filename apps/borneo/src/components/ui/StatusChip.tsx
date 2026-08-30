export type StatusChipVariant = "approved" | "pending" | "locked";

export function StatusChip({
  children,
  variant = "pending",
}: {
  children: string;
  variant?: StatusChipVariant;
}) {
  return <span className={`status-chip status-chip--${variant}`}>{children}</span>;
}
