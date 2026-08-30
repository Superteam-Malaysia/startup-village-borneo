# Railway — participant profiles & Telegram login

SVB participant data lives in **Postgres on Railway**. Builders sign in with
**Telegram** — the same @username they registered on Luma.

## One-time setup

1. Create a [Railway](https://railway.com) project and link this repo.
2. Add a **PostgreSQL** plugin — Railway sets `DATABASE_URL` automatically.
3. Create a Telegram bot via [@BotFather](https://t.me/BotFather):
   - `/newbot` → note the bot username and token
   - `/setdomain` → set `my.superteam.fun` (required for the Login Widget)
4. Set service variables (Railway → Variables):

   | Variable | Value |
   | -------- | ----- |
   | `DATABASE_URL` | From Postgres plugin (auto) |
   | `AUTH_SECRET` | Random 32+ char string (`openssl rand -base64 32`) |
   | `APP_URL` | `https://my.superteam.fun` |
   | `NEXT_PUBLIC_BASE_PATH` | `/borneo` |
   | `NEXT_PUBLIC_SITE_URL` | `https://my.superteam.fun/borneo` |
   | `TELEGRAM_BOT_TOKEN` | Bot token from BotFather |
   | `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Optional — bot username is resolved from the token at runtime |

5. Deploy — `railway.toml` runs migrations on start, then `next start`.

6. **Import guests** (after first deploy, or from Railway shell):

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
# create apps/web/.env.local with AUTH_SECRET, TELEGRAM_BOT_TOKEN, DATABASE_URL

cd apps/web
npm run db:migrate
npm run db:import-guests
npm run dev
```

- Sign in: `/borneo/login`
- Profile: `/borneo/profile` (after Telegram auth)

For local Telegram widget testing, BotFather domain must allow your test host
(or use a tunnel to `my.superteam.fun`).

## Auth flow

1. User clicks **Log in with Telegram** on `/login`.
2. Telegram verifies identity and redirects to `/api/auth/telegram/callback`.
3. Server checks the Telegram signature and matches the user to `participants`
   by linked `telegram_user_id` or normalized Luma @username.
4. Session cookie is set → `/profile`.

Only guests in the imported Luma CSV with a matching Telegram username can sign in.
Accounts without a Telegram @username cannot use the widget.

## Legacy email login

Email magic-link routes (`/api/auth/request-link`, `/api/auth/verify`) remain in
the codebase but are no longer linked from the login page. Remove `RESEND_API_KEY`
if you no longer need email sign-in.
