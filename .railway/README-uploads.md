# Profile photos & team logos (no storage cost)

SVB does **not** host uploaded images. There is no Railway Bucket or volume required.

## How it works

- **Profile photos:** paste an HTTPS link on `/profile`, or sign in via Telegram — we store Telegram’s public userpic URL (`t.me/i/userpic/...`) automatically when your profile has no photo yet.
- **Team logos:** paste an HTTPS link on your team edit form. Leave blank to show initials.

Supported hosts include `t.me`, GitHub avatars, Gravatar, X/Twitter CDN, Imgur, and Google Drive image links. See `apps/web/src/lib/uploads/image-url.ts`.

## Local dev

No extra env vars. URLs are stored in Postgres only.

## Legacy uploads

Older `/uploads/...` paths still render if present. New uploads via `/api/profile/avatar` and `/api/teams/[slug]/logo` return **410 Gone** — use URL fields instead.
