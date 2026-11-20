import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Save,
  SkipForward,
  SlidersHorizontal,
  UserRound
} from 'lucide-react'

import { Button, Heading, buttonChromeHeadingSize, buttonChromeVariants } from '../..'
import { BUTTON_SIZE_NAMES, BUTTON_VARIANT_NAMES } from './constants/buttonVariants'

const meta = {
  args: {
    children: 'save workout',
    disabled: false,
    focusableWhenDisabled: false,
    loading: false,
    revealAnimation: false,
    size: 'lg',
    type: 'button',
    variant: 'default'
  },
  argTypes: {
    append: {
      control: false
    },
    children: {
      control: 'text'
    },
    className: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    focusableWhenDisabled: {
      control: 'boolean'
    },
    loading: {
      control: 'boolean'
    },
    prepend: {
      control: false
    },
    revealAnimation: {
      control: 'boolean'
    },
    size: {
      control: 'select',
      options: BUTTON_SIZE_NAMES
    },
    variant: {
      control: 'select',
      options: BUTTON_VARIANT_NAMES
    }
  },
  component: Button,
  title: 'Components/Button'
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultActionButton = {
  args: {
    children: 'save workout',
    size: 'lg',
    variant: 'default'
  },
  name: 'EX-001 - Default Action Button'
} satisfies Story

export const Ex002ButtonWithPrependAndAppendIcons = {
  args: {
    children: 'continue plan',
    size: 'xl',
    variant: 'default'
  },
  name: 'EX-002 - Button With Prepend And Append Icons',
  render: (args) => (
    <Button
      {...args}
      append={<ArrowRight aria-hidden="true" />}
      prepend={<ArrowLeft aria-hidden="true" />}
    />
  )
} satisfies Story

export const Ex003GhostAndLinkVariants = {
  name: 'EX-003 - Ghost And Link Variants',
  render: () => (
    <div className="grid gap-3 text-foreground">
      <p>
        <Button type="button" variant="ghost">
          skip
        </Button>{' '}
        <Button disabled focusableWhenDisabled type="button" variant="ghost">
          locked skip
        </Button>{' '}
        or{' '}
        <Button type="button" variant="link">
          reset filters
        </Button>{' '}
        <Button disabled focusableWhenDisabled type="button" variant="link">
          locked reset
        </Button>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="ghost">
          ghost
        </Button>
        <Button disabled type="button" variant="ghost">
          disabled ghost
        </Button>
        <Button disabled focusableWhenDisabled type="button" variant="ghost">
          focusable ghost
        </Button>
      </div>
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[9rem_1fr] gap-2">
          <dt className="text-muted-foreground">ghost border</dt>
          <dd>transparent</dd>
        </div>
        <div className="grid grid-cols-[9rem_1fr] gap-2">
          <dt className="text-muted-foreground">ghost hover</dt>
          <dd>enabled only</dd>
        </div>
        <div className="grid grid-cols-[9rem_1fr] gap-2">
          <dt className="text-muted-foreground">disabled link</dt>
          <dd>cursor default</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex004IconActionButton = {
  args: {
    'aria-label': 'Open filters',
    size: 'icon-lg',
    variant: 'default'
  },
  name: 'EX-004 - Icon Action Button',
  render: (args) => (
    <div className="grid gap-3 text-foreground">
      <Button {...args}>
        <SlidersHorizontal />
      </Button>
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[7rem_1fr] gap-2">
          <dt className="text-muted-foreground">aria-label</dt>
          <dd>{args['aria-label']}</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex005StableLoadingState = {
  args: {
    children: 'save workout',
    loading: true,
    size: 'lg',
    variant: 'default'
  },
  name: 'EX-005 - Stable Loading State',
  render: (args) => (
    <div className="grid gap-3 text-foreground">
      <Button {...args} prepend={<Save aria-hidden="true" />} />
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">data-loading</dt>
          <dd>{args.loading ? 'present' : 'absent'}</dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">aria-busy</dt>
          <dd>{args.loading ? 'true' : 'false'}</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex006DisabledAndKeyboardFocusTreatments = {
  args: {
    children: 'save workout',
    disabled: true,
    focusableWhenDisabled: true,
    size: 'lg',
    variant: 'default'
  },
  name: 'EX-006 - Disabled And Keyboard Focus Treatments',
  render: (args) => (
    <div className="grid gap-3 text-foreground">
      <Button {...args} />
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">focusable disabled</dt>
          <dd>{args.disabled && args.focusableWhenDisabled ? 'enabled' : 'disabled'}</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex007DefaultButtonRevealAnimation = {
  args: {
    children: 'save workout',
    revealAnimation: true,
    size: 'lg',
    variant: 'default'
  },
  name: 'EX-007 - Default Button RevealAnimation',
  render: (args) => (
    <div className="grid gap-3 text-foreground">
      <div className="flex items-start">
        <Button {...args} />
      </div>
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[9rem_1fr] gap-2">
          <dt className="text-muted-foreground">revealAnimation</dt>
          <dd>{args.revealAnimation ? 'enabled' : 'disabled'}</dd>
        </div>
        <div className="grid grid-cols-[9rem_1fr] gap-2">
          <dt className="text-muted-foreground">overlay border</dt>
          <dd>transparent</dd>
        </div>
        <div className="grid grid-cols-[9rem_1fr] gap-2">
          <dt className="text-muted-foreground">unreveal behavior</dt>
          <dd>return</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex008IconPrefixedRevealAnimationVariants = {
  name: 'EX-008 - Icon-Prefixed RevealAnimation Variants',
  render: () => {
    const ghostUnrevealBehavior = 'continue' as const

    return (
      <div className="grid gap-3 text-foreground">
        <p>
          <Button
            aria-label="Open profile"
            revealAnimation={{
              alignX: 'center',
              alignY: 'center',
              direction: 'top-to-bottom',
              reveal: true,
              scale: 1.2
            }}
            size="icon-lg"
            type="button"
          >
            <UserRound />
          </Button>{' '}
          <Button
            aria-label="Skip"
            revealAnimation={{
              direction: 'left-to-right',
              unrevealBehavior: ghostUnrevealBehavior
            }}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <SkipForward />
          </Button>{' '}
          <Button
            aria-label="Reset filters"
            revealAnimation={{ contentMode: 'phrasing', reveal: true, scale: 1 }}
            size="icon-xs"
            type="button"
            variant="link"
          >
            <RotateCcw />
          </Button>
        </p>
        <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">icon direction</dt>
            <dd>top to bottom</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">icon scale</dt>
            <dd>1.2</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">ghost unreveal</dt>
            <dd>{ghostUnrevealBehavior}</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">link layout</dt>
            <dd>phrasing, scale 1</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">overlay variants</dt>
            <dd>default, ghost, link</dd>
          </div>
        </dl>
      </div>
    )
  }
} satisfies Story

export const Ex009SharedButtonChromeWithoutButtonSemantics = {
  args: {
    size: 'lg',
    variant: 'default'
  },
  name: 'EX-009 - Shared Button Chrome Without Button Semantics',
  render: (args) => {
    const chromeClassName = buttonChromeVariants({
      size: args.size,
      variant: args.variant
    })
    const headingSize = buttonChromeHeadingSize(args.size)

    return (
      <div className="grid gap-3 text-foreground">
        <span className={chromeClassName}>
          <Heading size={headingSize}>shared chrome</Heading>
        </span>
        <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">surface element</dt>
            <dd>span</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">button role</dt>
            <dd>none</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">heading size</dt>
            <dd>{headingSize}</dd>
          </div>
        </dl>
      </div>
    )
  }
} satisfies Story
