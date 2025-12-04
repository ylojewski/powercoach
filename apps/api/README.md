# @powercoach/api

Fastify HTTP API that powers Powercoach services. The server is written in TypeScript, bundled with tsup, and exposed through Turborepo tasks.

## Prerequisites

- Node.js 20+
- pnpm 9+

## Installation

```sh
pnpm install
```

## Available scripts

- `pnpm dev` – start the Fastify server with live reload via `tsx`.
- `pnpm build` – build the API into the `dist/` directory using `tsup`.
- `pnpm test` – execute the Vitest end-to-end tests.
- `pnpm lint` – lint the codebase with ESLint.
- `pnpm format` – format the sources using Prettier.
- `pnpm typecheck` – check types with TypeScript.

## Environment variables

Copy `.env.example` to `.env` and adjust the values if needed.

| Variable    | Description                            |
| ----------- | -------------------------------------- |
| `HOST`      | Hostname/IP address to bind the server |
| `LOG_LEVEL` | Pino log level                         |
| `NODE_ENV`  | NodeJS environment                     |
| `PORT`      | Port for the HTTP server               |

## API surface

Initial endpoints focus on service readiness:

- `GET /v1/health` – returns `{ ok: true, uptime: number }` via the health module in `src/modules/health`.

New modules can mirror the `src/modules/health` structure and be registered in `src/app/buildApp.ts` with their own route prefix. Shared utilities live under `src/app`.

## Testing strategy

Tests use Fastify's `inject` API for fast, hermetic end-to-end coverage without opening network sockets. Each test spins up an in-memory Fastify instance to validate handlers and plugins without side effects.
