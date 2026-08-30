CREATE TABLE IF NOT EXISTS "telegram_login_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "start_token" text NOT NULL UNIQUE,
  "finish_token" text UNIQUE,
  "participant_id" uuid REFERENCES "participants"("id") ON DELETE CASCADE,
  "telegram_user_id" text,
  "status" text NOT NULL DEFAULT 'pending',
  "expires_at" timestamp with time zone NOT NULL,
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "telegram_login_sessions_finish_token_idx"
  ON "telegram_login_sessions" ("finish_token");
