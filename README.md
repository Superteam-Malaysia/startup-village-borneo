# Superteam Malaysia monorepo

Community site and **Startup Village Borneo** hackathon app, deployed together on Railway.

| App | Path | Directory |
| --- | ---- | --------- |
| Superteam Malaysia site | `/` | `apps/site` |
| Startup Village Borneo | `/borneo` | `apps/borneo` |
| Edge reverse proxy | — | `services/edge` |

**Production:** [my.superteam.fun](https://my.superteam.fun) · SVB at [my.superteam.fun/borneo](https://my.superteam.fun/borneo)

## Quick start

```bash
npm install          # optional root devDeps
cd apps/site && npm install && npm run dev
cd apps/borneo && npm install && npm run dev
```

## Deploy

See [`docs/monorepo-railway.md`](./docs/monorepo-railway.md) for Railway service roots, DNS, and env vars.

Participant login / Postgres: [`docs/railway-setup.md`](./docs/railway-setup.md).

## Structure

```
apps/
  site/      Superteam Malaysia (Next.js + Supabase)
  borneo/    Startup Village Borneo (Next.js + Postgres/Drizzle)
services/
  edge/      Caddy — routes /borneo and /
docs/        Blueprint, design, Railway guides
data/        Shared CSV imports
```

The former standalone repo `startup-village-borneo` lives here as `apps/borneo`.
