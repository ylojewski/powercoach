---
name: design-system-test
description: Translate an approved Powercoach UI component or reusable animation spec, QA findings, or review findings owned by ds-tdd into the public .test.tsx executable contract in packages/ui, then return a Test Ready artifact for implementation.
---

# Design System TDD

Write public behavior tests. Do not implement production code or perform rendered QA.

This role is never a router. Do not open, create, resume, message, interrupt,
or otherwise interact with subagents, sibling agents, Codex threads, the
parent/root thread, `ds-dev`, `ds-review`, `ds-po`, `ds-qa`,
`ds-delivery`, or any other delivery role. Do not invoke implementation,
review, QA, specification, or orchestration skills as workers. Return only the
`Test Ready` or shared `Blocked` artifact to the caller.

## Start

Read:

1. [../shared/powercoach-ui-contract.md](../shared/powercoach-ui-contract.md)
2. [references/bdd-test-policy.md](references/bdd-test-policy.md)
3. [../design-system-component/references/test-code-style.md](../design-system-component/references/test-code-style.md)
4. The approved target spec and every named animation spec it references.

Use `$design-system-base-ui` only when the approved contract imports Base UI semantics, accessibility, attributes, variables, render overrides, or animation lifecycle.

Work only inside `packages/ui`, run commands from `packages/ui`, and establish the edit root before the first patch.

## Inputs

Accept one of:

- `Specification Ready`
- `QA Ko`
- complete `Review Ko` projection containing findings owned by `ds-tdd`

Every input must include either exactly one complete `Spec Revision Ticket`, or
an explicit `Linked SR Batch` with one complete artifact and matching complete
ticket per bundled `SR-*`. Read each spec path from its artifact and ticket.
Ignore review findings owned by `ds-dev`.
An input that mentions a `CR-*` but does not include the complete matching
`Review Ko` projection is invalid.
For review correction, also accept the latest complete `Test Ready` as current
test state; the `Review Ko` projection remains the correction trigger.
On correction work, preserve every received `CR-*`, `QA-*`, or accepted `SQ-*`
ID through the output.

Use each approved spec as the complete contract and each `Spec Revision Ticket`
as that spec's work boundary. For revision work, change only the tests required
by the ticket `Scope`, plus any received `CR-*`, `QA-*`, or accepted `SQ-*`
correction. Do not modify unrelated assertions named by `Non-scope` unless the
current spec now makes them contradictory. In linked batch mode, process the
bundled specs atomically and return one `Test Ready` artifact per `SR-*`.

From `packages/ui`, run the spec validator before editing:

```text
node ../../.agents/skills/design-system-specifications/scripts/validate-spec.mjs docs/design-system/<components-or-animations>/<Name>.md
```

Return the shared `Blocked` artifact if validation fails.

## Workflow

1. Map each `UC-*` to observable public tests.
2. Add consumer-usage tests for `EX-*` examples that contain code.
3. Preserve `UC-*`, `EX-*`, and applicable finding IDs in test names.
4. For correction work, add the smallest public regression test that prevents the finding.
5. Keep tests implementation-neutral unless the approved contract explicitly names a technical surface.
6. Leave exact rendered geometry, timing, clipping, and visual feel to `ds-qa`.
7. If a QA finding cannot become a meaningful public test, copy it verbatim into `Untestable findings`.
8. Run the required validation.

## Output

```text
Test Ready
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- Test: packages/ui/src/<components-or-animations>/<path>/<Name>.test.tsx
- Contracts: <UC-* and EX-* IDs>
- Addresses: <none or complete CR-*, QA-*, and SQ-* IDs>
- Untestable findings: <none or complete findings>

Spec Revision Ticket
- ID: SR-###
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <verbatim>
- Scope:
  - <verbatim>
- Non-scope:
  - <verbatim>
```

Copy the `Spec Revision Ticket` verbatim. Do not include `SR-*` in `Addresses`.
If a `PM Visual Assets` block is active, copy it verbatim before the ticket.
In linked batch mode, return one complete `Test Ready` artifact per received
ticket in the same final response. Each artifact carries only its matching
ticket; do not invent a merged ticket.

The contract may be red before implementation. Do not enumerate failures or add a red/green status.

Run from `packages/ui`:

```text
pnpm lint:fix
pnpm format:write
pnpm typecheck:test
pnpm test
```

Target-file formatting must pass. Tests must be collected and executable; syntax,
fixture, import-path, test-environment, and harness failures block `Test Ready`.
Only failures directly caused by not-yet-implemented public behavior or exports
may remain. Do not fix unrelated failures.
