import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type TelegramAuthPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

const AUTH_MAX_AGE_SEC = 60 * 60 * 24;

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set");
  }
  return token;
}

export type TelegramBotInfo = {
  id: number;
  username: string;
  firstName: string;
  canJoinGroups: boolean;
};

export type TelegramBotLookup =
  | { ok: true; bot: TelegramBotInfo }
  | { ok: false; reason: "missing_token" | "telegram_error" | "missing_username"; detail?: string };

/** Resolve bot metadata from Telegram using TELEGRAM_BOT_TOKEN (getMe). */
export async function getTelegramBotInfo(): Promise<TelegramBotInfo | null> {
  const lookup = await lookupTelegramBot();
  return lookup.ok ? lookup.bot : null;
}

export async function lookupTelegramBot(): Promise<TelegramBotLookup> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return { ok: false, reason: "missing_token" };

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      cache: "no-store",
    });

    const body = (await response.json()) as {
      ok?: boolean;
      description?: string;
      result?: {
        id: number;
        username?: string;
        first_name?: string;
        can_join_groups?: boolean;
      };
    };

    if (!response.ok || !body.ok) {
      return {
        ok: false,
        reason: "telegram_error",
        detail: body.description ?? `HTTP ${response.status}`,
      };
    }

    if (!body.result?.username) {
      return { ok: false, reason: "missing_username" };
    }

    return {
      ok: true,
      bot: {
        id: body.result.id,
        username: body.result.username,
        firstName: body.result.first_name ?? body.result.username,
        canJoinGroups: body.result.can_join_groups ?? false,
      },
    };
  } catch (error) {
    return {
      ok: false,
      reason: "telegram_error",
      detail: error instanceof Error ? error.message : "Network error",
    };
  }
}

/** Normalize Luma / t.me / @handle values to a lowercase username. */
export function normalizeTelegramUsername(
  value: string | null | undefined,
): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  const fromUrl = trimmed.match(/(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([^/?#]+)/i)?.[1];
  const handle = (fromUrl ?? trimmed).replace(/^@/, "").trim();
  return handle ? handle.toLowerCase() : null;
}

export function verifyTelegramAuth(
  payload: Record<string, string | number | undefined>,
): TelegramAuthPayload | null {
  const hash = payload.hash;
  const id = payload.id;
  const authDate = payload.auth_date;

  if (typeof hash !== "string" || !hash) return null;
  if (typeof id !== "string" && typeof id !== "number") return null;
  if (typeof authDate !== "string" && typeof authDate !== "number") return null;

  const authDateNum = Number(authDate);
  if (!Number.isFinite(authDateNum)) return null;
  if (Math.floor(Date.now() / 1000) - authDateNum > AUTH_MAX_AGE_SEC) return null;

  const dataCheckString = Object.entries(payload)
    .filter(([key, value]) => key !== "hash" && value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHash("sha256").update(getBotToken()).digest();
  const hmac = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  try {
    const expected = Buffer.from(hmac, "hex");
    const received = Buffer.from(hash, "hex");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      return null;
    }
  } catch {
    return null;
  }

  return {
    id: Number(id),
    first_name: typeof payload.first_name === "string" ? payload.first_name : undefined,
    last_name: typeof payload.last_name === "string" ? payload.last_name : undefined,
    username: typeof payload.username === "string" ? payload.username : undefined,
    photo_url: typeof payload.photo_url === "string" ? payload.photo_url : undefined,
    auth_date: authDateNum,
    hash,
  };
}
