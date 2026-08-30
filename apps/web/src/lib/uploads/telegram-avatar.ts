/** Broken placeholder URLs from the old t.me/i/userpic backfill (returns 1×1 gif). */
export function isTelegramUserpicUrl(value: string | null | undefined): boolean {
  return Boolean(value?.includes("t.me/i/userpic/"));
}

/** True when avatar is missing, a broken t.me userpic URL, or safe to replace with a stored upload. */
export function shouldBackfillTelegramAvatar(avatarUrl: string | null | undefined): boolean {
  const value = avatarUrl?.trim();
  if (!value) return true;
  if (value.startsWith("/uploads/participants/")) return false;
  if (value.startsWith("https://") || value.startsWith("http://")) {
    return isTelegramUserpicUrl(value);
  }
  return true;
}
