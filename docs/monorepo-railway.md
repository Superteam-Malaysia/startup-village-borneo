# Railway — monorepo deploy (my.superteam.fun)

Single GitHub repo: **Superteam-Malaysia/superteammy** (canonical parent)

This branch may live on `startup-village-borneo` temporarily — **merge into `superteammy`** and point all Railway services at that repo.

| Railway service | Root directory | Public URL |
| ---------------- | -------------- | ---------- |
| **edge** | `services/edge` | `https://my.superteam.fun` |
| **superteammy** | `apps/site` | (internal upstream) |
| **web** (SVB) | `apps/borneo` | `https://my.superteam.fun/borneo` |

## DNS (my.superteam.fun)

Point the subdomain at Railway **edge** (same pattern as the old `stmy.fun` setup):

1. Railway → project **svb** → service **edge** → Settings → Domains → add `my.superteam.fun`
2. At your DNS host for `superteam.fun`, add the records Railway shows (typically):
   - **CNAME** `my` → `<edge-service>.up.railway.app`
   - **TXT** `_railway-verify.my` → `railway-verify=…` (if prompted)

After cutover, you can remove `stmy.fun` from edge or keep it as a redirect.

## Edge environment

| Variable | Example |
| -------- | ------- |
| `SITE_UPSTREAM` | `superteammy-production.up.railway.app:443` |
| `BORNEO_UPSTREAM` | `web-production-cbc90.up.railway.app:443` |

Caddy config: `services/edge/Caddyfile` — `/borneo` → Borneo app, everything else → site.

## Link GitHub repo to all three services

For each service in Railway:

1. Settings → Source → connect **Superteam-Malaysia/superteammy**
2. Set **Root Directory** (table above)
3. Redeploy

Previously **web** pointed at `startup-village-borneo`; repoint it to this monorepo with root `apps/borneo`.

## Borneo (web) variables

| Variable | Value |
| -------- | ----- |
| `DATABASE_URL` | Postgres plugin (shared) |
| `AUTH_SECRET` | Random 32+ chars |
| `APP_URL` | `https://my.superteam.fun` |
| `NEXT_PUBLIC_BASE_PATH` | `/borneo` |
| `NEXT_PUBLIC_SITE_URL` | `https://my.superteam.fun/borneo` |
| `TELEGRAM_BOT_TOKEN` | BotFather token |

BotFather: `/setdomain` → **`my.superteam.fun`** (required for Login Widget).

Deploy runs migrations + guest import + Telegram webhook via `apps/borneo/scripts/start-production.sh`.

## Local development

```bash
# Site (port 3000)
cd apps/site && npm install && npm run dev

# Borneo (port 3001 — set in .env or pass -p)
cd apps/borneo && npm install && npm run dev
```

Postgres for Borneo: `docker compose up -d postgres` from repo root; see `docs/railway-setup.md`.

## Legacy repo

`Superteam-Malaysia/startup-village-borneo` is archived in favor of `apps/borneo` in this monorepo.
