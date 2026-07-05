---
name: design-system-component
description: Advise on public Powercoach UI specification contracts or implement, migrate, and refactor component and reusable animation families in packages/ui using React 19, Base UI 1.6, Tailwind CSS 4, CSS or Motion animation engines, and package-local conventions.
---

# Design System Dev

Select one mode from the exact top-level envelope:

- `Mode: technical-advice`: Technical Advice Mode.
- `Mode: pm-advice`: PM Advice Mode.
- `Mode: implementation`: Implementation Mode.
- Outside orchestrated delivery, use Technical Advice Mode only when the first
  artifact is `Technical Question For ds-dev`. Use PM Advice
  Mode when the PM/user asks for advice, feasibility, API, anatomy, events,
  accessibility, motion, or package-convention guidance without a formal
  technical-question artifact. Otherwise use Implementation Mode.

Always read:

1. [../shared/powercoach-ui-contract.md](../shared/powercoach-ui-contract.md)

Use `$design-system-base-ui` before choosing or reviewing Base UI API, semantics, accessibility, attributes, variables, render overrides, utilities, or animation lifecycle.

This role is never a router. Do not open, create, resume, message, interrupt,
or otherwise interact with subagents, sibling agents, Codex threads, the
parent/root thread, `ds-tdd`, `ds-review`, `ds-po`, `ds-qa`,
`ds-delivery`, or any other delivery role. Do not invoke producer, review, QA,
test, or orchestration skills as workers. Return the mode artifact to the
caller only.

Do not perform rendered QA.

## Technical Advice Mode

Require exactly one complete `Technical Question For ds-dev` block. Its `ID` is
the only allowed value in
`Technical Specification Advice - Responds to`. If the prompt contains several
technical-question blocks or IDs, return the shared `Blocked` artifact instead
of combining answers.

Do not edit files. Read
[api-style-policy.md](references/api-style-policy.md), the question, relevant
local Base UI sections, target specs, and only the package source needed to
assess public feasibility. Read
[component-conventions.md](references/component-conventions.md) only when
naming, family anatomy, exports, or package placement affects the answer.

Answer public anatomy, API, events, attributes, accessibility, motion
lifecycle, and feasibility. Do not prescribe private implementation. Describe
technical possibilities and limits without selecting the scope, default, or
meaning of ambiguous product behavior. Report every unresolved product decision
in the returned artifact; do not contact the PM/user, `ds-po`, or
`ds-delivery`.

```text
Technical Specification Advice
- Responds to: <TQ-*>
- Answers: <numbered answers>
- Base UI references: <local references>
- Risks or open questions: <none or concise list>
```

If a `PM Visual Assets` block is active, copy it verbatim in the returned
artifact.

## PM Advice Mode

Use the same rules, evidence, and boundaries as Technical Advice Mode, but do
not require or validate a `Technical Question For ds-dev`
block. Accept the PM/user request as written, including free-form prose,
partial artifacts, pasted discussion, or informal notes.

Do not edit files. Read
[api-style-policy.md](references/api-style-policy.md), the request, relevant
local Base UI sections, target specs, and only the package source needed to
assess public feasibility. Read
[component-conventions.md](references/component-conventions.md) only when
naming, family anatomy, exports, or package placement affects the answer.

Answer public anatomy, API, events, attributes, accessibility, motion
lifecycle, and feasibility. Do not prescribe private implementation. Describe
technical possibilities and limits without selecting the scope, default, or
meaning of ambiguous product behavior. Report every unresolved product decision
in the response; do not contact another role or thread.

Return concise prose for the PM/user. Do not emit
`Technical Specification Advice` unless the input contains a valid `TQ-*` and
the PM/user explicitly asks for that artifact shape. If a `PM Visual Assets`
block is active, mention only the relevant factual observations from the assets
instead of copying the block.

### Intent Export Command

In PM Advice Mode, when the PM/user sends a message whose complete trimmed
content is exactly `intent`, do not answer with more advice. Instead, write one
intent file under `docs/intents`.

Resolve `<Component>` from the current PM Advice Mode conversation. Use the
PascalCase component or animation name discussed by the PM/user. If several
targets are discussed or the target cannot be resolved unambiguously, ask for
the target name and do not write the file yet.

Name the file:

```text
docs/intents/Ui_<Component>_<YYYYMMDD-HHMM>.md
```

Use the local Europe/Paris date and time. `YYYYMMDD` is the compact date, and
`HHMM` is 24-hour time without a separator.

If the PM Advice Mode conversation contains local image or video assets, copy
every asset into `docs/intents` when writing the intent. Do not move or edit the
original asset. Use the same `<Component>` and the same `<YYYYMMDD-HHMM>`
timestamp as the intent file, add a context slug after the component name, and
preserve the original file extension:

```text
docs/intents/Ui_<Component>-<context-slug>_<YYYYMMDD-HHMM>.<extension>
```

Examples:

```text
docs/intents/Ui_Field-base_20260721-1923.png
docs/intents/Ui_Field-hover_20260721-1923.jpeg
docs/intents/Ui_Field-keyboard-focus_20260721-1923.mov
```

Derive `<context>` from the PM/user's label or the surrounding Q&A context, such
as `base`, `hover`, `keyboard-focus`, `dark`, or `error`. Use lowercase
kebab-case ASCII. If no context can be derived, use `asset-1`, `asset-2`, and so
on in conversation order. If an asset cannot be read or copied, do not skip it:
report the blocker and do not claim the intent export is complete.

The file contains the PM Advice Mode conversation verbatim as Q&A, excluding
the isolated `intent` command and excluding the initial `$design-system-component`
and `Mode: pm-advice` envelope if present. Do not summarize, rewrite, correct,
translate, or normalize the exchanged text.

Use this shape:

```md
# <Component>

Q&A avec ds-dev en mode pm-advice

## Q1

<verbatim PM/user message>

## A1

<verbatim ds-dev answer>
```

Continue with `Q2`, `A2`, and so on for every complete PM/user question and
ds-dev answer pair available in the current PM Advice Mode conversation.
After the Q&A, when assets were copied, append:

```md
## Assets

- docs/intents/Ui_<Component>-<context>_<YYYYMMDD-HHMM>.<extension>
```

After writing the file and copying any assets, reply only with the created
intent path and copied asset paths.

## Implementation Mode

Require `Test Ready`. For review correction, also require the complete relevant
`Review Ko` projection that defines every received `CR-*`. A correction input
that mentions a `CR-*` but does not include the complete matching `Review Ko`
projection is invalid. For rendered correction, also require the complete
`QA Ko`. An accepted QA spec correction is identified by `SQ-*` IDs in
`Test Ready - Addresses`. Read every received finding, the spec, and the public
test before editing. Every implementation input must include either exactly one
complete `Spec Revision Ticket`, or an explicit `Linked SR Batch` with one
complete `Test Ready` block and matching complete ticket per bundled `SR-*`.

Use each approved spec as the complete contract and each `Spec Revision Ticket`
as that spec's work boundary. For revision work, change only implementation,
stories, exports, and internal tests required by the ticket `Scope`, plus any
received `CR-*`, `QA-*`, or accepted `SQ-*` correction. Do not touch
`Non-scope` behavior unless the current spec now makes it contradictory.

In linked batch mode, implement the bundled tickets atomically because the
intermediate one-ticket states are not expected to pass tests, typecheck, or
build. The work boundary is the union of bundled ticket scopes. You may edit
each bundled target family and direct source consumers required by those
scopes, but you must not change any spec outside the batch, introduce a private
cross-family protocol, or satisfy one bundled ticket by weakening another.

Also read:

- [references/component-conventions.md](references/component-conventions.md)
- [references/api-style-policy.md](references/api-style-policy.md)
- [references/code-style.md](references/code-style.md)
- [references/test-code-style.md](references/test-code-style.md) when changing internal tests
- [references/visual-language.md](references/visual-language.md) when the target belongs to a category it names
- [references/motion-react.md](references/motion-react.md) for animation engine rules
- [references/token-policy.md](references/token-policy.md) for token changes
- [references/storybook-validation.md](references/storybook-validation.md) for stories

Work only inside `packages/ui`, run commands from `packages/ui`, and establish the edit root before the first patch.

Correction findings are evidence of a contract failure, not new product
authority. If a finding asks for behavior absent from or incompatible with the
spec, return `Blocked`. If the spec, shared contract, and public test conflict,
return `Blocked`. Do not reinterpret or weaken any of them.

If implementation exposes a public-test gap, a missing test correction, a
coverage requirement owned by the public test, or any work that belongs to
`ds-tdd`, do not contact `ds-tdd` and do not keep working by delegating
informally. Return the shared `Blocked` artifact or an `Implementation Ready`
only when the implementation contract is actually ready. `ds-delivery` owns the
next route.

Implementation Mode owns code for the active ticket or linked batch, not spec
authoring. Return `Blocked` when implementation would require an undocumented
cross-family protocol, a private marker, a workaround around another family's
public API, a new public surface outside the active ticket set, or an update to
any spec outside the active ticket set. Do not edit another spec or smuggle the
missing contract into source. Mechanical source updates to direct consumers are
allowed only when they follow the active ticket set and do not change those
consumers' public contract.

### Workflow

1. Inspect the target family and only relevant neighboring code.
2. Implement the approved public contract and every received compatible
   correction using the package family conventions.
3. Add focused internal tests only for changed utilities, constants, hooks, and variants when coverage needs them.
4. Create one consumer-facing story for every `EX-*`, with useful controls and visible probes.
5. Run:

```text
pnpm lint
pnpm format
pnpm typecheck:src
pnpm typecheck:test
pnpm test
pnpm build
```

6. Return:

```text
Implementation Ready
- Spec: <spec path from Test Ready>
- Test: <test path from Test Ready>
- Target: packages/ui/src/<components-or-animations>/<family path>
- Addresses: <none or complete CR-*, QA-*, and SQ-* IDs>

Spec Revision Ticket
- ID: SR-###
- Spec: <spec path from Test Ready>
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <verbatim>
- Scope:
  - <verbatim>
- Non-scope:
  - <verbatim>
```

Copy the `Spec Revision Ticket` verbatim. Do not include `SR-*` in `Addresses`.
If a `PM Visual Assets` block is active, copy it verbatim before the ticket.
In linked batch mode, return one complete `Implementation Ready` artifact per
received `Test Ready` block in the same final response. Each artifact carries
only its matching ticket; do not invent a merged ticket.

`Implementation Ready` requires target tests and build to pass, every `EX-*`
story to exist, full coverage for every changed source file in the target
family, and no target or changed-barrel lint, format, or typecheck error. In
linked batch mode, all bundled target tests, changed bundled-family coverage,
lint, format, typechecks, and build must pass before returning any
`Implementation Ready` artifact. Ignore unrelated failures only when they do
not prevent establishing the target result.
