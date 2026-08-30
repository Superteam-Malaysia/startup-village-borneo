import { NextResponse } from "next/server";
import { lookupTelegramBot } from "@/lib/auth/telegram";

export async function GET() {
  const lookup = await lookupTelegramBot();

  if (!lookup.ok) {
    const errorByReason = {
      missing_token: "TELEGRAM_BOT_TOKEN is not set on the server",
      telegram_error: lookup.detail ?? "Telegram rejected the bot token",
      missing_username: "Bot has no @username — set one in BotFather",
    } as const;

    return NextResponse.json(
      {
        configured: false,
        tokenPresent: lookup.reason !== "missing_token",
        reason: lookup.reason,
        error: errorByReason[lookup.reason],
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    configured: true,
    botId: lookup.bot.id,
    botUsername: lookup.bot.username,
    botName: lookup.bot.firstName,
  });
}
