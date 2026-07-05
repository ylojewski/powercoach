# Manager Spec Authoring Policy

## Source Reading

Read in this order:

1. PM Intent and active PM answers verbatim.
2. `docs/glossary.md`.
3. Existing manager specs under the current manager working directory's `docs/specs`.
4. `$powercoach-ui` when UI behavior or components are involved.

Do not read manager implementation, tests, QA artifacts, or the legacy `apps/manager` source. Tests are downstream executable contracts. Source and rendered evidence confirm implementation facts, but `manager-po` does not gather them directly.

If current manager routes, module boundaries, data/API shape, existing user-visible behavior, or folder ownership are needed to write the spec, emit `Technical Question For manager-dev` and stop. `manager-delivery` owns routing that question to `manager-dev-advice`.

## Spec Files

Write specs under:

```text
<manager-workdir>/docs/specs/<Feature>.md
```

Start every spec with frontmatter containing only:

```yaml
---
revision: <positive integer>
date: YYYY-MM-DD
---
```

Use PascalCase feature names. A spec should read like product documentation for the manager, not like implementation notes.

Recommended sections:

- Overview
- Entry Points
- Product Behavior
- States
- Data And API
- Accessibility
- Examples
- Use Cases
- Out Of Scope

Use `EX-###` for examples and `UC-###` for use cases. Keep examples consumer/user oriented. Do not add SSR, hydration, pre-hydration, or server/client mismatch scenarios.

## Revision Ticket

Every new spec or approved public-contract change returns one `Spec Revision Ticket`.

```text
Spec Revision Ticket
- ID: SR-###
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- From revision: <number or none>
- To revision: <number>
- Reason: <why this revision exists>
- Scope:
  - <user-visible behavior change>
- Non-scope:
  - <explicitly unchanged behavior or none>
```

The `SR-###` number matches `To revision`. Scope items describe the product change, not the authoring task.

## Authoring Results

Return one of these artifacts.

```text
Product Questions
- PQ-001
  - Context: <why the answer is needed>
  - Question: <numbered PM question>
```

```text
Technical Question For manager-dev
- ID: TQ-001
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- Context: <technical uncertainty>
- Questions:
  - <question>
```

```text
Feature Spec Ready
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- Approval: explicit PM/user go
- Addresses: <none or SQ-* IDs>

Spec Revision Ticket
...
```

```text
Design System Intent Required
- Feature: <manager feature>
- Manager spec: <spec path or none yet>
- User need: <manager user need>
- Missing UI capability: <missing public UI surface>
- Consumer scenario: <how manager would consume the UI capability>
- Proposed DS intent: <verbatim PM-ready intent for design-system-delivery>
```

Do not include backticks in delivery artifacts.
