# Powercoach UI Contract

This is the shared authority contract for design-system delivery in `packages/ui`.

## Authority

Read these sources in order. They own separate contract domains; they are not
override layers:

1. The approved spec owns product purpose, public behavior, copy, states, examples, use cases, and motion.
2. This contract owns cross-component Powercoach UI rules.
3. `$design-system-base-ui` owns documented Base UI semantics, accessibility, keyboard behavior, state attributes, CSS variables, render overrides, and lifecycle behavior when the approved spec declares Base UI alignment.
4. The public `.test.tsx` file is the executable translation of the approved spec. It never overrides the spec or this contract.

A conflict exists only when two sources make incompatible claims inside their
owned domains. Omitted detail is not a conflict. If owned claims conflict,
return `Blocked`; do not choose a winner or weaken either contract.

## Toolchain

Use Yann's local machine toolchain for every `packages/ui` command and every
repository validator script:

```text
PATH="/Users/yann/.nvm/versions/node/v20.20.2/bin:$PATH"
```

Expected versions:

```text
node v20.20.2
pnpm 10.20.0
```

Do not use Codex bundled or cached runtimes for `node` or `pnpm`, including the
Codex cached `pnpm` binary. When an instruction says to run `node` or `pnpm`,
either prepend the PATH above in the same command or call the binaries from
`/Users/yann/.nvm/versions/node/v20.20.2/bin` directly. If that toolchain is
unavailable, return the shared `Blocked` artifact instead of switching runtime.

## Global Rules

- Delivery role artifacts are plain text control messages. Do not include
  backticks anywhere in returned artifacts, including paths, IDs, field values,
  code identifiers, prose, finding text, questions, or blocker text. Markdown is
  allowed inside spec files and source files, not inside delivery artifacts.
- `ds-delivery` is the only role allowed to route work between delivery roles.
  Every other role is isolated: do not open, create, resume, message, interrupt,
  or otherwise interact with subagents, sibling agents, Codex threads, the
  parent/root thread, or another delivery role. Do not invoke another
  design-system skill as a worker. If another role needs to act, return the
  role's normal artifact or the shared `Blocked` artifact and let
  `ds-delivery` route it.
- Public specs start with frontmatter containing only `revision` and `date`.
  `revision` is a positive integer and `date` uses `YYYY-MM-DD`.
- Every approved spec creation or public-contract change produces one
  `Spec Revision Ticket` whose `SR-###` ID matches the target revision. Carry
  that ticket verbatim in every downstream delivery artifact. `SR-*` is revision
  scope local to its spec, not a correction finding, and must not appear in
  `Addresses`. In linked batches, the unique ticket identity is the spec path
  plus the local `SR-*`.
- A `Linked SR Batch` may group several `Spec Revision Ticket` blocks only when
  the PM/user or `ds-delivery` explicitly authorizes those tickets to be worked
  atomically because they are technically dependent. The batch never merges,
  renumbers, or rewrites tickets. Equal raw `SR-*` IDs are allowed across
  different spec paths. Each downstream role still returns one normal artifact
  per ticket identity, carrying that artifact's matching ticket verbatim.
- When a PM intent or directed PM update contains local image or video paths
  used to visualize a bug, reference, or regression, `ds-delivery` owns an
  active `PM Visual Assets` block. The block is a delivery artifact, not public
  documentation:

```text
PM Visual Assets
- /absolute/or/verbatim/path/to/asset
- /another/path/to/asset
```

  Copy every asset path exactly as provided by the PM/user, without markdown,
  quotes, or backticks. Carry the complete `PM Visual Assets` block verbatim in
  every role prompt and every returned role artifact until delivery ends or the
  PM/user withdraws it. Put the block after the main artifact fields and before
  the `Spec Revision Ticket` when a ticket exists.
- Every role that receives `PM Visual Assets` must inspect every listed asset
  after identifying the active scope and before returning questions, advice,
  tests, implementation, review, QA, or blockers. For images, inspect the image
  directly. For videos, prefer frame-by-frame or sampled-frame analysis with
  tools such as `ffmpeg`/`ffprobe` when the issue depends on motion, timing, or
  visual progression. If an asset cannot be opened or inspected factually,
  return the shared `Blocked` artifact instead of ignoring it.
- `PM Visual Assets` are evidence. They can clarify what the PM/user meant, but
  they do not authorize new product behavior outside the approved spec, a
  verbatim PM answer, this shared contract, or imported Base UI semantics.
- Coss is legacy input, not a compatibility target.
- Powercoach state APIs follow the approved spec. When the approved spec
  requests uncontrolled usage and the wrapped Base UI primitive documents the
  matching uncontrolled API, expose the Base UI controlled and uncontrolled
  pairs using Base UI names and semantics. Do not invent custom uncontrolled
  APIs.
- Powercoach UI uses square geometry. Do not introduce radius tokens or `rounded-*` classes.
- Public component and reusable animation family names and lifecycle files use PascalCase.
- A component with one public part uses the component name directly in its
  public API, examples, tests, stories, and implementation export. Do not
  introduce `.Root` or `<Name>Root` for single-part components. Reserve `Root`
  only for components whose public anatomy has at least two parts.
- Animation engine is a public contract. When a PM intent creates or changes
  animation behavior, the approved spec must name the PM-specified engine:
  `CSS` or `Motion`. Do not infer, substitute, or switch engines.
- Named reusable animation families end with `Animation`, live under `src/animations`, expose their documented `data-motion` contract, and use the engine named by their approved spec.
- Powercoach UI design-system delivery does not target SSR, server rendering,
  hydration, pre-hydration, or server/client mismatch behavior. Do not create
  specs, revision tickets, `UC-*`, `EX-*`, public tests, stories, QA checks, or
  implementation safeguards for those topics. If Base UI documentation mentions
  them, treat that material as out of scope unless the PM/user explicitly
  changes this global rule.
- When the PM intent or approved spec says to use an existing Powercoach UI
  component, consume that component through its public API as an application
  would. Do not recreate it by copying its CSS, tokens, markup, variants,
  behavior, or internals. If the requested composition is impossible or
  conflicts with another contract, return `Blocked` instead of working around it.
- A component that consumes a named reusable animation composes that animation instead of reimplementing it.
- Cross-family coordination must go through documented public APIs, documented
  public `data-*` attributes, documented public CSS variables, or Base UI
  contracts. Do not create private protocols between families through
  undocumented attributes, class names, selectors, DOM shape, CSS variables,
  refs, magic values, or tests. If a family needs a public surface that does not
  exist, return `Blocked` or route the required specification question instead
  of smuggling an internal contract.
- Every documented `EX-*` example has a consumer-facing Storybook story with the controls and visible probes needed to inspect it.
- Do not add user-observable behavior absent from the approved spec or a global rule in this contract.
- The mandatory category rules in [visual-language.md](../design-system-component/references/visual-language.md) are global rules. Apply and QA them only for the categories that file explicitly names.
- Public examples and tests must use an import path that the package actually exposes.

## Shared Blocker

Every delivery role uses this shape:

```text
Blocked
- Role: <delivery role or inspection>
- Target: <component, animation, manager, or storybook>
- Reason: <one precise reason>
- Resume with: <information, correction, or capability needed>
```
