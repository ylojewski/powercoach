# @powercoach/util-test

Vitest helper utilities shared across Powercoach packages.

## What it includes

- `stubEnv` – stub multiple environment variables in one call using `vi.stubEnv`.
- `expectZodParseToThrow` – assert that a Zod schema rejects invalid input and capture the resulting error.
- `spyOnConsole` – silence and assert console methods by spying on specific functions.

## Usage

```ts
import { expectZodParseToThrow, spyOnConsole, stubEnv } from '@powercoach/util-test'

const error = expectZodParseToThrow(schema, { invalid: true })
spyOnConsole(['error'])
stubEnv({ NODE_ENV: 'test' })
```

Utilities are designed to be small building blocks that keep tests focused on behavior instead of setup noise.

## React helpers

React test helpers are available from the dedicated `@powercoach/util-test/react` subpath so
Node-only test packages do not need to load React test tooling through the main entrypoint.

```tsx
import { renderWithRouter } from '@powercoach/util-test/react'

renderWithRouter(<Layout />, {
  initialEntry: '/reviews',
  pathnameProbe: true
})
```
