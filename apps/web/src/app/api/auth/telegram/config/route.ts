import { NextResponse } from "next/server";
import { getTelegramBotInfo } from "@/lib/auth/telegram";

export async function GET() {
  const bot = await getTelegramBotInfo();

  if (!bot) {
    return NextResponse.json(
      { configured: false, error: "Invalid or missing TELEGRAM_BOT_TOKEN" },
      { status: 503 },
    );
  }

  return NextResponse.json({
    configured: true,
    botUsername: bot.username,
    botName: bot.firstName,
  });
}
