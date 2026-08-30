import { telegramApi } from "@/lib/auth/telegram-api";
import { mimeForExtension } from "@/lib/uploads/bucket";
import { uploadPublicPath } from "@/lib/uploads/paths";
import { deleteUploadObject, writeUploadObject } from "@/lib/uploads/storage";

const MAX_BYTES = 1024 * 1024;

type ProfilePhotosResult = {
  total_count: number;
  photos: Array<Array<{ file_id: string; width: number; height: number }>>;
};

/** Download Telegram profile photo via Bot API and store in upload storage. */
export async function fetchAndStoreTelegramProfilePhoto(params: {
  participantId: string;
  telegramUserId: string;
  previousPublicPath?: string | null;
}): Promise<string | null> {
  if (!process.env.TELEGRAM_BOT_TOKEN?.trim()) return null;

  try {
    const photos = await telegramApi<ProfilePhotosResult>("getUserProfilePhotos", {
      user_id: Number(params.telegramUserId),
      limit: 1,
    });

    if (!photos.total_count || !photos.photos[0]?.length) return null;

    const sizes = photos.photos[0];
    const largest = sizes[sizes.length - 1];
    const file = await telegramApi<{ file_path?: string }>("getFile", {
      file_id: largest.file_id,
    });

    if (!file.file_path) return null;

    const token = process.env.TELEGRAM_BOT_TOKEN.trim();
    const fileResponse = await fetch(
      `https://api.telegram.org/file/bot${token}/${file.file_path}`,
      { signal: AbortSignal.timeout(15000) },
    );
    if (!fileResponse.ok) return null;

    const buffer = Buffer.from(await fileResponse.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_BYTES) return null;

    const rawExt = file.file_path.split(".").pop()?.toLowerCase() ?? "jpg";
    const ext = rawExt === "jpeg" ? "jpg" : rawExt;
    if (!["jpg", "png", "webp", "gif"].includes(ext)) return null;

    const publicPath = uploadPublicPath("participants", `${params.participantId}.${ext}`);

    await writeUploadObject({
      publicPath,
      body: buffer,
      contentType: mimeForExtension(ext),
    });

    if (
      params.previousPublicPath?.startsWith("/uploads/participants/") &&
      params.previousPublicPath !== publicPath
    ) {
      await deleteUploadObject(params.previousPublicPath);
    }

    return publicPath;
  } catch {
    return null;
  }
}
