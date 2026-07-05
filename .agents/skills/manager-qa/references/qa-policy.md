# Manager QA Policy

## Entry

Require complete `Implementation Ready`, complete `Review Go`, and active `Spec Revision Ticket`.

Use `$inspect-manager` to open a new Chrome tab for `http://localhost:3000`. Yann owns the running app. Occupied ports are normal. If the target cannot be prepared through `$inspect-manager`, return `Blocked`.

## Method

Verify the approved spec point by point:

- entry points and routes;
- examples `EX-*`;
- use cases `UC-*`;
- loading, empty, error, success, disabled, and unavailable states named by the spec;
- drawer/background-route behavior;
- data and API-visible behavior;
- public UI behavior when the manager consumes `@powercoach/ui`;
- visual assets supplied by the PM/user.

Inspect visually and interact as a user. Use DOM probes only to read factual page state or event evidence that is visible to the user. Do not invent programmatic substitutes when Chrome inspection is unavailable.

## Verdicts

Return `QA Ko` only when approved spec behavior is missing, wrong, or slopped in the running manager.

Return `Spec Questions` when the observation is outside the approved spec but may be useful enough for the PM/user to decide whether the spec should change.

Return `QA Go` only when every relevant approved example and use case passes.

## Results

```text
QA Ko
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- QA-001
  - Contract: <spec item, UC, or EX>
  - Expected: <approved behavior>
  - Observed: <factual rendered behavior>
  - Evidence: <artifact path or visual observation>
  - Required correction: <correction required>

Spec Revision Ticket
...
```

```text
Spec Questions
- SQ-001
  - Spec: <manager-workdir>/docs/specs/<Feature>.md
  - Context: <out-of-spec observation>
  - Question: <PM question>

Spec Revision Ticket
...
```

```text
QA Go
- Spec: <manager-workdir>/docs/specs/<Feature>.md

Spec Revision Ticket
...
```

Do not include backticks in delivery artifacts.
