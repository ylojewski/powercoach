# Storybook Stories

## Storybook

Story files for public components use PascalCase:

```text
src/components/<ComponentName>/<ComponentName>.stories.tsx
```

Story files for reusable animation primitives also use PascalCase:

```text
src/animations/<AnimationName>/<AnimationName>.stories.tsx
```

For a new public visual component, always create `<ComponentName>.stories.tsx`.

For a new reusable animation primitive, always create `<AnimationName>.stories.tsx`.

For an existing public visual component, update the story when implementation changes affect visuals, states, interaction, accessibility states, or responsive behavior.

When a component or reusable animation spec contains public examples with `EX-*` IDs, implement one Storybook story per example. Preserve the example ID in the story name or story parameters so review can trace docs to Storybook.

Example stories should use the documented consumer-facing API, not private leaf imports or internal helpers. If an example cannot be represented in Storybook, return the shared `Blocked` artifact.

Stories should cover the meaningful public states from the spec and handoff, including ready, disabled/unavailable, loading/progress, selected/pressed/open/invalid states when applicable. Stories must also cover every documented `EX-*` example.

Stories must expose useful Storybook controls for public props whenever controls make the documented behavior easier to inspect. Avoid stories that hard-code every relevant prop with no way to exercise the example.

When an example demonstrates callbacks, event details, state changes, completion, or other outcomes that are not directly visible, render visible probes in the story DOM. Prefer event logs, status text, counters, current-state readouts, or last-event summaries. Do not use `console.log` as the only observable result.

Do not perform visual QA in this skill. Do not open Storybook or the manager for QA. The independent `ds-qa` subagent owns QA through `$inspect-storybook`, `$inspect-manager`, and `$inspect-animation` after implementation. This skill owns making the stories inspectable.

## Required Package Checks

Before finishing component work, run from `packages/ui`:

```text
pnpm lint
pnpm format
pnpm typecheck:src
pnpm typecheck:test
pnpm test
pnpm build
```

`design-system-test` owns public behavior tests from specs. This component skill still owns internal unit tests for changed utils/constants/hooks/variants when they are needed to keep package coverage green.

Do not lower, skip, or bypass coverage thresholds. Every source file created or modified in the target family must report 100% branches, functions, lines, and statements. Add focused internal tests when public tests do not cover implementation internals.

The target may be ready when package-wide failures point entirely outside the target family and shared barrels changed for it. Do not modify or report unrelated files unless they prevent determining the target result.
