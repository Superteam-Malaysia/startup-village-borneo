#!/usr/bin/env bash
# Provision a persistent Railway volume for SVB uploads (team logos + profile photos).
# Requires an account-scoped RAILWAY_API_TOKEN (project tokens cannot create volumes).
set -euo pipefail

PROJECT_ID="${RAILWAY_PROJECT_ID:-18759cdb-9976-472c-8f88-c031395d84a9}"
ENVIRONMENT_ID="${RAILWAY_ENVIRONMENT_ID:-0e78d565-2e14-4611-9ef6-0c1662694a0e}"
WEB_SERVICE_ID="${RAILWAY_WEB_SERVICE_ID:-baf14df3-307d-4d8d-884c-162e03d006db}"
MOUNT_PATH="${RAILWAY_UPLOAD_MOUNT_PATH:-/app/public/uploads}"
REGION="${RAILWAY_UPLOAD_REGION:-sfo}"

TOKEN="${RAILWAY_API_TOKEN:-${RAILWAY_TOKEN:-}}"
if [[ -z "${TOKEN}" ]]; then
  echo "Set RAILWAY_API_TOKEN (account token) or RAILWAY_TOKEN, then re-run." >&2
  exit 1
fi

payload=$(cat <<JSON
{
  "query": "mutation VolumeCreate(\$input: VolumeCreateInput!) { volumeCreate(input: \$input) { id name } }",
  "variables": {
    "input": {
      "projectId": "${PROJECT_ID}",
      "environmentId": "${ENVIRONMENT_ID}",
      "serviceId": "${WEB_SERVICE_ID}",
      "mountPath": "${MOUNT_PATH}",
      "region": "${REGION}"
    }
  }
}
JSON
)

response=$(curl -s https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${payload}")

if echo "${response}" | grep -q '"errors"'; then
  echo "${response}" >&2
  echo "" >&2
  echo "If you see Not Authorized, create the volume in Railway UI:" >&2
  echo "  web service → Add Volume → mount path ${MOUNT_PATH}" >&2
  exit 1
fi

echo "${response}"
echo "Upload volume ready. Set UPLOAD_DIR=${MOUNT_PATH} on web (already configured in production)."
