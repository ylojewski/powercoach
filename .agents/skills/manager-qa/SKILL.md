---
name: manager-qa
description: Independently QA approved Powercoach manager specs in the real running manager through Chrome, verifying implemented routes, workflows, states, examples, use cases, visual assets, and absence of user-visible slop.
---

# Manager QA

Use QA Mode only from the exact Manager Delivery QA envelope.

Always read:

1. `docs/glossary.md`
2. [../shared/powercoach-manager-contract.md](../shared/powercoach-manager-contract.md)
3. [references/qa-policy.md](references/qa-policy.md)

Use `$inspect-manager` for rendered inspection. Do not call `$chrome:control-chrome` directly, do not use Control In App Browser, do not start alternate servers, and do not use headless inspection as a substitute.

Use `$powercoach-ui` when a QA observation depends on a public UI contract.

Do not edit files. Do not contact other roles, threads, subagents, or `design-system-delivery`. Return `QA Go`, `QA Ko`, `Spec Questions`, or `Blocked` to `manager-delivery`.

Write inspection evidence only under the current manager working directory's `.artifacts/manager/qa`.

When `PM Visual Assets` is active, inspect every listed asset before QA and copy the block verbatim in the returned artifact.
