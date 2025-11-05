# @powercoach/api

State-of-the-art Fastify API powered by Turborepo.

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
- `pnpm start` – run the compiled server from `dist/`.
- `pnpm test` – execute the Vitest end-to-end tests.
- `pnpm lint` – lint the codebase with ESLint.
- `pnpm format` – format the sources using Prettier.

## Environment variables

Copy `.env.example` to `.env` and adjust the values if needed.

| Variable    | Description                            | Default   |
| ----------- | -------------------------------------- | --------- |
| `HOST`      | Hostname/IP address to bind the server | `0.0.0.0` |
| `PORT`      | Port for the HTTP server               | `3000`    |
| `LOG_LEVEL` | Pino log level                         | `info`    |

## API surface

The API exposes a single health check endpoint:

- `GET /v1/health` – returns `{ ok: true, uptime: number }`

To add a new module, duplicate the structure in `src/modules/health` and register the module in `src/app/buildApp.ts` with the desired route prefix.

## Testing strategy

Tests use Fastify's `inject` API for fast, hermetic end-to-end coverage without opening network sockets. Each test spins up an in-memory Fastify instance
