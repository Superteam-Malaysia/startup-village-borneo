/**
 * Where a user lands after signing in.
 *
 * Order matters: a pending account must never reach the dashboard, even if it
 * arrived with a ?next= pointing there.
 */
export function resolvePostLoginPath(
  profile: { approval_status?: string | null; onboarding_completed?: boolean | null } | null,
  next?: string | null
): string {
  if (profile?.approval_status === "pending") return "/pending";
  if (profile?.approval_status === "rejected") return "/pending?rejected=1";
  if (!profile?.onboarding_completed) return "/onboarding";
  return safeNext(next) ?? "/dashboard";
}

/**
 * Only allow same-origin relative paths through ?next=, so the parameter can't be
 * used to bounce someone to an external site after a successful login.
 */
export function safeNext(next?: string | null): string | null {
  if (!next) return null;
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//")) return null;
  if (next.startsWith("/login") || next.startsWith("/register")) return null;
  return next;
}
