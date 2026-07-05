# Manager Review Policy

## Focus

Prioritize:

- approved spec violations;
- tests that do not cover the spec or overreach beyond it;
- implementation behavior regressions;
- route, store, and module-boundary mistakes;
- UI hacks or copied `@powercoach/ui` internals;
- coding-style violations likely to keep repeating;
- missing checks or relevant failing checks.

Do not raise new product behavior as a code-review finding. If a useful behavior is outside the spec, it belongs to QA as `Spec Questions`.

## UI Consumer Checklist

Flag any manager code that:

- copies UI CSS, Tailwind class bundles, tokens, markup, data attributes, DOM shape, variants, or behavior;
- reaches into `packages/ui` internals;
- creates a private protocol with a UI component;
- works around a missing public UI prop, variant, animation, or component instead of blocking for a DS intent.

## Findings

Owners:

- `manager-tdd` for public test contract issues.
- `manager-dev` for implementation, source, architecture, or internal test issues.

Return:

```text
Review Ko
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- Target: <manager-workdir>/<target>
- CR-001
  - Owner: manager-dev
  - File: <manager-workdir>/<path>:<line>
  - Rule: <spec, architecture, UI consumer, code style, or test rule>
  - Observed: <factual issue>
  - Required correction: <required correction>

Spec Revision Ticket
...
```

or:

```text
Review Go
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- Target: <manager-workdir>/<target>

Spec Revision Ticket
...
```

Do not include backticks in delivery artifacts.
