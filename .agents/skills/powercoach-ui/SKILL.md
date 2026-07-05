---
name: powercoach-ui
description: Reference the public consumer contract of Powercoach UI for manager work, including available @powercoach/ui exports, public design-system specs, documented examples, tokens, animations, and usage boundaries.
---

# Powercoach UI

Provide consumer-facing evidence for manager work. Do not implement UI and do not inspect Base UI directly.

Read:

1. `docs/glossary.md`
2. [references/public-contract.md](references/public-contract.md)

Use this skill when a manager role needs to know whether `@powercoach/ui` publicly provides a component, prop, variant, animation, token, data attribute, or documented example.

## Scope

Allowed public evidence:

- `packages/ui/docs/design-system`.
- `packages/ui/package.json` exports.
- `packages/ui/src/index.ts` and public barrel files.
- Built declaration files when available.
- Public Storybook stories only as consumer examples, not as source authority.

Do not treat component internals, private files, private attributes, class names, DOM shape, or implementation details as consumer contract. If public evidence is missing, say the UI capability is undocumented or missing.

Return concise prose or the artifact requested by the caller. Do not route work to other roles.
