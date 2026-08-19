#!/usr/bin/env sh
set -e
echo "[startup] migrate"
npm run db:migrate
echo "[startup] import guests"
npm run db:import-guests
echo "[startup] seed teams"
npm run db:seed-teams
echo "[startup] seed staff"
npm run db:seed-staff
echo "[startup] next start"
NODE_ENV=production exec npm run start
