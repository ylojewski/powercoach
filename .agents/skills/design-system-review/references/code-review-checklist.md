# Powercoach UI Code Review Checklist

Read the approved spec, shared Powercoach UI contract, and public test before applying this checklist. These references own detailed implementation rules:

- [code-style.md](../../design-system-component/references/code-style.md)
- [component-conventions.md](../../design-system-component/references/component-conventions.md)
- [api-style-policy.md](../../design-system-component/references/api-style-policy.md)
- [test-code-style.md](../../design-system-component/references/test-code-style.md)
- [storybook-validation.md](../../design-system-component/references/storybook-validation.md)
- [visual-language.md](../../design-system-component/references/visual-language.md) when visuals changed
- [token-policy.md](../../design-system-component/references/token-policy.md) when tokens changed

Check every item. Report failures only.

## Public Contract

- Implementation matches the approved spec and adds no user-observable behavior demonstrable from source, tests, or stories.
- Implementation, public tests, stories, exports, and internal tests satisfy the
  active `Spec Revision Ticket` or linked ticket set `Scope` without drifting
  into `Non-scope` behavior.
- Public tests enter through the family assembly and cover the approved contract.
- Base UI semantics, accessibility, state attributes, CSS variables, and render override state are preserved when applicable.
- Public state API matches the approved spec and Base UI
  controlled/uncontrolled semantics. No custom uncontrolled API is invented.
- Specs, tests, stories, QA evidence, and implementation do not introduce SSR,
  server rendering, hydration, pre-hydration, or server/client mismatch
  contracts or safeguards.
- Any existing Powercoach UI component required by the PM intent, approved spec,
  or public tests is consumed through its public API as an application consumer
  would. Recreating it by copying CSS, tokens, markup, variants, behavior, or
  internals is a contract failure.
- Cross-family coordination uses only documented public APIs, documented public
  `data-*` attributes, documented public CSS variables, or Base UI contracts.
  Undocumented attributes, class names, selectors, DOM shape, CSS variables,
  refs, magic values, or tests used as a private protocol between families are
  contract failures.

## Files And Exports

- Family, lifecycle files, leaf files, tests, and stories follow PascalCase conventions.
- A single-part component exposes and consumes the component name directly,
  without `.Root` or `<Name>Root`; `Root` appears only when the approved public
  anatomy has at least two parts.
- One implementation file exposes one runtime implementation symbol; its public
  input and output types may be exported beside it. Assembly and barrel files
  only assemble or re-export.
- Leaf exports, family namespace, `Components`, `Animations`, and `Ui` remain reachable at their intended levels.
- Runtime values never live in `types/`.
- PascalCase namespace assemblies such as `Button`, `Animations`, `Components`, and `Ui` are assembly exports, not scalar constants.

## Types, Constants, And Functions

- Export input and output types follow the file export and extend the appropriate native or Base UI surface.
- A local scalar constant is uppercase, uses `as const`, and is used at least twice in the file; otherwise the literal is inline.
- Shared runtime constants are uppercase in `constants/`.
- CamelCase constants are limited to callable builders such as CVA definitions; runtime defaults, maps, and literals are not camelCase constants.
- React contexts live in `constants/<contextName>.ts` with their paired value type, not in `components/` or `types/`.
- Component files contain no isolated top-level helpers.
- Utilities exist only when reused by at least two family components.

## Props And Styling

- Base UI `mergeProps` composes props, handlers, refs, styles, and `className`.
- No manual class arrays, `filter(Boolean)`, `join`, template concatenation helper, `cn`, or long `*_CLASS_NAME` constant replaces `mergeProps`.
- CVA is used for real visual variants and not for one-off branching.
- Tailwind groups remain readable (~150 chars max per group) and no CSS Modules or CSS-in-JS were introduced.
- No radius token or `rounded-*` class exists.
- Layout dimensions remain stable across states.
- Common icons come from `lucide-react` when available.

## Motion

- A named reusable animation is composed from its family rather than reimplemented.
- Animation implementation uses the engine named by the approved spec: `CSS` or
  `Motion`.
- `data-motion` and lifecycle attributes are present only where their public contract requires them.
- The chosen engine adds no visible effect absent from the approved spec.
- Consuming components do not introduce private hooks or markers for animation
  families; every shared motion surface is documented by the consuming spec, the
  animation spec, the shared contract, or Base UI.

## Stories And Tests

- Every `EX-*` has one consumer-facing story whose name or parameters preserve the ID.
- Each story exposes controls needed for its example and visible DOM probes for otherwise invisible results.
- Component implementation does not perform or claim visual QA.
- Internal tests cover changed utilities, constants, hooks, and variants when coverage requires them.
- Every source file created or modified in the target family reports 100% branches, functions, lines, and statements.
- No separate namespace test duplicates the public family test.
- The package build succeeds and documented consumer imports resolve through public package exports.

## Duplication

- Package search finds no existing helper, variant builder, component behavior, or named animation that the new code should reuse.
- Repeated design-system intent is identified even when syntax differs.
- An extraction is requested only when the shared intent and ownership boundary are clear; incidental similarity is not enough.
