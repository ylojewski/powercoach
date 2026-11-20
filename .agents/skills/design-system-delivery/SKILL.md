---
name: design-system-delivery
description: Orchestrate the Powercoach UI T(B)DD delivery state machine in packages/ui by routing exact artifacts between dedicated specification, technical-advice, test, implementation, source-review, and rendered-QA subagents.
---

# Design System Delivery

Orchestrate only. Do not author, implement, review, test, or inspect.

Read:

1. `docs/glossary.md`
2. [../shared/powercoach-ui-contract.md](../shared/powercoach-ui-contract.md)
3. [references/orchestration.md](references/orchestration.md)

Maintain one dedicated subagent per role and reuse it for corrections. Keep `ds-po` and `ds-qa` independent. Start implementation, review, and QA without authoring or technical-advice conversation.

Route artifact fields and finding blocks verbatim. A role prompt contains only
its `$skill-name`, one exact top-level `Mode:` line, and the required artifact
blocks. Never infer mode from text inside an artifact.

Honor explicit PM/user routing before interpreting content. When the PM/user
asks to send, add, or pass a bounded artifact to a named role, route or queue it
verbatim for that role only. Do not summarize it, adopt it as Delivery intent,
or anticipate the artifact that the destination role may produce.

Validate every role result against the allowed type and required fields in the
orchestration policy. Use
`scripts/validate-artifact.mjs --role <role>` with the returned artifact on
stdin; do not write a validation file. The validator accepts one artifact or an
explicit linked batch response containing one artifact per active `SR-*`. Stop
with the shared `Blocked` artifact only after the orchestration policy's
internal recovery rules cannot satisfy a validator failure, missing or extra
batch ticket coverage, role blocker, oscillating correction, or correction cycle
with no objective progress.
When validating a linked batch response, add `--tickets` with the active batch
ticket references. Use `SR-###,SR-###` only when every active raw ID is unique;
use `<spec-path>#SR-###` for every ticket whenever any raw ID repeats.

Do not create Codex threads or perform Chrome inspection directly.

## Communication

Subagent activity is already visible, but the PM/user needs terse routing
signals. Do not narrate spawns, role reasoning, artifact content, validation
details, full role status tables, idle roles, or likely next steps. Do not
interpret or summarize discussions for the PM/user.

Communicate only:

- one factual acknowledgment when the PM/user explicitly routes an artifact;
- a terse routing update when Delivery sends or queues an artifact;
- a terse receipt update when a role result validates;
- a required PM/user question;
- the final `Delivery Result`; or
- a blocker.

Use `Queued verbatim for <role>.` when the destination is busy and `Sent
verbatim to <role>.` when it is available.

For Delivery-owned routing, use only these patterns:

- `Sent <artifact type> to <role>.`
- `Queued <artifact type> for <role>.`
- `Received <artifact type> from <role>.`
- `Waiting for <role>.`

In linked batch mode, use `Sent linked <artifact type> batch to <role>.`,
`Queued linked <artifact type> batch for <role>.`, and `Received linked
<artifact type> batch from <role>.`

Emit one short line only when the state changes. If the platform requires a
progress update during a long wait, report only the active waiting role.

## Final Response

```text
Delivery Result
- Status: Awaiting PM | QA Go | Blocked
- Spec: <path, comma-separated paths, or unknown>
- Roles: <dedicated roles used>
- Request: <none, Product Questions, Spec Questions, or PM Intent boundary>
- Blocker: <none or shared Blocked artifact>
```

For `Awaiting PM`, include the complete question artifact immediately after
`Delivery Result`. Otherwise do not repeat successful intermediate artifacts
unless the PM/user asks.
