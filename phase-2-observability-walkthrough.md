# Phase 2 Observability Walkthrough

This walkthrough is designed to be reproducible in under 5 minutes.

## 1) Start stack

```bash
docker compose up -d --build
```

## 2) Open UI and run required scenarios

- UI: `http://localhost:3000`
- Run these scenario types from the form:
  - `success`
  - `validation_error`
  - `system_error`
  - `slow_request`

## 3) Verify backend + Prometheus metrics

```bash
curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"
```

## 4) Verify Grafana dashboard

- Grafana: `http://localhost:3100` (`admin/admin` by default)
- Dashboard: **Signal Lab Observability**
- Required panels available:
  - Scenario Runs by Type
  - Latency Distribution (P95)
  - Error Rate
  - (bonus) Recent Structured Logs from Loki

## 5) Verify Loki logs

- Grafana -> Explore -> Loki datasource
- Query:

```logql
{app="signal-lab"} | json | scenarioType!=""
```

- JSON logs include `scenarioType`, `scenarioId`, `duration`, and `error` (for error scenarios).

## 6) Verify Sentry event capture

- Configure a valid `SENTRY_DSN` in `.env.example` or `.env`.
- Trigger `system_error` from UI.
- Confirm exception appears in the configured Sentry project.
