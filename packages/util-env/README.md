# @powercoach/util-env

Environment loading utilities shared across the Powercoach monorepo. Built with Zod and dotenv for consistent validation and caching behavior between packages.

## Core concepts

- `envSchema` – base Zod schema requiring `NODE_ENV` and re-exported `NodeEnv` enum.
- `createEnvLoader` – factory that builds cached loaders and exposes `resetCachedEnv` for tests.
- `parseEnv` – helper to validate arbitrary `process.env` values and format Zod errors.

## Usage

```ts
import { createEnvLoader, envSchema } from '@powercoach/util-env'

const { loadEnv, resetCachedEnv } = createEnvLoader({
  schema: envSchema,
  format: (error) => `Invalid environment: ${error.message}`
})

const env = loadEnv()
// env.NODE_ENV is strongly typed
```

Pair the base schema with package-specific extensions (see `@powercoach/db`) to validate additional variables while preserving the shared caching behavior.
