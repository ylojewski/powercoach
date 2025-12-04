# @powercoach/manager

React + Vite frontend for the Powercoach platform. The app currently displays API health status and is the entry point for future management tooling.

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

- Entry point: `src/main.tsx` renders `<App />` into `index.html`.
- API usage: `src/App.tsx` fetches `/api/v1/health` to render backend status.
- Vite config: `vite.config.js` wires shared config from `@powercoach/config/vite` and applies the API proxy.
