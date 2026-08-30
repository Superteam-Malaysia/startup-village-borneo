import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  withBasePath,
} from "@/lib/auth/session";
import { consumeTelegramStartToken } from "@/lib/auth/telegram-bot-login";

export async function POST(request: Request) {
  let pollToken: string | undefined;
  try {
    const body = (await request.json()) as { pollToken?: string };
    pollToken = body.pollToken?.trim();
  } catch {
    pollToken = undefined;
  }

  if (!pollToken) {
    return NextResponse.json({ error: "missing_poll_token" }, { status: 400 });
  }

  const participant = await consumeTelegramStartToken(pollToken);
  if (!participant) {
    return NextResponse.json({ error: "not_ready" }, { status: 401 });
  }

  const sessionToken = await createSessionToken({
    sub: participant.id,
    email: participant.email,
  });

  const response = NextResponse.json({
    ok: true,
    redirect: withBasePath("/profile"),
  });
  response.cookies.set(sessionCookieOptions(sessionToken));
  return response;
}
