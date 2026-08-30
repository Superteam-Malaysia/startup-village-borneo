import { withBasePath } from "@/lib/base-path";
import { resolveStoredImageUrl } from "@/lib/uploads/image-url";

/** Turn a stored avatar/logo value into a browser URL (external HTTPS or legacy /uploads path). */
export function uploadPublicUrl(stored: string | null | undefined): string | null {
  const resolved = resolveStoredImageUrl(stored);
  if (!resolved) return null;
  if (resolved.startsWith("https://") || resolved.startsWith("http://")) return resolved;
  return withBasePath(resolved);
}
