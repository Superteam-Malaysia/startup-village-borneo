import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ participant: null }, { status: 401 });
  }

  const db = getDb();
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.id, session.sub))
    .limit(1);

  if (!participant) {
    return NextResponse.json({ participant: null }, { status: 401 });
  }

  const { rawRegistration: _raw, ...safe } = participant;
  return NextResponse.json({ participant: safe });
}
