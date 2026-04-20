---
name: observability-endpoint
description: Adds observability to a NestJS endpoint using Signal Lab conventions (Prometheus metrics, structured logs, and Sentry on system failures). Use when creating or modifying backend endpoints that must be observability-ready.
---

# Observability Endpoint

## When to Use
- A new backend endpoint is being added.
- Existing endpoint logic changes and metrics/logging may become stale.
- Reviewer asks to validate endpoint observability readiness.

## Outcome
- Endpoint emits at least one useful metric.
- Endpoint writes structured logs for success and failure paths.
- Unexpected failures are captured to Sentry without changing expected 4xx behavior.

## Steps
1. Identify success, validation-error, and system-error branches.
2. Add metric updates using `MetricsService` with low-cardinality labels.
3. Add structured log events using shared logger utility.
4. Ensure only unexpected/system failures are sent to Sentry.
5. Verify endpoint response contract remains unchanged.

## Minimum Checklist
- [ ] Metric name follows existing naming style.
- [ ] Labels are stable (no user-generated high-cardinality values).
- [ ] Logs contain context and identifiers needed for traceability.
- [ ] System errors are captured and still propagated correctly.
- [ ] Manual verification command prepared (`/check-obs` command).
