# Manager Dev Policy

## Architecture

- Keep `src/app` as the global shell/composition layer.
- Keep shared infrastructure in `src/core`.
- Keep feature work inside `src/modules/<domain>`.
- Create shared utilities only when at least two manager domains need them.
- Keep URL state in routing. Do not mirror route truth into Redux unless it is a derived bridge required by existing architecture.
- Use RTK Query for remote data and Redux Toolkit slices for shared client state.

## UI

Consume `@powercoach/ui` through public exports only. Do not read or rely on UI internals as implementation contract.

If a public UI capability is missing, return `Blocked` with a precise reason. Do not create local class-name, DOM, selector, data-attribute, or CSS-variable protocols to compensate.

## Code Style

- Use existing manager patterns before introducing abstractions.
- Keep imports first.
- Define types/interfaces only for exported inputs/outputs or meaningful local state.
- Use constants only when a value is reused or improves a named contract.
- Prefer straightforward React components and hooks over indirection.
- Avoid isolated helper functions inside components unless they are event handlers or necessary for readability.
- If a util is used by at least two places, place it in the relevant `utils` folder.

## Checks

From the current manager working directory, run the relevant checks before returning:

- `pnpm lint`
- `pnpm format`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

If unrelated existing failures occur outside the active feature scope, report them in the final prose but do not change unrelated code.

## Result

Return:

```text
Implementation Ready
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- Test: <manager-workdir>/<path>/<Feature>.test.tsx
- Target: <manager-workdir>/<implemented path or module>
- Addresses: <none or CR-*/QA-*/SQ-* IDs>

Spec Revision Ticket
...
```

Do not include backticks in delivery artifacts.
