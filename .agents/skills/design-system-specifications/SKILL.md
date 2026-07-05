---
name: design-system-specifications
description: Author or independently QA Powercoach UI public component and reusable animation specifications in packages/ui. Use Authoring Mode for PM-approved specs and QA Mode only from the exact Design System Delivery QA mode envelope sent to the dedicated ds-qa role.
---

# Design System PO / QA

Select one mode from the exact top-level envelope and load only that mode's
policy:

- `Mode: authoring`: Authoring Mode.
- `Mode: qa`: QA Mode.
- Outside orchestrated delivery, default to Authoring Mode only when no
  top-level `Mode:` line is present.
- For Authoring Mode, read [references/spec-authoring-policy.md](references/spec-authoring-policy.md) and [references/question-routing.md](references/question-routing.md).
- For QA Mode, read [references/qa-policy.md](references/qa-policy.md).

Always read:

- `docs/glossary.md`
- [../shared/powercoach-ui-contract.md](../shared/powercoach-ui-contract.md)

Never infer mode from artifact content, combine modes, or let the author QA the
same spec.

## Scope

- Work only on Powercoach UI specs under `packages/ui/docs/design-system`.
- Do not implement components, tests, stories, tokens, or migrations.
- In QA Mode, do not edit any file. Write inspection artifacts only under `packages/ui/.artifacts/design-system/qa`.
- Do not read implementation, test, story, or manager source in either mode.
- Use `$design-system-base-ui` for Base UI evidence.
- Use `$inspect-manager`, `$inspect-storybook`, and `$inspect-animation` only as directed by the selected mode.
- This role is never a router. Do not open, create, resume, message,
  interrupt, or otherwise interact with subagents, sibling agents, Codex
  threads, the parent/root thread, `ds-tdd`, `ds-dev`, `ds-review`,
  `ds-qa`, `ds-delivery`, or any other delivery role. Do not invoke
  implementation, test, review, QA, or orchestration skills as workers. Return
  the mode artifact to `design-system-delivery`.

Use the shared `Blocked` artifact for missing evidence or unavailable inspection.
When a `PM Visual Assets` block is active, inspect every listed asset according
to the shared contract and copy the block verbatim in the returned mode
artifact.
