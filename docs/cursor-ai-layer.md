# Cursor AI Layer (Phase 3)

This repository includes a scoped AI layer so a new Cursor chat can continue work with minimal manual onboarding.

## Rules

- `.cursor/rules/stack-constraints.mdc`: locks allowed stack and prevents library drift.
- `.cursor/rules/observability-conventions.mdc`: metrics/logging/Sentry conventions for backend changes.
- `.cursor/rules/prisma-patterns.mdc`: Prisma-only data access and schema-change workflow.
- `.cursor/rules/frontend-patterns.mdc`: TanStack Query + RHF + shadcn/Tailwind frontend patterns.
- `.cursor/rules/error-handling.mdc`: shared backend/frontend error handling contract.

## Custom Skills

- `.cursor/skills/observability-endpoint/SKILL.md`
  - **When to use**: adding/updating backend endpoints that must emit metrics/logs and capture system failures.
- `.cursor/skills/nestjs-endpoint-scaffold/SKILL.md`
  - **When to use**: scaffolding new API routes with DTO validation, Prisma access, and Swagger metadata.
- `.cursor/skills/shadcn-rhf-form/SKILL.md`
  - **When to use**: creating or fixing frontend forms with RHF and shadcn-style primitives.
- `.cursor/skills/signal-lab-orchestrator/SKILL.md`
  - **When to use**: running PRD-scale work through the required 7-phase orchestrator flow with atomic task delegation and resume support.

## Commands

- `.cursor/commands/add-endpoint.md`: workflow for adding a NestJS endpoint with observability.
- `.cursor/commands/check-obs.md`: quick observability readiness audit for backend changes.
- `.cursor/commands/health-check.md`: fast local stack verification command flow.

## Hooks

- `.cursor/hooks.json`
- `.cursor/hooks/schema-change-guard.sh`
  - **Problem solved**: catches Prisma schema edits and reminds migration/type/contract follow-ups.
- `.cursor/hooks/api-change-reminder.sh`
  - **Problem solved**: catches backend controller edits and reminds Swagger + observability + frontend contract checks.

## Marketplace Skills (6) and Guidance

These are the selected marketplace skills for this stack and workflow.

1. **next-best-practices**
   - **Rationale**: keeps Next.js App Router changes idiomatic and maintainable.
   - **When to use**: route/layout/data-fetching refactors or app-level performance issues.
2. **shadcn-ui**
   - **Rationale**: aligns component composition and styling with shadcn patterns.
   - **When to use**: new UI components, form controls, dialog/sheet/table patterns.
3. **tailwind-v4-shadcn**
   - **Rationale**: enforces consistent utility-class and design-token usage.
   - **When to use**: design system polish, spacing/typography cleanup, responsive adjustments.
4. **nestjs-best-practices**
   - **Rationale**: improves controller/service boundaries and API structure quality.
   - **When to use**: adding routes, cross-cutting middleware, or module-level refactors.
5. **prisma-orm**
   - **Rationale**: keeps schema/query/migration changes safe and deterministic.
   - **When to use**: schema updates, relation modeling, query optimization, migration review.
6. **docker-expert**
   - **Rationale**: speeds up reproducible local stack debugging and compose hardening.
   - **When to use**: startup failures, networking issues, port conflicts, service dependency tuning.

## Why Custom Skills Still Matter

Marketplace skills give broad framework guidance; custom skills encode repo-specific conventions (metrics names, log field contract, scenario workflow expectations, and practical command/check sequences).

## Orchestrator Runtime State (Phase 4)

- Runtime execution state is stored under `.execution/<timestamp>/context.json`.
- Reusable templates live in:
  - `.execution/templates/context.template.json`
  - `.execution/templates/report.template.md`
- `.cursor/skills/signal-lab-orchestrator/COORDINATION.md` contains compact delegation prompt templates.
- `.cursor/skills/signal-lab-orchestrator/EXAMPLE.md` shows resume flow behavior.
