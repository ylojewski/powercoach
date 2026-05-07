# @powercoach/manager

React + Vite frontend for the Powercoach platform manager.

## Prerequisites

- Node.js 20+
- pnpm 9+

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
- `pnpm typecheck` – run TypeScript type checks for source and tests.
- `pnpm test` – execute Vitest with coverage.

## Architecture notes

- Entry point: `src/main.tsx` renders the core router with the Redux store.
- Core shell: `src/core` owns routing, layout, startup loading and store wiring.
- Modules: `src/modules` owns manager business areas such as roster, settings, exercises and management panels.
- Shared primitives: `src/shared` owns generic hooks, types and utilities that do not depend on manager business modules.
- API usage: `src/api` owns the RTK Query base API and generated endpoints.
- Vite config: `vite.config.js` wires shared config from `@powercoach/config/vite` and applies the API proxy.
