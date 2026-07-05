---
revision: 1
date: 2026-08-09
---

# ScrollArea

## Overview

ScrollArea renders a native Base UI scroll container through one preassembled
Powercoach component. Use it when bounded content needs native vertical or
horizontal scrolling with Powercoach scrollbars.

ScrollArea does not expose the Base UI parts as public Powercoach components. It
assembles the Base UI root, viewport, content, vertical and horizontal
scrollbars, thumbs, and corner internally. Base UI owns native scrolling,
overflow detection, axis visibility, thumb sizing and position, pointer drag,
viewport focusability, keyboard interaction, touch interaction, root props,
root data attributes, and root CSS variables. Powercoach owns the overlay
scrollbar presentation and CSS visibility motion documented here.

## Anatomy

ScrollArea exposes one public component.

- `ScrollArea`: renders the preassembled Base UI Scroll Area and places its
  children inside the internal scrollable content.

```tsx
<ScrollArea>scrollable content</ScrollArea>
```

The internal Base UI anatomy is not a public Powercoach composition API. It
contains one viewport and content container, one vertical scrollbar and thumb,
one horizontal scrollbar and thumb, and one corner. Base UI omits a scrollbar
when its axis has no overflow and displays the corner only when both axes need
scrollbars.

## Examples

### EX-001 - Native vertical scrolling

Context: A consumer needs a bounded workout history that can overflow
vertically and remain usable with pointer, keyboard, and touch input.

Expected behavior: ScrollArea renders one vertical overlay scrollbar and omits
the horizontal scrollbar. The scrollbar is hidden while idle, fades in over
150 ms while the pointer is over the area or while vertical scrolling is
active, and fades out over 150 ms after interaction ends outside the area. The
scrollable viewport enters the keyboard order because it overflows, retains its
visible native focus indicator, and supports native keyboard scrolling. Merely
focusing the idle viewport does not reveal the scrollbar.

Covers: UC-001, UC-002, UC-004, UC-005

```tsx
import { ScrollArea } from '@powercoach/ui'

const sessions = Array.from({ length: 20 }, (_, index) => `Session ${index + 1}`)

export function WorkoutHistory() {
  return (
    <ScrollArea className="h-48 w-80 border border-foreground">
      <ol className="m-0 grid list-decimal gap-3 p-4 pl-10">
        {sessions.map((session) => (
          <li key={session}>{session}</li>
        ))}
      </ol>
    </ScrollArea>
  )
}
```

### EX-002 - Dual-axis overlay scrollbars

Context: A consumer needs to inspect a training matrix that overflows in both
directions without reserving scrollbar gutters or compensating content
padding.

Expected behavior: ScrollArea renders both 12 px overlay tracks and the
transparent 12 by 12 px structural corner. Each rectangular Foreground thumb
is 6 px thick across its track. The vertical thumb is aligned to the right with
the remaining transparent track surface mainly to its left; the horizontal
thumb is aligned to the bottom with the remaining transparent track surface
mainly above it. A 1 px transparent gap remains at the outer edge and at both
ends of each visible thumb. The complete 12 px transparent track remains
pointer-interactive without enlarging the Foreground thumb background. The
tracks do not create a visible gutter and intentionally cover the matrix when
visible. Either thumb remains visible while it is being dragged, including
after the pointer leaves the area, and fades out after the drag ends when the
pointer remains outside.

Covers: UC-001, UC-002, UC-003, UC-004

```tsx
import { ScrollArea } from '@powercoach/ui'

export function TrainingMatrix() {
  return (
    <ScrollArea className="h-64 w-80 border border-foreground">
      <div className="grid h-[40rem] w-[48rem] grid-cols-8 grid-rows-8 gap-px bg-foreground">
        {Array.from({ length: 64 }, (_, index) => (
          <div className="flex items-center justify-center bg-background" key={index}>
            {index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

### EX-003 - Reduced-motion scrollbar visibility

Context: A consumer uses the same vertically overflowing history while the
user requests reduced motion. The Storybook example provides a reduced-motion
media control and a visible status probe for the active preference.

Expected behavior: Hovering or scrolling still changes the scrollbar between
the same hidden and visible states, but the opacity change is immediate in both
directions. No duration or easing remains active while reduced motion is
requested.

Covers: UC-006

```tsx
import { ScrollArea } from '@powercoach/ui'

export function ReducedMotionHistory() {
  return (
    <ScrollArea className="h-40 w-72 border border-foreground">
      <div className="grid gap-3 p-4">
        {Array.from({ length: 16 }, (_, index) => (
          <p className="m-0" key={index}>
            Training entry {index + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
```

## ScrollArea

### Props

`ScrollAreaProps` includes Base UI Scroll Area Root props except for the Base UI
`children` anatomy. Powercoach owns `children` so it can assemble the internal
viewport, content, scrollbars, thumbs, and corner.

| Prop                    | Type                                                                                | Default | Description                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`                                                                   | None    | Content rendered inside the internal Base UI Content container.                                                                        |
| `overflowEdgeThreshold` | `number \| Partial<{ xStart: number; xEnd: number; yStart: number; yEnd: number }>` | `0`     | Passed to Base UI Root and controls the pixel threshold for its overflow-edge states.                                                  |
| `render`                | `Base UI ScrollArea.Root render prop`                                               | None    | Replaces or composes the outer root element while ScrollArea retains ownership of its preassembled internal anatomy.                   |
| `className`             | `Base UI ScrollArea.Root className prop`                                            | None    | Applies consumer classes to the outer root. Consumers use it to establish the bounded width and height needed for overflow.            |
| `style`                 | `Base UI ScrollArea.Root style prop`                                                | None    | Applies consumer styles to the outer root.                                                                                             |
| native div props        | `Base UI ScrollArea.Root native props`                                              | None    | Native div attributes, events, `aria-*`, `data-*`, and `ref` pass through to the outer root according to Base UI Scroll Area behavior. |

ScrollArea exposes no props for orientation, scrollbar thickness, thumb
appearance, visibility timing, motion, or the internal Base UI parts. Both axes
are always preassembled, and Base UI decides whether each axis has overflow.

### Events

ScrollArea defines no custom events. Native events passed through Base UI Root
apply to the outer root.

### Data Attributes

ScrollArea exposes the Base UI Root state attributes on its outer root.

| Attribute               | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `data-has-overflow-x`   | Present when content is wider than the viewport.              |
| `data-has-overflow-y`   | Present when content is taller than the viewport.             |
| `data-overflow-x-start` | Present when horizontal overflow remains at the inline start. |
| `data-overflow-x-end`   | Present when horizontal overflow remains at the inline end.   |
| `data-overflow-y-start` | Present when vertical overflow remains at the block start.    |
| `data-overflow-y-end`   | Present when vertical overflow remains at the block end.      |
| `data-scrolling`        | Present while the user scrolls inside ScrollArea.             |

Consumer `data-*` attributes may be passed through to the outer root.

### CSS Variables

ScrollArea exposes the Base UI Root corner-size variables on its outer root.

| Variable                      | Description                               |
| ----------------------------- | ----------------------------------------- |
| `--scroll-area-corner-height` | The height of the scrollbar intersection. |
| `--scroll-area-corner-width`  | The width of the scrollbar intersection.  |

ScrollArea defines no Powercoach CSS variables. Consumers cannot configure the
scrollbar appearance, thickness, visibility timing, or motion through public
CSS variables.

## Accessibility

ScrollArea preserves Base UI Scroll Area native scrolling and accessibility
semantics. The internal viewport is the actual scroll container. Base UI makes
it keyboard-focusable when it has overflow and omits it from the keyboard order
when it does not need scrolling.

The viewport retains a visible native browser focus indicator. ScrollArea does
not remove that indicator or replace it with a Powercoach container treatment.
Keyboard focus alone does not reveal an idle scrollbar.

When focused, the viewport keeps native keyboard scrolling, including arrow
keys, Page Up, Page Down, Home, and End where supported by the browser. A
resulting scroll reveals the scrollbar for the active axis. Touch scrolling
does the same without requiring hover.

The internal scrollbars and thumbs preserve Base UI pointer interaction and
drag behavior. A visible thumb remains available throughout an active drag,
including when the pointer leaves the outer root before the drag ends.

## Behavior

ScrollArea always assembles a vertical and a horizontal Base UI Scrollbar.
Base UI omits an axis when the viewport has no overflow on that axis. When both
axes overflow, the transparent Corner occupies their 12 by 12 px intersection
so the scrollbars do not overlap one another.

The scrollbars are overlaid on the viewport. ScrollArea reserves no scrollbar
gutter and adds no padding to compensate for the overlay. Visible scrollbars
may intentionally cover content. The vertical track is 12 px wide, the
horizontal track is 12 px high, and both tracks are transparent.

Powercoach styles only the scrollbars, thumbs, and structural corner.
ScrollArea adds no Powercoach background, border, radius, padding, or content
layout treatment to the root, viewport, or content. Consumers own the bounded
dimensions and any visible container or content presentation.

Each Thumb uses Foreground and has rectangular square-corner geometry. The
vertical thumb is 6 px wide and aligned to the right of its 12 px track; the
horizontal thumb is 6 px high and aligned to the bottom of its 12 px track. A
1 px transparent gap separates the visible thumb background from the outer
track edge and from both ends along its scrolling axis. The remainder of the
transparent pointer-interactive surface lies primarily to the left of the
vertical thumb and above the horizontal thumb. Base UI owns each thumb's length
and position according to the viewport and content.

While idle, each scrollbar has zero opacity and does not receive pointer
events. Both scrollbars become fully opaque and pointer-interactive while the
pointer is anywhere over ScrollArea. A scrollbar also becomes fully opaque and
pointer-interactive while its axis is actively scrolling or its thumb is being
dragged, including for keyboard and touch scrolling without hover.

When active scrolling or dragging ends, a scrollbar remains visible if the
pointer is still over ScrollArea. If the pointer is outside, it returns to the
hidden idle state. A focused viewport that is not scrolling remains in the
hidden idle state.

## Motion

ScrollArea uses the CSS animation engine.

Scrollbar visibility transitions only opacity. Entering and leaving the
visible state both use a 150 ms duration with linear easing. The same fade-in
applies when visibility is triggered by hover, pointer drag, keyboard
scrolling, touch scrolling, or another native scroll interaction. The same
fade-out applies when the last active trigger ends.

ScrollArea does not animate track or thumb size, thumb position, layout,
gutter, padding, or corner geometry as part of visibility changes.

When `prefers-reduced-motion: reduce` is active, ScrollArea removes the opacity
transition. The same hidden and visible states and interaction triggers remain,
but opacity changes immediately in both directions.

## Use Cases

### UC-001 - Render a preassembled native scroll area

Given a consumer renders `ScrollArea` with bounded dimensions and children
When the children overflow vertically, horizontally, in both directions, or not
at all
Then ScrollArea preserves native Base UI scrolling and renders only the
scrollbar axes needed for the detected overflow

### UC-002 - Overlay scrollbars without a gutter

Given ScrollArea has overflow on at least one axis
When a scrollbar becomes visible
Then its transparent 12 px pointer-interactive overlay track covers the
viewport without reserving a gutter or adding compensating content padding

### UC-003 - Present the approved thumb and corner geometry

Given ScrollArea overflows on both axes
When both scrollbars are displayed
Then each Foreground rectangular thumb is 6 px thick inside a 12 px transparent
pointer-interactive track, preserves the approved 1 px visual gaps, places the
remaining transparent surface mainly to the left for the vertical axis and
above for the horizontal axis, and the transparent 12 by 12 px corner prevents
the tracks from intersecting

### UC-004 - Reveal scrollbars during active interaction

Given ScrollArea has overflow and its scrollbars are idle and hidden
When the pointer enters the area or the user scrolls or drags through pointer,
keyboard, touch, or another native input
Then the relevant scrollbar becomes pointer-interactive and fades to full
opacity over 150 ms with linear easing, remains visible for the active trigger,
and fades to zero opacity over 150 ms after the last trigger ends outside the
area

### UC-005 - Preserve native keyboard scrolling and focus

Given ScrollArea has overflow
When the internal viewport receives keyboard focus
Then it retains its visible native focus indicator and native scrolling keys,
scrolling reveals the relevant scrollbar, and focus without scrolling leaves
the scrollbar hidden

### UC-006 - Respect reduced motion

Given the user requests reduced motion
When a scrollbar enters or leaves its visible state
Then the same state change happens immediately without an opacity transition
