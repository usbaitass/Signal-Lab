---
name: nestjs-endpoint-scaffold
description: Scaffolds a NestJS endpoint in this repo with controller/service wiring, DTO validation, Prisma access pattern, and observability integration points. Use when implementing a new API route in Signal Lab.
---

# NestJS Endpoint Scaffold

## When to Use
- User asks to add a new backend route.
- Existing route needs refactor into cleaner NestJS structure.
- A PR requires consistent endpoint patterns before merge.

## Scaffold Contract
- NestJS controller route with explicit request DTO.
- Validation decorators for input constraints.
- Prisma access through `PrismaService`.
- Observability hooks ready (metric + structured log).

## Steps
1. Define request/response shape and route path.
2. Add DTO with `class-validator` decorators.
3. Implement controller method and inject dependencies.
4. Persist/read data through `PrismaService` only.
5. Add metric + log touchpoints in normal and failure flows.
6. Add Swagger metadata for discoverability.

## Guardrails
- Keep endpoint business rules deterministic and testable.
- Avoid hidden side effects in controller.
- Return explicit HTTP errors for expected invalid input.
