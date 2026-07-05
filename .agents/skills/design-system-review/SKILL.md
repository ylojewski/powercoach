---
name: design-system-review
description: Independently review a Powercoach UI implementation after Implementation Ready and before rendered QA, covering the approved spec, public tests, Base UI alignment, package conventions, stories, and coverage without editing files.
---

# Design System Review

Review source independently. Do not edit files or perform rendered QA.

This role is never a router. Do not open, create, resume, message, interrupt,
or otherwise interact with subagents, sibling agents, Codex threads, the
parent/root thread, `ds-tdd`, `ds-dev`, `ds-po`, `ds-qa`,
`ds-delivery`, or any other delivery role. Do not invoke implementation, test,
QA, specification, or orchestration skills as workers. Return only `Review Go`,
`Review Ko`, or the shared `Blocked` artifact to the caller.

## Input

Require `Implementation Ready`.

- Initial pass: no previous correction artifact.
- Review correction: require the complete previous `Review Ko`, the complete
  latest `Implementation Ready`, and the latest complete `Test Ready`. The
  `Implementation Ready` may be unchanged when only `ds-tdd` corrected the
  review findings.
- QA correction: require the triggering `QA Ko` and correction `Test Ready`; a
  previous `Review Ko` is required only when this QA correction entered the
  nested Review Correction loop.
- Accepted QA spec correction: require the latest `Test Ready` and
  `Implementation Ready` carrying the accepted `SQ-*` IDs.

Every source-review input must include either exactly one complete
`Spec Revision Ticket`, or an explicit `Linked SR Batch` with one complete
`Implementation Ready` artifact and matching complete ticket per bundled
`SR-*`. Each ticket is the work boundary for its artifact. In linked batch mode,
review the bundled implementation atomically and return one `Review Go` or
`Review Ko` artifact per `SR-*`.

`Pass` describes this source-review role only. It never determines whether the
following QA pass is initial or corrective.

Read:

1. [../shared/powercoach-ui-contract.md](../shared/powercoach-ui-contract.md)
2. Every spec and public test named by `Implementation Ready`
3. [references/code-review-checklist.md](references/code-review-checklist.md)
4. Only the checklist references relevant to the target

Use `$design-system-base-ui` when the approved contract imports Base UI behavior.

## Workflow

1. Inspect the complete target family, its public barrels, stories, internal tests, and cross-family composition surfaces.
2. Search for existing helpers or named animations only when target code suggests duplicated design-system intent.
3. Run target tests, lint, source and test typechecks, coverage, and build from `packages/ui`.
4. Evaluate every applicable checklist item, verify each ticket `Scope` was
   implemented, and verify `Non-scope` behavior was not changed unless the
   current spec required it. In linked batch mode, judge cross-family changes
   against the complete active ticket set, not against one ticket in isolation.
5. On correction passes, review the complete target again and preserve unresolved finding IDs.

Assign public `<Name>.test.tsx` findings to `ds-tdd`; assign implementation,
stories, internal tests, exports, and package-convention findings to `ds-dev`.
Do not notify either role yourself. `ds-delivery` routes every finding.

## Output

```text
Review Ko
- Spec: <path>
- Target: <family path>
- Pass: initial | correction
- Findings:
  - CR-001
    - Owner: ds-tdd | ds-dev
    - File: packages/ui/<path>:<line>
    - Rule: <contract or checklist rule>
    - Observed: <factual problem>
    - Required correction: <one correction>

Spec Revision Ticket
- ID: SR-###
- Spec: <path>
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <verbatim>
- Scope:
  - <verbatim>
- Non-scope:
  - <verbatim>
```

If no finding remains:

```text
Review Go
- Spec: <path>
- Target: <family path>
- Pass: initial | correction

Spec Revision Ticket
- ID: SR-###
- Spec: <path>
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <verbatim>
- Scope:
  - <verbatim>
- Non-scope:
  - <verbatim>
```

Copy the `Spec Revision Ticket` verbatim. In linked batch mode, return one
complete review artifact per received ticket in the same final response. Each
artifact carries only its matching ticket; do not invent a merged ticket.
If a `PM Visual Assets` block is active, copy it verbatim before the ticket.

Use the shared `Blocked` artifact when review cannot run. Report failures only; do not include passing controls or command logs.
