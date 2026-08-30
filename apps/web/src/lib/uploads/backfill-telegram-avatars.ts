import { eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { normalizeTelegramUsername } from "@/lib/auth/telegram";
import {
  shouldBackfillTelegramAvatar,
  telegramAvatarFromRegistration,
} from "@/lib/uploads/telegram-avatar";

export type TelegramAvatarBackfillOptions = {
  dryRun?: boolean;
  skipVerify?: boolean;
  onProgress?: (message: string) => void;
};

export type TelegramAvatarBackfillResult = {
  dryRun: boolean;
  skipVerify: boolean;
  updated: number;
  unchanged: number;
  skippedHasUpload: number;
  skippedNoHandle: number;
  skippedNoPhoto: number;
  scanned: number;
};

async function userpicAvailable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    return response.ok || response.status === 206;
  } catch {
    return false;
  }
}

export async function runTelegramAvatarBackfill(
  options: TelegramAvatarBackfillOptions = {},
): Promise<TelegramAvatarBackfillResult> {
  const dryRun = options.dryRun ?? false;
  const skipVerify = options.skipVerify ?? false;
  const log = options.onProgress ?? (() => undefined);

  const db = getDb();
  const rows = await db
    .select({
      id: participants.id,
      email: participants.email,
      name: participants.name,
      telegram: participants.telegram,
      avatarUrl: participants.avatarUrl,
    })
    .from(participants)
    .where(isNotNull(participants.telegram));

  let updated = 0;
  let skippedHasUpload = 0;
  let skippedNoHandle = 0;
  let skippedNoPhoto = 0;
  let unchanged = 0;

  for (const row of rows) {
    if (!shouldBackfillTelegramAvatar(row.avatarUrl)) {
      skippedHasUpload++;
      continue;
    }

    const avatarUrl = telegramAvatarFromRegistration(row.telegram);
    const handle = normalizeTelegramUsername(row.telegram);
    if (!avatarUrl || !handle) {
      skippedNoHandle++;
      continue;
    }

    if (row.avatarUrl?.trim() === avatarUrl) {
      unchanged++;
      continue;
    }

    if (!skipVerify && !(await userpicAvailable(avatarUrl))) {
      log(`skip (no public photo): ${row.name ?? row.email} @${handle}`);
      skippedNoPhoto++;
      continue;
    }

    if (dryRun) {
      log(`would set: ${row.name ?? row.email} (@${handle})`);
    } else {
      await db
        .update(participants)
        .set({ avatarUrl, updatedAt: new Date() })
        .where(eq(participants.id, row.id));
      log(`set: ${row.name ?? row.email} (@${handle})`);
    }
    updated++;
  }

  return {
    dryRun,
    skipVerify,
    updated,
    unchanged,
    skippedHasUpload,
    skippedNoHandle,
    skippedNoPhoto,
    scanned: rows.length,
  };
}
