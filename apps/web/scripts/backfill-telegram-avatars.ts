#!/usr/bin/env tsx
/**
 * Backfill participant avatar_url from Telegram public userpics.
 *
 * Usage:
 *   DATABASE_URL=... npm run db:backfill-telegram-avatars
 *   DATABASE_URL=... npm run db:backfill-telegram-avatars -- --dry-run
 *   DATABASE_URL=... npm run db:backfill-telegram-avatars -- --skip-verify
 */
import "dotenv/config";
import { closeDb } from "../src/lib/db";
import { runTelegramAvatarBackfill } from "../src/lib/uploads/backfill-telegram-avatars";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const skipVerify = process.argv.includes("--skip-verify");

  const result = await runTelegramAvatarBackfill({
    dryRun,
    skipVerify,
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
