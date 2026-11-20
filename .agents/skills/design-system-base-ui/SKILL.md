---
name: design-system-base-ui
description: Local Base UI 1.6 documentation snapshot for Powercoach UI. Use when any design-system skill needs Base UI component docs, handbook guidance, public API, accessibility behavior, state/data attributes, render override semantics, animation lifecycle, Motion integration patterns, or utilities such as mergeProps without crawling base-ui.com.
---

# Design System Base UI

Use this skill whenever Powercoach UI work needs Base UI knowledge.

Version tag: `Base UI 1.6 / @base-ui/react@1.6.x`.

## Hard Scope

- Serve the vendored Base UI 1.6 documentation snapshot from `references/base-ui-1.6`.
- Do not implement Powercoach components, tests, stories, specs, or migrations.
- Do not fetch `base-ui.com` during normal skill use.
- Do not rely on memory when local Base UI docs exist.
- If the local snapshot is missing a required page, report the missing local ref instead of guessing exact API behavior.

## Start Here

1. Read [references/base-ui-1.6/index.md](references/base-ui-1.6/index.md)
   completely to know the available documentation surface.
2. Use headings and `rg` to locate the API, accessibility, state, lifecycle, or
   utility sections required by the caller.
3. Read each selected section completely, including any immediately referenced
   constraints. Do not load unrelated demos or API parts.

## Routing

- Component API, anatomy, data attributes, CSS variables, accessibility, render overrides: read the relevant local component page plus local handbook pages.
- Composition or render overrides: read local composition, customization, TypeScript, and primitive docs.
- Animation, open/closed lifecycle, mounted or unmounted behavior, transition attributes, or Motion integration: read the local animation handbook and relevant local component page.
- Prop merging and className composition: read the local `react/utils/merge-props.md` page.
- Forms: read the local forms handbook and relevant Field, Form, Input, Select, Checkbox, Radio, or Number Field docs.

## Output

The caller owns its deliverable. Do not emit a separate Base UI report. Report only a required local reference that is missing or contradictory.
