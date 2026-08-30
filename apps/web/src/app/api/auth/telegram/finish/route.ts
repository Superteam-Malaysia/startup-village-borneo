import { NextResponse } from "next/server";
import {
  appOrigin,
  createSessionToken,
  sessionCookieOptions,
  withBasePath,
} from "@/lib/auth/session";
import { consumeTelegramFinishToken } from "@/lib/auth/telegram-bot-login";

function loginRedirect(error: string) {
  return NextResponse.redirect(`${appOrigin()}${withBasePath("/login")}?error=${error}`);
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) return loginRedirect("invalid_auth");

  const participant = await consumeTelegramFinishToken(token);
  if (!participant) return loginRedirect("invalid_auth");

  const sessionToken = await createSessionToken({
    sub: participant.id,
    email: participant.email,
  });

  const response = NextResponse.redirect(`${appOrigin()}${withBasePath("/profile")}`);
  response.cookies.set(sessionCookieOptions(sessionToken));
  return response;
}
