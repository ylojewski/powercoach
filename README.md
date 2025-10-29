# Power Monorepo

This repository is managed with [Turborepo](https://turbo.build/). The root package declares the applications under `apps/` and
shared packages under `packages/` as workspaces, enabling incremental builds and caching across the monorepo.

## Projects

- [`@power/api`](./apps/api) – Fastify HTTP API with health-check endpoint and opinionated architecture.

## Getting started

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Start development tasks with Turbo:
   ```sh
   pnpm dev
   ```

Other helpful commands:

- `pnpm build` – run the build pipeline for all packages.
- `pnpm lint` – run lint tasks.
- `pnpm test` – run tests.

Turbo caches the results of tasks to speed up subsequent runs. The cache directory `.turbo/` is ignored from version control.
