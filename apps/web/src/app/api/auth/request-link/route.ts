import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authTokens, participants } from "@/lib/db/schema";
import { sendMagicLinkEmail } from "@/lib/auth/email";
import {
  createMagicToken,
  hashToken,
  normalizeEmail,
} from "@/lib/auth/session";

const TOKEN_TTL_MS = 30 * 60 * 1000;

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  const emailNormalized = normalizeEmail(email);
  const db = getDb();
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.emailNormalized, emailNormalized))
    .limit(1);

  // Always return success to avoid email enumeration.
  const generic = {
    ok: true,
    message: "If that email is registered, we sent a sign-in link.",
  };

  if (!participant) {
    return NextResponse.json(generic);
  }

  const token = createMagicToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db.insert(authTokens).values({
    emailNormalized,
    tokenHash,
    expiresAt,
  });

  const result = await sendMagicLinkEmail({ email: participant.email, token });

  return NextResponse.json({
    ...generic,
    devPreviewUrl: result.previewUrl,
  });
}
