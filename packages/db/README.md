# @powercoach/db

Database toolkit for Powercoach built on Drizzle ORM and PostgreSQL. It ships schema definitions, migrations, seeds, and helpers for creating typed database clients.

## Features

- Zod-validated environment loading via `@powercoach/util-env` (`DATABASE_URL` required).
- Drizzle schema definitions under `src/schema` with a metadata table.
- Local development Docker Compose stack for PostgreSQL.
- CLI scripts for generating and running migrations plus seeding.
- Helper `createClient` to connect with `pg` and wrap the client with Drizzle.

## Scripts

- `pnpm db:up` – start the local PostgreSQL container.
- `pnpm db:down` – stop and clean local containers and volumes.
- `pnpm db:generate` – generate SQL migrations from the Drizzle schema.
- `pnpm db:migrate` – apply migrations to the configured database.
- `pnpm db:seed` – seed the database with sample data.
- `pnpm db:reset` – full cycle: down, up, migrate, and seed.
- `pnpm test` – run Vitest suite with coverage.
- `pnpm build` – bundle the package with tsup.

## Usage

```ts
import { createClient } from '@powercoach/db'

async function example() {
  const { db, pg } = await createClient()
  const result = await db.select().from(/* tables here */)
  await pg.end()
}
```

Ensure `DATABASE_URL` is defined before using the package. Use the helper `resetCachedEnv` from `src/core/env` when tests mutate environment variables.
