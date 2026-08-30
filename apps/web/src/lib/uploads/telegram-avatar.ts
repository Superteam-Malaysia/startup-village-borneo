import { normalizeTelegramUsername } from "@/lib/auth/telegram";
import { telegramUserpicUrl } from "@/lib/uploads/image-url";

/** Public Telegram userpic URL from a Luma @handle, t.me link, or bare username. */
export function telegramAvatarFromRegistration(
  telegram: string | null | undefined,
): string | null {
  const username = normalizeTelegramUsername(telegram);
  if (!username) return null;
  return telegramUserpicUrl(username);
}

/** True when avatar is missing or already a Telegram userpic (safe to refresh). */
export function shouldBackfillTelegramAvatar(avatarUrl: string | null | undefined): boolean {
  const value = avatarUrl?.trim();
  if (!value) return true;
  if (value.startsWith("/uploads/")) return false;
  return value.includes("t.me/i/userpic/");
}
