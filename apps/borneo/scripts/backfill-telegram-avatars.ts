#!/usr/bin/env tsx
/**
 * Backfill participant avatars from Telegram Bot API (users who signed in via bot).
 * Clears broken t.me/i/userpic placeholder URLs.
 */
import "dotenv/config";
import { closeDb } from "../src/lib/db";
import { runTelegramAvatarBackfill } from "../src/lib/uploads/backfill-telegram-avatars";

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const result = await runTelegramAvatarBackfill({
    dryRun,
    onProgress: (message) => console.log(message),
  });

  console.log(JSON.stringify(result, null, 2));
  await closeDb();
}

main().catch(async (error) => {
  console.error(error);
  await closeDb().catch(() => undefined);
  process.exit(1);
});
