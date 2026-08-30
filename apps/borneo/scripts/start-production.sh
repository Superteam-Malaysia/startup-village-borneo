#!/usr/bin/env sh
set -e

if [ -z "${BUCKET:-}" ]; then
  UPLOAD_ROOT="${UPLOAD_DIR:-${RAILWAY_VOLUME_MOUNT_PATH:-public/uploads}}"
  echo "[startup] ensure upload dirs at ${UPLOAD_ROOT}"
  mkdir -p "${UPLOAD_ROOT}/participants" "${UPLOAD_ROOT}/teams"
else
  echo "[startup] uploads via Railway Bucket (${BUCKET})"
fi

echo "[startup] migrate"
npm run db:migrate
echo "[startup] import guests"
npm run db:import-guests
echo "[startup] seed teams"
npm run db:seed-teams
echo "[startup] seed staff"
npm run db:seed-staff
echo "[startup] backfill telegram avatars"
npm run db:backfill-telegram-avatars || echo "[startup] telegram avatar backfill skipped"
echo "[startup] telegram webhook"
npm run telegram:setup-webhook || echo "[startup] telegram webhook setup skipped"
echo "[startup] next start"
NODE_ENV=production exec npm run start
