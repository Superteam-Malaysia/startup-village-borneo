#!/usr/bin/env tsx
/**
 * Import Luma guest CSV into Postgres (participants table).
 * Usage: DATABASE_URL=... npm run db:import-guests [-- path/to/guests.csv]
 */
import "dotenv/config";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse";
import { eq, sql } from "drizzle-orm";
import { closeDb, getDb } from "../src/lib/db";
import { participants } from "../src/lib/db/schema";
import { normalizeEmail } from "../src/lib/auth/session";

const CSV_DEFAULT = resolve(__dirname, "../data/imports/guests-2026-08-19.csv");

const COL = {
  telegram: "What is your Telegram username?",
  projectIdea:
    "What do you plan to build? Give us a one to two sentence description of your project idea. What problem does it solve and who is it for?",
  proofOfWork:
    "What is your proof of work? Share links to anything that shows you can build - a GitHub repo, a live product, a previous hackathon submission, a Superteam Earn bounty, or anything else that demonstrates you ship. No prior Solana experience required but we want to see that you build.",
  teamSetup: "Do you have a team? What is your team setup?",
  commitmentProof:
    "We ask for either a 5 USDC commitment fee which will be refunded after the event, or proof of travel (plane ticket to KCH). Please send 5 USDC on solana to hanstmy.sol. Then paste the transaction link here. Alternatively, send us a google drive link to a picture of your plane ticket to KCH.",
  jerseySize: "Preferred jersey size",
  ownAccommodation:
    "I do NOT need accommodation in Kuching and have own accommodation arrangements.",
  passportFirst: "First Name as per passport/IC",
  passportLast: "Last Name as per passport/IC",
} as const;

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseDate(value: string | undefined): Date | null {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  console.log("Importing guests...");
  const csvPath = process.argv[2] ?? CSV_DEFAULT;
  const db = getDb();
  const rows: Record<string, string>[] = [];

  await new Promise<void>((resolvePromise, reject) => {
    createReadStream(csvPath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on("data", (row: Record<string, string>) => rows.push(row))
      .on("error", reject)
      .on("end", () => resolvePromise());
  });

  let upserted = 0;
  for (const row of rows) {
    const email = row.email?.trim();
    const guestId = row.guest_id?.trim();
    if (!email || !guestId) continue;

    const emailNormalized = normalizeEmail(email);
    const values = {
      guestId,
      email,
      emailNormalized,
      name: emptyToNull(row.name),
      firstName: emptyToNull(row.first_name),
      lastName: emptyToNull(row.last_name),
      phoneNumber: emptyToNull(row.phone_number),
      lumaCreatedAt: parseDate(row.created_at),
      approvalStatus: emptyToNull(row.approval_status),
      checkedInAt: parseDate(row.checked_in_at),
      ticketTypeId: emptyToNull(row.ticket_type_id),
      ticketName: emptyToNull(row.ticket_name),
      passportFirstName: emptyToNull(row[COL.passportFirst]),
      passportLastName: emptyToNull(row[COL.passportLast]),
      telegram: emptyToNull(row[COL.telegram]),
      projectIdea: emptyToNull(row[COL.projectIdea]),
      proofOfWork: emptyToNull(row[COL.proofOfWork]),
      teamSetup: emptyToNull(row[COL.teamSetup]),
      commitmentProof: emptyToNull(row[COL.commitmentProof]),
      jerseySize: emptyToNull(row[COL.jerseySize]),
      ownAccommodation: emptyToNull(row[COL.ownAccommodation]),
      rawRegistration: row,
      updatedAt: new Date(),
    };

    await db
      .insert(participants)
      .values(values)
      .onConflictDoUpdate({
        target: participants.guestId,
        set: {
          ...values,
          importedAt: sql`now()`,
        },
      });
    upserted += 1;
  }

  console.log(`Imported ${upserted} participants from ${csvPath}`);
  await closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
