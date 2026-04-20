# Check Observability

Run a fast observability readiness pass for Signal Lab backend changes.

## Steps
1. Identify changed backend routes/services.
2. Confirm each changed endpoint has:
   - at least one metric update
   - structured logs on success + error path
   - Sentry capture for unexpected failures
3. Verify metric names and labels follow current conventions.
4. Provide quick runtime checks:
   - `curl -sS http://localhost:3001/metrics | rg "scenario_runs_total|scenario_run_duration_seconds|http_requests_total"`
   - Loki query hint: `{app="signal-lab"} | json`
5. Return gaps as actionable TODOs with file targets.

## Output Format
- ✅ Passed checks
- ⚠️ Missing pieces
- 🔎 Suggested follow-up verification
