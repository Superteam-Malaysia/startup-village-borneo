import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export async function getParticipantForSession() {
  const session = await getSession();
  if (!session) return null;

  const db = getDb();
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.id, session.sub))
    .limit(1);
  return participant ?? null;
}

export async function requireParticipant() {
  const participant = await getParticipantForSession();
  if (!participant) {
    redirect("/login");
  }
  return participant;
}
