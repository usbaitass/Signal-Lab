# Orchestrator Coordination Prompts

Use these compact prompt shapes when delegating each phase.

## 1) PRD Analysis Prompt (fast)

```
Analyze PRD input and return:
1) must-have requirements
2) constraints/non-goals
3) acceptance checks
4) assumptions/questions
Keep output concise and structured for execution planning.
```

## 2) Codebase Scan Prompt (fast/explore)

```
Scan repository for files relevant to this PRD.
Return:
- reusable artifacts
- missing artifacts
- implementation risks
- file paths grouped by backend/frontend/infra/docs/.cursor
Do not propose large refactors.
```

## 3) Planning Prompt (default)

```
Create an implementation plan based on PRD + scan results.
Include milestones, dependencies, validation steps, and expected changed files.
Optimize for practical delivery, not framework design.
```

## 4) Decomposition Prompt (default)

```
Break plan into atomic tasks (5-10 minutes each).
For each task include:
id, title, domain, description, complexity(low|medium|high),
recommendedModel(fast|default), dependsOn[], doneCriteria.
Target >=80% fast model tasks.
```

## 5) Implementation Prompt (fast/default)

```
Execute exactly one atomic task.
Respect repository conventions and existing .cursor rules/skills.
Return:
- files changed
- validations run
- task status (completed|failed)
- blockers/assumptions
```

## 6) Review Prompt (fast readonly reviewer)

```
Review changed artifacts for one domain.
Return PASS/FAIL with concrete issues.
If FAIL, provide minimal actionable fixes.
Focus on correctness and requirement coverage.
```

## 7) Final Report Prompt (fast)

```
Generate final execution report using required Signal Lab format.
Include counts, model usage, completed outcomes, failed/deferred items,
open risks, and next steps.
```
