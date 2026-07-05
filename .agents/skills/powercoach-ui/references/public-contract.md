# Powercoach UI Public Contract

Powercoach UI is consumed by manager through `@powercoach/ui`.

## Public Sources

Use these as consumer contract:

- public specs under `packages/ui/docs/design-system/components` and `packages/ui/docs/design-system/animations`;
- package exports in `packages/ui/package.json`;
- exported symbols from `packages/ui/src/index.ts`;
- public namespace/barrel files that are exported by `src/index.ts`;
- Storybook examples only when they are documented as consumer-facing examples.

## Private Sources

Do not use these as consumer contract:

- component internals;
- private utilities;
- private CSS class names;
- undocumented `data-*` attributes;
- DOM shape;
- tests;
- implementation-only stories;
- Base UI internals.

## Answering Manager Roles

When the capability exists, identify the public import/export and the public spec or example that proves it.

When the capability is missing or undocumented, say so plainly. Do not suggest a manager workaround. The manager loop will produce `Design System Intent Required` when the missing UI capability blocks product work.
