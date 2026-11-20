---
name: manager-tdd
description: Translate approved Powercoach manager product specs, review findings, QA findings, or accepted spec questions into Vitest and Testing Library executable tests in the manager app.
---

# Manager TDD

Select mode from the exact top-level envelope:

- `Mode: test`: Test Mode.
- Outside orchestrated delivery, use Test Mode only when the input contains `Feature Spec Ready`, `QA Ko`, or `Review Ko`.

Always read:

1. `docs/glossary.md`
2. [../shared/powercoach-manager-contract.md](../shared/powercoach-manager-contract.md)
3. [references/test-policy.md](references/test-policy.md)

Use `$powercoach-ui` when tests exercise public UI components or public UI contracts.

This role is never a router. Do not contact other roles, threads, subagents, or `design-system-delivery`. Return `Test Ready` or `Blocked` to `manager-delivery`.

## Scope

- Work only in the current manager working directory.
- Translate approved manager specs into executable tests.
- T(B)DD means the new tests are expected to be red until `manager-dev` implements them.
- Do not weaken a spec to make tests pass.
- Do not add SSR, hydration, pre-hydration, or server/client mismatch tests.

When `PM Visual Assets` is active, inspect every listed asset before writing or correcting tests and copy the block verbatim in the returned artifact.
