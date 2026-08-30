CREATE TABLE IF NOT EXISTS "participants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "guest_id" text NOT NULL,
  "email" text NOT NULL,
  "email_normalized" text NOT NULL,
  "name" text,
  "first_name" text,
  "last_name" text,
  "phone_number" text,
  "luma_created_at" timestamp with time zone,
  "approval_status" text,
  "checked_in_at" timestamp with time zone,
  "ticket_type_id" text,
  "ticket_name" text,
  "passport_first_name" text,
  "passport_last_name" text,
  "telegram" text,
  "project_idea" text,
  "proof_of_work" text,
  "team_setup" text,
  "commitment_proof" text,
  "jersey_size" text,
  "own_accommodation" text,
  "raw_registration" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "imported_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "participants_guest_id_unique" UNIQUE("guest_id"),
  CONSTRAINT "participants_email_normalized_unique" UNIQUE("email_normalized")
);

CREATE TABLE IF NOT EXISTS "auth_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email_normalized" text NOT NULL,
  "token_hash" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "used_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "auth_tokens_token_hash_unique" UNIQUE("token_hash")
);

CREATE INDEX IF NOT EXISTS "auth_tokens_email_normalized_idx" ON "auth_tokens" ("email_normalized");
