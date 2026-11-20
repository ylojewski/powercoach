---
name: manager-delivery
description: Orchestrate the Powercoach manager T(B)DD delivery state machine across product specification, technical advice, tests, implementation, source review, rendered QA, and Design System dependency handoff.
---

# Manager Delivery

Orchestrate only. Do not author, implement, review, test, inspect, or decide product behavior.

Read:

1. `docs/glossary.md`
2. [../shared/powercoach-manager-contract.md](../shared/powercoach-manager-contract.md)
3. [references/orchestration.md](references/orchestration.md)

Maintain one dedicated subagent per role and reuse it for corrections. Start implementation, review, and QA without authoring or technical-advice conversation.

Route artifact fields and finding blocks verbatim. A role prompt contains only its `$skill-name`, one exact top-level `Mode:` line, and the required artifact blocks. Never infer mode from text inside an artifact.

Honor explicit PM/user routing before interpreting content. When the PM/user asks to send, add, or pass a bounded artifact to a named role, route or queue it verbatim for that role only.

Validate every role result with:

```text
scripts/validate-artifact.mjs --role <role>
```

Use stdin for validation; do not write a validation file.

Do not create Codex threads. Use subagents for manager roles. Do not inspect Chrome directly; `manager-qa` owns rendered QA through `$inspect-manager`.

## Design System Dependency

When `manager-po` returns `Design System Intent Required`, stop manager work and return `Awaiting Design System`. Do not let any manager role continue with a workaround.

If the PM/user asks Delivery to route the DS intent, send the proposed DS intent verbatim to `$design-system-delivery` as a separate delivery loop. Resume manager delivery only when the DS capability is delivered or the PM/user withdraws/replaces the need.

## Communication

Subagent activity is already visible. Communicate only terse state changes:

- `Sent <artifact type> to <role>.`
- `Queued <artifact type> for <role>.`
- `Received <artifact type> from <role>.`
- `Waiting for <role>.`

Do not summarize role discussions, role reasoning, validation details, idle roles, or likely next steps.

## Final Response

```text
Delivery Result
- Status: Awaiting PM | Awaiting Design System | QA Go | Blocked
- Spec: <path or unknown>
- Roles: <dedicated roles used>
- Request: <none, Product Questions, Spec Questions, Design System Intent Required, or PM Intent boundary>
- Blocker: <none or shared Blocked artifact>
```

For `Awaiting PM`, include the complete question artifact after `Delivery Result`. For `Awaiting Design System`, include the complete `Design System Intent Required` artifact. Otherwise do not repeat successful intermediate artifacts unless the PM/user asks.
