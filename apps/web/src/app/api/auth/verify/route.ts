import { NextResponse } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authTokens, participants } from "@/lib/db/schema";
import {
  appOrigin,
  createSessionToken,
  hashToken,
  sessionCookieOptions,
  withBasePath,
} from "@/lib/auth/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();
  const loginPath = withBasePath("/login");
  const profilePath = withBasePath("/profile");

  if (!token) {
    return NextResponse.redirect(`${appOrigin()}${loginPath}?error=missing_token`);
  }

  const db = getDb();
  const tokenHash = hashToken(token);
  const now = new Date();

  const [authToken] = await db
    .select()
    .from(authTokens)
    .where(
      and(
        eq(authTokens.tokenHash, tokenHash),
        gt(authTokens.expiresAt, now),
        isNull(authTokens.usedAt),
      ),
    )
    .limit(1);

  if (!authToken) {
    return NextResponse.redirect(`${appOrigin()}${loginPath}?error=invalid_token`);
  }

  const participant = await db
    .select()
    .from(participants)
    .where(eq(participants.emailNormalized, authToken.emailNormalized))
    .limit(1)
    .then((rows) => rows[0]);

  if (!participant) {
    return NextResponse.redirect(`${appOrigin()}${loginPath}?error=not_registered`);
  }

  await db
    .update(authTokens)
    .set({ usedAt: now })
    .where(eq(authTokens.id, authToken.id));

  const sessionToken = await createSessionToken({
    sub: participant.id,
    email: participant.email,
  });

  const response = NextResponse.redirect(`${appOrigin()}${profilePath}`);
  response.cookies.set(sessionCookieOptions(sessionToken));
  return response;
}
