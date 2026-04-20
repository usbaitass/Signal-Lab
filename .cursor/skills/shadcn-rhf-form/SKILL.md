---
name: shadcn-rhf-form
description: Builds or updates frontend forms using React Hook Form with shadcn-style UI primitives and backend-aligned payload types. Use when creating input flows in the Signal Lab Next.js app.
---

# shadcn RHF Form

## When to Use
- New user input flow is needed on frontend.
- Existing form has brittle state handling or weak validation.
- Backend payload changed and form contract must be updated.

## Output Expectations
- Form state managed with React Hook Form.
- Inputs composed from existing UI primitives where possible.
- Submit handler wired to TanStack Query mutation.
- User sees clear loading/success/error states.

## Steps
1. Define form type from backend DTO contract.
2. Initialize RHF with sensible defaults.
3. Render controls with existing `components/ui` primitives.
4. Connect submit to mutation and invalidate related query keys.
5. Surface API validation/system errors in user-friendly copy.

## Checklist
- [ ] No duplicate state management for form fields.
- [ ] Disabled/loading states during submit.
- [ ] Error message path tested for failed API responses.
- [ ] Resulting payload matches backend expectations.
