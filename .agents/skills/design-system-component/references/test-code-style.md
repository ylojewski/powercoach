# Powercoach UI Test Code Style

Scope: every new or rewritten component unit test in `packages/ui`.

Use this file in addition to [code-style.md](code-style.md).

## Stack

- Vitest.
- `@testing-library/react`.
- `@testing-library/jest-dom`.

Use `@testing-library/jest-dom` matchers from the package test setup.

These are component unit tests only. Do not test app routes, manager workflows, package integration, or multi-package behavior here.

## Test Ownership

`design-system-test` owns public component behavior tests generated from component spec use cases.

Public component behavior tests use PascalCase filenames:

```text
<ComponentName>.test.tsx
```

Do not create separate namespace, barrel, or assembly test files such as `<ComponentName>.namespace.test.tsx` unless the user explicitly asks for that file. Cover namespace consumer usage inside the public `<ComponentName>.test.tsx` file when it matters.

`design-system-component` owns internal unit tests for utilities, constants, hooks, and variant definitions that it creates or changes when they are needed for package coverage.

Internal tests follow this same test code style. They should stay scoped to the internal export under test and must not duplicate public use-case coverage owned by `design-system-test`.

## File Order

1. Imports.
2. `vi.mock(...)` declarations.
3. Types and interfaces used only to type test input/output fixtures.
4. Static constants as uppercase `as const`.
5. The top-level `describe(<export name>, () => {})` block.

Do not add an export section to test files.

## Mocks

Place all top-level `vi.mock(...)` declarations immediately after imports.

Do not put constants, types, fixtures, or `describe(...)` before top-level mocks.

When mocking imported functions, type them with `MockedFunction` or `vi.mocked(...)`:

```ts
import { resolveAnimationState } from './resolveAnimationState'
import { describe, expect, it, type MockedFunction, vi } from 'vitest'

vi.mock('./resolveAnimationState', () => ({
  resolveAnimationState: vi.fn()
}))

describe('SwitchAnimation', () => {
  let resolveAnimationStateMock: MockedFunction<typeof resolveAnimationState>

  beforeEach(() => {
    resolveAnimationStateMock = vi.mocked(resolveAnimationState)
  })
})
```

Avoid untyped mocked functions in assertions and setup.

## Describe Shape

The top-level suite name is the export under test:

```ts
describe('ButtonRoot', () => {})
```

Use nested `describe('when ...', () => {})` blocks when several tests share setup:

```ts
describe('ButtonRoot', () => {
  describe('when disabled', () => {})
})
```

Keep setup local to the smallest useful `describe`.

Use scoped, typed `let` bindings for shared setup values, and assign them in `beforeEach` / `afterEach`:

```ts
describe('when disabled', () => {
  let onClick: Mock

  beforeEach(() => {
    onClick = vi.fn()
  })
})
```

Do not create isolated helper functions just to hide setup. Prefer nested suites, local `let` bindings, and inline render calls.

## Queries

Prefer queries in this order:

1. `getByRole`.
2. `getByText`.
3. Other accessible queries such as label, placeholder, or display value when they match user behavior.
4. `getByTestId` only when there is no meaningful accessible query.

Use `screen` as the default query surface after `render`.

Use `within(...)` when querying inside a specific region or component part.

Avoid `container.querySelector(...)` unless the spec requires asserting a structural or visual contract that cannot be reached through Testing Library queries.

## Assertions

Prefer observable public contracts:

- visible text
- roles and accessible names
- focus
- disabled state
- pressed, selected, checked, expanded, invalid, or busy state
- callback calls and payloads
- public `aria-*` attributes
- public `data-*` attributes

Use Testing Library queries and `@testing-library/jest-dom` matchers:

```ts
const button = screen.getByRole('button', { name: 'Save' })

expect(button).toHaveFocus()
expect(button).toBeDisabled()
expect(button).toHaveAttribute('aria-disabled', 'true')
expect(button).toHaveAttribute('aria-pressed', 'true')
expect(button).toHaveAttribute('data-pressed')
```

Assert accessible names through queries such as `getByRole('button', { name: 'Save' })` instead of DOM matchers.

Do not assert private implementation details, private state, or exact DOM shape unless the component spec names that shape as public API.

Do not use snapshots for design-system component behavior.

Public spec-derived tests must stay implementation-neutral. They should not assert Tailwind utility names, internal `data-slot` values, private wrapper elements, CVA class output, or exact class strings when the spec only names a product behavior or an existing design-system pattern.

When a user-centric use case depends on a named visual pattern, assert its public contract when testable and leave detailed rendered verification to `ds-qa`.

## Base UI Data Attributes

When testing a Base UI wrapper, read the relevant Base UI component docs from `$design-system-base-ui` local snapshot (`references/base-ui-1.6/index.md`) before asserting data attributes.

Reproduce Base UI public state attributes when Powercoach UI wraps the primitive, for example `data-disabled`, `data-open`, `data-closed`, `data-pressed`, `data-selected`, or component-specific attributes documented by Base UI.

Only assert a `data-*` attribute when it is part of the Base UI or Powercoach UI public contract.

## Animation Tests

Cover the observable motion contract, not merely the trigger control. Read the
local Base UI animation handbook for Base UI lifecycle and
[motion-react.md](motion-react.md) for the approved animation engine.

For a consuming component, assert only its documented `data-motion`, public
state, and callback contract. Do not duplicate the named animation family's
lifecycle tests.

For a reusable animation family, assert the applicable public lifecycle:

- `data-motion` and documented state or lifecycle attributes;
- mounted, unmounted, or kept-mounted behavior;
- render-override state forwarding when exposed by Base UI;
- required engine wiring, using typed mocks when the approved spec names
  `Motion`;
- public CSS variables or animated property names only when the spec names
  them.

Accept CSS, Tailwind, or keyframes as the engine only when the approved spec
names `CSS`. Accept `motion/react` only when the approved spec names `Motion`.
Do not infer effects from Base UI, CSS, Tailwind, or Motion examples. Avoid
private DOM, Tailwind, and class assertions.

Exact geometry, clipping, pixel position, visual feel, and timing remain
rendered QA responsibilities unless the spec exposes a stable public surface
that unit tests can assert.

## Interactions

Use realistic user-level events where the local test stack supports them.

If the package does not include `@testing-library/user-event`, use Testing Library event helpers sparingly and keep the assertion focused on public behavior.

Use `vi.fn()` for callbacks.

Use fake timers only when testing delayed animation or timeout behavior, and restore timers in `afterEach`.

## Use Case Mapping

Use one `it(...)` per observable behavior.

When the behavior comes from a component spec use case, preserve the use case ID in the test name:

```ts
it('UC-003 - does not call onClick while disabled', () => {})
```

If an initial-spec use case cannot be tested meaningfully in Vitest/Testing Library, leave its rendered verification to `ds-qa`. If a QA finding cannot become a useful public test, preserve the complete finding in `Untestable findings`.
