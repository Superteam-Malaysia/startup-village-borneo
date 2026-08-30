import { NextResponse } from "next/server";
import { completeTelegramAppLoginFromBot } from "@/lib/auth/telegram-bot-login";
import { telegramWebhookSecret } from "@/lib/auth/telegram-api";

type TelegramUpdate = {
  message?: {
    chat: { id: number };
    from?: { id: number; username?: string };
    text?: string;
  };
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== telegramWebhookSecret()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;
  const text = message?.text?.trim();
  const from = message?.from;

  if (!message || !text?.startsWith("/start") || !from?.id) {
    return NextResponse.json({ ok: true });
  }

  const payload = text.split(/\s+/)[1];
  if (!payload?.startsWith("login_")) {
    return NextResponse.json({ ok: true });
  }

  const startToken = payload.slice("login_".length);
  if (!startToken) return NextResponse.json({ ok: true });

  await completeTelegramAppLoginFromBot({
    startToken,
    telegramUserId: from.id,
    username: from.username,
    chatId: message.chat.id,
  });

  return NextResponse.json({ ok: true });
}
