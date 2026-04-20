#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"

if [[ "$payload" == *"apps/backend/src/"* && "$payload" == *"controller.ts"* ]]; then
  echo '{"additional_context":"Backend controller edited: verify Swagger docs metadata, endpoint observability (metric + structured log), and frontend API usage alignment."}'
  exit 0
fi

echo '{"additional_context":"No backend controller edit detected."}'
exit 0
