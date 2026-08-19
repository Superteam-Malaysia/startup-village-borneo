import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** Luma guest / SVB participant — imported from registration CSV. */
export const participants = pgTable("participants", {
  id: uuid("id").defaultRandom().primaryKey(),
  guestId: text("guest_id").notNull().unique(),
  email: text("email").notNull(),
  emailNormalized: text("email_normalized").notNull().unique(),
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  lumaCreatedAt: timestamp("luma_created_at", { withTimezone: true }),
  approvalStatus: text("approval_status"),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
  ticketTypeId: text("ticket_type_id"),
  ticketName: text("ticket_name"),
  passportFirstName: text("passport_first_name"),
  passportLastName: text("passport_last_name"),
  telegram: text("telegram"),
  projectIdea: text("project_idea"),
  proofOfWork: text("proof_of_work"),
  teamSetup: text("team_setup"),
  commitmentProof: text("commitment_proof"),
  jerseySize: text("jersey_size"),
  ownAccommodation: text("own_accommodation"),
  /** Full Luma export row for audit / future fields. */
  rawRegistration: jsonb("raw_registration").notNull().default({}),
  importedAt: timestamp("imported_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** One-time magic link tokens for email login. */
export const authTokens = pgTable("auth_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  emailNormalized: text("email_normalized").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
