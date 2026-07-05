import { Dialog } from '@base-ui/react/dialog'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { Dumbbell, Search, UserRound, UsersRound } from 'lucide-react'
import { useState, useTransition, type ReactElement } from 'react'

import {
  Autocomplete,
  Button,
  Field,
  Text,
  type AutocompletePositionerProps,
  type AutocompleteRootChangeEventReason,
  type AutocompleteRootHighlightEventDetails,
  type AutocompleteSize
} from '../..'

const meta = {
  args: {
    disabled: false,
    size: 'xl'
  },
  argTypes: {
    children: {
      control: false
    },
    disabled: {
      control: 'boolean'
    },
    items: {
      control: false
    },
    onItemHighlighted: {
      control: false
    },
    onOpenChange: {
      control: false
    },
    onOpenChangeComplete: {
      control: false
    },
    onValueChange: {
      control: false
    },
    size: {
      control: 'select',
      options: ['xs', 'md', 'xl']
    }
  },
  component: Autocomplete.Root,
  title: 'Components/Autocomplete'
} satisfies Meta<typeof Autocomplete.Root>

export default meta

type Story = StoryObj<typeof meta>

const AUTOCOMPLETE_POSITIONER_SIDES = [
  'top',
  'bottom',
  'left',
  'right',
  'inline-start',
  'inline-end'
] as const satisfies readonly NonNullable<AutocompletePositionerProps['side']>[]

interface AutocompleteSidesStoryArgs {
  disabled?: boolean
  side?: (typeof AUTOCOMPLETE_POSITIONER_SIDES)[number]
  size?: AutocompleteSize
}

interface AsyncAutocompleteStoryProps {
  size?: AutocompleteSize
}

function ControlledAutocompleteStory(): ReactElement {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<AutocompleteRootChangeEventReason>('none')
  const [phase, setPhase] = useState('closed')
  const [highlight, setHighlight] = useState(-1)

  return (
    <div className="grid max-w-xl gap-2 text-foreground">
      <Autocomplete.Root
        items={['Deadlift', 'Front squat', 'Pull-up']}
        onItemHighlighted={(_, details: AutocompleteRootHighlightEventDetails) =>
          setHighlight(details.index)
        }
        onOpenChange={(nextOpen, details) => {
          setReason(details.reason)
          setOpen(nextOpen)
        }}
        onOpenChangeComplete={(nextOpen) => setPhase(nextOpen ? 'open' : 'closed')}
        onValueChange={(nextValue, details) => {
          setReason(details.reason)
          setValue(nextValue)
        }}
        open={open}
        value={value}
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
      <output className="border border-foreground/30 p-2 font-sans text-xs">
        value: {value || 'empty'}; reason: {reason}; highlighted: {highlight}; phase: {phase}
      </output>
    </div>
  )
}

function AsyncAutocompleteStory({ size }: AsyncAutocompleteStoryProps): ReactElement {
  const [value, setValue] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const { contains } = Autocomplete.useFilter()

  return (
    <div className="grid max-w-xl gap-2 text-foreground">
      <Autocomplete.Root
        filter={null}
        items={results}
        onValueChange={(nextValue) => {
          setValue(nextValue)
          startTransition(() => {
            setResults(
              ['Deadlift', 'Front squat', 'Pull-up', 'Push press'].filter((item) =>
                contains(item, nextValue)
              )
            )
          })
        }}
        size={size}
        value={value}
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
      <output className="border border-foreground/30 p-2 font-sans text-xs">
        query: {value || 'empty'}; pending: {String(pending)}; results: {results.length}
      </output>
    </div>
  )
}

function EmojiGridStory(): ReactElement {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const emojiRows = [
    ['😀', '🙂', '🏋️'],
    ['🚴', '🏃', '🧘']
  ]

  return (
    <div className="grid w-fit gap-2 text-foreground">
      <Autocomplete.Root
        grid
        items={emojiRows}
        onOpenChange={setOpen}
        onValueChange={setValue}
        open={open}
        value={value}
      >
        <Autocomplete.Trigger aria-label="Choose emoji" render={<Button />}>
          {value || '😀'}
        </Autocomplete.Trigger>
        <Autocomplete.Portal>
          <Autocomplete.Positioner align="end">
            <Autocomplete.Popup aria-label="Emoji picker" className="w-72 p-3">
              <Autocomplete.Input
                aria-label="Search emojis"
                className="mb-3 w-full border border-foreground bg-background px-2 py-1"
              />
              <Autocomplete.List className="grid gap-2">
                {(row: string[]) => (
                  <Autocomplete.Row className="grid grid-cols-3 gap-2" key={row.join('-')}>
                    {row.map((emoji) => (
                      <Autocomplete.Item
                        className="grid min-h-10 place-items-center border border-foreground/30"
                        key={emoji}
                        value={emoji}
                      >
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
      <output className="border border-foreground/30 p-2 font-sans text-xs">
        selected value: {value || 'none'}; popup: {open ? 'open' : 'closed'}
      </output>
    </div>
  )
}

function CommandPaletteStory(): ReactElement {
  const [lastCommand, setLastCommand] = useState('none')
  const commands = [
    { items: ['Open workouts', 'Open athletes'], value: 'Navigation' },
    { items: ['Create workout', 'Invite athlete'], value: 'Actions' }
  ]

  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button />}>Open command palette</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-foreground/30" />
        <Dialog.Viewport className="fixed inset-0 grid place-items-center p-6">
          <Dialog.Popup
            aria-label="Command palette"
            className="w-full max-w-xl border border-foreground bg-background p-4 shadow-(--hard-shadow)"
          >
            <Autocomplete.Root inline items={commands} open>
              <Autocomplete.Input
                aria-label="Search commands"
                className="mb-3 w-full border border-foreground bg-background px-3 py-2 text-foreground"
              />
              <Autocomplete.Empty>No command found.</Autocomplete.Empty>
              <Autocomplete.List className="grid gap-3">
                {(group: (typeof commands)[number]) => (
                  <Autocomplete.Group className="grid gap-1" items={group.items} key={group.value}>
                    <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {(command: string) => (
                        <Autocomplete.Item
                          className="border border-foreground/30 px-3 py-2"
                          key={command}
                          onClick={() => setLastCommand(command)}
                          value={command}
                        >
                          {command}
                        </Autocomplete.Item>
                      )}
                    </Autocomplete.Collection>
                  </Autocomplete.Group>
                )}
              </Autocomplete.List>
            </Autocomplete.Root>
            <output className="mt-3 block border border-foreground/30 p-2 font-sans text-xs">
              last command: {lastCommand}
            </output>
            <Dialog.Close className="mt-3" render={<Button />}>
              Close palette
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export const Ex001LabeledDefaultAutocomplete = {
  name: 'EX-001 - Labeled default Autocomplete',
  render: (args) => {
    const athletes = [
      { icon: <UserRound />, text: 'Yann' },
      { icon: <UserRound />, text: 'Amina' },
      { icon: <UserRound />, text: 'Jo' },
      { icon: <UserRound />, text: 'Maya' }
    ]

    return (
      <Field.Root className="grid max-w-xl gap-1" name="athlete">
        <Field.Label>Athlete</Field.Label>
        <Autocomplete.Root items={athletes} size={args.size}>
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn>
              <Search />
            </Autocomplete.AddOn>
            <Autocomplete.Input placeholder="Search athletes…" />
            <Autocomplete.Clear aria-label="Clear athlete" disabled={args.disabled} />
            <Autocomplete.Trigger aria-label="Show athlete suggestions" disabled={args.disabled}>
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
          waitingContent="Enter a name or choose an optional suggestion."
          waitingKey="athlete-help"
        />
      </Field.Root>
    )
  }
} satisfies Story

export const Ex002SharedSizesAndBothAddOnPositions = {
  args: {
    side: 'bottom'
  },
  argTypes: {
    side: {
      control: 'select',
      options: AUTOCOMPLETE_POSITIONER_SIDES
    }
  },
  name: 'EX-002 - Shared sizes and both AddOn positions',
  render: (args) => (
    <div className="grid max-w-xl gap-4">
      {(['xs', 'md', 'xl'] as const satisfies readonly AutocompleteSize[]).map((size, index) => (
        <Autocomplete.Root items={['Amina', 'Jo', 'Maya']} key={size} size={size}>
          <Autocomplete.InputGroup>
            <Autocomplete.AddOn position={index === 1 ? 'end' : 'start'}>
              {index === 1 ? <UserRound /> : <Search />}
            </Autocomplete.AddOn>
            <Autocomplete.Input aria-label={`${size} athlete`} placeholder={size} />
            <Autocomplete.Clear aria-label={`Clear ${size} athlete`} disabled={args.disabled} />
            <Autocomplete.Trigger aria-label={`Show ${size} suggestions`} disabled={args.disabled}>
              <Autocomplete.Icon />
            </Autocomplete.Trigger>
          </Autocomplete.InputGroup>
          <Autocomplete.Portal>
            <Autocomplete.Positioner side={args.side}>
              <Autocomplete.Popup>
                <Autocomplete.List>
                  {(name: string) => (
                    <Autocomplete.Item icon={<UserRound />} key={name} value={name}>
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
} satisfies StoryObj<AutocompleteSidesStoryArgs>

export const Ex003ControlledValueOpenStateAndCompletionProbes = {
  name: 'EX-003 - Controlled value, open state, and completion probes',
  render: () => <ControlledAutocompleteStory />
} satisfies Story

export const Ex004GroupedAndComplexItems = {
  name: 'EX-004 - Grouped and complex items',
  render: () => {
    const teams = [
      {
        items: [
          { discipline: 'Powerlifting', id: 'amina', name: 'Amina' },
          { discipline: 'Weightlifting', id: 'maya', name: 'Maya' }
        ],
        value: 'Power'
      }
    ]

    return (
      <div className="max-w-xl">
        <Autocomplete.Root itemToStringValue={(athlete) => athlete.name} items={teams} size="md">
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
                    <Autocomplete.Group items={team.items} key={team.value}>
                      <Autocomplete.GroupLabel>{team.value}</Autocomplete.GroupLabel>
                      <Autocomplete.Collection>
                        {(athlete: (typeof team.items)[number]) => (
                          <Autocomplete.Item
                            key={athlete.id}
                            render={<a href={`/athletes/${athlete.id}`} />}
                            value={athlete}
                          >
                            <span className="grid flex-1">
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
      </div>
    )
  }
} satisfies Story

export const Ex005AsyncExternallyFilteredResults = {
  name: 'EX-005 - Async externally filtered results',
  render: (args) => <AsyncAutocompleteStory size={args.size} />
} satisfies Story

export const Ex006InlineCompletionModes = {
  name: 'EX-006 - Inline completion modes',
  render: () => (
    <div className="grid max-w-xl gap-4">
      {(['list', 'both'] as const).map((mode) => (
        <Autocomplete.Root items={['feature', 'fix', 'mobile']} key={mode} mode={mode}>
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
} satisfies Story

export const Ex007TriggerOnlyGridWithInputInsidePopup = {
  name: 'EX-007 - Trigger-only grid with Input inside Popup',
  render: () => <EmojiGridStory />
} satisfies Story

export const Ex008CommandPaletteInsideDialog = {
  name: 'EX-008 - Command palette inside a Dialog',
  render: () => <CommandPaletteStory />
} satisfies Story

export const Ex009AutomaticGroupedObjectsWithDecorativeIcons = {
  args: {
    size: 'md'
  },
  name: 'EX-009 - Automatic grouped objects with decorative icons',
  render: (args) => {
    const exerciseGroups = [
      {
        icon: <Dumbbell />,
        items: [
          { icon: <Dumbbell />, text: 'Deadlift' },
          { icon: <Dumbbell />, text: 'Front squat' }
        ],
        text: 'Strength'
      },
      {
        icon: <UsersRound />,
        items: [
          { icon: <UsersRound />, text: 'Amina' },
          { icon: <UsersRound />, text: 'Maya' }
        ],
        text: 'Athletes'
      }
    ]

    return (
      <div className="max-w-xl">
        <Autocomplete.Root disabled={args.disabled} items={exerciseGroups} size={args.size}>
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
      </div>
    )
  }
} satisfies Story

export const Ex010ExplicitRailAndRevealOverrides = {
  args: {
    size: 'md'
  },
  name: 'EX-010 - Existing className and reveal overrides',
  render: (args) => {
    const exerciseOptions = [
      { icon: <Dumbbell />, text: 'Deadlift' },
      { icon: <Dumbbell />, text: 'Front squat' },
      { icon: <Dumbbell />, text: 'Push press' }
    ]

    return (
      <div className="grid max-w-xl gap-4">
        <div className="pb-28">
          <Autocomplete.Root disabled={args.disabled} items={exerciseOptions} size={args.size}>
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
                        className="bg-accent text-accent-foreground"
                        icon={item.icon}
                        key={item.text}
                        revealAnimationProps={
                          index === 1 ? { scale: 1.1 } : index === 2 ? false : undefined
                        }
                        value={item}
                      >
                        {item.text}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
        </div>

        <Autocomplete.Root
          disabled={args.disabled}
          inline
          items={exerciseOptions}
          open
          size={args.size}
        >
          <Autocomplete.Input aria-label="Standalone exercise search" />
          <Autocomplete.List />
        </Autocomplete.Root>
      </div>
    )
  }
} satisfies Story
