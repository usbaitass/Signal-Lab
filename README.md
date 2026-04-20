# Signal Lab

Phase 1 foundation stack for Signal Lab:
- Frontend: Next.js App Router on `http://localhost:3000`
- Backend: NestJS API on `http://localhost:3001`
- Database: PostgreSQL 16 on `localhost:5432`

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
```

Expected:
- `frontend` is up on `0.0.0.0:3000->3000/tcp`
- `backend` is up on `0.0.0.0:3001->3001/tcp`
- `postgres` is up on `0.0.0.0:5432->5432/tcp`
- Health returns JSON with `status: "ok"` and timestamp.

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
