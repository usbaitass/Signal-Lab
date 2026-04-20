# Signal Lab

Phase 1 foundation stack for Signal Lab:
- Frontend: Next.js App Router on `http://localhost:3000`
- Backend: NestJS API on `http://localhost:3001`
- Database: PostgreSQL 16 on `localhost:5432`
- Observability: Prometheus (`:9090`), Grafana (`:3100`), Loki (`:3101`), Promtail

## Prerequisites

- Docker + Docker Compose
- Optional for local non-container runs: Node.js 20+

## Setup

1. Review deterministic non-secret defaults in `.env.example`.

2. (Optional) Create local `.env` only if you need to override defaults:

```bash
cp .env.example .env
```

3. Start the full stack:

```bash
docker compose up -d --build
```

## Verify

Run the required checks:

```bash
# Services and exposed ports
docker compose ps

# Backend health endpoint
curl -sS http://localhost:3001/api/health

# Swagger UI
curl -I http://localhost:3001/api/docs

# Prometheus metrics endpoint
curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"
```

Expected:
- `frontend` is up on `0.0.0.0:3000->3000/tcp`
- `backend` is up on `0.0.0.0:3001->3001/tcp`
- `postgres` is up on `0.0.0.0:5432->5432/tcp`
- Health returns JSON with `status: "ok"` and timestamp.
- `/metrics` exposes required Prometheus counters/histogram.

## Phase 2 observability demo

- Scenario runner UI: `http://localhost:3000`
- Grafana: `http://localhost:3100` (default `admin/admin`)
- Prometheus: `http://localhost:9090`
- Loki API: `http://localhost:3101`

Quick guide: `phase-2-observability-walkthrough.md`

## Phase 3 Cursor AI layer

- AI layer reference: `docs/cursor-ai-layer.md`
- Rules: `.cursor/rules/`
- Custom skills: `.cursor/skills/`
- Commands: `.cursor/commands/`
- Hooks config: `.cursor/hooks.json`

Common command intents:
- `/add-endpoint`
- `/check-obs`
- `/health-check`

## Prisma migration path

The backend service runs Prisma migrations automatically on startup:

```bash
npx prisma migrate deploy --schema=/workspace/prisma/schema.prisma
```

Manual migration apply (from repo root) if needed:

```bash
docker compose run --rm backend npx prisma migrate deploy --schema=/workspace/prisma/schema.prisma
```

## Stop

```bash
docker compose down
```
