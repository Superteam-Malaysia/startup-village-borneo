# Profile photos & team logos (free uploads)

Uploads are stored in **Postgres** (`uploaded_images` table) — the same database Railway already provisions for the app. No Railway Bucket, no volume, no extra storage product.

## How it works

- User picks a file on `/profile` or team edit (max **1 MB**)
- Bytes are saved in Postgres; `avatar_url` / `logo_url` point at `/uploads/participants/…` or `/uploads/teams/…`
- Images are served from `/borneo/uploads/…` via the web app
- Telegram sign-in still auto-sets a Telegram userpic URL when the profile has no photo yet

## Local dev

Without `DATABASE_URL`, files fall back to `public/uploads/` on disk.

## Optional Railway Bucket

If `BUCKET`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, and `ENDPOINT` are set, uploads use the bucket instead of Postgres. Not required for SVB.

Run migrations after deploy: `npm run db:migrate`
