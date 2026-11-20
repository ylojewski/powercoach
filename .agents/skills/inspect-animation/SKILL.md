---
name: inspect-animation
description: Capture factual Powercoach UI animation evidence in the running manager or Storybook through real Chrome, including timeline screenshots, browser completion timing, computed styles, clipping, and layout movement, without issuing a product verdict.
---

# Inspect Animation

Observe motion; do not read product specs or decide correctness.

## Input

Require the target, URL or story, root selector, reset and trigger actions,
caller-owned output directory, and viewport when the contract is
viewport-dependent.

Read [../shared/powercoach-ui-contract.md](../shared/powercoach-ui-contract.md) for the shared blocker shape.

Use `$inspect-manager` for port 3000 or `$inspect-storybook` for port 6006. Use only the new real-Chrome tab and initialized CDP bindings prepared by that skill.

## Workflow

1. Read [references/chrome-animation-inspection.md](references/chrome-animation-inspection.md).
2. Import [scripts/chrome-animation-inspection.mjs](scripts/chrome-animation-inspection.mjs) relative to this skill.
3. Reset before capturing `00-pre.png`.
4. Reset again, collect finite animations with
   `element.getAnimations({ subtree: true })` for the complete discovery
   window, then select every stable signature belonging to the requested
   motion.
5. Capture 0%, 25%, 50%, 75%, and 100%.
6. Reset and measure the same signatures live through their `finished`
   promises, including sequentially created animations.
7. Inspect every screenshot and record factual observations. When the requested
   motion concerns visual surface coverage, borders, outlines, clipping, or
   theme inversion, record those visible facts explicitly; do not rely only on
   geometry or layout deltas.
8. Require the helper readiness assertion to pass.
9. Always clean up inspection state. The caller closes the prepared tab when its pass ends.

If Chrome, CDP, screenshots, or matching browser-exposed animations are unavailable, return the shared `Blocked` artifact. Do not substitute another browser surface.

## Output

```text
Animation Inspection Ready
- Target: <manager | storybook>
- URL: <URL>
- Report: <path to report.md>
- Candidates: <selected stable signatures>
- Observations: <concise factual list>
- Limitations: <none or list>
```

Do not emit `PASS`, `FAIL`, `go`, or `ko`.
