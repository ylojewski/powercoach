---
revision: 1
date: 2026-08-14
---

# Bottom Sheet Migration

## Overview

The manager presents its routed Home overlay with the public Powercoach UI
BottomSheet instead of the legacy Coss drawer. The migration removes the
manager's dependency on Coss drawer presentation without changing the
overlay's route, entry point, copy, or route-owned closing behavior.

The only concrete overlay in this revision is the Home bottom sheet at
`/drawer`. It remains a modal overlay route whose URL is canonical whether it
opens over Home or is loaded directly.

## Entry Points

- The `Hello world` link on Home opens `/drawer` over the current background
  route.
- Loading `/drawer` directly opens the same bottom sheet without a background
  route.
- No additional bottom-sheet entry point is introduced by this revision.

## Product Behavior

### Presentation

The `/drawer` overlay uses the default public BottomSheet presentation:

- it enters from the bottom edge;
- it is full width and nearly full height;
- it indents the bounded manager surface behind it;
- it is modal and uses the BottomSheet backdrop, automatic handle, fixed
  geometry, internal scrolling, and default motion;
- it uses the default reduced-motion behavior from Powercoach UI.

The bottom sheet displays the existing copy verbatim and in this content order:

1. title `Hello drawer`;
2. description `This drawer is mounted by the home module route.`;
3. an explicit Close control labelled `close`;
4. content `Hello world`.

The Close control uses the default Powercoach Button size and variant with its
default reveal animation. Its placement immediately after the description is
temporary but is the approved placement for this revision.

### Routing

Opening from Home navigates to `/drawer` while retaining the original
background route. The Home screen remains visible as the indented background
surface.

Every accepted close request closes the bottom sheet through navigation:

- when the sheet was opened over a background route, closing returns through
  browser history to that original route;
- when `/drawer` was loaded directly, closing navigates to the fallback `/`.

The URL remains canonical throughout the workflow. Matching `/drawer` or one
of its descendant routes keeps this routed bottom sheet open.

### Dismissal

All default BottomSheet dismissal methods remain enabled:

- activating the explicit `close` control;
- pressing Escape;
- pressing the backdrop;
- swiping the sheet downward.

Each method follows the same route-owned closing behavior. No dismissal method
is disabled.

## States

### Closed

The bottom sheet is absent when `/drawer` and its descendants do not match the
current URL. Home remains the normal interactive application surface.

### Open Over A Background Route

The URL is `/drawer`, the Home route remains visible behind the modal sheet,
and the background surface receives the standard BottomSheet indentation.
Closing returns to the retained background route through history.

### Open From Direct Navigation

The URL is `/drawer`, the sheet is open without retained background navigation
state, and closing navigates to `/`.

### Closing

Any enabled dismissal method requests the same navigation outcome. The sheet
uses the public BottomSheet closing transition before the closed route state is
settled.

## Data And API

The sheet has no data loading, mutation, form, Redux state, or multi-step
workflow. This migration does not add any API interaction.

## Accessibility

- The bottom sheet is a modal dialog labelled by `Hello drawer` and described
  by `This drawer is mounted by the home module route.`.
- The explicit `close` Button is keyboard operable and has the accessible name
  `close`.
- Opening uses the default BottomSheet modal focus management and scroll lock.
- Closing through any supported method restores focus according to the public
  BottomSheet contract.
- Escape dismissal and reduced-motion behavior remain available.
- The reveal layer on the Close Button is decorative and does not add another
  control, accessible name, focus target, or action.

## Examples

### EX-001 - Open From Home And Close

Given the user is on Home

When the user activates the `Hello world` link

Then the URL becomes `/drawer`, Home remains visible as the indented background,
and the BottomSheet shows the approved title, description, Close Button, and
content in order. Activating `close` returns the user to the original Home
route.

### EX-002 - Open Directly And Dismiss

Given the user loads `/drawer` directly

When the BottomSheet opens and the user dismisses it through Escape, backdrop
press, or downward swipe

Then the sheet closes and the manager navigates to `/`.

## Use Cases

### UC-001 - Replace The Coss Drawer Presentation

Given the manager renders its routed Home overlay

When `/drawer` is active

Then the overlay is presented by Powercoach UI BottomSheet and no Coss drawer
presentation is used.

### UC-002 - Open Over Home

Given the user is on Home

When the user activates `Hello world`

Then the manager navigates to `/drawer`, preserves the background route, and
opens the BottomSheet over the indented Home surface.

### UC-003 - Preserve The Approved Copy And Order

Given the BottomSheet is open

Then it shows `Hello drawer`, `This drawer is mounted by the home module route.`,
the `close` control, and `Hello world` in that order.

### UC-004 - Render The Temporary Close Control

Given the BottomSheet is open

Then `close` is rendered immediately after the description as a default
Powercoach Button with the default reveal animation.

### UC-005 - Close To The Background Route

Given the BottomSheet was opened over a retained background route

When the user closes it through any enabled dismissal method

Then the manager returns through history to that original route.

### UC-006 - Close A Direct Entry

Given `/drawer` was loaded without a retained background route

When the user closes the BottomSheet through any enabled dismissal method

Then the manager navigates to `/`.

### UC-007 - Support Every Default Dismissal Method

Given the BottomSheet is open

When the user activates `close`, presses Escape, presses the backdrop, or
swipes downward

Then the BottomSheet accepts the dismissal and follows the route-owned closing
behavior.

### UC-008 - Keep The URL Canonical

Given the current URL matches `/drawer` or one of its descendants

Then the routed BottomSheet remains open, and closing changes navigation rather
than maintaining independent application open state.

### UC-009 - Preserve Accessible Modal Behavior

Given the BottomSheet opens or closes

Then it provides the approved accessible title, description, Close Button,
modal focus management, scroll lock, focus restoration, Escape dismissal, and
reduced-motion behavior from the public BottomSheet and Button contracts.

## Out Of Scope

- Changing the `/drawer` route or the `Hello world` Home entry point.
- Rewriting the title, description, content, or legacy word `drawer` in the
  approved copy.
- Adding data access, forms, mutations, or a multi-step workflow.
- Adding another concrete routed bottom sheet or a nested bottom-sheet flow.
- Defining a permanent Close control position beyond the temporary approved
  placement in this revision.
- Preserving a Coss compatibility layer.
