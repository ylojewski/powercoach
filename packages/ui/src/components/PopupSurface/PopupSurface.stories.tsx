import { Popover } from '@base-ui/react/popover'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { Dumbbell, Home, Info, Search, Settings, Star, UserRound } from 'lucide-react'

import { Button, PopupSurface } from '../..'

const meta = {
  args: {
    size: 'md'
  },
  argTypes: {
    children: { control: false },
    render: { control: false },
    size: {
      control: 'inline-radio',
      options: ['xs', 'md', 'xl']
    }
  },
  component: PopupSurface.Root,
  title: 'Components/PopupSurface'
} satisfies Meta<typeof PopupSurface.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001CompleteSharedSizeScale = {
  name: 'EX-001 - Complete shared size scale',
  render: () => (
    <div className="grid w-fit gap-4">
      {(['xs', 'md', 'xl'] as const).map((size) => (
        <PopupSurface.Root key={size} size={size}>
          <PopupSurface.Group>
            <PopupSurface.GroupLabel>Strength</PopupSurface.GroupLabel>
            <PopupSurface.Item icon={<Dumbbell />} size={size}>
              Deadlift
            </PopupSurface.Item>
            <PopupSurface.Item icon={<Dumbbell />} size={size}>
              Front squat
            </PopupSurface.Item>
          </PopupSurface.Group>
        </PopupSurface.Root>
      ))}
    </div>
  )
} satisfies Story

export const Ex002LogicalIconAndContentPositions = {
  name: 'EX-002 - Logical Icon and content positions',
  render: () => (
    <PopupSurface.Root dir="rtl" size="md">
      <PopupSurface.Item icon={<Search />} iconPosition="start" size="md">
        Search
      </PopupSurface.Item>
      <PopupSurface.Item icon={<UserRound />} iconPosition="end" size="md">
        Athlete
      </PopupSurface.Item>
      <PopupSurface.Item contentInset="start" size="md">
        Reserved start rail
      </PopupSurface.Item>
    </PopupSurface.Root>
  )
} satisfies Story

export const Ex003ControlledAndInteractionDerivedLinkReveal = {
  name: 'EX-003 - Controlled and interaction-derived Link reveal',
  render: () => (
    <PopupSurface.Root render={<nav aria-label="Athlete pages" />} size="md">
      <PopupSurface.Item
        aria-current="page"
        icon={<Home />}
        render={<a href="home" />}
        reveal
        size="md"
      >
        Home
      </PopupSurface.Item>
      <PopupSurface.Item icon={<Star />} render={<a href="reviews" />} size="md">
        Reviews
      </PopupSurface.Item>
    </PopupSurface.Root>
  )
} satisfies Story

export const Ex004ImmediateFallbackAndPresentationOverrides = {
  name: 'EX-004 - Immediate fallback and presentation overrides',
  render: () => (
    <PopupSurface.Root className="bg-accent text-accent-foreground" size="md">
      <PopupSurface.Item
        className="bg-accent text-accent-foreground"
        icon={<Settings />}
        render={<a href="settings" />}
        reveal
        revealAnimationProps={false}
        size="md"
      >
        Settings
      </PopupSurface.Item>
    </PopupSurface.Root>
  )
} satisfies Story

export const Ex005BaseUiPopupLifecycleComposition = {
  name: 'EX-005 - Base UI Popup lifecycle composition',
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button />}>Open details</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup render={<PopupSurface.Root size="md" />}>
            <PopupSurface.Item icon={<Info />} size="md">
              Recovery details
            </PopupSurface.Item>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
} satisfies Story
