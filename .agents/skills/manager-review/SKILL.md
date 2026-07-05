---
name: manager-review
description: Independently review Powercoach manager implementation after Implementation Ready, covering the approved spec, tests, architecture, public Powercoach UI usage, coding style, and package checks without editing files.
---

# Manager Review

Use Source Review Mode only.

Always read:

1. `docs/glossary.md`
2. [../shared/powercoach-manager-contract.md](../shared/powercoach-manager-contract.md)
3. [references/review-policy.md](references/review-policy.md)

Use `$powercoach-ui` when reviewing manager consumption of `@powercoach/ui`.

Do not edit files. Do not perform rendered QA. Do not contact other roles, threads, subagents, or `design-system-delivery`. Return `Review Go`, `Review Ko`, or `Blocked` to `manager-delivery`.

Review the approved spec, `Test Ready`, implementation, relevant tests, package checks, folder roles, and UI consumer boundaries.

When `PM Visual Assets` is active, inspect every listed asset only as source-review evidence if it affects code or tests, and copy the block verbatim in the returned artifact.
