# Powercoach Monorepo

Turborepo-powered workspace that hosts the Powercoach backend, frontend manager, and shared tooling packages. Everything runs on Node 20, pnpm, and TypeScript with reproducible developer workflows.

[![CI](https://github.com/ylojewski/powercoach/actions/workflows/ci.yml/badge.svg)](https://github.com/ylojewski/powercoach/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Topics:** monorepo · turborepo · fastify · react · typescript · pnpm

This repository is managed with [Turborepo](https://turbo.build/). The root package declares the applications under `apps/` and shared packages under `packages/` as workspaces, enabling incremental builds and caching across the monorepo.

## Workspace layout

### Applications

- [`@powercoach/api`](./apps/api) – Fastify HTTP API that exposes health checks and future service endpoints.
- [`@powercoach/manager`](./apps/manager) – React + Vite frontend that consumes the API (currently displaying backend health).

### Shared packages

- [`@powercoach/config`](./packages/config) – Centralized ESLint, Prettier, tsconfig, Vite, Vitest, Drizzle, lint-staged, commitlint, and tsup configuration.
- [`@powercoach/db`](./packages/db) – Drizzle ORM schema, migrations, seeds, and typed Postgres client utilities.
- [`@powercoach/util-env`](./packages/util-env) – Zod-powered environment loader with dotenv support and caching helpers.
- [`@powercoach/util-test`](./packages/util-test) – Vitest utilities for spying on console output, stubbing environment variables, and validating Zod schemas.

## Getting started

1. Install dependencies:
   ```sh
   pnpm install --frozen-lockfile
   ```
2. Start development tasks with Turbo:
   ```sh
   pnpm dev
   ```

Other helpful commands:

- `pnpm build` – run the build pipeline for all packages.
- `pnpm lint` – run lint tasks.
- `pnpm test` – run tests.
- `pnpm pre-commit` – run the full formatting, linting, typing, testing, and build chain expected before commits.

Turbo caches the results of tasks to speed up subsequent runs. The cache directory `.turbo/` is ignored from version control.
