#!/usr/bin/env sh
set -e

UPLOAD_ROOT="${UPLOAD_DIR:-${RAILWAY_VOLUME_MOUNT_PATH:-public/uploads}}"
echo "[startup] ensure upload dirs at ${UPLOAD_ROOT}"
mkdir -p "${UPLOAD_ROOT}/participants" "${UPLOAD_ROOT}/teams"

echo "[startup] migrate"
npm run db:migrate
echo "[startup] import guests"
npm run db:import-guests
echo "[startup] seed teams"
npm run db:seed-teams
echo "[startup] seed staff"
npm run db:seed-staff
echo "[startup] telegram webhook"
npm run telegram:setup-webhook || echo "[startup] telegram webhook setup skipped"
echo "[startup] next start"
NODE_ENV=production exec npm run start
