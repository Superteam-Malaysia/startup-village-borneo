import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getParticipantForSession } from "@/lib/auth/participant";
import { getDb } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { participantToProfileForm, sanitizeProfileInput } from "@/lib/profile/form";

export async function GET() {
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  return NextResponse.json({
    profile: participantToProfileForm(participant),
    meta: {
      email: participant.email,
      approvalStatus: participant.approvalStatus,
      ticketName: participant.ticketName,
    },
  });
}

export async function PATCH(request: Request) {
  const participant = await getParticipantForSession();
  if (!participant) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const values = sanitizeProfileInput(body);

  if (!values.name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const db = getDb();
  const [updated] = await db
    .update(participants)
    .set({
      name: values.name,
      phoneNumber: values.phoneNumber || null,
      telegram: values.telegram || null,
      passportFirstName: values.passportFirstName || null,
      passportLastName: values.passportLastName || null,
      projectIdea: values.projectIdea || null,
      proofOfWork: values.proofOfWork || null,
      teamSetup: values.teamSetup || null,
      commitmentProof: values.commitmentProof || null,
      jerseySize: values.jerseySize || null,
      ownAccommodation: values.ownAccommodation || null,
      updatedAt: new Date(),
    })
    .where(eq(participants.id, participant.id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }

  return NextResponse.json({
    profile: participantToProfileForm(updated),
    meta: {
      email: updated.email,
      approvalStatus: updated.approvalStatus,
      ticketName: updated.ticketName,
    },
  });
}
