# Railway — participant profiles & email login

SVB participant data lives in **Postgres on Railway**. Builders sign in with the
**same email they used on Luma** (magic link, no password).

## One-time setup

1. Create a [Railway](https://railway.com) project and link this repo.
2. Add a **PostgreSQL** plugin — Railway sets `DATABASE_URL` automatically.
3. Set service variables (Railway → Variables):

   | Variable | Value |
   | -------- | ----- |
   | `DATABASE_URL` | From Postgres plugin (auto) |
   | `AUTH_SECRET` | Random 32+ char string (`openssl rand -base64 32`) |
   | `APP_URL` | `https://stmy.fun` |
   | `NEXT_PUBLIC_BASE_PATH` | `/borneo` |
   | `RESEND_API_KEY` | Resend API key (production email) |
   | `EMAIL_FROM` | e.g. `Startup Village Borneo <hello@superteam.my>` |

4. Deploy — `railway.toml` runs migrations on start, then `next start`.

5. **Import guests** (after first deploy, or from Railway shell):

   ```bash
   cd apps/web
   railway run npm run db:migrate
   railway run npm run db:import-guests
   railway run npm run db:seed-teams
   railway run npm run db:seed-staff
   ```

   CSV source: `data/imports/guests-2026-08-19.csv` (63 Luma guests).

## Local development

```bash
docker compose up -d postgres
cp apps/web/.env.example apps/web/.env.local
# edit AUTH_SECRET in .env.local

cd apps/web
npm run db:migrate
npm run db:import-guests
npm run dev
```

- Sign in: `/borneo/login`
- Profile: `/borneo/profile` (after magic link)

Without `RESEND_API_KEY`, dev mode prints the magic link in the API response and server logs.

## Auth flow

1. User enters registration email on `/login`.
2. If email exists in `participants`, a 30-minute magic link is emailed (or shown in dev).
3. Link hits `/api/auth/verify?token=…` → session cookie → `/profile`.

Only emails present in the imported Luma CSV can sign in.
