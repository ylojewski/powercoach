---
revision: 8
date: 2026-08-10
---

# Autocomplete

## Overview

Autocomplete renders a Powercoach free-form text field whose current input may
be completed from a filtered suggestion popup. It preserves Base UI
Autocomplete 1.6 semantics, accessibility, generic item inference, state,
events, filtering, positioning, render composition, and transition lifecycle.

Autocomplete is not a strict selection control. A submitted value may be text
that does not match an item. Use Combobox instead when the product requires a
remembered selection from a predefined set.

Powercoach adds one shared Root size, a mandatory decorative AddOn whenever the
Powercoach InputGroup surface is used, Input-equivalent field presentation,
Button ghost chrome at icon-prefixed sizes for InputGroup controls, fixed
decorative control icons, PopupSurface composition for grouped layout, muted
group labels, Popup chrome, and Item Icon plus Text presentation, an exact
one-pixel anchor gap, an exact anchor-width Popup, automatic flat and grouped
object presentation, AddOn-aligned decorative row icons, CSS Clear fading, and
stable closing results.

Autocomplete.Popup, Autocomplete.Group, Autocomplete.GroupLabel, and
Autocomplete.Item consume the public semantic-free PopupSurface family.
PopupSurface.Root owns their shared border, colors, hard shadow, and CSS scale
and opacity lifecycle. PopupSurface.Group owns neutral grouped layout.
PopupSurface.GroupLabel owns only presentation-agnostic render composition.
Autocomplete owns GroupLabel's muted Heading, logical inset, decorative Icon,
and row geometry. PopupSurface.Item owns the exact xs, md, and xl row geometry,
Text, decorative Icon slot, default scale-1 RevealAnimation, and immediate false
fallback. Autocomplete remains the sole owner of autocomplete semantics, state,
values, highlighting, grouping relationships, events, positioning, render
replacements, and refs.

Root does not require InputGroup. Base UI compositions with a standalone Input,
an Input inside Popup, a trigger-only grid picker, an always-open inline list,
or a command palette inside another modal remain valid.

Autocomplete.Backdrop remains available because it belongs to the preserved
Base UI namespace. Powercoach adds no Backdrop appearance, shadow, or motion.

## Anatomy

Autocomplete is a non-callable namespace with twenty-two public parts and two
hooks.

- Autocomplete.Root: coordinates value, open state, filtering, items, focus,
  form behavior, and the Powercoach size.
- Autocomplete.InputGroup: renders the optional Powercoach field surface.
- Autocomplete.AddOn: renders its mandatory decorative visual identifier.
- Autocomplete.Input: renders the Base UI text control.
- Autocomplete.Trigger: toggles or opens the popup and consumes Button ghost
  chrome at an icon-prefixed size inside InputGroup.
- Autocomplete.Icon: renders the fixed decorative ChevronUpDownIcon trigger
  indicator.
- Autocomplete.Clear: clears the current value, consumes Button ghost chrome at
  an icon-prefixed size inside InputGroup, and renders a fixed decorative
  XIcon with CSS opacity fading.
- Autocomplete.Value: exposes the current value to consumer content.
- Autocomplete.Portal: portals popup layers.
- Autocomplete.Backdrop: preserves the unstyled Base UI backdrop part.
- Autocomplete.Positioner: anchors Popup at the fixed one-pixel Powercoach gap.
- Autocomplete.Popup: renders the Base UI suggestion popup through the shared
  PopupSurface Root chrome.
- Autocomplete.Arrow: points Popup toward its anchor.
- Autocomplete.Status: announces status content politely.
- Autocomplete.Empty: announces empty-list content politely.
- Autocomplete.List: renders a flat or grouped item collection.
- Autocomplete.Row: groups one grid row.
- Autocomplete.Item: renders one suggested value or command through the shared
  PopupSurface Item with optional AddOn-aligned decorative Icon, Text, and
  default RevealAnimation presentation.
- Autocomplete.Group: groups related items through the shared PopupSurface
  Group presentation.
- Autocomplete.GroupLabel: preserves the Base UI Group association through the
  presentation-agnostic PopupSurface GroupLabel composition while Autocomplete
  supplies muted Heading and optional decorative Icon presentation.
- Autocomplete.Separator: separates list regions.
- Autocomplete.Collection: renders filtered items inside Group.
- Autocomplete.useFilter: returns locale-aware matching helpers.
- Autocomplete.useFilteredItems: reads the internally filtered item array.

Root does not require InputGroup. Whenever InputGroup is rendered, its semantic
subtree requires exactly one AddOn and exactly one Input. Clear and Trigger are
optional. Icon and Value remain composable with their Base UI owners.
Non-interactive layout wrappers are accepted, so required parts do not have to
be direct children.

```tsx
<Autocomplete.Root items={items}>
  <Autocomplete.InputGroup>
    <Autocomplete.AddOn>
      <SearchIcon />
    </Autocomplete.AddOn>
    <Autocomplete.Input />
    <Autocomplete.Clear aria-label="Clear" />
    <Autocomplete.Trigger>
      <Autocomplete.Icon />
    </Autocomplete.Trigger>
  </Autocomplete.InputGroup>

  <Autocomplete.Portal>
    <Autocomplete.Positioner>
      <Autocomplete.Popup>
        <Autocomplete.Status />
        <Autocomplete.Empty />
        <Autocomplete.List>{(item) => <Autocomplete.Item value={item} />}</Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete.Positioner>
  </Autocomplete.Portal>
</Autocomplete.Root>
```

### Public Exports

| Export                                | Description                                                   |
| ------------------------------------- | ------------------------------------------------------------- |
| Autocomplete                          | Non-callable namespace containing every public part and hook. |
| AutocompleteNamespace                 | Type of the public namespace object.                          |
| AutocompleteRoot                      | Direct Root component export.                                 |
| AutocompleteInputGroup                | Direct InputGroup component export.                           |
| AutocompleteAddOn                     | Direct AddOn component export.                                |
| AutocompleteInput                     | Direct Input component export.                                |
| AutocompleteTrigger                   | Direct Trigger component export.                              |
| AutocompleteIcon                      | Direct Icon component export.                                 |
| AutocompleteClear                     | Direct Clear component export.                                |
| AutocompleteValue                     | Direct Value component export.                                |
| AutocompletePortal                    | Direct Portal component export.                               |
| AutocompleteBackdrop                  | Direct Backdrop component export.                             |
| AutocompletePositioner                | Direct Positioner component export.                           |
| AutocompletePopup                     | Direct Popup component export.                                |
| AutocompleteArrow                     | Direct Arrow component export.                                |
| AutocompleteStatus                    | Direct Status component export.                               |
| AutocompleteEmpty                     | Direct Empty component export.                                |
| AutocompleteList                      | Direct List component export.                                 |
| AutocompleteRow                       | Direct Row component export.                                  |
| AutocompleteItem                      | Direct Item component export.                                 |
| AutocompleteGroup                     | Direct Group component export.                                |
| AutocompleteGroupLabel                | Direct GroupLabel component export.                           |
| AutocompleteSeparator                 | Direct Separator component export.                            |
| AutocompleteCollection                | Direct Collection component export.                           |
| useAutocompleteFilter                 | Direct Autocomplete.useFilter hook export.                    |
| useAutocompleteFilteredItems          | Direct Autocomplete.useFilteredItems hook export.             |
| FieldSize                             | Package-level xs, md, and xl size contract owned by Input.    |
| AutocompleteSize                      | Alias of PopupSurfaceSize and FieldSize.                      |
| AutocompleteAddOnPosition             | Alias-compatible union of start and end.                      |
| AutocompleteFilter                    | Base UI locale-aware matching helper type.                    |
| AutocompleteFilterOptions             | Base UI matching locale options.                              |
| AutocompleteRootActions               | Base UI imperative Root actions.                              |
| AutocompleteRootChangeEventReason     | Base UI value and open change reason union.                   |
| AutocompleteRootChangeEventDetails    | Base UI cancellable change details.                           |
| AutocompleteRootHighlightEventReason  | Base UI item-highlight reason union.                          |
| AutocompleteRootHighlightEventDetails | Base UI item-highlight details.                               |
| AutocompleteItemIcon                  | Alias of PopupSurfaceItemIcon.                                |
| AutocompleteItemOption                | Flat automatic object shape with icon and text.               |
| AutocompleteGroupOption               | Grouped automatic object shape with icon, text, and items.    |
| AutocompleteItemRevealAnimationProps  | Alias of PopupSurfaceItemRevealAnimationProps.                |

The package also exports AutocompleteRootProps and the complete prefixed Props
and State aliases for InputGroup, AddOn, Input, Trigger, Icon, Clear, Value,
Portal, Backdrop, Positioner, Popup, Arrow, Status, Empty, List, Row, Item,
Group, GroupLabel, Separator, and Collection.

## Examples

### EX-001 - Labeled default Autocomplete

Context: A workout form needs a free-form athlete search with optional
suggestions and Powercoach field presentation.

Expected behavior: Root uses the default xl size. Field.Label names Input and
uses its existing Heading contract. AddOn is decorative. Clear and Trigger use
the xl-to-Button-icon-md ghost chrome mapping without nested Button semantics,
Clear owns XIcon, Icon owns ChevronUpDownIcon, and the Clear slot remains stable
while its Base UI visibility fades over 200ms linear. Focusing Input applies
field-emphasis. The object items render automatically with decorative
Root-sized icons in AddOn-aligned row slots and text conversion. Inactive Empty
contributes no whitespace, and a highlighted Item consumes PopupSurface.Item
with scale-1 RevealAnimation across the complete bg-background and
text-foreground row.
Selecting an item completes the text without turning the field into a strict
selection control. Popup remains exactly one pixel from the InputGroup border
box on every collision-resolved side. Popup matches the anchor border-box
width, consumes PopupSurface.Root with the xl Input-matched hard shadow, aligns
Item text with Input text, and uses the shared scale-0.9 CSS entrance and exit.

Covers: UC-020, UC-024, UC-029, UC-001, UC-002, UC-003, UC-004, UC-005, UC-006,
UC-007, UC-009, UC-010, UC-015, UC-016, UC-017, UC-023, UC-025, UC-026,
UC-028

```tsx
import { Search, UserRound } from 'lucide-react'
import { Autocomplete, Field } from '@powercoach/ui'

const athletes = [
  { text: 'Yann', icon: <UserRound /> },
  { text: 'Amina', icon: <UserRound /> },
  { text: 'Jo', icon: <UserRound /> },
  { text: 'Maya', icon: <UserRound /> }
]

export function AthleteAutocomplete() {
  return (
    <Field.Root name="athlete">
      <Field.Label>Athlete</Field.Label>
      <Autocomplete.Root items={athletes}>
        <Autocomplete.InputGroup>
          <Autocomplete.AddOn>
            <Search />
          </Autocomplete.AddOn>
          <Autocomplete.Input placeholder="Search athletes…" />
          <Autocomplete.Clear aria-label="Clear athlete" />
          <Autocomplete.Trigger aria-label="Show athlete suggestions">
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
        </Autocomplete.InputGroup>
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.Empty>No athlete found.</Autocomplete.Empty>
              <Autocomplete.List />
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      <Field.Description
        waitingKey="athlete-help"
        waitingContent="Enter a name or choose an optional suggestion."
      />
    </Field.Root>
  )
}
```

### EX-002 - Shared sizes and both AddOn positions

Context: A consumer needs the three field sizes and a logical-end identifier in
one right-to-left-compatible field.

Expected behavior: Every Root coordinates InputGroup, AddOn, Input, Clear,
Trigger, Icon, Button ghost chrome at icon-prefixed sizes, popup typography and
row density, field-emphasis offsets, and descendant SVG size. xs maps to Button
icon-xs ghost chrome with the Autocomplete-owned size-6 and size-3 SVG
exception, md maps to Button icon-sm ghost chrome at size 8 with size-4 SVG,
and xl maps to Button icon-md ghost chrome at size 9 with size-4 SVG. AddOn and
optional decorative row-icon slots follow the logical inline axis, and popup
content aligns to the corresponding Input text axis. Every collision-resolved
Popup side uses the same one-pixel gap at xs, md, and xl. PopupSurface Root
shadows match the three Input shadow offsets at 0.125rem, 0.1875rem, and
0.25rem. Explicit List callback content remains authoritative while each
highlighted row uses PopupSurface Item with default scale-1 RevealAnimation.

Covers: UC-003, UC-004, UC-006, UC-007, UC-008, UC-009, UC-010, UC-015,
UC-020, UC-023, UC-025, UC-029

```tsx
import { Search, UserRound } from 'lucide-react'
import { Autocomplete } from '@powercoach/ui'

const names = ['Amina', 'Jo', 'Maya']

export function AutocompleteSizes() {
  return (
    <div className="grid gap-4">
      {(['xs', 'md', 'xl'] as const).map((size, index) => (
        <Autocomplete.Root key={size} items={names} size={size}>
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn position={index === 1 ? 'end' : 'start'}>
              {index === 1 ? <UserRound /> : <Search />}
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label={`${size} athlete`} placeholder={size} />
            <Autocomplete.Clear aria-label={`Clear ${size} athlete`} />
            <Autocomplete.Trigger aria-label={`Show ${size} suggestions`}>
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
          </Autocomplete.InputGroup>
          <Autocomplete.Portal>
            <Autocomplete.Positioner>
              <Autocomplete.Popup>
                <Autocomplete.List>
                  {(name: string) => (
                    <Autocomplete.Item key={name} value={name} icon={<UserRound />}>
                      {name}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      ))}
    </div>
  )
}
```

### EX-003 - Controlled value, open state, and completion probes

Context: A consumer needs externally controlled value and popup state while
observing Base UI reasons and CSS lifecycle completion.

Expected behavior: value, open, change details, event cancellation APIs, and
onOpenChangeComplete preserve Base UI semantics. The visible outputs show the
latest value reason, open reason, highlighted index, and completed phase.
Closing during entrance reverses smoothly from the current computed scale and
opacity. When deleting the final character closes an open Popup, Input becomes
empty immediately while the last filtered collection and announcement
children remain visibly frozen for the CSS exit; the snapshot is released on
reopening or close completion.

Covers: UC-002, UC-006, UC-014, UC-016, UC-017, UC-018, UC-021

```tsx
'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Autocomplete } from '@powercoach/ui'

const exercises = ['Deadlift', 'Front squat', 'Pull-up']

export function ControlledAutocomplete() {
  const [value, setValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState('none')
  const [phase, setPhase] = React.useState('closed')
  const [highlight, setHighlight] = React.useState(-1)

  return (
    <div className="grid gap-2">
      <Autocomplete.Root
        items={exercises}
        value={value}
        onValueChange={(nextValue, details) => {
          setReason(details.reason)
          setValue(nextValue)
        }}
        open={open}
        onOpenChange={(nextOpen, details) => {
          setReason(details.reason)
          setOpen(nextOpen)
        }}
        onOpenChangeComplete={(nextOpen) => setPhase(nextOpen ? 'open' : 'closed')}
        onItemHighlighted={(_, details) => setHighlight(details.index)}
      >
        <Autocomplete.InputGroup>
          <Autocomplete.AddOn>
            <Search />
          </Autocomplete.AddOn>
          <Autocomplete.Input aria-label="Exercise" />
          <Autocomplete.Clear aria-label="Clear exercise" />
        </Autocomplete.InputGroup>
        <Autocomplete.Portal keepMounted>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.List>
                {(exercise: string) => (
                  <Autocomplete.Item key={exercise} value={exercise}>
                    {exercise}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      <output>
        value: {value || 'empty'}; reason: {reason}; highlighted: {highlight}; phase: {phase}
      </output>
    </div>
  )
}
```

### EX-004 - Grouped and complex items

Context: Athlete suggestions need a muted group heading, primary and secondary
text, a status detail, and link semantics for one item.

Expected behavior: Group and GroupLabel preserve their Base UI grouping and
label association while consuming PopupSurface.Group and
PopupSurface.GroupLabel on those same final elements. PopupSurface GroupLabel
remains presentation-agnostic while Autocomplete supplies muted Heading with
the Root-derived size, inset, and decorative Icon geometry. The one rendered
anchor receives Base UI option props, ref, highlighted state, and one owned
RevealAnimation subtree. The Root-derived PopupSurface Item passes the
authoritative complex children unchanged through RevealAnimation's real and
decorative copies. GroupLabel and Item use the md Input text axis and size-8
minimum row height, while the complex Item grows as needed. Inactive Empty
contributes no top whitespace. Entering a value that matches no athlete shows
the mounted polite empty state before List with the existing athlete copy and no
empty grouped row defect.

Covers: UC-008, UC-009, UC-010, UC-011, UC-015, UC-022, UC-025, UC-028,
UC-029

```tsx
import { Search } from 'lucide-react'
import { Autocomplete, Text } from '@powercoach/ui'

const teams = [
  {
    value: 'Power',
    items: [
      { id: 'amina', name: 'Amina', discipline: 'Powerlifting' },
      { id: 'maya', name: 'Maya', discipline: 'Weightlifting' }
    ]
  }
]

export function GroupedAthletes() {
  return (
    <Autocomplete.Root items={teams} size="md" itemToStringValue={(athlete) => athlete.name}>
      <Autocomplete.InputGroup>
        <Autocomplete.AddOn>
          <Search />
        </Autocomplete.AddOn>
        <Autocomplete.Input aria-label="Grouped athlete search" />
      </Autocomplete.InputGroup>
      <Autocomplete.Portal>
        <Autocomplete.Positioner>
          <Autocomplete.Popup>
            <Autocomplete.Empty>No athlete found.</Autocomplete.Empty>
            <Autocomplete.List>
              {(team: (typeof teams)[number]) => (
                <Autocomplete.Group key={team.value} items={team.items}>
                  <Autocomplete.GroupLabel>{team.value}</Autocomplete.GroupLabel>
                  <Autocomplete.Collection>
                    {(athlete: (typeof team.items)[number]) => (
                      <Autocomplete.Item
                        key={athlete.id}
                        value={athlete}
                        render={<a href={`/athletes/${athlete.id}`} />}
                      >
                        <span className="grid">
                          <span>{athlete.name}</span>
                          <Text size="xs" tone="muted">
                            {athlete.discipline}
                          </Text>
                        </span>
                        <span>active</span>
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.Collection>
                </Autocomplete.Group>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )
}
```

### EX-005 - Async externally filtered results

Context: A remote exercise search needs cancellable requests, custom loading
copy, and no second client-side filtering pass.

Expected behavior: filter null lets the controlled async item array remain
authoritative. Status stays mounted and announces loading or result copy
politely. Empty stays mounted and announces its children when no item remains.
The public locale-aware filter hook can be used by the external search layer.

Covers: UC-002, UC-010, UC-012, UC-013

```tsx
'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Autocomplete } from '@powercoach/ui'

const catalog = ['Deadlift', 'Front squat', 'Pull-up', 'Push press']

export function AsyncExerciseAutocomplete() {
  const [value, setValue] = React.useState('')
  const [results, setResults] = React.useState<string[]>([])
  const [pending, startTransition] = React.useTransition()
  const { contains } = Autocomplete.useFilter()

  return (
    <Autocomplete.Root
      items={results}
      value={value}
      filter={null}
      onValueChange={(nextValue) => {
        setValue(nextValue)
        startTransition(() => {
          setResults(catalog.filter((item) => contains(item, nextValue)))
        })
      }}
    >
      <Autocomplete.InputGroup>
        <Autocomplete.AddOn>
          <Search />
        </Autocomplete.AddOn>
        <Autocomplete.Input aria-label="Async exercise search" />
      </Autocomplete.InputGroup>
      <Autocomplete.Portal>
        <Autocomplete.Positioner>
          <Autocomplete.Popup aria-busy={pending || undefined}>
            <Autocomplete.Status>
              {pending ? 'Searching…' : `${results.length} results`}
            </Autocomplete.Status>
            <Autocomplete.Empty>No exercise found.</Autocomplete.Empty>
            <Autocomplete.List>
              {(exercise: string) => (
                <Autocomplete.Item key={exercise} value={exercise}>
                  {exercise}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )
}
```

### EX-006 - Inline completion modes

Context: A consumer needs to compare list-only suggestions and inline
autocompletion.

Expected behavior: mode list keeps the typed text while highlighting
suggestions. mode both presents the list and previews the highlighted item
inline according to Base UI. The other documented values inline and none remain
available with their Base UI aria-autocomplete behavior.

Covers: UC-012

```tsx
import { Search } from 'lucide-react'
import { Autocomplete } from '@powercoach/ui'

const tags = ['feature', 'fix', 'mobile']

export function CompletionModes() {
  return (
    <div className="grid gap-4">
      {(['list', 'both'] as const).map((mode) => (
        <Autocomplete.Root key={mode} items={tags} mode={mode}>
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn>
              <Search />
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label={`${mode} tag completion`} />
          </Autocomplete.InputGroup>
          <Autocomplete.Portal>
            <Autocomplete.Positioner>
              <Autocomplete.Popup>
                <Autocomplete.List>
                  {(tag: string) => (
                    <Autocomplete.Item key={tag} value={tag}>
                      {tag}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        </Autocomplete.Root>
      ))}
    </div>
  )
}
```

### EX-007 - Trigger-only grid with Input inside Popup

Context: A text editor needs a trigger-only emoji picker whose search field
lives in the grid popup.

Expected behavior: Root renders no InputGroup. Trigger has an accessible name,
grid enables grid keyboard semantics, Input inside Popup has its own accessible
name, Row supplies grid rows, and selecting an Item preserves Base UI item
events and closes according to controlled Root logic.

Covers: UC-001, UC-005, UC-013, UC-014

```tsx
import { Autocomplete } from '@powercoach/ui'

const emojiRows = [
  ['😀', '🙂', '🏋️'],
  ['🚴', '🏃', '🧘']
]

export function EmojiGrid() {
  return (
    <Autocomplete.Root items={emojiRows} grid>
      <Autocomplete.Trigger aria-label="Choose emoji">😀</Autocomplete.Trigger>
      <Autocomplete.Portal>
        <Autocomplete.Positioner align="end">
          <Autocomplete.Popup aria-label="Emoji picker">
            <Autocomplete.Input aria-label="Search emojis" />
            <Autocomplete.List>
              {(row: string[]) => (
                <Autocomplete.Row key={row.join('-')}>
                  {row.map((emoji) => (
                    <Autocomplete.Item key={emoji} value={emoji}>
                      {emoji}
                    </Autocomplete.Item>
                  ))}
                </Autocomplete.Row>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )
}
```

### EX-008 - Command palette inside a Dialog

Context: A modal command palette needs an always-open Autocomplete that filters
actions without creating a second modal or Powercoach Backdrop.

Expected behavior: Dialog owns modality, labeling, focus containment, and its
Backdrop. Autocomplete uses open and inline within that modal, a standalone
named Input, grouped commands, and Item click handlers. Autocomplete.Backdrop
is not rendered and has no Powercoach treatment.

Covers: UC-001, UC-005, UC-011, UC-014, UC-019

```tsx
import { Dialog } from '@base-ui/react/dialog'
import { Autocomplete } from '@powercoach/ui'

const commands = [
  { value: 'Navigation', items: ['Open workouts', 'Open athletes'] },
  { value: 'Actions', items: ['Create workout', 'Invite athlete'] }
]

export function CommandPalette() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open command palette</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup aria-label="Command palette">
            <Autocomplete.Root open inline items={commands}>
              <Autocomplete.Input aria-label="Search commands" />
              <Autocomplete.Empty>No command found.</Autocomplete.Empty>
              <Autocomplete.List>
                {(group: (typeof commands)[number]) => (
                  <Autocomplete.Group key={group.value} items={group.items}>
                    <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {(command: string) => (
                        <Autocomplete.Item key={command} value={command}>
                          {command}
                        </Autocomplete.Item>
                      )}
                    </Autocomplete.Collection>
                  </Autocomplete.Group>
                )}
              </Autocomplete.List>
            </Autocomplete.Root>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

### EX-009 - Automatic grouped objects with decorative icons

Context: Exercise suggestions need automatic grouped presentation with one
decorative group icon and one decorative icon for every exercise.

Expected behavior: Root recognizes the grouped object shape. List renders each
Group, GroupLabel, Collection, and Item without a callback. Base UI owns the
group association while PopupSurface.Group provides the shared grouped layout
and PopupSurface.GroupLabel provides presentation-agnostic composition.
Autocomplete owns the muted label and decorative Icon presentation. Group text
labels the group without RevealAnimation. Group and Item icons are hidden, inert,
pointer-inert, placed in row-local slots on the start AddOn axis, and normalized
to the md AddOn SVG size. The slots render without a List background surface.
Item text supplies filtering, completion, visible input value, and form
serialization. Inactive Empty adds no top whitespace. Pointer or keyboard
highlight reveals the complete bg-background and text-foreground Item row,
including its icon slot, at scale 1.

Covers: UC-027, UC-002, UC-008, UC-009, UC-010, UC-012, UC-013, UC-023,
UC-025, UC-028

```tsx
import { Dumbbell, Search, UsersRound } from 'lucide-react'
import { Autocomplete } from '@powercoach/ui'

const exerciseGroups = [
  {
    text: 'Strength',
    icon: <Dumbbell />,
    items: [
      { text: 'Deadlift', icon: <Dumbbell /> },
      { text: 'Front squat', icon: <Dumbbell /> }
    ]
  },
  {
    text: 'Athletes',
    icon: <UsersRound />,
    items: [
      { text: 'Amina', icon: <UsersRound /> },
      { text: 'Maya', icon: <UsersRound /> }
    ]
  }
]

export function AutomaticGroupedExercises() {
  return (
    <Autocomplete.Root items={exerciseGroups} size="md">
      <Autocomplete.InputGroup>
        <Autocomplete.AddOn>
          <Search />
        </Autocomplete.AddOn>
        <Autocomplete.Input aria-label="Search grouped exercises" />
        <Autocomplete.Clear aria-label="Clear grouped exercise search" />
      </Autocomplete.InputGroup>
      <Autocomplete.Portal>
        <Autocomplete.Positioner>
          <Autocomplete.Popup>
            <Autocomplete.Empty>No exercise found.</Autocomplete.Empty>
            <Autocomplete.List />
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  )
}
```

### EX-010 - Existing className and reveal overrides

Context: One consumer needs custom Item colors with the default reveal, a
custom copied-content scale, and the immediate highlighted fallback.

Expected behavior: The List callback remains authoritative. Each state-aware
Item className is evaluated once, preserved on the semantic Item, and merged
after bg-background and text-foreground on both Reveal visual copies. The first
Item therefore replaces the default colors and uses the Autocomplete-owned
scale 1. The second Item also replaces the colors and its object form overrides
the copied-content scale. The third Item uses revealAnimationProps false, so
only the semantic Item renders and keeps the complete immediate highlighted
foreground/background inversion. Repeated non-color effects from the shared
className string are consumer-owned. A second inline Root omits InputGroup and
AddOn, so its automatic object icons use the logical-start fallback slots
without adding a collection-wide background surface.

Covers: UC-009, UC-014, UC-015, UC-023, UC-025, UC-026

```tsx
import { Dumbbell, Search } from 'lucide-react'
import { Autocomplete } from '@powercoach/ui'

const exerciseOptions = [
  { text: 'Deadlift', icon: <Dumbbell /> },
  { text: 'Front squat', icon: <Dumbbell /> },
  { text: 'Push press', icon: <Dumbbell /> }
]

export function AutocompletePresentationOverrides() {
  return (
    <div className="grid gap-4">
      <Autocomplete.Root items={exerciseOptions} size="md">
        <Autocomplete.InputGroup>
          <Autocomplete.AddOn>
            <Search />
          </Autocomplete.AddOn>
          <Autocomplete.Input aria-label="Exercises with custom item colors" />
        </Autocomplete.InputGroup>
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.List>
                {(item: (typeof exerciseOptions)[number], index: number) => (
                  <Autocomplete.Item
                    key={item.text}
                    value={item}
                    icon={item.icon}
                    className="bg-accent text-accent-foreground"
                    revealAnimationProps={
                      index === 1 ? { scale: 1.1 } : index === 2 ? false : undefined
                    }
                  >
                    {item.text}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>

      <Autocomplete.Root items={exerciseOptions} size="md" open inline>
        <Autocomplete.Input aria-label="Standalone exercise search" />
        <Autocomplete.List />
      </Autocomplete.Root>
    </div>
  )
}
```

## Root

### Props

AutocompleteSize aliases both PopupSurfaceSize and the package-level FieldSize.
The names remain assignable and preserve the xs, md, and xl union.

```ts
type AutocompleteSize = PopupSurfaceSize

type AutocompleteItemIcon = PopupSurfaceItemIcon

type AutocompleteItemRevealAnimationProps = PopupSurfaceItemRevealAnimationProps

type AutocompleteItemOption = {
  icon?: AutocompleteItemIcon
  text: string
}

type AutocompleteGroupOption<ItemValue = AutocompleteItemOption> = {
  icon?: AutocompleteItemIcon
  text: string
  items: readonly ItemValue[]
}
```

AutocompleteRootProps preserves Base UI generic arbitrary flat and grouped
items and adds convenience overloads for the two Powercoach object shapes. The
public overload order is grouped convenience, flat convenience, arbitrary
grouped, then arbitrary flat. A grouped convenience Root infers its Item value
from the group items array rather than from the group object.

Convenience shapes are structural. Extra fields are allowed and remain part of
the consumer value, but Autocomplete does not spread them onto any rendered
part. Automatic presentation activates only when the complete active
collection conforms to one approved shape. Root otherwise preserves the
existing arbitrary item contract. Root adds only size to Base UI behavior.

| Prop                 | Type or values                                | Default                | Description                                                                                                                 |
| -------------------- | --------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| size                 | xs, md, or xl                                 | xl                     | Coordinates the Powercoach field and typography treatment.                                                                  |
| children             | React.ReactNode                               | None                   | Any valid Base UI Autocomplete composition.                                                                                 |
| id                   | string                                        | Base UI                | Identifies the control and related popup parts.                                                                             |
| name                 | string                                        | None                   | Identifies the submitted free-form value.                                                                                   |
| form                 | string                                        | None                   | Associates the control with a form.                                                                                         |
| formAutoComplete     | string                                        | None                   | Preserves native form autocomplete behavior.                                                                                |
| required             | boolean                                       | false                  | Requires a non-empty text value; it does not require an item match.                                                         |
| readOnly             | boolean                                       | false                  | Prevents user edits while preserving Base UI read-only behavior.                                                            |
| disabled             | boolean                                       | false                  | Disables the Autocomplete family.                                                                                           |
| defaultValue         | string, number, or string array               | None                   | Initial uncontrolled input value.                                                                                           |
| value                | string, number, or string array               | None                   | Controlled input value.                                                                                                     |
| onValueChange        | Function receiving value and change details   | None                   | Preserves Base UI value requests and cancellable details.                                                                   |
| defaultOpen          | boolean                                       | false                  | Initial uncontrolled popup state.                                                                                           |
| open                 | boolean                                       | None                   | Controlled popup state.                                                                                                     |
| onOpenChange         | Function receiving open and change details    | None                   | Preserves Base UI open requests and cancellable details.                                                                    |
| onOpenChangeComplete | Function receiving final open state           | None                   | Runs after Base UI detects transition completion.                                                                           |
| openOnInputClick     | boolean                                       | Base UI                | Preserves Base UI input-click opening.                                                                                      |
| autoHighlight        | Base UI auto-highlight values                 | Base UI                | Preserves automatic highlight behavior.                                                                                     |
| keepHighlight        | boolean                                       | Base UI                | Preserves highlight when pointer or focus changes.                                                                          |
| highlightItemOnHover | boolean                                       | Base UI                | Preserves pointer highlight behavior.                                                                                       |
| loopFocus            | boolean                                       | Base UI                | Preserves wrapped keyboard navigation.                                                                                      |
| actionsRef           | React.RefObject of AutocompleteRootActions    | None                   | Exposes Base UI imperative actions.                                                                                         |
| onItemHighlighted    | Function receiving item and highlight details | None                   | Reports keyboard, pointer, and none highlight changes.                                                                      |
| inputRef             | Base UI input ref                             | None                   | Resolves to the active input-compatible surface.                                                                            |
| grid                 | boolean                                       | false                  | Enables Base UI grid semantics with Row.                                                                                    |
| items                | readonly flat or grouped item array           | None                   | Owns item inference and internal filtering.                                                                                 |
| filteredItems        | readonly item array                           | None                   | Supplies externally filtered results.                                                                                       |
| filter               | Base UI filter function or null               | Base UI                | Preserves internal filtering or disables it with null.                                                                      |
| itemToStringValue    | Function receiving one item                   | Object text or Base UI | Consumer mapping wins; otherwise conforming automatic leaf objects use text and arbitrary values preserve Base UI behavior. |
| virtualized          | boolean                                       | false                  | Preserves Base UI virtualized-list behavior.                                                                                |
| inline               | boolean                                       | false                  | Preserves inline or externally hosted popup composition.                                                                    |
| modal                | boolean                                       | Base UI                | Preserves Base UI modal interaction behavior.                                                                               |
| limit                | number                                        | Base UI                | Limits internally filtered results.                                                                                         |
| mode                 | list, both, inline, or none                   | list                   | Selects Base UI aria-autocomplete and inline-completion behavior.                                                           |
| locale               | Intl locale argument                          | Runtime                | Selects locale-aware matching.                                                                                              |
| submitOnItemClick    | boolean                                       | Base UI                | Preserves item-click form submission behavior.                                                                              |

When itemToStringValue is omitted, a conforming automatic leaf object uses its
text string for internal filtering, the itemToString argument supplied to a
custom filter, completion after item press, the visible Input value, and form
serialization. A consumer itemToStringValue replaces that converter for every
leaf. Group text labels GroupLabel only and is never a leaf string value.

Automatic objects retain object-reference value identity. Distinct entries
must use distinct object references; text does not have to be unique. Recreating
an object changes its identity exactly as it does for arbitrary revision 3
object values.

Root renders no element, exposes no ref or render prop, and has no data
attributes or CSS variables. React context carries size through Portal because
portals preserve React ancestry.

### Events

AutocompleteRootChangeEventReason preserves trigger-press, outside-press,
item-press, close-press, escape-key, list-navigation, focus-out, input-change,
input-clear, clear-press, chip-remove-press, and none.

AutocompleteRootChangeEventDetails preserves reason, the native event, cancel,
allowPropagation, isCanceled, isPropagationAllowed, and trigger.

AutocompleteRootHighlightEventReason is keyboard, pointer, or none.
AutocompleteRootHighlightEventDetails preserves reason, event, and index and
is not cancellable.

## InputGroup

### Props

AutocompleteInputGroupProps preserves Base UI InputGroup.Props. Its children
remain ReactNode so passive wrappers are valid, but the semantic subtree must
contain exactly one Autocomplete.AddOn and one Autocomplete.Input.

| Prop             | Type                                                     | Default | Description                                                            |
| ---------------- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| children         | React.ReactNode                                          | None    | Required Powercoach field anatomy plus optional controls and wrappers. |
| className        | String or function receiving AutocompleteInputGroupState | None    | Merges after Powercoach defaults; recognized consumer conflicts win.   |
| style            | Object or function receiving AutocompleteInputGroupState | None    | Merges after Powercoach defaults.                                      |
| render           | ReactElement or state callback                           | div     | Preserves Base UI element replacement and ref composition.             |
| native div props | Base UI ref-capable div props                            | None    | Native events, ARIA, data attributes, children, and ref pass through.  |

InputGroup is a full-width, min-width-zero square flex surface with one fine
outer border, background and foreground colors, and the public field-emphasis
utility. It owns the only outer field border. Input has no second border, and
AddOn owns its logical separator.

### Data Attributes

InputGroup preserves data-popup-open, data-popup-side, data-list-empty,
data-pressed, data-disabled, data-readonly, data-valid, data-invalid,
data-dirty, data-touched, data-filled, and data-focused. Powercoach adds
data-size with xs, md, or xl.

### CSS Variables

InputGroup consumes --field-emphasis-offset,
--field-emphasis-shadow-offset, and --hard-shadow through the Input-owned public
field-emphasis contract.

### Size Treatments

| Root size | InputGroup | AddOn | Input              | General descendant SVG | Emphasis offset | Shadow offset |
| --------- | ---------- | ----- | ------------------ | ---------------------- | --------------- | ------------- |
| xs        | h-6        | w-6   | px-2 text-xs/4     | size-3                 | spacing 0.25    | spacing 0.5   |
| md        | h-8        | w-8   | px-2.5 text-sm/4.5 | size-3.5               | spacing 0.375   | spacing 0.75  |
| xl        | h-9        | w-9   | px-3 text-base/5   | size-4                 | spacing 0.5     | spacing 1     |

The outer border and AddOn separator use the standard one-pixel Tailwind
border treatment at every size.

Clear and Trigger consume `buttonChromeVariants` with variant `ghost` at an
icon-prefixed size inside InputGroup. Root preserves its field-to-Button mapping
and then applies only the approved Autocomplete-owned xs geometry exception.

| Root size | Button chrome size | Button chrome variant | Clear and Trigger square | Owned control SVG |
| --------- | ------------------ | --------------------- | ------------------------ | ----------------- |
| xs        | icon-xs            | ghost                 | size-6                   | size-3            |
| md        | icon-sm            | ghost                 | size-8                   | size-4            |
| xl        | icon-md            | ghost                 | size-9                   | size-4            |

Clear and Trigger use shrink-0. Button focus chrome is an outline and changes no
box metric. Their Base UI data-disabled state activates Button's ghost disabled
colors. The Root or Field disabled state remains Base UI-owned and reaches both
semantic buttons.

Root size also coordinates Popup hard shadow, decorative Item and GroupLabel
icon-slot width and SVG size, and the public popup content metrics documented by
Item, GroupLabel, Status, and Empty. It does not change the fixed one-pixel
Positioner gap, Popup width, Row geometry, or alternative standalone anatomy.

## AddOn

### Props

AutocompleteAddOnProps matches InputAddOnProps. It derives from a ref-capable
span, omits children, and reintroduces one required ReactElement.

| Prop               | Type                                                                    | Default  | Description                                                            |
| ------------------ | ----------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| children           | React.ReactElement                                                      | Required | One decorative visual whose descendant SVGs follow Root size.          |
| position           | start or end                                                            | start    | Selects logical placement and separator side.                          |
| className          | Native span className                                                   | None     | Merges consumer visual classes after Powercoach defaults.              |
| style              | CSSProperties without an effective pointerEvents override               | None     | Extends visual style while pointer-events-none keeps final precedence. |
| passive span props | id, data attributes, dir, lang, hidden, nonce, slot, translate, and ref | None     | Pass through except for reserved AddOn attributes.                     |

AddOn excludes every ARIA attribute, every React event prop beginning with on,
and every native prop that could add interaction or semantics. It always owns
aria-hidden true, inert true, pointer-events-none, no role, and no tabIndex.
Untyped event handlers are discarded at runtime. AddOn has no render prop.

### Data Attributes

AddOn exposes data-position with start or end and data-field-addon. These owned
values override consumer values.

## Input

### Props

AutocompleteInputProps preserves Base UI Autocomplete.Input.Props without
narrowing it. It includes native input props, disabled, render, state-aware
className and style, native events, ARIA attributes, consumer data attributes,
and the Base UI ref. Native numeric size remains a native Input prop; the
Powercoach size exists only on Root.

Input remains valid outside InputGroup and inside Popup. A standalone Input
keeps Base UI behavior and consumer styling but does not claim the complete
Powercoach bordered field surface or mandatory AddOn.

### Data Attributes

Input preserves data-popup-open, data-popup-side, data-list-empty,
data-disabled, data-readonly, data-required, data-valid, data-invalid,
data-dirty, data-touched, data-filled, and data-focused.

## Trigger

### Props

AutocompleteTriggerProps preserves Base UI Trigger.Props, including disabled,
nativeButton, render, state-aware className and style, button-compatible native
props, children, events, and ref.

Within InputGroup, the same Base UI Trigger semantic button consumes
`buttonChromeVariants` with variant `ghost` and the Root-derived icon-prefixed
size. It does not render or nest Button. Trigger keeps consumer children so
alternative anatomy such as a trigger-only grid may render other content.
Icon-only content requires an accessible name.

### Data Attributes

Trigger preserves data-popup-open, data-popup-side, data-list-empty,
data-pressed, data-disabled, and applicable Field state attributes.

## Icon

### Props

AutocompleteIconProps preserves Base UI Icon.Props except children. It
preserves passive render composition, state-aware className and style, native
span props, and ref. Icon renders one owned decorative ChevronUpDownIcon with
aria-hidden true. A render replacement receives that owned child exactly once
and must remain a non-interactive surface.

Icon reflects Trigger state and follows the Root-derived owned control SVG size
when rendered inside InputGroup. Consumers needing other Trigger content place
it directly in Trigger instead of replacing Icon content.

## Clear

### Props

AutocompleteClearProps preserves Base UI Clear.Props except children. It
preserves disabled, nativeButton, keepMounted, render, state-aware className and
style, native button props, events, and ref. Clear renders one owned decorative
XIcon and remains the Base UI semantic button that owns clear behavior. A
render replacement receives the owned child exactly once. Clear requires a
consumer-provided accessible name.

Within InputGroup, the same Clear semantic surface consumes
`buttonChromeVariants` with variant `ghost` and the Root-derived icon-prefixed
size. It does not render or nest Button. keepMounted defaults to true for this
Powercoach surface. Base UI decides when Clear enters or leaves its visible
state. Clear rests at opacity 1 while data-visible is present and uses opacity 0
while inactive and at data-starting-style or data-ending-style. It transitions
only opacity over 200ms linear and becomes pointer-inert whenever data-visible
is absent. The full square slot remains mounted before, during, and after the
fade, so visibility changes do not change width, height, padding, border, or
sibling position.

Clear does not use visibility or display to suppress its default inactive
paint, because either value would prevent the requested opacity interpolation.
If entrance or exit is interrupted, the CSS transition reverses from the
current computed opacity. Reduced motion changes duration to zero and preserves
the same visible and inactive endpoints. Autocomplete adds no Clear completion
callback.

A consumer may explicitly set keepMounted false. That choice or a supported
conflicting visual override becomes consumer-owned and is outside the default
no-layout-shift guarantee.

### Data Attributes

Clear preserves data-disabled, data-visible, data-starting-style, and
data-ending-style.

## Value

### Props

AutocompleteValueProps preserves Base UI Value.Props. children may be a
ReactNode or Base UI value-rendering function. Value preserves state-aware
className and style, render composition, native span props, and ref.

## Portal

### Props

AutocompletePortalProps preserves Base UI Portal.Props, including children,
container, keepMounted, className, and native portal behavior. keepMounted
keeps the closed portal subtree in the DOM under Base UI's closed and hidden
interaction rules; it does not make closed popup content interactive.

## Backdrop

### Props

AutocompleteBackdropProps preserves Base UI Backdrop.Props, including
className, style, render, native div props, events, and ref. It has no
Powercoach classes, theme treatment, shadow, CSS variables, or motion.

### Data Attributes

Backdrop preserves data-open, data-closed, data-starting-style, and
data-ending-style. Base UI owns outside interaction and transition state.

## Positioner

### Props

AutocompletePositionerProps preserves Base UI Positioner.Props except
sideOffset. Powercoach supplies sideOffset 1. The gap is exactly one CSS pixel
between the anchor and Popup border boxes for every Root size and every
collision-resolved top, bottom, left, right, inline-start, or inline-end side.
Collision flipping or perpendicular fallback retains that one-pixel result.

The preserved API includes anchor, side, align, alignOffset, arrowPadding,
collisionAvoidance, sticky, trackAnchor, positionMethod, className, style,
render, native div props, events, and ref. A consumer cannot configure
sideOffset. Consumer alignOffset remains available. Root size and a consumer
override of --field-emphasis-shadow-offset do not redefine the Positioner gap.

### Data Attributes

Positioner preserves data-open, data-closed, data-anchor-hidden, data-align,
data-empty, and data-side.

### CSS Variables

| Variable           | Description                                         |
| ------------------ | --------------------------------------------------- |
| --anchor-height    | Resolved anchor border-box height.                  |
| --anchor-width     | Resolved anchor border-box width consumed by Popup. |
| --available-height | Available collision-aware height.                   |
| --available-width  | Available collision-aware width.                    |
| --transform-origin | Collision-aware Popup transform origin.             |

## Popup

### Props

AutocompletePopupProps preserves Base UI Popup.Props, including initialFocus,
finalFocus, render, state-aware className and style, native div attributes,
events, ARIA attributes, children, and ref.

Autocomplete resolves the Base UI Popup state-aware props and ref onto
PopupSurface.Root at the Root-derived size. The result is one final Base UI
Popup element with PopupSurface chrome, not a Popup element wrapped by another
semantic surface. AutocompletePopupProps and AutocompletePopupState remain
Base UI Popup aliases rather than PopupSurface props or state.

PopupSurface.Root supplies square box-border geometry, a one-pixel foreground
border, background fill, foreground text, and shadow-(--hard-shadow).
Autocomplete adds w-(--anchor-width) on that same element. It defines no
min-width or max-width that changes the resolved anchor width. PopupSurface size
supplies the complete positive x and y, zero-blur, zero-spread foreground hard
shadow.

| Root size | Popup --hard-shadow value                       |
| --------- | ----------------------------------------------- |
| xs        | 0.125rem 0.125rem 0 0 var(--color-foreground)   |
| md        | 0.1875rem 0.1875rem 0 0 var(--color-foreground) |
| xl        | 0.25rem 0.25rem 0 0 var(--color-foreground)     |

React context carries Root size through Portal and maps it to PopupSurface, so
Popup does not require Input DOM ancestry and never reads
--field-emphasis-shadow-offset. The three values exactly match Input
field-emphasis shadow offsets for xs, md, and xl.

Base UI state-aware classes resolve once and remain on the final Popup. Shared
PopupSurface defaults and render-element classes resolve before the explicit
consumer className. Consumer className then passes through tailwind-merge last,
and consumer style merges last. Recognized conflicting width, box-sizing,
shadow, transition, scale, opacity, or origin utilities may deliberately replace
the default. The replaced behavior becomes consumer-owned.

### Data Attributes

Popup preserves data-open, data-closed, data-align, data-empty, data-side,
data-starting-style, and data-ending-style. PopupSurface adds
data-popup-surface-root and data-size with xs, md, or xl on the same final
element. Autocomplete does not promise that Base UI emits or operationally
handles data-instant. A consumer data attribute with that name passes through
only as an ordinary native data attribute.

### CSS Variables

Popup consumes --anchor-width, --transform-origin, and PopupSurface's public
--hard-shadow, enter-duration, enter-easing, exit-duration, exit-easing,
layout-duration, and layout-easing variables. PopupSurface layout duration
remains its default 0ms, so Autocomplete does not interpolate Popup width or
height.

## Arrow

### Props

AutocompleteArrowProps preserves Base UI Arrow.Props, state-aware className and
style, render composition, native div props, children, and ref.

### Data Attributes

Arrow preserves data-open, data-closed, data-uncentered, data-align, and
data-side.

## List

### Props

AutocompleteListProps preserves Base UI List.Props and adds automatic
presentation when children is omitted.

```ts
type AutocompleteListAutomaticProps = {
  children?: undefined
}

type AutocompleteListCallbackProps = {
  children: (item: any, index: number) => React.ReactNode
}

type AutocompleteListNodeProps = {
  children: Exclude<React.ReactNode, undefined>
}
```

AutocompleteListProps combines the preserved common Base UI props with one of
the three children branches above.

| Prop             | Type                                     | Default   | Description                                                                                                          |
| ---------------- | ---------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------- |
| children         | undefined, render function, or ReactNode | undefined | Omission enables automatic presentation; a function or explicit node is authoritative.                               |
| className        | Base UI state-aware List className       | None      | Composes consumer classes on the final List element.                                                                 |
| style            | Base UI state-aware List style           | None      | Composes consumer style on the final List element.                                                                   |
| render           | Base UI List render element or callback  | div       | Preserves Base UI element replacement, children, state, props, and ref composition.                                  |
| native div props | Base UI ref-capable div props            | None      | Native attributes, events, ARIA, consumer data attributes, children, and ref pass through to the final List element. |

For flat arbitrary items, a function child preserves Base UI's implicit
Collection behavior. Any explicit ReactNode child, including an element,
fragment, string, null, or false, renders exactly as supplied and disables
top-level automatic presentation. children undefined is indistinguishable from
omission and enables automatic presentation. List reserves no collection-wide
background surface or icon column.

### Data Attributes

List exposes data-empty when no filtered item remains.

### Content Geometry

Root derives one logical popup content inset from the active field anatomy.
Item maps that result to PopupSurface.Item contentInset. GroupLabel, Status, and
Empty retain the same resolved values directly on their final elements.
PopupSurface.GroupLabel adds no inset. List and PopupSurface.Group add no inline
padding, so flat and grouped anatomy do not accumulate offsets.

| Root size | Base inset  | Start AddOn width | Inset with start AddOn |
| --------- | ----------- | ----------------- | ---------------------- |
| xs        | spacing 2   | spacing 6         | spacing 8              |
| md        | spacing 2.5 | spacing 8         | spacing 10.5           |
| xl        | spacing 3   | spacing 9         | spacing 12             |

When AddOn is at logical start, the content inset is its Root-derived width
plus the base inset. When AddOn is at logical end, or Root uses standalone
anatomy without a start AddOn, the content inset is the base inset. All values
use the logical inline axis, so the Input value, flat or grouped popup text,
Status, and Empty share the same visible start axis in left-to-right and
right-to-left direction.

Item delegates its row-local Icon slot to PopupSurface.Item. GroupLabel
retains the same Autocomplete-owned geometry on its final element while
PopupSurface.GroupLabel supplies only composition. A present slot follows the
logical side of the active AddOn and falls back to logical start when no AddOn
is present. Its complete column width and descendant SVG size use the Root
mapping below.

| Root size | Icon slot width | Decorative icon SVG size |
| --------- | --------------- | ------------------------ |
| xs        | spacing 6       | spacing 3                |
| md        | spacing 8       | spacing 3.5              |
| xl        | spacing 9       | spacing 4                |

A row with an icon reserves that complete column plus the normal text inset on
the matching logical side, including logical-end AddOn and standalone
compositions. Icon and text never overlap. A row without an icon reserves no
empty icon slot. Default Item RevealAnimation and the revealAnimationProps
false highlighted surface both cover the complete row, including any row-local
icon slot.

### Automatic Presentation

Automatic presentation activates only when children is omitted or undefined
and the complete active collection is either flat AutocompleteItemOption
objects or AutocompleteGroupOption objects whose leaves are
AutocompleteItemOption objects. Extra fields are allowed but are never spread
onto public parts. A mixed or nonconforming collection renders no automatic
entries instead of guessing or coercing values.

For a flat collection, List renders one Item per object, passes the object as
value, passes its collection index as index, passes icon to Item, and renders
text as the authoritative visible children. For a grouped collection, List
renders one Group with the group's items, one GroupLabel with group icon and
text, and one automatic Collection for every group. GroupLabel does not compose
RevealAnimation.

Automatic groups and items receive opaque Root-scoped React identity derived
from their distinct object references. Text does not need to be unique. Reusing
one object reference for several entries is invalid because Base UI Item values
must uniquely identify items.

Automatic presentation supports ordinary flat and grouped listbox
collections, internally filtered values, async Root items, externally supplied
filteredItems, filter null, inline lists, and closing snapshots. It does not
support grid or virtualized Roots because it cannot own Row boundaries,
columns, visible-window placement, or externally meaningful indexes. Those
modes, arbitrary values, mixed values, commands, custom children, disabled
items, links, render replacements, and action-specific events retain the
explicit revision 3 callback and ReactNode APIs.

## Row

### Props

AutocompleteRowProps preserves Base UI Row.Props, state-aware className and
style, render composition, native div props, children, events, and ref. Row is
used with Root grid to provide one accessible grid row.

## Item

### Props

AutocompleteItemProps preserves Base UI Item.Props and adds the existing
decorative icon and bounded RevealAnimation surface. Revision 6 delegates that
presentation to PopupSurface.Item without changing the Autocomplete prop names
or assignability.

```ts
type AutocompleteItemIcon = PopupSurfaceItemIcon
type AutocompleteItemRevealAnimationProps = PopupSurfaceItemRevealAnimationProps
```

| Prop                 | Type or values                                     | Default  | Description                                                                                                    |
| -------------------- | -------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| value                | Root-inferred item value                           | Required | Identifies the suggested value or command.                                                                     |
| index                | number                                             | Base UI  | Supports indexed and virtualized collections.                                                                  |
| disabled             | boolean                                            | false    | Preserves disabled option behavior.                                                                            |
| nativeButton         | boolean                                            | false    | Must match a native button render replacement.                                                                 |
| onClick              | Native click handler                               | None     | Preserves consumer action composition with Base UI item behavior.                                              |
| icon                 | AutocompleteItemIcon                               | None     | One decorative visual placed in the AddOn-aligned row slot and sized like AddOn content.                       |
| revealAnimationProps | boolean or AutocompleteItemRevealAnimationProps    | true     | Uses scale-1 RevealAnimation, passes bounded props, or restores immediate highlighted presentation with false. |
| children             | React.ReactNode                                    | None     | Authoritative simple or complex content passed unchanged to the selected visual branch.                        |
| className            | String or function receiving AutocompleteItemState | None     | Resolves once and merges after semantic and duplicated visual defaults as documented below.                    |
| style                | Object or function receiving AutocompleteItemState | None     | Consumer style merges last.                                                                                    |
| render               | ReactElement or state callback                     | div      | Preserves Base UI role, events, ref, state, and replacement semantics on the single semantic Item.             |

The Base UI Item remains the owner of role, ARIA, events, ref, highlighted and
disabled state, nativeButton, consumer render replacement, and final semantic
element. Autocomplete resolves those owner props and its state-aware className
and style once, then composes PopupSurface.Item onto that same final element.
No wrapper Item and no second Base UI Item is rendered or registered.

Autocomplete passes Root size to PopupSurface.Item. It maps the active AddOn
context to PopupSurface's public iconPosition and contentInset contract. A start
AddOn selects start contentInset even for an iconless row. An end AddOn leaves
an iconless row at base, while a present icon selects end iconPosition and end
contentInset. Without AddOn, a present icon falls back to start iconPosition and
start contentInset, while an iconless row uses base.

Autocomplete always passes AutocompleteItemState highlighted as a controlled
PopupSurface reveal boolean. Keyboard and pointer highlighting therefore use
the same reveal state. When Root highlightItemOnHover is false, raw pointer
hover alone cannot reveal because the controlled false highlighted state
remains authoritative.

When revealAnimationProps is omitted or true, PopupSurface.Item composes the
existing public RevealAnimation inside the one semantic root with scale 1.
Autocomplete retains children, owner render replacement, and controlled reveal.
An object starts from scale 1 and may override scale, contentMode, direction,
alignX, alignY, offsetX, offsetY, and lifecycle callbacks.

PopupSurface passes the authoritative Icon and children through one real visual
copy and one decorative copy. Item does not inspect, normalize, replace, or
reorder them. Consumers remain responsible for ensuring arbitrary children are
safe to render twice and for selecting a contentMode compatible with the final
Item replacement and child content. Children or Icon content with
document-unique ids, effects, registrations, form controls, portals, requests,
single-owner refs, or other mount-sensitive behavior use
revealAnimationProps false.

The Item className state callback is evaluated exactly once with
AutocompleteItemState. The resolved string remains on the semantic Item as
required by Base UI and is passed through PopupSurface as a presentation layer
on both semantic-free visual copies. Each visual copy merges PopupSurface Text,
geometry, bg-background, and text-foreground defaults first, then merges the
resolved consumer string last through Tailwind conflict resolution. Recognized
consumer background and text-color conflicts therefore replace the visual
defaults on both copies. The semantic Item separately merges its own defaults
with the same resolved consumer string.

The shared string intentionally has one semantic application and two
duplicated presentation applications. Non-conflicting padding, margin, width,
height, display, position, overflow, opacity, transform, filter,
pseudo-element, descendant-selector, and arbitrary utilities may affect all
three elements or produce context-dependent results; those results are
consumer-owned. Conflict resolution occurs independently against each
element's defaults, so the three final class sets need not be textually
identical. Base UI state attributes remain only on the semantic Item. A
data-highlighted utility therefore targets that element unless a state
callback resolves the highlighted state into an unconditional visual class or
the consumer explicitly targets RevealAnimation's public data-reveal-source
and data-reveal-overlay-surface attributes. Consumers do not target
undocumented Autocomplete DOM shape or private attributes. Item style remains
on the semantic Item and is not duplicated.

When revealAnimationProps is false, PopupSurface renders no RevealAnimation or
duplicated visual branch. The one Base UI Item receives the same Root-derived
Text typography, complete row geometry, decorative Icon slot, bg-background,
text-foreground, and immediate controlled-highlight inversion before the
resolved consumer className. Resting color conflicts and explicit highlighted
state conflicts may replace those defaults. Without an explicit conflict, the
complete immediate foreground/background inversion covers the row.

The icon is always decorative, aria-hidden, inert, pointer-inert, and outside
the focus order. Its slot and descendant SVGs use the Root-sized mapping.
Explicit paint and non-SVG visual details remain consumer-owned. Disabled and
highlighted data states remain separately addressable. Consumer descendants
may use their own Powercoach components, sizes, tones, and layout.

Item uses PopupSurface's shared logical content inset and exact Root-derived
metrics below.

| Root size | Minimum height | Block padding | Inline child gap |
| --------- | -------------- | ------------- | ---------------- |
| xs        | min-h-6        | py-1          | gap-2            |
| md        | min-h-8        | py-1.5        | gap-2.5          |
| xl        | min-h-9        | py-2          | gap-3            |

Item centers its children on the block axis. Together with the mapped Text line
height, ordinary single-line items finish at exactly the matching InputGroup
height. Multiline and complex content preserves every child and grows from the
same minimum instead of clipping or forcing an exact height. The default
RevealAnimation and the false highlighted branch both cover this complete row,
including any row-local icon slot.

### Data Attributes

Item preserves data-highlighted and data-disabled. PopupSurface adds
data-popup-surface-item, data-size, data-icon-position when Icon is present,
data-content-inset, and data-revealed when highlighted on that same final
element. RevealAnimation retains its complete public data contract on owned
descendants.

## Group

### Props

AutocompleteGroupProps preserves Base UI Group.Props, including items,
className, style, render, native div attributes, children, events, and ref.
Base UI owns the accessible relationship between Group and GroupLabel.
Autocomplete composes PopupSurface.Group onto that same final Base UI Group
element. PopupSurface supplies neutral full-width layout with no inline
padding, block padding, or gap. GroupLabel owns the group's leading breathing
room, and child parts own their own row geometry. PopupSurface adds
data-popup-surface-group without replacing Base UI role, registration, ids,
events, state callbacks, render semantics, or ref.

## GroupLabel

### Props

AutocompleteGroupLabelProps preserves Base UI GroupLabel.Props, adds one
decorative icon, and exposes no Heading size, tone, intent, or headingProps
surface.

| Prop | Type                 | Default | Description                                                                              |
| ---- | -------------------- | ------- | ---------------------------------------------------------------------------------------- |
| icon | AutocompleteItemIcon | None    | One decorative visual placed in the AddOn-aligned row slot and sized like AddOn content. |

Base UI GroupLabel remains the owner of the final element, generated id,
association, state callback, render callback, native props, events, children,
and ref. Autocomplete composes the presentation-agnostic PopupSurface.GroupLabel
onto that same element. Autocomplete owns the Root-derived muted Heading,
logical inset, decorative Icon, row geometry, and presentation data attributes
documented below.

GroupLabel does not compose RevealAnimation. Its icon is aria-hidden, inert,
pointer-inert, and outside the focus order. Its slot and descendant SVGs use
the Root-sized mapping, while explicit paint and non-SVG visual details remain
consumer-owned. GroupLabel text and source children remain authoritative.

| Root size | Heading size |
| --------- | ------------ |
| xs        | xs           |
| md        | sm           |
| xl        | md           |

GroupLabel uses the shared logical content inset and the Root-derived metrics
below.

| Root size | Minimum height | Top padding | Bottom padding |
| --------- | -------------- | ----------- | -------------- |
| xs        | min-h-6        | pt-0        | pb-0           |
| md        | min-h-8        | pt-1        | pb-0           |
| xl        | min-h-9        | pt-2        | pb-0           |

Together with the mapped Heading line height, an ordinary single-line label
finishes at exactly the matching InputGroup height. Complex content may grow
from that minimum. GroupLabel never adds bottom padding.

Heading visual lowercase remains presentation-only and never rewrites source
or accessible text.

Autocomplete adds data-size with xs, md, or xl, data-content-inset with base,
start, or end, and data-icon-position with start or end when an Icon is present.
PopupSurface adds data-popup-surface-group-label on the same final element.

## Separator

### Props

AutocompleteSeparatorProps preserves Base UI Separator.Props, including
orientation, state-aware className and style, render, native div props, events,
and ref.

### Data Attributes

Separator preserves data-orientation with horizontal or vertical.

## Status

### Props

AutocompleteStatusProps preserves Base UI Status.Props but exposes no Text
size, tone, intent, or textProps surface. Base UI Status remains the live-region
root and render-state owner. Public Text typography is composed onto the same
element with tone muted and the Root-derived mapping xs to xs, md to sm, and xl
to md.

Status uses the shared logical content inset, centered block alignment, and the
same Root-derived minimum height, block padding, and inline child gap as Item.
Ordinary single-line status content therefore equals InputGroup height, while
complex content grows from that minimum.

Status must remain mounted. Consumers update or conditionally render its
children instead of hiding or removing the root.

## Empty

### Props

AutocompleteEmptyProps preserves Base UI Empty.Props but exposes no Text size,
tone, intent, or textProps surface. Base UI Empty remains the conditional
empty-state and polite live-region root. Public Text typography is composed
onto the same element with tone muted and the Root-derived mapping xs to xs, md
to sm, and xl to md.

While Base UI renders Empty children, Empty uses the shared logical content
inset, centered block alignment, and the same Root-derived minimum height,
block padding, and inline child gap as Item. Ordinary single-line empty content
therefore equals InputGroup height, while complex content grows from that
minimum.

While Base UI renders no Empty children, the still-mounted root has zero
minimum height, zero block size, zero padding, zero margin, and no border
contribution. It remains normally present to assistive technology and does not
use display none, hidden, visibility hidden, or aria-hidden. The first visible
Item or GroupLabel therefore touches the Popup top edge.

Empty must remain mounted. Consumers update or conditionally render its
children instead of applying hidden, display none, aria-hidden, or conditional
removal to the root.

## Collection

### Props

AutocompleteCollectionProps preserves Base UI Collection.Props and adds an
automatic branch with children omitted or undefined. It renders no owned
element. Within Group, omitted children automatically render conforming
AutocompleteItemOption leaves using the same Item algorithm as List. A function
child remains authoritative and renders the group's filtered items. Collection
does not accept a ReactNode child form. Base UI 1.6 does not contextually infer
the callback item type across JSX from Root; consumers annotate callback
parameters when needed.

## Hooks

Autocomplete.useFilter and useAutocompleteFilter accept optional
AutocompleteFilterOptions with locale and return contains, startsWith, and
endsWith generic matching helpers backed by Intl.Collator.

Autocomplete.useFilteredItems and useAutocompleteFilteredItems return the
internally filtered item array when called inside Root.

Neither hook adds Powercoach filtering rules.

## Accessibility

Base UI owns combobox, listbox, option, grid, dialog-like popup, group, row, and
live-region semantics. Powercoach presentation and typography must not weaken
roles, generated ids, aria-controls, aria-expanded, aria-activedescendant,
aria-autocomplete, aria-labelledby, aria-describedby, or focus ownership.

Every Input requires an accessible name through Field.Label, a native label,
aria-label, or aria-labelledby. An Input inside Popup requires its own name.
Trigger-only compositions require an accessible Trigger name. Icon-only Clear
and Trigger content require accessible names.

Field.Root may coordinate name, required, disabled, validation, Label, and
Description with Input. Autocomplete adds no Label part. Field.Label retains
its public Heading composition. Root required represents a non-empty text value
and does not validate that the value corresponds to an Item.

AddOn is always decorative, inert, hidden from the accessibility tree,
unfocusable, and pointer-inert. It cannot label Input and cannot contain an
operable control.

Every Item or GroupLabel icon is decorative, aria-hidden, inert, unfocusable,
and pointer-inert. Object text or authoritative consumer children provide the
visible and accessible Item or GroupLabel content. Icons cannot label,
describe, or activate an item or group.

Clear remains the only clear action, and Trigger remains the only popup action.
Their Button chrome adds no duplicate Button semantics. Clear's owned XIcon and
Icon's owned ChevronUpDownIcon are decorative and add no accessible name,
focus target, or interaction. Icon and every render replacement remain passive
inside Trigger. Consumers provide the accessible names for icon-only Clear and
Trigger surfaces.

GroupLabel keeps Base UI's generated id and accessible Group association.
Heading lowercase is visual only. Item keeps Base UI option or grid semantics,
keyboard and pointer behavior, and highlighted state. PopupSurface adds no
semantics: Group and presentation-agnostic GroupLabel composition preserve the
Base UI role, registration, generated id, and aria-labelledby relationship;
Item Text changes typography without adding or replacing a role; and every
Autocomplete-owned row Icon remains decorative. Default Item RevealAnimation
renders no second option or gridcell. The final composed Base UI Item remains
the only semantic, focusable, interactive, ref-owning surface, and
RevealAnimation owns the decorative inert visual copy inside it.

Status and Empty preserve Base UI polite announcement behavior. Their root
elements remain mounted. Appearance adds no second live region, alert role,
focus movement, or source-text mutation. During a final-character close,
keeping their last pre-close children stable prevents a transient all-results
or empty-state announcement. Inactive Empty remains layout-neutral without
being hidden from assistive technology.

A command palette composes Autocomplete inside a consumer-owned modal such as
Dialog. The modal owner provides labeling, modality, focus containment,
dismissal, and any Backdrop. Autocomplete.Backdrop is not required.

Render replacements must forward the received ref, spread all received props
onto the final semantic element, and render received children exactly once.
Group and GroupLabel replacements preserve their Base UI grouping props while
PopupSurface supplies presentation on those same elements. For a revealed Item,
the one outer Item replacement receives the owned RevealAnimation subtree once;
RevealAnimation independently passes the source children through its documented
real and decorative visual copies. Consumers own HTML validity, render-twice
compatibility, and any semantics introduced by a replacement.

Reduced motion removes Popup and Clear transition duration and preserves
RevealAnimation's immediate-target contract while retaining focus, navigation,
live-region, positioning, and every final state.

## Behavior

Autocomplete preserves Base UI item inference, free-form values, internal or
external filtering, controlled and uncontrolled state, item highlighting,
keyboard navigation, pointer behavior, form participation, async updates,
grouping, grid rows, virtualization, inline composition, command items, and
render overrides.

The namespace is not callable. Root renders no element and creates the React
context that carries size through Portal. InputGroup is optional and owns the
Powercoach field surface only when rendered. A standalone Input remains
unstyled beyond any consumer classes and does not require AddOn.

InputGroup uses the same public metrics and field-emphasis protocol as Input,
not Input's private implementation. AddOn uses the same public passive anatomy
and logical position contract as Input.AddOn. The two families share FieldSize,
field-emphasis, data-field-addon, and --hard-shadow through documented public
contracts.

Root size affects InputGroup, AddOn, Input, Clear, Trigger, Icon, PopupSurface
Item typography and geometry, Autocomplete GroupLabel typography and geometry,
Status typography and geometry, Empty typography and geometry, the shared
logical content inset, decorative icon-slot metrics, and PopupSurface Root hard
shadow. It does not change the fixed one-pixel Positioner gap, Popup width, Row
geometry, or alternative standalone anatomy.

Positioner passes sideOffset 1 to Base UI. Collision handling may change the
resolved side and --transform-origin, but the anchor-to-Popup border-box gap
remains exactly one CSS pixel for every side and Root size. Popup width uses the
resolved --anchor-width with border-box sizing. The Popup border is included in
that width; its outline is excluded by the CSS box model.

Clear and Trigger consume Button's public semantic-free `ghost` chrome at the
Root-mapped icon-prefixed size inside InputGroup while preserving their Base UI
semantic ownership. Clear owns XIcon, Icon owns ChevronUpDownIcon, and no Button
component is nested. The default persistent Clear slot changes paint and
interaction with data-visible without changing layout geometry. Base UI owns
when Clear becomes visible or inactive; Autocomplete fades only its opacity.

The shared popup content inset follows the active AddOn and Input padding. Item
maps that result to PopupSurface Item contentInset and iconPosition. GroupLabel,
Status, and Empty retain the matching direct inset and Root-derived minimum
height. List and PopupSurface Group add no padding that would duplicate it.
Ordinary single-line rows equal InputGroup height; complex content grows from
the same minimum. Inactive Empty contributes no layout space, so the first
visible Item or GroupLabel begins at the Popup top edge.

PopupSurface Item and Autocomplete GroupLabel own row-local decorative Icon
slots without a List background surface. A present Icon follows the active
AddOn logical side and falls back to logical start without AddOn. Its slot uses
the Root-sized AddOn width and SVG mapping. The row reserves the complete Icon
column plus its normal text inset on that side, and Item highlight presentation
covers the complete row. Omitted Icons reserve no empty slot.

When List children are omitted and the active values conform to the approved
flat or grouped object shape, List renders the public automatic anatomy.
Automatic leaf text supplies presentation and the default string converter;
icons supply decorative presentation only. Explicit List or Collection
callbacks and explicit List ReactNode children remain authoritative. Automatic
presentation never reads extra object fields as props, state, events, ARIA,
styles, disabled state, or render composition.

The one Base UI Item always owns semantics and interaction. Autocomplete
composes PopupSurface Item onto that final element and passes highlighted as a
controlled reveal boolean. PopupSurface owns the existing public
RevealAnimation visual surface, Text, Icon, row geometry, and scale 1. The same
authoritative Icon and children are passed unchanged through RevealAnimation,
and both visual copies use bg-background and text-foreground before the
resolved consumer Item className merges last. revealAnimationProps false
removes duplication and keeps immediate foreground/background inversion.

The Base UI Group and GroupLabel likewise remain the semantic and association
owners. Autocomplete composes PopupSurface Group and GroupLabel onto those same
final elements. PopupSurface owns neutral grouped layout and
presentation-agnostic GroupLabel composition only. Autocomplete owns the muted
Heading, logical inset, optional decorative Icon, InputGroup-matched minimum
height, and presentation data attributes. PopupSurface generates no id, role,
registration, or accessible relationship.

When an input-change changes the effective query from non-empty to empty and
moves an open Popup into closing, Root snapshots the last filtered collection
before the empty value exposes unfiltered items. Input displays the empty value
immediately. During the exit, List renders the snapshot, preserving flat order,
grouped order, group identity, GroupLabel content, and each group's filtered
members. Automatic object snapshots also preserve leaf text and icon content,
group text and icon content, and object-reference identity.

Highlight is not snapshotted. Active option, aria-activedescendant, and
data-highlighted continue to follow Base UI closing semantics. Empty reflects
whether the snapshot is empty. Status and Empty remain mounted with their last
pre-close children. Reopening or a new input change that reopens during exit
releases the snapshot immediately and resumes live filtering. Otherwise Root
releases it at close completion. No public prop, callback, data attribute, or
hook exposes the internal snapshot.

PopupSurface.Root owns the shared --hard-shadow application and resolves the
complete 0.125rem, 0.1875rem, or 0.25rem positive x and y foreground result from
Root size xs, md, or xl. Autocomplete keeps the existing values compatible with
Input's public hard-shadow scale. Popup never reads
--field-emphasis-shadow-offset and does not activate field-emphasis focus,
translation, AddOn inversion, or border behavior.

Powercoach and PopupSurface class defaults are passed to tailwind-merge before
explicit consumer className values. Supported consumer conflicts therefore win
on the same final element. Item additionally evaluates its state-aware
className once and PopupSurface independently merges the resolved string on the
semantic Item and both Reveal visual copies. Repeated non-color presentation
effects are consumer-owned. Consumer Item style remains on the semantic Item
and merges last. Semantic and safety-owned values such as AddOn inert behavior,
Base UI ARIA ownership, and Item and GroupLabel decorative Icon semantics retain
final precedence.

Backdrop remains an unstyled Base UI escape hatch. Rendering it does not
automatically make a non-modal Root modal, and Powercoach provides no default
visual treatment or timing for it.

## Motion

Autocomplete uses the CSS animation engine for Popup and Clear. It does not use
Motion. Popup consumes PopupSurface.Root, and Item consumes PopupSurface.Item,
which composes the existing named RevealAnimation family by default.
PopupSurface and RevealAnimation retain their public CSS lifecycle,
interruption, theme, timing, and reduced-motion contracts.

Popup rests at scale 1 and opacity 1. Its transform origin is
var(--transform-origin). PopupSurface transitions entry scale and opacity for
350ms with cubic-bezier(0.22, 1, 0.36, 1). Exit overrides those properties to
150ms ease.

data-starting-style and data-ending-style both set scale 0.9 and opacity 0.
Opening transitions from those values to rest. Closing transitions from rest
to those values. If an open or close request interrupts the opposite phase, CSS
transitions reverse from the current computed scale and opacity without a
discrete jump.

PopupSurface's width and height transition properties remain present with its
public layout duration at the default 0ms. Autocomplete therefore preserves its
exact anchor-width result without interpolating width or height.

Base UI keeps Popup and its portal subtree mounted during a detected closing
transition, calls onOpenChangeComplete after completion, and then unmounts when
Portal keepMounted is false. With keepMounted true, Base UI keeps the closed
subtree mounted and owns its closed, hidden, and interaction behavior.

Clear transitions opacity for 200ms with linear easing. data-visible identifies
the visible resting state. Inactive Clear, data-starting-style, and
data-ending-style use opacity 0. Entrance and exit reverse from current
computed opacity when interrupted. Base UI owns when those lifecycle states
apply, and Autocomplete adds no Clear completion callback.

PopupSurface.Item receives controlled reveal equal to the Base UI highlighted
state. Omission and true use the shared copied-content scale 1 and
RevealAnimation defaults for direction, positioning, 300ms clip-path
transition, and cubic-bezier easing. A bounded props object starts from scale 1
and may override the public RevealAnimation presentation and lifecycle fields,
including scale. false removes the named animation and uses the immediate
highlighted inversion.

During the final-character close defined in Behavior, the last filtered
collection and the last Status and Empty children stay visually frozen for the
same exit duration. A reopening request releases the snapshot and live content
resumes while the CSS transition reverses from its computed scale and opacity.
Otherwise close completion releases the snapshot before normal unmount or
hidden persistence. onOpenChangeComplete keeps its Base UI timing and
arguments.

Autocomplete.Backdrop receives no Powercoach transition. Automatic object
presentation, decorative icons, GroupLabel, Status, and Empty add no
independent motion.

When reduced motion is requested, PopupSurface entry, exit, and layout duration
and Clear duration become zero, and RevealAnimation uses its documented
immediate target behavior. The same Popup scale-0.9 and opacity-0 lifecycle
endpoints, resting state, and Clear visible and inactive endpoints remain.
Popup completion and unmount proceed without timed interpolation, so the
final-character snapshot lasts only through the zero-duration completion path.

Autocomplete does not promise operational data-instant behavior. A future Base
UI dependency change may establish that behavior only through another approved
Autocomplete revision.

## Use Cases

### UC-001 - Expose the complete Autocomplete family

Given a consumer imports Autocomplete, a direct part, a hook, or a documented
type from @powercoach/ui
When the public surface is inspected
Then the complete Base UI-aligned namespace plus AddOn and the prefixed direct
exports are available and Autocomplete is not callable

### UC-002 - Preserve free-form controlled and uncontrolled state

Given a consumer uses value and onValueChange, defaultValue, open and
onOpenChange, or defaultOpen
When input text or popup state changes
Then Base UI controlled or uncontrolled behavior, reasons, cancellation,
completion, form participation, and free-form value semantics are preserved

### UC-003 - Render the Powercoach InputGroup surface

Given a consumer renders InputGroup with exactly one AddOn and one Input
When the field is displayed
Then it receives the Input-equivalent square surface, selected size, field
emphasis, optional controls, and supported passive layout wrappers

### UC-004 - Place the decorative AddOn

Given a consumer supplies one ReactElement to AddOn with position start or end
When the field is displayed in left-to-right or right-to-left direction
Then AddOn uses the corresponding logical position and separator while its
subtree remains normalized, hidden, inert, unfocusable, and pointer-inert

### UC-005 - Name every interactive composition

Given a consumer renders an Input, Trigger, Clear, Popup with dialog semantics,
or command palette
When assistive technology encounters the composition
Then the consumer-provided Field, native label, ARIA names, descriptions, and
modal owner provide every required accessible relationship

### UC-006 - Render Popup at the approved anchor geometry

Given Popup is positioned from any supported side
When Base UI resolves its anchor
Then Positioner uses exactly one pixel between the anchor and Popup border
boxes for Root xs, md, and xl on every collision-resolved side, and Popup's
border box equals the resolved anchor width while its outline remains outside
that width

### UC-007 - Apply the shared hard shadow

Given Popup uses the default Powercoach classes
When it is visible at any Root size
Then PopupSurface Root displays the Input-compatible zero-blur, zero-spread
foreground hard shadow at positive x and y offsets of 0.125rem for xs,
0.1875rem for md, or 0.25rem for xl

### UC-008 - Derive GroupLabel typography and geometry

Given Root size is xs, md, or xl and GroupLabel is rendered
When the group is displayed
Then the same Base UI label element consumes PopupSurface GroupLabel, uses muted
Heading at size xs, sm, or md respectively, aligns with the Input text axis,
uses min-h-6, min-h-8, or min-h-9 with the matching top padding and no bottom
padding, and preserves source and accessible text while Autocomplete owns the
presentation

### UC-009 - Derive Item typography and row geometry

Given Root size is xs, md, or xl and Item contains simple or complex children
When the option is displayed
Then PopupSurface Item uses Text size xs, sm, or md respectively while the one
Base UI Item preserves semantics, aligns content with the Input text axis, and
uses the matching min-h-6, min-h-8, or min-h-9, block padding, and inline gap;
ordinary content equals InputGroup height while complex descendants and
authoritative children remain unchanged and may grow

### UC-010 - Present Status and Empty content

Given Status or Empty remains mounted and its children change
When async, result, or empty state updates
Then Base UI announces active content politely and the same root uses muted Text
at the Root-derived size, aligns with the Input text axis, and uses the matching
min-h-6, min-h-8, or min-h-9, block padding, and inline gap while ordinary
content equals InputGroup height and inactive Empty follows its layout-neutral
contract

### UC-011 - Preserve grouping and Item render composition

Given a consumer uses Group, GroupLabel, Collection, a complex Item, or an Item
render replacement
When the list is displayed or activated
Then Group consumes PopupSurface grouped layout and GroupLabel consumes its
presentation-agnostic PopupSurface composition on their same final elements
while Autocomplete owns label presentation and Base UI associations, roles,
refs, events, nativeButton, states, and authoritative children remain on the
final composed elements

### UC-012 - Preserve filtering and completion modes

Given a consumer uses Base UI filtering or mode list, both, inline, or none
When the query or highlighted item changes
Then locale-aware matching, aria-autocomplete, list presentation, and inline
completion follow the documented Base UI behavior

### UC-013 - Support async, grid, grouped, and virtualized data

Given a consumer supplies async items, filteredItems, filter null, grouped
items, grid rows, or a virtualized list
When results change or users navigate
Then Base UI data ownership, indexes, highlighting, keyboard behavior, and
consumer rendering remain preserved

### UC-014 - Support alternative anatomy

Given a consumer omits InputGroup for a standalone Input, an Input inside Popup,
a trigger-only grid, an inline list, or a command palette
When Root renders
Then the composition remains valid and no missing InputGroup or AddOn error is
introduced

### UC-015 - Preserve consumer visual overrides

Given a consumer supplies a supported conflicting className utility or style to
a public leaf
When Powercoach defaults and consumer values merge
Then the explicit consumer value wins, non-conflicting defaults remain, and
the replaced visual result becomes consumer-owned; Item className resolves once
and PopupSurface merges it independently on the semantic Item and both Reveal
visual copies, while repeated non-color effects remain consumer-owned

### UC-016 - Enter and exit with CSS motion

Given Popup opens, closes, or reverses during a transition
When Base UI applies its starting or ending lifecycle attribute
Then PopupSurface scale and opacity transition between 0.9 and 0 and 1 and 1
with 350ms cubic-bezier entry and 150ms ease exit from the collision-aware
transform origin without an interruption jump or width and height morphing

### UC-017 - Complete and reduce motion

Given Popup finishes closing, Portal keepMounted changes mounting behavior, or
the user requests reduced motion
When Base UI observes the CSS lifecycle
Then onOpenChangeComplete, unmounting or hidden persistence, and immediate
PopupSurface scale-0.9 opacity-0 lifecycle endpoints follow the documented
contract

### UC-018 - Preserve public state hooks

Given a consumer uses state-aware className, style, render callbacks, data
attributes, Positioner variables, change details, or highlight details
When Autocomplete state changes
Then every applicable Base UI state and Powercoach data-size, data-position,
data-field-addon, PopupSurface data attributes, and shared hard-shadow and timing
hooks remain available on their owning parts

### UC-019 - Keep Backdrop outside Powercoach presentation

Given a consumer accesses Autocomplete.Backdrop or composes Autocomplete inside
another modal
When popup layers render
Then Backdrop preserves Base UI props and lifecycle only, while the modal owner
controls any visible backdrop appearance, motion, focus containment, and
modality

### UC-020 - Share Button ghost chrome without nested interaction

Given Clear or Trigger is rendered inside InputGroup
When the Root size, disabled state, focus state, or Clear visibility changes
Then the existing Base UI semantic button consumes Button ghost chrome at the
mapped icon-prefixed size, including the Autocomplete-owned xs geometry
exception, Clear owns decorative XIcon, passive Icon owns decorative
ChevronUpDownIcon, and the default Clear slot changes no box metric or sibling
position

### UC-021 - Freeze final-character closing results

Given an input-change deletes the final character and moves an open Popup into
closing
When the existing CSS exit is visible
Then Input displays the empty value while List, grouped content, Status
children, Empty children, and automatic object text and icon content keep their
last filtered snapshot until reopening or close completion without adding a
public snapshot API

### UC-022 - Render the grouped empty state

Given a grouped Autocomplete keeps Empty mounted before List
When the effective query matches no item in any group
Then Empty displays and politely announces its consumer copy while Group,
GroupLabel, Collection, and Item retain their Base UI grouped anatomy

### UC-023 - Place row-local decorative icons

Given Item or GroupLabel receives an icon with a start AddOn, an end AddOn, or
no AddOn
When the row is displayed in left-to-right or right-to-left direction
Then the decorative Root-sized icon slot follows the active AddOn logical side
or falls back to logical start through PopupSurface's public iconPosition and
contentInset contract, reserves no collection-wide background surface, keeps
Icon and text from overlapping, and remains covered by Item highlight
presentation

### UC-024 - Fade Clear through the Base UI visibility lifecycle

Given Base UI makes the default mounted Clear visible, inactive, entering, or
leaving
When its visibility lifecycle changes, reverses, or is reduced
Then opacity transitions between zero and one over 200ms linear or reaches the
same endpoint immediately under reduced motion while the slot geometry remains
stable and inactive Clear remains pointer-inert

### UC-025 - Reveal highlighted Items by default

Given Item omits revealAnimationProps, passes true, an approved object, or false
When Base UI changes its keyboard or pointer highlighted state
Then PopupSurface receives highlighted as controlled reveal and one semantic
Item uses scale-1 or configured RevealAnimation on the shared bg-background and
text-foreground visual surface, or false keeps complete immediate inversion
without rendering a second Base UI Item

### UC-026 - Render automatic flat object items

Given Root receives a complete flat collection of objects with required text
and optional icon and List children is omitted
When the collection filters, renders, or completes the Input value
Then List renders one Item per object, text supplies default presentation and
string conversion, icon uses the decorative AddOn-aligned Root-sized slot,
object reference supplies identity, and an explicit callback or ReactNode
remains authoritative

### UC-027 - Render automatic grouped object items

Given Root receives complete group objects with text, optional icon, and items
whose leaves are automatic item objects
When List and Collection children are omitted
Then every Group renders a non-revealed GroupLabel with decorative icon and
text plus automatic leaf Items while explicit List or Collection callbacks
remain authoritative

### UC-028 - Keep inactive Empty layout-neutral

Given mounted Empty has no Base UI-rendered children or retains active or
snapshotted children
When a flat or grouped collection is displayed or closes
Then inactive Empty remains normally mounted but contributes no visible layout
space, the first Item or GroupLabel touches the Popup top edge, and active or
snapshotted Empty retains its Root-sized presentation and polite announcement

### UC-029 - Consume the shared PopupSurface contract

Given Autocomplete renders Popup, Group, GroupLabel, or Item at xs, md, or xl
When their public elements and visual presentation are inspected
Then Popup consumes PopupSurface Root, Group consumes PopupSurface Group,
GroupLabel consumes PopupSurface GroupLabel, and Item consumes PopupSurface Item
on the same final Base UI semantic elements while Autocomplete owns GroupLabel
presentation and preserves its existing props, states, values, events, refs,
render replacements, AddOn geometry, and accessibility ownership
