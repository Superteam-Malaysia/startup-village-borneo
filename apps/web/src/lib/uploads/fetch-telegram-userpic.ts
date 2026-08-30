import { normalizeTelegramUsername } from "@/lib/auth/telegram";
import { mimeForExtension } from "@/lib/uploads/bucket";
import { fetchAndStoreTelegramProfilePhoto } from "@/lib/uploads/fetch-telegram-profile-photo";
import { uploadPublicPath } from "@/lib/uploads/paths";
import { deleteUploadObject, writeUploadObject } from "@/lib/uploads/storage";

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const MIN_PHOTO_BYTES = 500;

/** Unique @handle variants from Luma text (lowercase, original URL segment, @prefix). */
export function telegramUsernameVariants(telegram: string | null | undefined): string[] {
  const raw = telegram?.trim() ?? "";
  const variants = new Set<string>();

  const normalized = normalizeTelegramUsername(telegram);
  if (normalized) variants.add(normalized);

  const fromUrl = raw.match(/(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([^/?#]+)/i)?.[1];
  if (fromUrl) variants.add(fromUrl.replace(/^@/, ""));

  if (raw.startsWith("@")) variants.add(raw.slice(1));

  return [...variants].filter(Boolean);
}

async function fetchUserpicBuffer(username: string): Promise<Buffer | null> {
  const handle = username.replace(/^@/, "").trim();
  if (!handle) return null;

  try {
    const response = await fetch(`https://t.me/i/userpic/320/${encodeURIComponent(handle)}.jpg`, {
      headers: { "User-Agent": BROWSER_UA, Accept: "image/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < MIN_PHOTO_BYTES) return null;
    if (buffer[0] === 0x47 && buffer[1] === 0x49) return null; // GIF placeholder
    return buffer;
  } catch {
    return null;
  }
}

/** Fetch public Telegram userpic (when privacy allows) and store in upload storage. */
export async function fetchAndStoreTelegramUserpic(params: {
  participantId: string;
  telegram: string | null | undefined;
  previousPublicPath?: string | null;
}): Promise<string | null> {
  for (const variant of telegramUsernameVariants(params.telegram)) {
    const buffer = await fetchUserpicBuffer(variant);
    if (!buffer) continue;

    const publicPath = uploadPublicPath("participants", `${params.participantId}.jpg`);
    await writeUploadObject({
      publicPath,
      body: buffer,
      contentType: mimeForExtension("jpg"),
    });

    if (
      params.previousPublicPath?.startsWith("/uploads/participants/") &&
      params.previousPublicPath !== publicPath
    ) {
      await deleteUploadObject(params.previousPublicPath);
    }

    return publicPath;
  }

  return null;
}

export { fetchAndStoreTelegramProfilePhoto };
