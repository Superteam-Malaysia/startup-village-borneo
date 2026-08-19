#!/usr/bin/env tsx
/**
 * Seed staff / mentor accounts that are not in the Luma guest export.
 * Usage: DATABASE_URL=... npm run db:seed-staff
 */
import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { normalizeEmail } from "../src/lib/auth/session";
import { closeDb, getDb } from "../src/lib/db";
import { participants } from "../src/lib/db/schema";

type StaffSeed = {
  guestId: string;
  email: string;
  name: string;
  telegram?: string;
  projectIdea: string;
  teamSetup: string;
};

const STAFF: StaffSeed[] = [
  {
    guestId: "staff-semi",
    email: "semi@sendarcade.fun",
    name: "Semi",
    telegram: "semi_infiknight",
    projectIdea: "solana.new — from idea to running code (Day 2 workshop)",
    teamSetup: "Mentor · Workshop leader",
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
      telegram: person.telegram ?? null,
      projectIdea: person.projectIdea,
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

    console.log(`Seeded staff: ${person.name} (${person.email})`);
  }

  await closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
