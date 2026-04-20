# Example: Resume-Aware PRD Run

## Input
- `prd_input`: `prds/004_prd-orchestrator.md`
- `mode`: `fast`

## First run (new execution)
1. Create `.execution/2026-04-20-11-00-00/`.
2. Initialize `.execution/2026-04-20-11-00-00/context.json`.
3. Complete phases:
   - analysis
   - codebase
   - planning
   - decomposition
4. Start implementation tasks by dependency layers.

## Interrupted run
- Process stops during implementation after 6/9 tasks.

## Resume run
1. Load `.execution/2026-04-20-11-00-00/context.json`.
2. Detect `currentPhase=implementation`.
3. Skip completed phases/tasks.
4. Continue remaining tasks.
5. Execute review loop with max 3 retries per domain.
6. Generate final report at `.execution/2026-04-20-11-00-00/report.md`.

## Expected `context.json` signals
- `status`: `completed` or `completed_with_failures`
- `phases.review.retriesByDomain` populated if retries occurred
- `modelUsage.fast` significantly greater than `modelUsage.default`
