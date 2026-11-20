# @powercoach/manager

Active React + Vite application for the Powercoach manager, built from the revamp.
This is the only manager included in the main workspace, Turbo, and CI/CD.

## Prerequisites

- Node.js 26 (see the root `.nvmrc`)
- pnpm 10.20.0

## Environment variables

Copy `.env.example` to `.env` and set the backend origin:

| Variable            | Description                         |
| ------------------- | ----------------------------------- |
| `VITE_API_BASE_URL` | Base URL for the API proxy in Vite. |

During local development the Vite dev server proxies `/api` requests to `VITE_API_BASE_URL`, removing the `/api` prefix.

## Scripts

- `pnpm dev` – start the Vite dev server.
- `pnpm build` – create a production build and prepare Vercel output.
- `pnpm preview` – preview the production build locally.
- `pnpm lint` – run ESLint.
- `pnpm format` – check formatting with Prettier.
- `pnpm store:generate` – regenerate the RTK Query API and pending-query hooks from OpenAPI.
- `pnpm typecheck` – run TypeScript type checks for source and tests.
- `pnpm test` – execute Vitest with coverage.

## Architecture notes

- `src/main.tsx` wires React Strict Mode, the system theme, the Redux provider and the router.
- `src/app` owns application assembly, `AppNavigation`, the mounted navigation state, `SystemTheme` and store creation.
- `src/core` owns the open `Navigation` contract, route and drawer mounting, generated API exports, the base API slice, reducer and typed store hooks.
- Each feature module augments `Navigation` and declares its own routes; `src/modules/home` contributes `HomeNavigation`, renders `Hello world` and exposes the route-mounted `/drawer` example.
- `scripts/store/generate.ts` derives the RTK Query client and `usePending…` hooks from the API OpenAPI contract.
