import { NextResponse } from "next/server";
import { eq, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import {
  appOrigin,
  createSessionToken,
  sessionCookieOptions,
  withBasePath,
} from "@/lib/auth/session";
import {
  normalizeTelegramUsername,
  verifyTelegramAuth,
} from "@/lib/auth/telegram";

function loginRedirect(error: string) {
  return NextResponse.redirect(`${appOrigin()}${withBasePath("/login")}?error=${error}`);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const payload: Record<string, string> = {};
  for (const key of ["id", "first_name", "last_name", "username", "photo_url", "auth_date", "hash"]) {
    const value = searchParams.get(key);
    if (value) payload[key] = value;
  }

  let auth;
  try {
    auth = verifyTelegramAuth(payload);
  } catch {
    return loginRedirect("bot_not_configured");
  }

  if (!auth) {
    return loginRedirect("invalid_auth");
  }

  const telegramUserId = String(auth.id);
  const authUsername = normalizeTelegramUsername(auth.username);
  const db = getDb();

  const [linked] = await db
    .select()
    .from(participants)
    .where(eq(participants.telegramUserId, telegramUserId))
    .limit(1);

  let participant: typeof linked | null = linked ?? null;

  if (!participant && authUsername) {
    const registered = await db
      .select()
      .from(participants)
      .where(isNotNull(participants.telegram));

    participant =
      registered.find(
        (row) => normalizeTelegramUsername(row.telegram) === authUsername,
      ) ?? null;
  }

  if (!participant) {
    return loginRedirect(authUsername ? "not_registered" : "missing_telegram");
  }

  if (participant.telegramUserId !== telegramUserId) {
    await db
      .update(participants)
      .set({ telegramUserId, updatedAt: new Date() })
      .where(eq(participants.id, participant.id));
  }

  const sessionToken = await createSessionToken({
    sub: participant.id,
    email: participant.email,
  });

  const response = NextResponse.redirect(`${appOrigin()}${withBasePath("/profile")}`);
  response.cookies.set(sessionCookieOptions(sessionToken));
  return response;
}
