# Health Check

Validate local Signal Lab stack health in under five minutes.

## Run
1. `docker compose ps`
2. `curl -sS http://localhost:3001/api/health`
3. `curl -I http://localhost:3001/api/docs`
4. `curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"`
5. Optional UI check: open `http://localhost:3000` and run one scenario.

## Report
- Service status summary (frontend/backend/postgres/prometheus/grafana/loki).
- Any failing checks with likely root cause.
- Next command to recover fastest.
