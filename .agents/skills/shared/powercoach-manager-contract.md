# Powercoach Manager Contract

Shared authority contract for manager delivery.

## Authority

Read these sources in order. They own separate domains:

1. The approved manager spec owns product behavior, copy, routes, states, workflows, examples, and use cases.
2. This contract owns cross-feature manager architecture, scope, tooling, and delivery rules.
3. `$powercoach-ui` owns the public consumer contract of `@powercoach/ui`.
4. The public manager tests are the executable translation of the approved spec. They never override the spec or this contract.

If owned claims conflict, return `Blocked`. Do not choose a winner or weaken either contract.

## Scope

- The product is `manager`.
- The current working directory is `apps/manager-revamp`.
- Do not call the product `manager-revamp` in role artifacts, specs, findings, or PM-facing text.
- Do not edit `apps/manager` unless the PM/user explicitly asks. The future rename from `apps/manager-revamp` to `apps/manager` should require only changing this working-directory rule.
- The manager is a SPA. Do not create specs, tests, implementation safeguards, review findings, or QA checks for SSR, hydration, pre-hydration, or server/client mismatch behavior.

## Toolchain

Use Yann's local machine toolchain for every manager command and every repository validator script:

```text
PATH="/Users/yann/.nvm/versions/node/v20.20.2/bin:$PATH"
```

Expected versions:

```text
node v20.20.2
pnpm 10.20.0
```

Do not use Codex bundled or cached runtimes for `node` or `pnpm`. If that toolchain is unavailable, return `Blocked`.

## Folder Roles

- `apps/manager-revamp/src/app`: global composition, router, layout, sidebar, panels, bootstrap, and app store.
- `apps/manager-revamp/src/core`: reusable infrastructure, generated API, RTK Query, root store, routed drawers, hooks, utils, and shared types.
- `apps/manager-revamp/src/modules/<domain>`: product vertical slices. Keep domain components, hooks, store, constants, types, and utils inside the module unless they are genuinely shared.
- `apps/manager-revamp/src/styles`: manager-only global styles.
- `apps/manager-revamp/src/assets`: manager-only assets.
- `apps/manager-revamp/test`: manager test setup and utilities.
- `apps/manager-revamp/scripts/store`: OpenAPI/RTK Query store generation.
- `apps/manager-revamp/scripts/vercel`: deployment artifact generation.
- `apps/manager-revamp/docs/intents`: exported manager PM intents.
- `apps/manager-revamp/docs/specs`: approved manager product specs.
- `apps/manager-revamp/.artifacts/manager`: temporary delivery and rendered-QA evidence.

## Architecture

- The URL is the canonical product context for coach/athlete scope, active route, active panels, and drawers.
- Redux and RTK Query own API cache and shared client state, not navigation.
- Modules are vertical slices. `app` composes modules; modules do not own the global shell.
- Drawers are overlay routes using background location.
- The Exercise workflow is a real product state machine. Other domains may be placeholders until their specs make them real.
- When evolving toward real pages plus Rails, distinguish business route from presentation: React Router owns the page; Powercoach UI owns only transition and presentation components.

## UI Consumption

The manager is always a strict consumer of `@powercoach/ui`.

- Use Powercoach UI components through their public API as an app would.
- Do not copy UI CSS, tokens, markup, variants, data attributes, DOM shape, selectors, refs, behavior, or internals.
- Do not create local hacks for missing UI behavior.
- If a needed UI prop, variant, animation, interaction, component, token, data attribute, or public example is missing, the producing role returns the appropriate manager artifact. `manager-po` turns the gap into `Design System Intent Required`.
- Only `manager-delivery` may route that DS intent to `design-system-delivery`. Other roles never launch DS work.

## Global Delivery Rules

- Delivery role artifacts are plain text control messages. Do not include backticks anywhere in returned artifacts.
- `manager-delivery` is the only manager router. Every other role is isolated and must not open, create, resume, message, interrupt, or otherwise interact with subagents, sibling agents, Codex threads, the parent/root thread, or another delivery role.
- Every approved spec creation or public-contract change produces one `Spec Revision Ticket`. Carry it verbatim in downstream delivery artifacts.
- PM visual assets are evidence. Carry the active `PM Visual Assets` block verbatim in every role prompt and role artifact until delivery ends or the PM/user withdraws it.
- Every role that receives `PM Visual Assets` must inspect every listed asset after identifying active scope. For videos, prefer frame-by-frame or sampled-frame analysis when motion or timing matters.
- Do not add user-observable behavior absent from the approved spec, a PM answer, this contract, or the public UI contract.
- If implementation would require a UI hack, a manager architecture violation, or a spec change outside the current ticket, return `Blocked`.

## Checks

Run manager commands from `apps/manager-revamp`.

- `pnpm lint`
- `pnpm format`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

TDD may intentionally leave new tests red. Dev and review must distinguish expected red TDD tests from unrelated failures.

## Shared Blocker

Every manager delivery role uses this shape:

```text
Blocked
- Role: <manager role or inspection>
- Target: <feature, route, module, or manager>
- Reason: <one precise reason>
- Resume with: <information, correction, or capability needed>
```
