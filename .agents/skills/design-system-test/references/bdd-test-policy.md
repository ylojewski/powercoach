# BDD Test Policy

Use Vitest and Testing Library for public component and reusable animation unit tests.

## Placement

```text
docs/design-system/components/<ComponentName>.md
src/components/<ComponentName>/<ComponentName>.test.tsx

docs/design-system/animations/<AnimationName>.md
src/animations/<AnimationName>/<AnimationName>.test.tsx
```

Import through the neighboring public family assembly:

```ts
import { Button } from './Button'
```

Do not import private leaves in public tests.

## Assertions

Prefer roles, accessible names, visible text, focus, public ARIA or data attributes, callback calls, and exported API shape.

Do not assert private state, internal slots, incidental DOM shape, or exact class strings unless the approved contract makes that surface public.

Do not create public tests for SSR, server rendering, hydration,
pre-hydration, or server/client mismatch behavior. If a spec still contains
such a `UC-*` or `EX-*`, return `Blocked` instead of translating it.

For named reusable animations, test the public lifecycle and animation-engine
contract described by the spec. Test `motion/react` wiring only when the spec
names `Motion`. For `CSS`, test public attributes, state, callbacks, CSS
variables, or animated property names only when the spec makes them public.
Test consuming components only for their public animation contract; do not
duplicate the animation family's lifecycle tests.

One test should prove one observable behavior. Preserve source IDs:

```ts
it('UC-001 / EX-001 - renders the documented consumer contract', () => {})
```

Initial contracts that cannot be meaningfully tested in Vitest remain rendered QA responsibilities. Correction findings that cannot become tests go verbatim into `Untestable findings`.
