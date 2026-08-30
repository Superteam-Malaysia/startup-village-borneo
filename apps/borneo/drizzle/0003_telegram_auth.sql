ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "telegram_user_id" text;
CREATE UNIQUE INDEX IF NOT EXISTS "participants_telegram_user_id_unique"
  ON "participants" ("telegram_user_id")
  WHERE "telegram_user_id" IS NOT NULL;
