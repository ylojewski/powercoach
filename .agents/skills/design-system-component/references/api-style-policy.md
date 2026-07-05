# API And Style Policy

## Base UI Model

Use Base UI documentation as the API, accessibility, and behavior source of truth:

- Use `$design-system-base-ui` local snapshot (`references/base-ui-1.6/index.md`) as the official Base UI entry point.
- For each Base UI primitive involved, read the linked component page and every relevant handbook page before designing or implementing.
- Compose accessible primitives 1:1 where possible.
- Preserve useful Base UI state attributes.
- Preserve useful Base UI CSS variables for runtime layout and motion.
- Preserve render override semantics, including the second `state` argument when the primitive exposes it.
- Expose a Powercoach naming layer without weakening Base UI semantics.
- For animated Base UI parts, follow `$design-system-base-ui` local animation handbook (`references/base-ui-1.6/react/handbook/animation.md`).

Do not rely on memory for Base UI behavior. If the docs and an existing Powercoach component disagree, treat the docs as the default source of truth and make any intentional divergence explicit.

Target Base UI 1.6+ behavior. If `package.json` still contains an older `@base-ui/react` version, verify API availability before implementation and report the mismatch if it matters.

Base UI alignment imports documented semantics, accessibility, keyboard behavior, state attributes, CSS variables, and render override behavior. It does not import example styling, visual effects, or motion that the approved Powercoach spec does not request.

Base UI source note: compound packages such as Tabs use `export * as Tabs from './index.parts'`, and `index.parts.ts` aliases parts such as `TabsRoot as Root`. Powercoach keeps that ergonomics only for multi-part families through a family-level namespace assembly file while preserving one export per leaf file. Single-part components use the component name directly, as defined by the shared contract.

## Stateful Public API

Powercoach state APIs follow the approved spec and Base UI documentation.
Controlled usage is always allowed when the primitive supports it.

Expose uncontrolled state only when both conditions are true:

- the approved spec explicitly requests uncontrolled usage
- the wrapped Base UI primitive documents the matching uncontrolled API

Use Base UI names and semantics exactly:

- `value` and `onValueChange`
- `defaultValue` and `onValueChange`
- `open` and `onOpenChange`
- `defaultOpen` and `onOpenChange`
- `checked` and `onCheckedChange`
- `defaultChecked` and `onCheckedChange`

Do not invent custom uncontrolled props such as `initialValue`, `initialOpen`,
`initialChecked`, or family-specific aliases.

If a Base UI primitive type includes uncontrolled props that the approved spec
does not expose, narrow the public Powercoach props so consumers cannot use them
accidentally. If the approved spec requests uncontrolled usage but Base UI does
not document a matching uncontrolled counterpart, return `Blocked`.

## Props

Props interfaces extend the root element or overridden Base UI primitive props:

```ts
export interface ButtonRootProps extends BaseUiButton.Props {}
```

or:

```ts
export interface PanelProps extends ComponentProps<'div'> {}
```

When a component spec is written in product/user terms, translate it into a design-system API, not an app-specific business API.

Preserve spec terminology in examples, Storybook args, accessible labels, and default sample children. Do not replace terms with synonyms such as `sign in` when the spec says `log in`.

Prefer the underlying element or Base UI vocabulary:

- use `children` for visible content when the wrapped primitive naturally accepts children
- use native/Base UI event names such as `onClick` unless the primitive documents a more specific controlled callback
- use `disabled`, `value`, `defaultValue`, `open`, `defaultOpen`, `checked`,
  `defaultChecked`, `onValueChange`, `onOpenChange`, or `onCheckedChange`
  according to the primitive and approved state API

Do not invent domain-specific prop names such as `label`, `onLogin`, `progressLabel`, or similar from a component spec unless the spec explicitly defines them as product API. Product examples and use case wording are intent, not prop names.

## Styling

- Use Tailwind CSS 4 utilities.
- Use CSS variables for measured or runtime-dependent dimensions.
- Use `className` as a composition surface. Consumer classes may extend
  styling, but conflicting Tailwind utilities are not a deterministic override
  API; expose documented visual variants as props.
- Use Base UI `mergeProps` to compose Powercoach props, Base UI props, consumer props, `className`, `style`, event handlers, and refs.
- Keep dimensions stable across hover, focus, selected, loading, and disabled states.
- Do not create `cn` unless the task proves it is needed.

Do not use CSS Modules or CSS-in-JS for Powercoach UI components.

Keep Tailwind utilities in component code or CVA constants. Avoid long single-line `className` strings in JSX.

Use this escalation order for large Tailwind blocks:

1. Keep a grouped multiline `className` inside `mergeProps` when the style is local to one leaf component.
2. Move to a CVA definition in the family `constants` folder when props create visual variants, sizes, intents, density, or compound appearance states.

Do not create a local class constant as an intermediate step.

Do not extract shared CSS patterns during component implementation just because similar intent appears elsewhere. `design-system-review` owns duplication analysis and may request a separate extraction when an abstraction is proven.

For long class sets, group classes by theme: ~150 chars max per line, one theme per line in a multiline backtick block.

Themes are:
- layout and sizing
- surface and border
- typography
- state and data attributes
- motion
- accessibility and focus

Do not create long static `*_CLASS_NAME` constants in component files.

Do not compose classes manually with arrays, `filter(Boolean)`, `join(' ')`, template concatenation, or local class helper functions.

Use `mergeProps` to compose className layers when merging user props, Base UI props, and Powercoach styling. Be conscious that Base UI `mergeProps` concatenates `className` values rightmost-first; avoid conflicting utilities across layers and do not rely on class order to resolve Tailwind conflicts.

Preferred shape:

```tsx
import { mergeProps } from '@base-ui/react/merge-props'

export function ButtonRoot({ children, ...props }: ButtonRootProps): ReactElement {
  return (
    <BaseUiButton
      {...mergeProps<'button'>(
        {
          className: `
            inline-flex items-center justify-center
            border border-foreground bg-background text-foreground
            transition-colors duration-200 ease-out
            focus-visible:outline-2 focus-visible:outline-offset-2
          `
        },
        props
      )}
    >
      {children}
    </BaseUiButton>
  )
}
```

Forbidden shape:

```ts
const BUTTON_ROOT_CLASS_NAME = `
  inline-flex items-center justify-center
  border border-foreground bg-background text-foreground
` as const

const classNameValue = [BUTTON_ROOT_CLASS_NAME, className].filter(Boolean).join(' ')
```

CVA definitions should use the same grouped multiline style for base classes, variants, compound variants, and defaults.

## Animation

Use Base UI animation conventions for parts that enter, exit, mount, unmount, or expose open/closed state.

Use the same public-contract mindset for custom Powercoach motion. A named animation pattern should expose a small public contract through documented `data-*` attributes, semantic ARIA state, lifecycle attributes, or public CSS variables instead of existing only as private Tailwind classes.

Reusable named animation primitives live in:

```text
src/animations/<AnimationName>
```

Their specs live in:

```text
docs/design-system/animations/<AnimationName>.md
```

When a component consumes a reusable animation, do not reimplement the pattern inside the component family. Import or compose the animation primitive and keep component-specific state wiring in the component family.

Consuming components expose named motion according to [component-conventions.md](component-conventions.md). They must not duplicate the reusable animation's internal lifecycle tests or visual mechanics.

Reusable animation implementation follows the engine named by the approved spec,
[motion-react.md](motion-react.md), and the local Base UI animation handbook.
Named animation behavior belongs only to its approved spec.

## Accessibility

- Keep semantic roles from Base UI primitives.
- Provide accessible names for icon-only controls.
- Ensure keyboard focus is visible and behaves like Base UI examples.
- Do not hide interactive state only in color.
- Test disabled, pressed, selected, open, focus-visible, and invalid states when applicable.

## Icons

Use `lucide-react` first for common UI icons and indicators, including loading spinners. Prefer a lucide icon such as `LoaderCircleIcon` for spinner affordances before creating custom SVG, CSS-only drawings, or ad hoc icon markup.

Keep decorative icons `aria-hidden` unless the icon is the only accessible content.

## Performance

- Avoid layout shifts from interaction states.
- Avoid measuring in JavaScript when CSS variables or Base UI variables already expose the needed state.
- Keep component render work small and predictable.
- Use images/icons with stable dimensions.
