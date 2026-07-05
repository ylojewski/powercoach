# Token Policy

## Source

Use the current `packages/ui` styles, the shared Powercoach UI contract, and the approved target spec. Do not depend on files outside this repository.

## Palette

The primary orange palette is named `ember`.

Tailwind CSS 4 only generates scaled utilities when scaled theme variables exist. Define every scale step to get utilities such as `bg-ember-300`:

```css
@theme {
  --color-ember-50: oklch(98% 0.016 73.684);
  --color-ember-100: oklch(95.4% 0.038 75.164);
  --color-ember-200: oklch(90.1% 0.076 70.697);
  --color-ember-300: oklch(83.7% 0.128 66.29);
  --color-ember-400: oklch(75% 0.183 55.934);
  --color-ember-500: oklch(70.5% 0.213 47.604);
  --color-ember-600: oklch(64.6% 0.222 41.116);
  --color-ember-700: oklch(55.3% 0.195 38.402);
  --color-ember-800: oklch(47% 0.157 37.304);
  --color-ember-900: oklch(40.8% 0.123 38.172);
  --color-ember-950: oklch(26.6% 0.079 36.259);
}
```

Semantic aliases:

- `primary`: alias of ember.
- `secondary`: alias of foreground.

## Radius

Powercoach UI has no radius tokens.

Do not use:

- `--radius`
- `--radius-*`
- `rounded-*`

If a native control or accessibility edge case seems to need round geometry, stop and explain the tradeoff before adding it.

## Typography

- Heading font: `Anton SC`.
- Sans font target: `Nunito Sans Variable`.
- Current Coss-era files may still contain Geist; do not treat Geist as the final DS decision.
- `font-heading` text is visually lowercase by convention. Do not pair `font-heading` with uppercase or capitalize treatment; use lowercase visual styling because Anton SC supplies the small-caps feel.

## Motion

Use CSS variables for measured dimensions and runtime geometry consumed by the animation implementation. Animation engine rules live in [motion-react.md](motion-react.md).
