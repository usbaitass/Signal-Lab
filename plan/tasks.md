# Signal Lab Task Breakdown (L/XL Only)

## XL Tasks

- [ ] **T1 (XL) — End-to-End Platform Foundation**
  Deliver PRD 001 completely: working Docker Compose stack, Next.js frontend, NestJS backend, PostgreSQL + Prisma, health endpoint, Swagger, migrations, and runnable baseline docs.

- [ ] **T2 (XL) — Full Observability Pipeline**
  Deliver PRD 002 completely: scenario execution flow from UI to backend with persistence, Prometheus metrics, Loki structured logs, Sentry exception capture, and Grafana dashboards wired and visible.

- [ ] **T3 (XL) — Cursor AI Layer Completion**
  Deliver PRD 003 artifact set: at least 5 scoped rules, 3 custom skills (including observability), 3 commands, 2 practical hooks, and 6 marketplace skills with rationale and usage guidance.

- [ ] **T4 (XL) — Orchestrator Skill System**
  Deliver PRD 004 orchestrator: phased execution model, atomic decomposition, fast/default model selection strategy, context state file with resume support, review loop, and final report output.

- [ ] **T5 (XL) — Submission-Ready Verification and Packaging**
  Complete submission hardening: 15-minute reviewer walkthrough, README verification path, filled submission checklist, rubric cross-check, and proof that a fresh Cursor chat can continue without manual onboarding.

## L Tasks

- [ ] **T6 (L) — Compose and Environment Reliability Pass**
  Finalize `docker-compose.yml` and `.env.example` for deterministic startup, service dependencies, ports, and non-secret defaults so `docker compose up -d` is reliable.

- [ ] **T7 (L) — Scenario Domain Completion Pass**
  Finalize scenario types and backend contracts (`success`, `validation_error`, `system_error`, `slow_request`) with consistent DB status modeling and optional `teapot` bonus if time remains.

- [ ] **T8 (L) — Observability Signal Quality Pass**
  Normalize metric names/labels, structured log fields, and error capture conventions to match rubric expectations and ensure dashboards are meaningful, not decorative.

- [ ] **T9 (L) — Cursor Rules and Skill Quality Pass**
  Improve AI artifacts for strict scope, non-conflicting guidance, concrete “When to Use,” and token-efficient instructions optimized for fast execution by smaller models.

- [ ] **T10 (L) — Commands and Hooks Practicality Pass**
  Ensure command prompts and hooks solve real recurring workflows (endpoint scaffolding, observability checks, schema-change guardrails, API-change reminders) with minimal prompt overhead.
