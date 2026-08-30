#!/usr/bin/env bash
# Create Railway Bucket for SVB uploads and wire S3 credentials to the web service.
set -euo pipefail

PATCH_FILE="$(cd "$(dirname "$0")/.." && pwd)/.railway/web-uploads-bucket.patch.json"

if [[ ! -f "${PATCH_FILE}" ]]; then
  echo "Missing ${PATCH_FILE}" >&2
  exit 1
fi

echo "Applying Railway bucket config from ${PATCH_FILE}"
railway environment edit --json < "${PATCH_FILE}" -m "Add svb-uploads bucket for profile photos and team logos"

echo "Done. Redeploy the web service if Railway did not auto-deploy."
