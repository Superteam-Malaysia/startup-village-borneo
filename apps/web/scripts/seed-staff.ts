#!/usr/bin/env tsx
/**
 * Seed staff / mentor accounts that are not in the Luma guest export.
 * Usage: DATABASE_URL=... npm run db:seed-staff
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { normalizeEmail } from "../src/lib/auth/session";
import { closeDb, getDb } from "../src/lib/db";
import { participants } from "../src/lib/db/schema";

type StaffSeed = {
  guestId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  telegram?: string;
  ticketName?: string;
  projectIdea: string;
  proofOfWork?: string;
  teamSetup: string;
};

const STAFF: StaffSeed[] = [
  {
    guestId: "staff-semi",
    email: "semi@sendarcade.fun",
    name: "Semi",
    firstName: "Semi",
    telegram: "https://t.me/semi_infiknight",
    ticketName: "Organizer",
    teamSetup: "Organizer · Superteam Malaysia",
    projectIdea:
      "Startup Village Borneo organizer — workshops, mentor ops, and builder programs with Superteam Malaysia.",
    proofOfWork: [
      "X: https://x.com/semiii",
      "@superteammy Rainmaker · dev mentor & hackathon host.",
      "Prev $SEND (Send Arcade). Colosseum Frontier Hackathon winner (Jun 2026).",
    ].join("\n"),
  },
];

async function main() {
  const db = getDb();

  for (const person of STAFF) {
    const emailNormalized = normalizeEmail(person.email);
    const values = {
      guestId: person.guestId,
      email: person.email,
      emailNormalized,
      name: person.name,
      firstName: person.firstName ?? null,
      lastName: person.lastName ?? null,
      telegram: person.telegram ?? null,
      ticketName: person.ticketName ?? null,
      projectIdea: person.projectIdea,
      proofOfWork: person.proofOfWork ?? null,
      teamSetup: person.teamSetup,
      approvalStatus: "approved",
      updatedAt: new Date(),
    };

    await db
      .insert(participants)
      .values(values)
      .onConflictDoUpdate({
        target: participants.emailNormalized,
        set: {
          ...values,
          updatedAt: sql`now()`,
        },
      });

    console.log(`Seeded staff: ${person.name} (${person.email}) · ${person.telegram ?? "no telegram"}`);
  }

  await closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
