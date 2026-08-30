const MAX_URL_LENGTH = 500;

/** Allowed hosts for pasted profile / logo URLs (HTTPS only). */
const ALLOWED_HOSTS = new Set([
  "t.me",
  "telegram.org",
  "api.telegram.org",
  "github.com",
  "raw.githubusercontent.com",
  "avatars.githubusercontent.com",
  "gravatar.com",
  "www.gravatar.com",
  "i.imgur.com",
  "imgur.com",
  "pbs.twimg.com",
  "abs.twimg.com",
  "unavatar.io",
  "cloudflare-ipfs.com",
  "ipfs.io",
  "drive.google.com",
  "lh3.googleusercontent.com",
]);

export function telegramUserpicUrl(username: string): string {
  const handle = username.replace(/^@/, "").trim();
  return `https://t.me/i/userpic/320/${encodeURIComponent(handle)}.jpg`;
}

export function sanitizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_URL_LENGTH) return null;

  if (trimmed.startsWith("/uploads/")) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (!ALLOWED_HOSTS.has(host)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Legacy `/uploads/...` paths or absolute HTTPS image URLs. */
export function resolveStoredImageUrl(stored: string | null | undefined): string | null {
  if (!stored?.trim()) return null;
  const value = stored.trim();
  if (value.startsWith("https://") || value.startsWith("http://")) return value;
  return value.startsWith("/") ? value : `/${value}`;
}
