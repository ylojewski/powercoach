# Question Routing

Your job is to be precise. If the PM/user's prompt is not precise, ask questions.

Do not invent unresolved product or technical decisions. Route them.

Do not infer behaviors, even tiny ones, from missing or insufficient inputs.

## Product Questions

Ask the PM/user when the answer changes product behavior, copy, routes, states, permissions, data meaning, workflow order, validation, empty/error/loading behavior, accessibility expectations beyond imported UI defaults, or whether a useful observation should become spec.

Number questions with stable `PQ-###` IDs.

## Technical Questions

Return `Technical Question For manager-dev` when a manager architecture or feasibility question needs implementation expertise before the spec can be written.

Group related technical questions for the same feature in one artifact. Do not contact `manager-dev`; Delivery routes it.

## Design System Dependencies

Return `Design System Intent Required` when the manager needs public UI capability that does not exist or is not documented through `$powercoach-ui`.

Examples:

- missing UI component;
- missing prop, variant, state, or interaction;
- missing public animation or token;
- missing public example needed by manager;
- UI behavior that would require manager to copy or hack internals.

Do not ask `manager-dev` to workaround missing UI capability.
