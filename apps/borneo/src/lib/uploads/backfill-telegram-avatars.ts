import { eq, isNotNull, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { normalizeTelegramUsername } from "@/lib/auth/telegram";
import {
  fetchAndStoreTelegramProfilePhoto,
  fetchAndStoreTelegramUserpic,
} from "@/lib/uploads/fetch-telegram-userpic";
import { isTelegramUserpicUrl, shouldBackfillTelegramAvatar } from "@/lib/uploads/telegram-avatar";

export type TelegramAvatarBackfillOptions = {
  dryRun?: boolean;
  onProgress?: (message: string) => void;
};

export type TelegramAvatarBackfillResult = {
  dryRun: boolean;
  updated: number;
  cleared: number;
  skippedHasUpload: number;
  skippedNoHandle: number;
  skippedNoPublicPhoto: number;
  scanned: number;
};

export async function runTelegramAvatarBackfill(
  options: TelegramAvatarBackfillOptions = {},
): Promise<TelegramAvatarBackfillResult> {
  const dryRun = options.dryRun ?? false;
  const log = options.onProgress ?? (() => undefined);

  const db = getDb();
  const rows = await db
    .select({
      id: participants.id,
      email: participants.email,
      name: participants.name,
      telegram: participants.telegram,
      telegramUserId: participants.telegramUserId,
      avatarUrl: participants.avatarUrl,
    })
    .from(participants)
    .where(isNotNull(participants.telegram));

  let updated = 0;
  let cleared = 0;
  let skippedHasUpload = 0;
  let skippedNoHandle = 0;
  let skippedNoPublicPhoto = 0;

  for (const row of rows) {
    const handle = normalizeTelegramUsername(row.telegram);
    const label = `${row.name ?? row.email}${handle ? ` (@${handle})` : ""}`;

    if (row.avatarUrl?.startsWith("/uploads/participants/") && !isTelegramUserpicUrl(row.avatarUrl)) {
      skippedHasUpload++;
      continue;
    }

    if (!shouldBackfillTelegramAvatar(row.avatarUrl) && !isTelegramUserpicUrl(row.avatarUrl)) {
      continue;
    }

    if (!handle) {
      skippedNoHandle++;
      continue;
    }

    if (dryRun) {
      log(`would backfill: ${label}`);
      updated++;
      continue;
    }

    let publicPath =
      (await fetchAndStoreTelegramUserpic({
        participantId: row.id,
        telegram: row.telegram,
        previousPublicPath: row.avatarUrl,
      })) ?? null;

    if (!publicPath && row.telegramUserId) {
      publicPath = await fetchAndStoreTelegramProfilePhoto({
        participantId: row.id,
        telegramUserId: row.telegramUserId,
        previousPublicPath: row.avatarUrl,
      });
    }

    if (!publicPath) {
      if (isTelegramUserpicUrl(row.avatarUrl) || row.avatarUrl?.trim()) {
        await db
          .update(participants)
          .set({ avatarUrl: null, updatedAt: new Date() })
          .where(eq(participants.id, row.id));
        cleared++;
      }
      log(`skip (no public photo): ${label}`);
      skippedNoPublicPhoto++;
      continue;
    }

    await db
      .update(participants)
      .set({ avatarUrl: publicPath, updatedAt: new Date() })
      .where(eq(participants.id, row.id));
    log(`saved photo: ${label}`);
    updated++;
  }

  return {
    dryRun,
    updated,
    cleared,
    skippedHasUpload,
    skippedNoHandle,
    skippedNoPublicPhoto,
    scanned: rows.length,
  };
}
