import { NextResponse } from "next/server";
import { lookupTelegramBot } from "@/lib/auth/telegram";
import { createTelegramAppLoginSession } from "@/lib/auth/telegram-bot-login";

export async function POST() {
  const lookup = await lookupTelegramBot();
  if (!lookup.ok) {
    return NextResponse.json({ error: "Telegram is not configured" }, { status: 503 });
  }

  const session = await createTelegramAppLoginSession(lookup.bot.username);

  return NextResponse.json({
    deepLink: session.deepLink,
    desktopDeepLink: session.desktopDeepLink,
    pollToken: session.startToken,
    expiresAt: session.expiresAt.toISOString(),
  });
}
