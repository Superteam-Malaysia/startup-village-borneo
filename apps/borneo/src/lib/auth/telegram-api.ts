import { createHash } from "node:crypto";
import { appOrigin, createMagicToken, withBasePath } from "@/lib/auth/session";

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return token;
}

export function telegramWebhookSecret(): string {
  if (process.env.TELEGRAM_WEBHOOK_SECRET?.trim()) {
    return process.env.TELEGRAM_WEBHOOK_SECRET.trim();
  }
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) throw new Error("AUTH_SECRET is not set");
  return createHash("sha256").update(`svb-telegram-webhook:${authSecret}`).digest("hex");
}

export function telegramWebhookUrl(): string {
  return `${appOrigin()}${withBasePath("/api/auth/telegram/webhook")}`;
}

export async function telegramApi<T>(method: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://api.telegram.org/bot${botToken()}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const json = (await response.json()) as { ok?: boolean; description?: string; result?: T };
  if (!response.ok || !json.ok) {
    throw new Error(json.description ?? `Telegram API ${method} failed`);
  }
  return json.result as T;
}

export async function setTelegramWebhook(): Promise<void> {
  await telegramApi("setWebhook", {
    url: telegramWebhookUrl(),
    secret_token: telegramWebhookSecret(),
    allowed_updates: ["message"],
  });
}

export async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyMarkup?: { inline_keyboard: { text: string; url: string }[][] },
): Promise<void> {
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
    disable_web_page_preview: true,
  });
}

export function buildTelegramDeepLink(botUsername: string, startToken: string): string {
  return `https://t.me/${botUsername}?start=login_${startToken}`;
}

/** Opens Telegram Desktop / mobile app via OS protocol handler (not the t.me website). */
export function buildTelegramDesktopDeepLink(botUsername: string, startToken: string): string {
  const start = `login_${startToken}`;
  return `tg://resolve?domain=${encodeURIComponent(botUsername)}&start=${encodeURIComponent(start)}`;
}

export function createTelegramStartToken(): string {
  return createMagicToken().replace(/[^a-zA-Z0-9]/g, "").slice(0, 24);
}
