import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps, type ReactElement, type ReactNode } from 'react'

import { Button, Tabs, type TabsTabValue } from '../..'

interface TabsStoryFrameProps {
  children: ReactNode
}

interface TabsViewportProps {
  children: ReactNode
}

const TABS_DIRECTIONS = ['ltr', 'rtl'] as const

const meta = {
  args: {
    defaultValue: 'overview',
    orientation: 'horizontal'
  },
  argTypes: {
    children: {
      control: false
    },
    defaultValue: {
      control: 'text'
    },
    onValueChange: {
      control: false
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical']
    },
    value: {
      control: false
    }
  },
  component: Tabs.Root,
  title: 'Components/Tabs'
} satisfies Meta<typeof Tabs.Root>

export default meta

type Story = StoryObj<typeof meta>

function TabsStoryFrame({ children }: TabsStoryFrameProps): ReactElement {
  return (
    <div className="grid w-full max-w-xl gap-4 bg-background p-6 text-foreground">{children}</div>
  )
}

function TabsViewport({ children }: TabsViewportProps): ReactElement {
  return (
    <div className="relative grid min-h-32 w-full grid-cols-1 overflow-hidden border border-foreground/30">
      {children}
    </div>
  )
}

function DefaultTabsStory({
  defaultValue,
  orientation
}: Pick<ComponentProps<typeof Tabs.Root>, 'defaultValue' | 'orientation'>): ReactElement {
  const [activeValue, setActiveValue] = useState<TabsTabValue>(defaultValue ?? 'overview')

  return (
    <TabsStoryFrame>
      <output className="w-fit border border-foreground/30 px-2 py-1">
        active: {activeValue ?? 'none'}
      </output>
      <Tabs.Root
        defaultValue={defaultValue}
        onValueChange={setActiveValue}
        orientation={orientation}
      >
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <TabsViewport>
          <Tabs.Panel value="overview">Workspace stats and activity.</Tabs.Panel>
          <Tabs.Panel value="projects">Milestones and deadlines.</Tabs.Panel>
          <Tabs.Panel value="account">Profile and preferences.</Tabs.Panel>
        </TabsViewport>
      </Tabs.Root>
    </TabsStoryFrame>
  )
}

function ControlledTabsStory(): ReactElement {
  const [value, setValue] = useState<TabsTabValue>('overview')

  return (
    <TabsStoryFrame>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setValue('overview')}>
          show overview
        </Button>
        <Button type="button" onClick={() => setValue('projects')}>
          show projects
        </Button>
        <Button type="button" onClick={() => setValue(null)}>
          clear selection
        </Button>
      </div>
      <output className="w-fit border border-foreground/30 px-2 py-1">
        active: {value ?? 'none'}
      </output>
      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <TabsViewport>
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="projects">Projects content</Tabs.Panel>
        </TabsViewport>
      </Tabs.Root>
    </TabsStoryFrame>
  )
}

function CustomizedTabRevealsStory(): ReactElement {
  const [message, setMessage] = useState('idle')
  const unrevealBehavior = 'continue' as const
  const revealAnimation = {
    alignX: 'start' as const,
    direction: 'top-to-bottom' as const,
    offsetX: 4,
    offsetY: -2,
    onRevealStart: (revealed: boolean) => setMessage(revealed ? 'revealing' : 'hiding'),
    scale: 1.1,
    unrevealBehavior
  }

  return (
    <TabsStoryFrame>
      <output className="w-fit border border-foreground/30 px-2 py-1">
        {unrevealBehavior}: {message}
      </output>
      <Tabs.Root defaultValue="training">
        <Tabs.List>
          <Tabs.Tab revealAnimation={revealAnimation} value="overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab revealAnimation={revealAnimation} value="training">
            Training
          </Tabs.Tab>
          <Tabs.Tab disabled revealAnimation={revealAnimation} value="locked">
            Locked
          </Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <TabsViewport>
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="training">Training content</Tabs.Panel>
          <Tabs.Panel value="locked">Locked content</Tabs.Panel>
        </TabsViewport>
      </Tabs.Root>
    </TabsStoryFrame>
  )
}

function LinkedTabsStory(): ReactElement {
  const [value, setValue] = useState<TabsTabValue>('overview')

  return (
    <TabsStoryFrame>
      <output className="w-fit border border-foreground/30 px-2 py-1">
        active link: {value ?? 'none'}
      </output>
      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab nativeButton={false} render={<a href="#overview" />} value="overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab nativeButton={false} render={<a href="#projects" />} value="projects">
            Projects
          </Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <TabsViewport>
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="projects">Projects content</Tabs.Panel>
        </TabsViewport>
      </Tabs.Root>
    </TabsStoryFrame>
  )
}

function PersistentTabsStory(): ReactElement {
  const [value, setValue] = useState<TabsTabValue>('first')

  return (
    <TabsStoryFrame>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setValue('first')}>
          first
        </Button>
        <Button type="button" onClick={() => setValue('second')}>
          second
        </Button>
      </div>
      <output className="w-fit border border-foreground/30 px-2 py-1">
        active: {value ?? 'none'}
      </output>
      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="first">First</Tabs.Tab>
          <Tabs.Tab value="second">Second</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <TabsViewport>
          <Tabs.Panel keepMounted value="first">
            First persistent content
          </Tabs.Panel>
          <Tabs.Panel keepMounted value="second">
            Second persistent content
          </Tabs.Panel>
        </TabsViewport>
      </Tabs.Root>
    </TabsStoryFrame>
  )
}

function LogicalBorderFusionTabsStory(): ReactElement {
  const [values, setValues] = useState<Record<(typeof TABS_DIRECTIONS)[number], TabsTabValue>>({
    ltr: 'projects',
    rtl: 'projects'
  })

  return (
    <TabsStoryFrame>
      <div className="grid gap-8">
        {TABS_DIRECTIONS.map((direction) => (
          <section className="grid gap-2" key={direction}>
            <output className="w-fit border border-foreground/30 px-2 py-1">
              {direction}: {values[direction]}
            </output>
            <Tabs.Root
              dir={direction}
              onValueChange={(nextValue) => {
                if (typeof nextValue === 'string') {
                  setValues((current) => ({ ...current, [direction]: nextValue }))
                }
              }}
              value={values[direction]}
            >
              <Tabs.List activateOnFocus className="[--tabs-border-width:3px]">
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="projects">Longer projects label</Tabs.Tab>
                <Tabs.Tab disabled value="locked">
                  Locked
                </Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <TabsViewport>
                <Tabs.Panel value="overview">Overview content</Tabs.Panel>
                <Tabs.Panel value="projects">Projects content</Tabs.Panel>
                <Tabs.Panel value="locked">Locked content</Tabs.Panel>
              </TabsViewport>
            </Tabs.Root>
          </section>
        ))}
      </div>
    </TabsStoryFrame>
  )
}

function BoundaryTabsStory({
  orientation
}: {
  orientation: 'horizontal' | 'vertical'
}): ReactElement {
  const [value, setValue] = useState<TabsTabValue>(null)
  const vertical = orientation === 'vertical'

  return (
    <section className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setValue('first')}>
          show first
        </Button>
        <Button type="button" onClick={() => setValue('second')}>
          show second
        </Button>
        <Button type="button" onClick={() => setValue(null)}>
          clear selection
        </Button>
      </div>
      <output className="w-fit border border-foreground/30 px-2 py-1">
        {orientation}: {value ?? 'none'}
      </output>

      <Tabs.Root
        className={vertical ? 'grid grid-cols-[max-content_minmax(0,1fr)]' : undefined}
        onValueChange={setValue}
        orientation={orientation}
        value={value}
      >
        <Tabs.List className={vertical ? 'relative grid grid-cols-1' : undefined}>
          <Tabs.Tab className={vertical ? 'w-full' : undefined} value="first">
            First
          </Tabs.Tab>
          <Tabs.Tab className={vertical ? 'h-14 w-full' : undefined} value="second">
            Longer second Tab
          </Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>

        <TabsViewport>
          <Tabs.Panel value="first">First content</Tabs.Panel>
          <Tabs.Panel value="second">Second content</Tabs.Panel>
        </TabsViewport>
      </Tabs.Root>
    </section>
  )
}

function IndicatorBoundaryMotionTabsStory(): ReactElement {
  return (
    <TabsStoryFrame>
      <div className="grid gap-8">
        <BoundaryTabsStory orientation="horizontal" />
        <BoundaryTabsStory orientation="vertical" />
      </div>
    </TabsStoryFrame>
  )
}

export const Ex001DefaultAnimatedTabs = {
  name: 'EX-001 - Default animated Tabs',
  render: (args) => (
    <DefaultTabsStory defaultValue={args.defaultValue} orientation={args.orientation} />
  )
} satisfies Story

export const Ex002ControlledSelectionAndNoActiveState = {
  name: 'EX-002 - Controlled selection and no-active state',
  render: () => <ControlledTabsStory />
} satisfies Story

export const Ex003VerticalKeyboardNavigation = {
  name: 'EX-003 - Vertical keyboard navigation',
  render: () => (
    <TabsStoryFrame>
      <p className="text-sm text-muted-foreground">
        Use Up, Down, Home, and End to move focus without looping. Press Enter or Space to activate.
      </p>
      <Tabs.Root
        className="grid w-full min-w-0 grid-cols-[max-content_minmax(0,1fr)]"
        defaultValue="training"
        orientation="vertical"
      >
        <Tabs.List className="relative grid grid-cols-1 items-stretch" loopFocus={false}>
          <Tabs.Tab className="w-full" value="overview">
            Overview
          </Tabs.Tab>
          <Tabs.Tab className="w-full" value="training">
            Training
          </Tabs.Tab>
          <Tabs.Tab className="h-14 w-full" value="nutrition">
            Nutrition
          </Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <div className="relative grid min-h-32 min-w-0 grid-cols-1 overflow-hidden border border-foreground/30">
          <Tabs.Panel value="overview">Overview content</Tabs.Panel>
          <Tabs.Panel value="training">Training content</Tabs.Panel>
          <Tabs.Panel value="nutrition">Nutrition content</Tabs.Panel>
        </div>
      </Tabs.Root>
    </TabsStoryFrame>
  )
} satisfies Story

export const Ex004RevealOverridesAndDisabledPolicy = {
  name: 'EX-004 - Reveal overrides and disabled policy',
  render: () => <CustomizedTabRevealsStory />
} satisfies Story

export const Ex005LinkTabRenderOverride = {
  name: 'EX-005 - Link Tab render override',
  render: () => <LinkedTabsStory />
} satisfies Story

export const Ex006KeptPanelsAndInterruptedSelection = {
  name: 'EX-006 - Kept Panels and interrupted selection',
  render: () => <PersistentTabsStory />
} satisfies Story

export const Ex007LogicalBorderFusionAndRtlIndicator = {
  name: 'EX-007 - Logical border fusion and RTL Indicator',
  render: () => <LogicalBorderFusionTabsStory />
} satisfies Story

export const Ex008IndicatorBoundaryMotion = {
  name: 'EX-008 - Indicator boundary motion',
  render: () => <IndicatorBoundaryMotionTabsStory />
} satisfies Story
