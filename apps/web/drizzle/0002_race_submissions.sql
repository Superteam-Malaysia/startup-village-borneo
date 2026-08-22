CREATE TABLE IF NOT EXISTS "race_submissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" uuid NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "task_id" text NOT NULL,
  "thread_url" text NOT NULL,
  "submitted_by" uuid REFERENCES "participants"("id") ON DELETE SET NULL,
  "submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "race_submissions_team_task_unique" UNIQUE("team_id", "task_id")
);

CREATE INDEX IF NOT EXISTS "race_submissions_team_id_idx" ON "race_submissions" ("team_id");
CREATE INDEX IF NOT EXISTS "race_submissions_task_id_idx" ON "race_submissions" ("task_id");
CREATE INDEX IF NOT EXISTS "race_submissions_submitted_at_idx" ON "race_submissions" ("submitted_at");
