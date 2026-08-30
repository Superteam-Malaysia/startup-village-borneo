#!/usr/bin/env tsx
/**
 * Register Telegram bot webhook for app-based mobile login.
 * Usage: DATABASE_URL=... TELEGRAM_BOT_TOKEN=... npm run telegram:setup-webhook
 */
import "dotenv/config";
import { setTelegramWebhook, telegramWebhookUrl } from "../src/lib/auth/telegram-api";

async function main() {
  await setTelegramWebhook();
  console.log(`Telegram webhook set to ${telegramWebhookUrl()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
