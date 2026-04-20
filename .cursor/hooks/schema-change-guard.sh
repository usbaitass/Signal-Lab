#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"

if [[ "$payload" != *"prisma/schema.prisma"* ]]; then
  echo '{"additional_context":"No Prisma schema edit detected."}'
  exit 0
fi

echo '{"additional_context":"Prisma schema changed: confirm migration creation/apply, Prisma client generation, and API/frontend contract updates before finishing."}'
exit 0
