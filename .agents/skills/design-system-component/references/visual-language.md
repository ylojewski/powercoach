# Visual Language

Observed from `http://localhost:3000/exercises/new` on 2026-06-21.

## Core Feel

- Square, tile-like layout.
- Thin borders separate frank zones.
- Black and white dominate foreground and background.
- Primary/active state often uses foreground/background inversion.
- Body copy is quiet, compact, and work-focused.
- Display headings use compact Anton-style typography.

## Typography

`font-heading` uses Anton SC. Treat Anton SC as the small-caps display face.

When using `font-heading`, do not add uppercase or capitalize treatment. Use lowercase visual treatment instead. If the source text contains uppercase characters, intentionally render it lowercase for the visual layer.

Prefer CSS/Tailwind lowercase styling for visual text transformation so the component does not mutate product strings or accessible values in JavaScript unless the API explicitly requires a transformed output value.

## Signature Interaction

The canonical brand interaction is `RevealAnimation`.

Use it only when the approved component spec references `RevealAnimation`. Its public anatomy, behavior, motion, and visual requirements live only in `packages/ui/docs/design-system/animations/RevealAnimation.md`.

If that spec is missing, stop instead of reconstructing the animation from existing components or this visual-language reference.

## Fields

Every Powercoach UI form field uses:

- square geometry
- fine border
- left icon rail
- clear focus border or shadow effect
- help text below when needed
- explicit invalid/loading/result state when applicable

Field wrapper:

```txt
group flex w-full min-w-0 border border-foreground/30 bg-background transition-[border-color,box-shadow,translate] duration-150 focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:border-foreground focus-within:shadow-[4px_4px_0_0_--theme(--color-foreground)]
```

Icon rail:

```txt
flex w-9 shrink-0 items-start justify-center border-e border-foreground/30 bg-muted pt-2.5 text-muted-foreground transition-colors duration-150 group-focus-within:border-foreground group-focus-within:bg-foreground group-focus-within:text-background [&_svg]:size-4 [&_svg]:opacity-100
```

Input area:

```txt
min-w-0 flex-1
```

Textarea area:

```txt
min-w-0 flex-1 [&_textarea]:resize-none
```

This is the Powercoach field neominimalism pattern: on focus-within, the whole control shifts `-0.5` on both axes, the border becomes foreground, a hard `4px 4px` foreground shadow appears, and the icon rail inverts to foreground/background. Preserve the square geometry and do not add radius.

This pattern is mandatory design-system styling for form fields. It is not an optional product behavior that each component spec must repeat.

The exercise title flow shows a computed-code panel with a loading state and a final snake_case result. Preserve that kind of explicit state feedback.

## Hatching

Hatching is used as a support surface:

- empty zones
- feedback areas
- media drop areas
- contextual explanation zones

Use hatching sparingly. It supports the neominimalist system; it is not decoration by default.

## Selection

Selection grids use:

- icon or image media
- label strips
- `aria-pressed`
- black/white inversion when selected
- a compact description or feedback zone

## Panels

Horizontal/stacked panels use:

- vertical trigger labels
- width or translate transitions
- active black trigger columns
- stable panel dimensions
