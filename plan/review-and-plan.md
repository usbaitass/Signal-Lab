---
name: Signal Lab Fast Execution
overview: Deliver all PRD requirements with a strict, low-token workflow that prioritizes score-critical items first, then completes Cursor AI layer and orchestrator with minimal rework.
todos:
  - id: foundation-stack
    content: "Implement PRD 001 baseline: Docker, FE/BE/DB, health/docs, Prisma model+migration, README run/check/stop"
    status: pending
  - id: observability-e2e
    content: Implement PRD 002 scenarios + Prometheus + Loki logging + Sentry + Grafana dashboard and pass walkthrough
    status: pending
  - id: cursor-ai-layer
    content: Create required Cursor rules, 3 custom skills, 3 commands, 2 hooks, and document 6 marketplace skills with rationale
    status: pending
  - id: orchestrator-skill
    content: Implement PRD 004 orchestrator skill with phased flow, context.json, fast/default mapping, retry/resume/report
    status: pending
  - id: final-hardening
    content: Complete submission checklist, cross-check rubric penalties, and finalize 15-minute verification path
    status: pending
isProject: false
---

# Signal Lab Fast, Strict Implementation Plan

## Objectives
- Reach rubric-safe baseline fast: runnable stack + verifiable observability walkthrough + complete Cursor AI layer + orchestrator.
- Minimize token usage by using short command flows, fixed templates, and batch validations.

## Non-Negotiable Acceptance Gates
- Stack exactly as required (no substitutions): Next.js App Router, shadcn/ui, Tailwind, TanStack Query, RHF, NestJS, PostgreSQL, Prisma, Sentry, Prometheus, Grafana, Loki.
- `docker compose up -d` brings up full stack.
- Observability walkthrough reproducible in <=5 minutes.
- Cursor AI layer minimums:
  - 5 rules
  - 3 custom skills (including observability) + orchestrator skill
  - 3 commands
  - 2 useful hooks
  - 6 marketplace skills with rationale

## Execution Order (Fastest Path)

### Phase 1 — Foundation First (score unlock)
- Implement and verify PRD 001 core in:
  - [ASSIGNMENT.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/ASSIGNMENT.md)
  - [prds/001_prd-platform-foundation.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/prds/001_prd-platform-foundation.md)
- Target files:
  - [docker-compose.yml](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/docker-compose.yml)
  - [.env.example](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/.env.example)
  - [README.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/README.md)
  - Backend + frontend app folders and [prisma/schema.prisma](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/prisma/schema.prisma)
- Hard checks:
  - FE on `:3000`, BE on `:3001`, PG on `:5432`
  - `GET /api/health`, Swagger `/api/docs`
  - Prisma migration applied

### Phase 2 — Observability Demo (score protection)
- Implement PRD 002 end-to-end in:
  - [prds/002_prd-observability-demo.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/prds/002_prd-observability-demo.md)
- Build required scenario types: `success`, `validation_error`, `system_error`, `slow_request` (optional bonus `teapot` if time).
- Enforce signals:
  - Prometheus metrics endpoint `/metrics` with required counters/histogram.
  - Structured logs to Loki with `scenarioType/scenarioId/duration/error`.
  - Sentry capture for `system_error`.
  - Grafana dashboard with 3+ useful panels.
- Verify using the exact walkthrough sequence from PRD/Rubric.

### Phase 3 — Cursor AI Layer (strict artifact completion)
- Implement PRD 003 in:
  - [prds/003_prd-cursor-ai-layer.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/prds/003_prd-cursor-ai-layer.md)
- Create strict minimal set:
  - Rules in [.cursor/rules/](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/.cursor/rules)
    - `stack-constraints.mdc`
    - `observability-conventions.mdc`
    - `prisma-patterns.mdc`
    - `frontend-patterns.mdc`
    - `error-handling.mdc`
  - Custom skills in [.cursor/skills/](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/.cursor/skills)
    - `observability-endpoint/SKILL.md`
    - `nestjs-endpoint-scaffold/SKILL.md`
    - `shadcn-rhf-form/SKILL.md`
  - Commands in [.cursor/commands/](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/.cursor/commands)
    - `add-endpoint.md`
    - `check-obs.md`
    - `health-check.md`
  - Hooks (2+) in project hook config (after schema change, after endpoint creation).
  - Marketplace skills doc section with 6+ enabled skills + rationale.

### Phase 4 — Orchestrator Skill (PRD 004)
- Implement in:
  - [prds/004_prd-orchestrator.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/prds/004_prd-orchestrator.md)
  - [.cursor/skills/signal-lab-orchestrator/SKILL.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/.cursor/skills/signal-lab-orchestrator/SKILL.md)
- Must include:
  - Required 7 phases
  - `.execution/<timestamp>/context.json` state model
  - explicit `fast` vs `default` task mapping
  - retry/review loop and resume behavior
  - final report format

### Phase 5 — Submission Hardening
- Finalize:
  - [SUBMISSION_CHECKLIST.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/SUBMISSION_CHECKLIST.md)
  - [RUBRIC.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/RUBRIC.md) as validation baseline
  - [README.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/README.md) demo path <=15 minutes
- Add short AI-layer documentation section: rules/skills/commands/hooks/marketplace + why.

## Strict Command Playbook (Low Token)

Use these exact loops while implementing:

```bash
# 1) Bring stack up
docker compose up -d

# 2) Fast health checks
docker compose ps
curl -sS http://localhost:3001/api/health
curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|http_requests_total|scenario_run_duration_seconds"

# 3) Trigger scenario quickly (repeat by type)
curl -sS -X POST http://localhost:3001/api/scenarios/run \
  -H "Content-Type: application/json" \
  -d '{"type":"success"}'

# 4) Debug only failing service
docker compose logs backend --tail 200

# 5) Full reset only when required
docker compose down && docker compose up -d
```

Cursor artifact creation loop:

```bash
# Create all required directories once
mkdir -p .cursor/rules .cursor/skills .cursor/commands .cursor/hooks .execution

# Quick count checks
ls .cursor/rules | wc -l
ls .cursor/skills | wc -l
ls .cursor/commands | wc -l
```

## Timebox (6–8 Hours)
- Foundation: 1.5h
- Observability: 2.5h
- Cursor AI layer: 1.5h
- Orchestrator: 1.5h
- Final verification/docs/checklist: 1h

## Done Definition
- Every checkbox in [SUBMISSION_CHECKLIST.md](/home/usbaitass/Projects/Work_Assignment/Signal-Lab/SUBMISSION_CHECKLIST.md) is filled with concrete paths and verification steps.
- New Cursor chat can continue work from `.cursor` artifacts without manual onboarding.
- Interviewer can run one command and verify all required signals quickly.