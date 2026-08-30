import { eq, isNotNull, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { normalizeTelegramUsername } from "@/lib/auth/telegram";
import { fetchAndStoreTelegramProfilePhoto } from "@/lib/uploads/fetch-telegram-profile-photo";
import {
  isTelegramUserpicUrl,
  shouldBackfillTelegramAvatar,
} from "@/lib/uploads/telegram-avatar";

export type TelegramAvatarBackfillOptions = {
  dryRun?: boolean;
  onProgress?: (message: string) => void;
};

export type TelegramAvatarBackfillResult = {
  dryRun: boolean;
  updated: number;
  cleared: number;
  skippedHasUpload: number;
  skippedNoTelegramUserId: number;
  skippedNoPhoto: number;
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
    .where(
      or(
        isNotNull(participants.telegramUserId),
        isNotNull(participants.telegram),
      ),
    );

  let updated = 0;
  let cleared = 0;
  let skippedHasUpload = 0;
  let skippedNoTelegramUserId = 0;
  let skippedNoPhoto = 0;

  for (const row of rows) {
    const handle = normalizeTelegramUsername(row.telegram);
    const label = `${row.name ?? row.email}${handle ? ` (@${handle})` : ""}`;

    if (row.avatarUrl?.startsWith("/uploads/participants/") && !isTelegramUserpicUrl(row.avatarUrl)) {
      skippedHasUpload++;
      continue;
    }

    if (isTelegramUserpicUrl(row.avatarUrl)) {
      if (dryRun) {
        log(`would clear broken userpic: ${label}`);
      } else {
        await db
          .update(participants)
          .set({ avatarUrl: null, updatedAt: new Date() })
          .where(eq(participants.id, row.id));
        log(`cleared broken userpic: ${label}`);
      }
      cleared++;
      row.avatarUrl = null;
    }

    if (!shouldBackfillTelegramAvatar(row.avatarUrl)) {
      continue;
    }

    if (!row.telegramUserId) {
      skippedNoTelegramUserId++;
      continue;
    }

    if (dryRun) {
      log(`would fetch from Telegram: ${label}`);
      updated++;
      continue;
    }

    const publicPath = await fetchAndStoreTelegramProfilePhoto({
      participantId: row.id,
      telegramUserId: row.telegramUserId,
      previousPublicPath: row.avatarUrl,
    });

    if (!publicPath) {
      log(`skip (no bot photo): ${label}`);
      skippedNoPhoto++;
      continue;
    }

    await db
      .update(participants)
      .set({ avatarUrl: publicPath, updatedAt: new Date() })
      .where(eq(participants.id, row.id));
    log(`saved Telegram photo: ${label}`);
    updated++;
  }

  return {
    dryRun,
    updated,
    cleared,
    skippedHasUpload,
    skippedNoTelegramUserId,
    skippedNoPhoto,
    scanned: rows.length,
  };
}
