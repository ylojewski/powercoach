# Rendered QA Policy

Audit the approved spec independently in real Chrome. Do not read implementation source, tests, stories, manager source, or authoring conversation.

## Inputs

For the initial pass, require:

```text
<complete Implementation Ready>

<complete Review Go>

<complete Spec Revision Ticket>
```

In linked batch mode, require the complete `Linked SR Batch`, one complete
`Implementation Ready`, one complete `Review Go`, and one matching complete
`Spec Revision Ticket` per bundled `SR-*`. Audit the batch atomically and return
one QA artifact per `SR-*`.

The QA pass is initial when no previous QA result caused code or spec
correction, regardless of the `Pass` value in `Review Go`.

For a correction pass, also require either:

- the previous `QA Ko`; or
- the previous accepted `Spec Questions` with the verbatim PM decision.

To resume after rejected `Spec Questions`, require those questions and the
verbatim PM decision in addition to the unchanged initial-pass inputs. Continue
the same pass; this is not a correction pass.

Read each approved spec from its `Implementation Ready` path and read every
named spec it references. Read each `Spec Revision Ticket` as the work boundary
for that QA pass.

## Preparation

1. Read `docs/glossary.md` and the shared Powercoach UI contract.
2. Use `$design-system-base-ui` for every Base UI contract declared by the spec.
3. Read [visual-language.md](../../design-system-component/references/visual-language.md) only when the target belongs to a category it names.
4. Build a verification matrix from each approved spec and ticket. For
   `From revision: none`, include every `EX-*`, `UC-*`, and user-observable
   contract. For an existing-spec revision, include the ticket `Scope`, every
   touched `EX-*` and `UC-*`, and observable paths needed to prove `Non-scope`
   behavior was not changed. In linked batch mode, include shared paths touched
   by any bundled ticket and judge them against the complete active ticket set.
5. Use `$inspect-storybook` for stories, controls, probes, states, and interactions.
6. Use `$inspect-manager` only when the spec explicitly requires comparison with manager behavior.
7. Use `$inspect-animation` for motion timing, timeline, style, clipping, or layout evidence.

When a contract names visual surface coverage, borders, outlines, clipping,
theme inversion, or reveal surface behavior, verify the visible result in the
captured screenshots. Geometry, layout deltas, and computed rectangles are
supporting evidence only; they do not prove that the visible surface or border
was correctly covered. If screenshots show a mismatch with an approved visual
surface contract, return `QA Ko`.

Store animation evidence under:

```text
packages/ui/.artifacts/design-system/qa/<SpecName>/<initial-or-correction>/<contract-id>/
```

Close every prepared Chrome tab in `finally`, including blocked and failed
passes. If inspection cannot run, return the shared `Blocked` artifact.

## Verdict

The initial pass follows the ticket matrix: exhaustive only for
`From revision: none`, and scoped for an existing-spec revision. A correction
pass rechecks every open finding or accepted `SQ-*` contract and every story or
use-case path touched by the correction. Derive touched paths from the
revision ticket, corrected contract IDs, stories, and shared component or
animation families. Add a new finding only when correction work introduces a
new observable problem on a touched path.

Return `QA Go` only when the complete matrix passed and no finding remains:

```text
QA Go
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- Pass: initial | correction

Spec Revision Ticket
- ID: SR-###
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <verbatim>
- Scope:
  - <verbatim>
- Non-scope:
  - <verbatim>
```

Return stable findings only when an approved spec claim, shared rule, or
explicitly imported Base UI contract is missing or incorrect, or when the
implementation adds unauthorized user-observable behavior. `Contract` must
identify that authority. Never turn a potentially useful but unspecified
behavior into `QA Ko`.

```text
QA Ko
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- Pass: initial | correction
- Findings:
  - QA-001
    - Contract: <EX-*, UC-*, or public behavior>
    - Expected: <approved contract>
    - Observed: <factual Chrome observation>
    - Evidence: <story, route, screenshot, or animation report>
    - Required correction: <one correction>

Spec Revision Ticket
- ID: SR-###
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <verbatim>
- Scope:
  - <verbatim>
- Non-scope:
  - <verbatim>
```

Keep unresolved IDs stable.

When required behavior is ambiguous, contradictory, incomplete, or
unverifiable, ask a contract question. When inspection reveals a concrete,
potentially useful user behavior that no authority requires, do not ideate or
prescribe a correction: ask the PM whether it belongs in the product contract.
Return:

```text
Spec Questions
- SQ-001
  - Spec: <path>
  - Context: <spec reference or factual out-of-spec observation>
  - Question: <one product-contract decision for the PM/user>

Spec Revision Ticket
- ID: SR-###
- Spec: <path>
- From revision: <none or positive integer>
- To revision: <positive integer>
- Reason: <verbatim>
- Scope:
  - <verbatim>
- Non-scope:
  - <verbatim>
```

After a verbatim PM rejection, abandon only the rejected `SQ-*` observation and
continue the interrupted QA pass. After PM acceptance and the resulting
specification, test, implementation, and source-review loop, recheck only the
accepted `SQ-*` contracts and touched paths in the same `ds-qa` context.

Copy the active `Spec Revision Ticket` verbatim in every QA result. In linked
batch mode, return one complete QA artifact per active ticket in the same final
response. Each artifact carries only its matching ticket; do not invent a merged
ticket. If PM accepts a `Spec Questions` change, the subsequent authoring pass
emits a new ticket for the corrected spec revision.
