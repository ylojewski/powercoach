# Specification Authoring Policy

Author a public Powercoach UI contract in a Base UI-like documentation style.

## Evidence

1. Read the `$design-system-base-ui` index and only the component, handbook, or utility pages relevant to the target.
2. Read the target spec when updating it.
3. Read every named component or animation spec the target depends on.
4. Read one analogous Powercoach spec only when it resolves a concrete documentation-pattern question.
5. Read
   [visual-language.md](../../design-system-component/references/visual-language.md)
   only when the target belongs to a category it names.
6. Inspect similar consumed behavior through `$inspect-manager` only when the PM/user identifies it as a reference. Ask for the route when it is unknown.

Evidence confirms decisions; it does not create them.

## Decisions

- Every user-observable claim in the spec must trace to the PM intent, a verbatim
  PM answer, the shared contract, or semantics explicitly owned by Base UI.
  Evidence and analogous components never create product decisions.
- Ask the PM/user whenever a missing or ambiguous decision affects the public
  contract. Group related questions.
- If unspecified behavior can be omitted without choosing on the PM/user's behalf, omit it.
- Do not specify SSR, server rendering, hydration, pre-hydration, or
  server/client mismatch behavior. Do not create `UC-*` or `EX-*` for those
  topics, even when relevant Base UI documentation mentions them.
- A request to skip details, delegate them, follow a library, or handle them
  normally does not authorize choices outside the named authority. In
  particular, behavioral or accessibility authority does not define visual
  presentation unless its contract says so.
- When the PM/user says the target uses an existing Powercoach UI component,
  preserve that as a public composition requirement. Do not translate it into
  copied styles, copied markup, or a visual resemblance requirement. If the
  requested component composition is technically unclear, emit a `Technical
  Question For ds-dev` artifact and stop. `ds-delivery` owns
  the route to `ds-dev-advice`.
- When the PM/user requests uncontrolled usage for a Base UI-aligned stateful
  component, allow it only when Base UI documents the corresponding
  uncontrolled API. Document controlled and uncontrolled props with Base UI
  names and semantics. If the PM/user does not specify controlled or
  uncontrolled behavior for a stateful component, ask a Product Question instead
  of inferring.
- For public anatomy, API, events, attributes, accessibility mapping, motion
  lifecycle, and feasibility questions, emit a `Technical Question For ds-dev`
  artifact and stop. Do not contact `design-system-component` yourself.
- Keep product and technical questions separate.
- If the PM intent creates or changes animation behavior, it must explicitly
  name the animation engine as `CSS` or `Motion`. Otherwise return `Blocked`.
  Do not infer the engine, choose one from technical evidence, or ask a Product
  Question for the missing engine.
- Require an explicit PM/user `go` before writing the final spec.

## Spec Shape

Use this order:

````md
---
revision: 1
date: 2026-07-02
---

# Name

## Overview

## Anatomy

## Examples

### EX-001 - Consumer-facing example

Context: ...

Expected behavior: ...

Covers: UC-001

```tsx
...
```

## Root

### Props

### Events

### Data Attributes

### CSS Variables

## Accessibility

## Behavior

## Motion

## Use Cases

### UC-001 - User-centered behavior

Given ...
When ...
Then ...
````

Omit a part subsection when it is not public or not applicable. Every `UC-*` must be exercised by at least one `EX-*`.

Component specs and lifecycle files use the public PascalCase name. Reusable animation names end with `Animation`.

For component specs, `Root` is allowed only when the public anatomy has at
least two parts. If the component exposes a single public component, document
and use the component itself (`Button`, `Heading`, etc.), never
`Button.Root`/`Heading.Root`.

Write consumer documentation, not implementation instructions. Examples must use an import path exposed by `packages/ui/package.json`, and invisible results must have visible probes.

## Revision Metadata

The PM/user decides the public contract and gives the go/no-go. The author
computes revision metadata mechanically:

- New spec: `revision: 1`, `Spec Revision Ticket - ID: SR-001`, `From revision: none`, `To revision: 1`.
- Existing spec: read the current `revision`; the next approved public-contract
  change increments by exactly one.
- Existing specs without `revision`/`date` metadata are not update-ready. Return
  `Blocked` and ask for a baseline metadata pass instead of inventing an
  implicit revision.
- `date` is the PM/user approval date in `YYYY-MM-DD`.

Create one `Spec Revision Ticket` for every approved spec creation or
public-contract change. The ticket is not public documentation and does not go
inside the spec. It is a delivery artifact that scopes downstream work.

`Scope` bullets are downstream delivery directives, not authoring tasks. Write
each bullet as the public behavior, API, example, or use-case change that
`ds-tdd`, `ds-dev`, `ds-review`, and `ds-qa` must
understand. Prefer the exact approved `Planned behavior` wording. Do not start
scope bullets with writer verbs such as `Document`, `Update`, `Describe`,
`Mention`, `Write`, or `Revise`.

Each final `Scope` bullet must end with the spec lines changed for that exact
point:

```text
Spec changes: lines 120-148.
Spec changes: lines 120-148, 310-335.
```

Do not repeat the from/to revision numbers in a scope bullet; the ticket already
carries them. If one scope point changes several spec sections, put every line
range on that same bullet.

The ticket shape is:

```text
Spec Revision Ticket
- ID: SR-###
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <why this revision exists>
- Scope:
  - <bounded public change required by this revision. Spec changes: lines <line-range>.>
- Non-scope:
  - <nearby behavior that must not be changed unless it conflicts with Scope>
```

`SR-###` must match `To revision`, for example `SR-002` for `To revision: 2`.
Do not include backticks in the ticket.

## Workflow

1. Establish the target name, path, and explicit PM intent.
2. Gather the relevant evidence.
3. Trace every intended user-observable claim to its authority. Remove claims
   that can be omitted and question every unresolved claim.
4. Return routed questions until the public contract is decidable.
5. Return a final `Product Questions` item summarizing every intended public
   behavior, the planned revision number, and the planned ticket scope, then ask
   `Go or no-go?`. The planned ticket scope uses the same public-change wording
   as the final ticket, but omits line references until the spec has been
   written.
6. After explicit `go`, write the spec.
7. From the repository root, run:

```text
node .agents/skills/design-system-specifications/scripts/validate-spec.mjs <spec-path>
```

8. Return:

```text
Specification Ready
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- Approval: explicit PM/user go
- Addresses: <none or complete accepted SQ-* IDs>

Spec Revision Ticket
- ID: SR-###
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <why this revision exists>
- Scope:
  - <bounded public change required by this revision. Spec changes: lines <line-range>.>
- Non-scope:
  - <nearby behavior that must not be changed unless it conflicts with Scope>
```

Do not return `Specification Ready` while a question is unresolved or validation is blocked.

When updating a spec after accepted QA `Spec Questions`, read the complete
questions and verbatim PM answers. Change only the accepted public-contract
scope, preserve unrelated approved behavior, run the normal question and
go/no-go flow, emit a new `Spec Revision Ticket`, and carry every accepted
`SQ-*` ID in `Addresses`.
