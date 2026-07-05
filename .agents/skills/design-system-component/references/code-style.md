# Powercoach UI Code Style

Scope: every new or rewritten TypeScript/TSX file in `packages/ui`.

Generated Coss files are out of scope. Existing non-Coss components may not follow this style yet; do not use them as code-style examples. When they are migrated into Powercoach UI conventions, rewrite them to this style.

Namespace assembly and barrel files are exempt from the function-export and implementation-file order rules below. Their shape is owned by [component-conventions.md](component-conventions.md).

## File Order

1. Imports.
2. Types and interfaces used only to type the input or output of the exported symbol.
3. Local constants.
4. The exported function.

Test files follow the base import/type/constant order, then use [test-code-style.md](test-code-style.md) for suite structure and assertions.

## Imports

Let lint/format tooling reorder import groups.

Do not manually fight import grouping. Run the package checks and accept the ordered result.

## Types And Interfaces

Declare types/interfaces only when they type the input or output of the exported symbol.

Examples:

```ts
export interface ButtonRootProps extends BaseUiButton.Props {}
```

```ts
export interface UseButtonProps {}

export interface UseButtonResult {}
```

Avoid private top-level types inside component files. If a type is not part of the exported input/output contract, inline it or simplify the code.

In test files, add top-level types only when they make test fixtures meaningfully clearer.

`types` folders and `*Types.ts` files are type-only. Do not export runtime values, defaults, literals, maps, constants, or `as const` values from `types`.

## Constants

Local component-file constants must be uppercase and `as const`.

```ts
const BUTTON_ROOT_DEFAULT_VARIANT = 'primary' as const
```

Use local component-file constants for small scalar values only when the value is used at least twice in the file.

Inline one-off literal values such as `type="button"`. Do not create constants like `LOGIN_BUTTON_ROOT_DEFAULT_TYPE = 'button' as const` when the value is used once.

Do not create long `*_CLASS_NAME` constants in component files. Long Tailwind class bundles are styling layers, not component constants.

Do not compose classes manually with arrays, `filter(Boolean)`, `join(' ')`, template concatenation, or local class helper functions in component files.

Use Base UI `mergeProps` to compose Powercoach props, Base UI props, consumer props, `className`, `style`, handlers, and refs.

If a value cannot be represented cleanly with `as const`, or if it is complex, shared, dynamic, variant-related, or used by multiple files, move it to the family `constants` folder.

Runtime defaults and scalar constants exported from a `constants` folder use uppercase names and `as const`, for example:

```ts
export const BUTTON_VARIANT_NAMES = ['primary', 'secondary'] as const
```

CVA and variant builders live in `constants` too, but they may keep camelCase names because they are callable style definitions rather than scalar runtime constants:

```ts
export const buttonRootVariants = cva(...)
```

React contexts live in the family `constants` folder, never in `components/`
or `types/`. Name the file after the context value and keep the context value
and its value type together:

```ts
// src/animations/RevealAnimation/constants/revealAnimationContext.ts
export interface RevealAnimationContextValue {}

export const revealAnimationContext =
  createContext<RevealAnimationContextValue | undefined>(undefined)
```

Context values may use camelCase because they are React identity objects, not
scalar constants. The paired value type stays in the same file even when it is
internal to the family.

For long Tailwind class groups, prefer `mergeProps` with grouped multiline `className` props. Use CVA definitions in the family `constants` folder only when props describe visual variants, sizes, intents, density, or related appearance combinations.

Group multiline class strings by visual theme, for example layout, surface, state, motion, and accessibility.

## Export Shape

Use function declarations for implementation exports.

Components:

```ts
export function ButtonRoot({ ...props }: ButtonRootProps): ReactElement {}
```

Hooks:

```ts
export function useButton(props: UseButtonProps): UseButtonResult {}
```

Utilities:

```ts
export function normalizeButtonProps(...) {}
```

Do not use `export const` for components or hooks unless there is a concrete technical blocker.

## Component Files

Do not add isolated top-level helper functions in component files.

If logic is small and used once, keep it inline in the exported component. If logic is reused by at least two components, move it to the family `utils` folder.

Do not use CSS Modules or CSS-in-JS in component files. Use Tailwind CSS utilities, CSS variables, and package style sheets.

## Utils

Use a `utils` file only when the utility is shared by at least two components in the family.

Utility files follow the same order and export-shape rules as other files.

## Base UI Wrappers

When wrapping a Base UI primitive, inspect whether the primitive accepts a render override with a second `state` argument.

If it does, reproduce the behavior:

- preserve merged props
- preserve event handler composition
- preserve refs
- preserve className/style merging
- pass the same `state` shape through to render overrides

Powercoach wrappers may narrow the public API, but they must not break Base UI override semantics.
