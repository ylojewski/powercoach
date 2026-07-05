# Animation Engine Policy

The approved spec owns the animation engine. Do not choose, infer, substitute,
or upgrade the engine during implementation.

## Engines

- `CSS`: implement animation with CSS or Tailwind transitions, keyframes,
  data-attribute selectors, and CSS variables as needed.
- `Motion`: implement animation with the installed `motion` package. Import
  React APIs from `motion/react` and use Motion's documented React behavior.

If the approved spec creates or changes animation behavior but does not name
`CSS` or `Motion`, return `Blocked`.

## Shared Rules

- Treat the approved animation spec as the only source for anatomy, trigger,
  timing, geometry, visible effects, and callbacks.
- Follow the local Base UI animation handbook for public lifecycle attributes
  and mounted or unmounted behavior when the target wraps or mirrors Base UI
  lifecycle.
- Use `data-*` attributes, public CSS variables, semantic ARIA state, or Base UI
  contracts for public animation state. Do not expose private class or DOM
  protocols.
- Do not add opacity, transform, spring, gesture, layout, or timing effects
  merely because the chosen engine supports them.

## CSS Engine

- CSS may be the full engine for named reusable animations when the spec names
  `CSS`.
- Keep animated properties explicit and stable.
- Use CSS variables for measured dimensions and runtime geometry when the spec
  exposes them as public contract.
## Motion Engine

- Use `motion` elements for animated values.
- Use controlled `animate` state for controlled Powercoach APIs.
- Use `AnimatePresence` only when content actually enters or exits the React
  tree.
- Do not use `AnimatePresence` for kept-mounted state changes.
- Preserve Base UI render props and their second `state` argument when animation
  uses a render override.
- Use `initial`, `animate`, `exit`, `transition`, layout animation, gestures,
  and lifecycle APIs only when required by the approved spec and applicable Base
  UI lifecycle.

When exact engine behavior remains unclear after reading the approved spec,
local Base UI documentation, and installed types, return `Blocked` rather than
guessing.
