# Component Conventions

## Package Boundary

Implementation work stays inside `packages/ui`.

Before writing files, verify the effective edit root. If the edit tool is operating from the repository root, use `packages/ui/...` paths. If it is operating from `packages/ui`, use package-relative paths. Never create `src/...` at the repository root.

Implementation agents do not inspect manager screens or manager source. The approved spec and package-local references provide the required product and visual context.

## Public Composition

When the PM intent, approved spec, or public test says to use an existing
Powercoach UI component, import and render that component through its public API
as a consumer would. Do not copy the component's CSS, tokens, markup, variants,
behavior, or internals to recreate it indirectly.

Use package public exports when the composition is documented as consumer-facing.
Use family-local public assembly exports only when the composition stays inside
the same family. Do not import private leaves or constants from another family
to simulate composition.

If the requested composition is impossible, conflicts with Base UI behavior, or
needs API that the consumed component does not expose, return the shared
`Blocked` artifact or route the technical question instead of silently
substituting copied implementation.

Do not create private protocols between component or animation families. A
family must not coordinate with another family through undocumented `data-*`
attributes, class names, selectors, DOM shape, CSS variables, refs, magic
values, or tests. If a composition needs a new shared surface, make that surface
part of the public spec/API or block for clarification.

## Family Structure

Each component family lives in a folder under `src/components`:

```text
src/components/Button/
  components/
  constants/
  hooks/
  types/
  utils/
  Button.tsx
  Button.test.tsx
  Button.stories.tsx
  index.ts
```

Only create subfolders that are useful for the family being implemented.

Family folders use the public PascalCase component name. For example:

- `Button` lives in `src/components/Button`
- `LoginButton` lives in `src/components/LoginButton`

Do not use kebab-case, snake_case, or lower-case multiword family folders such as `login-button`.

## Reusable Animation Structure

Reusable animation primitives live under `src/animations`.

Animation specs live in:

```text
docs/design-system/animations/<AnimationName>.md
```

Animation family names must be PascalCase and end with `Animation`.

The public `data-motion` value is derived from the animation family name:

1. remove the `Animation` suffix
2. convert the remaining PascalCase name to kebab-case

Examples:

- `RevealAnimation` -> `data-motion="reveal"`

Animation implementation follows the same PascalCase family convention:

```text
src/animations/RevealAnimation/
  components/
  constants/
  hooks/
  types/
  utils/
  RevealAnimation.tsx
  RevealAnimation.test.tsx
  RevealAnimation.stories.tsx
  index.ts
```

Only create subfolders that are useful for the animation family being implemented.

Do not place a reusable named animation such as `RevealAnimation` inside a consuming component family like `src/components/LoginButton`. A local one-off animation may stay inside the component family only when it has no shared name, no animation spec, and no expected reuse.

When a component consumes a named reusable animation, the element or animation primitive that owns that motion must expose the derived `data-motion` value. If a component uses multiple named animations, expose one `data-motion` value per animation-bearing element rather than combining names into one attribute.

## Export Rules

Powercoach implementation rule: one implementation file exposes one runtime
implementation symbol. Its public input and output types may be exported from
the same file.

Assembly and barrel files may re-export. Family PascalCase files are API assembly files, not implementation files.

PascalCase namespace objects such as `Button`, `Animations`, `Components`, and `Ui` are assembly exports. Constant naming rules for scalar runtime values do not apply to them.

The package exposes namespace assembly layers so consumers can import at different depths:

- `src/Ui.tsx` exports the `Ui` namespace and is re-exported from `src/index.ts`.
- `src/components/Components.tsx` exports the `Components` namespace and is re-exported from `src/components/index.ts`.
- `src/animations/Animations.tsx` exports the `Animations` namespace and is re-exported from `src/animations/index.ts` when reusable animations exist.

`Components` and `Animations` are sibling namespaces. `Components` contains
component families only; `Animations` contains reusable animation families
only. `Ui` assembles both when reusable animations exist.

Consumers should be able to import broad namespaces, family namespaces, or leaf exports, for example `Ui`, `Components`, `Animations`, `RevealAnimation`, and `RevealAnimationRoot`.

Use the public family name as the namespace key:

```ts
import { RevealAnimation } from './RevealAnimation'

export * from './RevealAnimation'

export const Animations = {
  RevealAnimation
}
```

The same pattern applies upward:

```ts
import { Animations } from './animations'
import { Components } from './components'

export * from './animations'
export * from './components'

export const Ui = {
  Animations,
  Components
}
```

Single-part component families expose the component name directly. Do not create
or document `Root`, `<Name>.Root`, or `<Name>Root` when the public anatomy has
only one part.

```ts
import { Heading } from './components/Heading'

export * from './components/Heading'

export { Heading }
```

Consumers must use the component directly:

```tsx
import { Heading } from '@powercoach/ui'

;<Heading />
```

Multi-part component leaf exports use the family prefix:

- `ButtonRoot`
- `ButtonIcon`
- `ButtonLabel`
- `useButtonSomething`
- `ButtonRootProps`
- `ButtonSomethingType`

For multi-part components, the root leaf owns the primary behavior. The family
PascalCase file assembles the namespace:

```ts
import { ButtonIcon } from './components/ButtonIcon'
import { ButtonLabel } from './components/ButtonLabel'
import { ButtonRoot } from './components/ButtonRoot'

export * from './components/ButtonIcon'
export * from './components/ButtonLabel'
export * from './components/ButtonRoot'

export const Button = {
  Root: ButtonRoot,
  Icon: ButtonIcon,
  Label: ButtonLabel
}
```

Use `export * from ...` for leaf re-exports. Do not hand-pick component exports, prop types, or helper types from leaf files.

The family `index.ts` exports everything from the PascalCase file:

```ts
export * from './Button'
```

For multi-part components, consumers must be able to use either:

```ts
import { Button, ButtonRoot } from '@powercoach/ui'

;<Button.Root />
;<ButtonRoot />
```

## Naming

- Public component lifecycle files use the same PascalCase base name:
  - spec: `Button.md`
  - component: `Button.tsx`
  - public behavior test: `Button.test.tsx`
  - Storybook story: `Button.stories.tsx`
- Component files: PascalCase `.tsx`.
- Main family file: PascalCase family name, for example `Button.tsx`. It
  assembles a namespace for multi-part components and re-exports the direct
  component for single-part components.
- Single-part component implementation export uses the family name directly, for
  example `Heading`.
- Multi-part leaf components use the family prefix, for example `ButtonRoot`,
  `ButtonIcon`, `ButtonLabel`.
- Hooks use the family prefix, for example `useButtonSomething`.
- Public types use the family prefix, for example `ButtonSomethingType`.
- Base UI imports are aliased when names collide, for example `Button as BaseUiButton`.

General TypeScript file ordering, props interface naming, constants, hook shape, and utility rules live in [code-style.md](code-style.md).

`types/` is type-only. Runtime defaults, literals, maps, and shared `as const` values belong in `constants/`, not `types/`.

Internal implementation files keep the established local naming for their export kind, such as camelCase CVA constants in `constants`. When internal tests are needed for coverage, colocate them with the internal file and follow [test-code-style.md](test-code-style.md).

## Variants

Use `class-variance-authority` when props describe visual variants, sizes, intents, density, emphasis, or other appearance combinations.

Prefer colocating CVA definitions in `constants`, for example:

```text
src/components/Button/constants/buttonRootVariants.ts
```

Do not use CVA for simple one-off conditional classes where plain branching is clearer.

Write CVA class sets as grouped multiline strings. Group by layout, surface, typography, state, motion, and accessibility rather than writing one very long utility line.

Do not move styling into CSS Modules or CSS-in-JS to avoid long Tailwind strings.

## Legacy Source Anchors

The current non-Coss components are useful visual and behavioral anchors, not code-style examples. They do not yet follow the target conventions and should be rewritten when migrated.

- `src/components/HorizontalPanel.tsx`
- `src/components/SelectableGrid.tsx`
- `src/components/StackedPanel.tsx`
- `src/components/SwitchAnimation.tsx`
- `src/components/FadeAnimation.tsx`

Legacy animation components should be migrated into `src/animations/<AnimationName>` when they become reusable named animations.

Do not extract shared code or shared styles from resemblance during implementation. `design-system-review` owns duplication analysis and may request a separate extraction when it is justified.
