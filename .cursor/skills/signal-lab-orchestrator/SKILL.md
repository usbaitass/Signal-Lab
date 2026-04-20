---
name: signal-lab-orchestrator
description: Orchestrates PRD execution for Signal Lab using a strict 7-phase pipeline, atomic task decomposition, fast/default model routing, file-based resume state, and retry-aware review loops. Use when implementing or continuing PRD-sized work with minimal main-chat context.
---

# Signal Lab PRD Orchestrator

## When to Use
- User asks to implement a PRD or large phase (for example `T1`..`T5` in `plan/tasks.md`).
- Work needs resumability after interruption.
- Goal is to keep main chat lean and delegate atomic tasks.

## Inputs
- `prd_input`: PRD file path (preferred) or pasted PRD text.
- `mode`: `fast` or `default`.
  - `fast`: maximize small/fast model delegation, smaller prompts, strict timeboxing.
  - `default`: balanced quality, more reasoning budget on planning/review.
- Optional: existing execution directory `.execution/<timestamp>/` to resume.

## Required Workspace Artifacts
- Runtime directory: `.execution/<timestamp>/` (generated at run time).
- State file: `.execution/<timestamp>/context.json`.
- Optional phase artifacts:
  - `.execution/<timestamp>/analysis.md`
  - `.execution/<timestamp>/codebase-scan.md`
  - `.execution/<timestamp>/plan.md`
  - `.execution/<timestamp>/tasks.json`
  - `.execution/<timestamp>/review.md`
  - `.execution/<timestamp>/report.md`

If `.execution/templates/` exists, use templates from:
- `.execution/templates/context.template.json`
- `.execution/templates/report.template.md`

## 7-Phase Execution Model (Mandatory)

### Phase 1 — PRD Analysis (`fast`)
Goal: extract hard requirements, constraints, acceptance criteria, and explicit non-goals.

Output:
- `analysis.md` with:
  - Must-have checklist
  - Nice-to-have checklist
  - Blockers/assumptions

Context update:
- `currentPhase: "analysis"`
- `phases.analysis.status: "completed"` when done.

### Phase 2 — Codebase Scan (`fast`, explore-style)
Goal: map relevant files, current implementation status, and reuse candidates.

Output:
- `codebase-scan.md` with:
  - Existing artifacts to reuse
  - Gaps against PRD
  - Risks (missing infra/files/contracts)

Context update:
- `currentPhase: "codebase"`
- `phases.codebase.status` transitions.

### Phase 3 — Planning (`default`)
Goal: build an implementation plan grounded in the discovered repo state.

Output:
- `plan.md` including:
  - Scope
  - Ordered milestones
  - Validation approach
  - Expected changed files

Context update:
- `currentPhase: "planning"`
- `phases.planning.result` summary.

### Phase 4 — Decomposition (`default`)
Goal: create atomic tasks with dependency graph and model routing.

Task rules:
- Each task should be executable in 5-10 minutes.
- Task description should be 1-3 sentences.
- Every task must have:
  - `id`, `title`, `domain`, `complexity`, `recommendedModel`, `dependsOn`, `status`
- Allowed `complexity`: `low | medium | high`
- Allowed `recommendedModel`: `fast | default`

Output:
- `tasks.json` and `context.json.tasks`.

Context update:
- `currentPhase: "decomposition"`
- `phases.decomposition.totalTasks`.

### Phase 5 — Implementation (`fast` majority, `default` selective)
Goal: execute tasks by dependency layers; orchestrator delegates work and updates state after each task.

Execution rules:
- Do not execute a task until all `dependsOn` tasks are `completed` or `failed`.
- Update `context.json` immediately after each task completion/failure.
- Continue when a task fails unless it blocks all dependents.

Task routing strategy:
- `fast` model for routine, scoped tasks (target >=80%):
  - Simple Prisma schema field/model additions
  - DTO or validation boilerplate
  - Basic endpoint/controller wiring
  - Metric/log instrumentation on existing flow
  - Basic UI form/list updates
- `default` model for complex tasks (target <=20%):
  - Architecture/trade-off decisions
  - Cross-domain integration and refactor coordination
  - Complex error-handling or migration strategy
  - Ambiguous requirements resolution

Mode override:
- If `mode=fast`: keep `default` only for high complexity or unresolved ambiguity.
- If `mode=default`: allow `default` for medium/high complexity and critical reviews.

Context update:
- `currentPhase: "implementation"`
- `phases.implementation.completedTasks` increments per task.

### Phase 6 — Review Loop (`fast` readonly reviewer, bounded retries)
Goal: validate changes by domain and repair issues with bounded retry loop.

Domains:
- `database`, `backend`, `frontend`, `observability`, `docs` (include only relevant domains).

Loop behavior (mandatory):
1. Run reviewer for a domain in readonly mode.
2. If review passes, mark domain passed.
3. If review fails, run implementer with reviewer feedback.
4. Re-run reviewer.
5. Repeat up to 3 attempts per domain.
6. After max retries, mark domain/task `failed`, keep progressing.

Context update:
- Save retry counters in `phases.review.retriesByDomain`.
- Record unresolved items in `phases.review.openIssues`.

### Phase 7 — Final Report (`fast`)
Goal: produce human-readable completion report from context state.

Output:
- `report.md` using required format from section "Final Report Format".
- Set top-level `status` to:
  - `completed` if no unresolved blockers
  - `completed_with_failures` if any failed tasks/domains
  - `failed` if pipeline cannot continue

## Resume Semantics (`context.json`)

On start:
1. If no execution folder is provided, create `.execution/<timestamp>/` and initialize `context.json`.
2. If `context.json` exists, resume from `currentPhase`.
3. Never rerun completed phases unless user explicitly asks.
4. Keep failed tasks as failed; do not erase history.

State transition rules:
- `pending -> in_progress -> completed | failed`
- Phase/task status updates must be durable in file before moving forward.
- Interrupted runs are recoverable from last saved phase/task state.

## Context State Model

Use this JSON structure (fields can be extended, core keys required):

```json
{
  "executionId": "2026-04-20-10-30-00",
  "createdAt": "2026-04-20T10:30:00Z",
  "updatedAt": "2026-04-20T10:30:00Z",
  "prdInput": "prds/004_prd-orchestrator.md",
  "mode": "fast",
  "status": "in_progress",
  "currentPhase": "analysis",
  "phases": {
    "analysis": { "status": "pending", "result": null },
    "codebase": { "status": "pending", "result": null },
    "planning": { "status": "pending", "result": null },
    "decomposition": { "status": "pending", "result": null, "totalTasks": 0 },
    "implementation": {
      "status": "pending",
      "completedTasks": 0,
      "failedTasks": 0,
      "totalTasks": 0
    },
    "review": {
      "status": "pending",
      "retriesByDomain": {},
      "openIssues": []
    },
    "report": { "status": "pending", "path": null }
  },
  "tasks": [],
  "modelUsage": { "fast": 0, "default": 0 },
  "assumptions": [],
  "errors": []
}
```

## Fast vs Default Mapping Strategy

Use this deterministic matrix first, then adjust by ambiguity/risk:

| Task Pattern | Complexity | Model |
|---|---|---|
| Add/update schema field, DTO, simple endpoint, simple UI form | low | fast |
| Add observability signal to existing path | low | fast |
| Cross-layer contract updates with small ripple | medium | fast (default if ambiguous) |
| Architecture decision or broad refactor | high | default |
| Multi-system integration with unclear constraints | high | default |
| Final quality review with trade-off analysis | medium/high | default (or fast readonly in `mode=fast`) |

Routing guardrails:
- Keep fast-model share >=80% for decomposed implementation tasks when feasible.
- Escalate to default model if task fails twice for unclear reasoning issues.

## Retry and Escalation Rules
- Implementation retry cap per task: `2` (then mark failed or escalate model).
- Review retry cap per domain: `3`.
- Escalation flow:
  1. `fast` retry
  2. `fast` retry with tightened scope
  3. escalate to `default` if still failing and task is critical
- Non-critical failures are logged and carried into final report.

## Final Report Format (Mandatory)

Use this exact structure:

```markdown
Signal Lab PRD Execution — <Completed | Completed with Failures | Failed>

Execution ID: <executionId>
PRD: <prd path or short label>
Mode: <fast | default>
Duration: <approx duration>

Tasks:
- Completed: <n>
- Failed: <n>
- Retried: <n>

Model usage:
- fast: <n>
- default: <n>

Completed Deliverables:
- <bullet list of outcomes>

Failed / Deferred:
- <bullet list with reason and retry count>

Open Risks:
- <bullet list>

Next Steps:
- <short actionable list>
```

## Practical Delegation Guidance
- Prefer existing project skills for implementation prompts:
  - `.cursor/skills/nestjs-endpoint-scaffold/SKILL.md`
  - `.cursor/skills/observability-endpoint/SKILL.md`
  - `.cursor/skills/shadcn-rhf-form/SKILL.md`
- Use project commands for quick verification where relevant:
  - `.cursor/commands/health-check.md`
  - `.cursor/commands/check-obs.md`
- Keep prompts scoped to one atomic task and explicit output artifact.

## Minimal Run Checklist
- [ ] `.execution/<timestamp>/context.json` exists.
- [ ] All 7 phases have status entries.
- [ ] Tasks are atomic and include `complexity` + `recommendedModel`.
- [ ] Review loop recorded retries and outcomes.
- [ ] Final report generated in required format.
