# Power Monorepo

Monorepo Fastify API powered by TypeScript and pnpm, orchestrated with Turborepo for scalable builds and developer workflows.

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Topics:** monorepo · turborepo · fastify · typescript · pnpm

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
