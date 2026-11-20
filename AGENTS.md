# Powercoach Agent Instructions

Scope: repository root.

Project capabilities live in `.agents/skills`.

For design-system work, the PM/user is Yann, the human requester in the active Codex conversation, unless he explicitly delegates that role.

For `packages/ui` design-system work, use the relevant root capability:

- Read `.agents/skills/shared/powercoach-ui-contract.md` as the common authority contract for every delivery role.

- `design-system-base-ui` for local Base UI 1.6 docs, API, accessibility, data attributes, animation lifecycle, render overrides, and utilities.
- `design-system-specifications` for spec authoring in `ds-po` and independent implementation QA in `ds-qa`.
- `design-system-test` for `.test.tsx` executable contracts from specs.
- `design-system-component` for implementation, Storybook stories, and component-family work.
- `design-system-review` for independent source review against specs, tests, coding style, package conventions, and the persistent review checklist.
- `design-system-delivery` for orchestration across dedicated subagents, including `design-system-specifications` specification and QA work.

For manager work, the PM/user is Yann, the human requester in the active Codex conversation, unless he explicitly delegates that role.

For manager delivery work, use the relevant root capability:

- Read `.agents/skills/shared/powercoach-manager-contract.md` as the common authority contract for every manager delivery role.

- `powercoach-ui` for the public consumer contract of `@powercoach/ui`.
- `manager-po` for product specification authoring and Design System dependency intents.
- `manager-tdd` for manager `.test.ts` and `.test.tsx` executable contracts from specs.
- `manager-dev` for PM advice, technical advice, and implementation inside the current manager working directory.
- `manager-review` for independent source review against specs, tests, architecture, coding style, and public UI usage.
- `manager-qa` for independent rendered QA in the running manager.
- `manager-delivery` for orchestration across dedicated manager subagents, including Design System dependency handoff.

Read `docs/glossary.md` whenever project, product, design-system role, or workflow terminology appears. Glossary names and aliases are authoritative; do not reinterpret them.

For Chrome inspection of running Powercoach targets:

- `inspect-manager` always opens a new Chrome tab for `http://localhost:3000` through `@chrome` and `$chrome:control-chrome`, then initializes CDP.
- `inspect-storybook` always opens a new Chrome tab for `http://localhost:6006` through `@chrome` and `$chrome:control-chrome`, then initializes CDP.
- `inspect-animation` captures factual animation timing, timeline, style, screenshot, and layout-shift evidence after preparing the relevant Chrome target.

For local inspection and visual QA, Yann owns the running apps. Storybook is expected on `http://localhost:6006` and the manager app is expected on `http://localhost:3000`; occupied ports are normal. Always enter these targets through `inspect-manager` or `inspect-storybook`; those skills own `@chrome`, `$chrome:control-chrome`, the new Chrome tab, and CDP initialization. Do not use Control In App Browser, call `$chrome:control-chrome` directly outside the inspection skills, start alternate servers, use headless browser mode, inspect DOM as a substitute for looking at the UI, or invent a workaround. If the required inspection skill cannot prepare its target, block and report it.

Package-local instructions are authoritative if a package defines them.
