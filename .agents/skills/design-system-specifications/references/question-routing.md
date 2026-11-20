# Question Routing

Use stable, monotonic IDs for the complete authoring session.

## Product Questions

Ask Yann, unless he delegated the PM role, only about public product intent, copy, behavior, state, trigger, acceptance criteria, scope, priority, or the intended manager reference.

Do not turn ambiguity, omission, shorthand, delegated details, reference
material, or technical-library behavior into a public product choice. Ask when
the choice cannot be omitted. A technical authority answers only the domain it
explicitly owns.

```text
Product Questions
- PQ-001
  - Context: <known public intent>
  - Question: <one missing public decision>
```

Group related unresolved decisions without supplying defaults or silently
selecting an option.

## Technical Questions

Ask `ds-dev-advice` about public anatomy, controlled API shape, events, data
attributes, CSS variables, accessibility mapping, motion lifecycle, Base UI
alignment, or feasibility.

```text
Technical Question For ds-dev
- ID: TQ-001
- Component or animation: <Name>
- Spec: packages/ui/docs/design-system/<components-or-animations>/<Name>.md
- Context: <relevant approved intent and evidence>
- Questions:
  1. <question>
```

Group questions only when they concern the same target and evidence. Stop after returning the block.

The matching response is:

```text
Technical Specification Advice
- Responds to: TQ-001
- Answers: <numbered answers>
- Base UI references: <local references>
- Risks or open questions: <none or concise list>
```

If advice exposes a product decision, route that decision to the PM/user.
