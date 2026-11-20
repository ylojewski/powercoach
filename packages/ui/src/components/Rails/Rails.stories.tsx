import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode
} from 'react'

import { Rails } from '../..'

interface RailsFrameProps {
  children: ReactNode
}

interface StoryRouterLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  to: string
}

interface PanelMountProbeProps {
  children: ReactNode
  name: string
  onMountedChange: (name: string, mounted: boolean) => void
}

const StoryRouterLink = forwardRef<HTMLAnchorElement, StoryRouterLinkProps>(
  ({ to, ...props }, ref) => <a href={to} ref={ref} {...props} />
)

StoryRouterLink.displayName = 'StoryRouterLink'

const meta = {
  args: {
    defaultValue: ['overview']
  },
  argTypes: {
    defaultValue: {
      control: 'object'
    },
    disabled: {
      control: 'boolean'
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal']
    },
    value: {
      control: false
    }
  },
  component: Rails.Root,
  title: 'Components/Rails'
} satisfies Meta<typeof Rails.Root>

export default meta

type Story = StoryObj<typeof meta>

function RailsFrame({ children }: RailsFrameProps): ReactElement {
  return <div className="h-100 w-100 border-8 border-muted">{children}</div>
}

function PanelMountProbe({ children, name, onMountedChange }: PanelMountProbeProps): ReactElement {
  useEffect(() => {
    onMountedChange(name, true)
    return () => onMountedChange(name, false)
  }, [name, onMountedChange])

  return <div className="p-4">{children}</div>
}

export const Ex001DefaultRails = {
  args: {
    defaultValue: ['overview']
  },
  name: 'EX-001 - Default Vertical Rails',
  render: (args) => (
    <RailsFrame>
      <Rails.Root {...args}>
        <Rails.List>
          <Rails.Item value="overview">
            <Rails.Header>
              <Rails.Rail>Overview</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Overview content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="training">
            <Rails.Header>
              <Rails.Rail>Training</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Training content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="nutrition">
            <Rails.Header>
              <Rails.Rail>Nutrition</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Nutrition content</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </RailsFrame>
  )
} satisfies Story

export const Ex002ControlledAllCollapsedState = {
  name: 'EX-002 - Controlled All-Collapsed State',
  render: () => {
    const [value, setValue] = useState<string[]>([])

    return (
      <div className="grid gap-3 text-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="border border-foreground px-3 py-1"
            type="button"
            onClick={() => setValue([])}
          >
            collapse all
          </button>
          <button
            className="border border-foreground px-3 py-1"
            type="button"
            onClick={() => setValue(['programs'])}
          >
            open programs
          </button>
          <output className="border border-foreground/30 px-2 py-1">{value[0] ?? 'none'}</output>
        </div>

        <RailsFrame>
          <Rails.Root value={value} onValueChange={setValue}>
            <Rails.List>
              <Rails.Item value="programs">
                <Rails.Header>
                  <Rails.Rail>Programs</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>
                  <div className="p-4">Programs panel</div>
                </Rails.Panel>
              </Rails.Item>

              <Rails.Item value="athletes">
                <Rails.Header>
                  <Rails.Rail>Athletes</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>
                  <div className="p-4">Athletes panel</div>
                </Rails.Panel>
              </Rails.Item>
            </Rails.List>
          </Rails.Root>
        </RailsFrame>
      </div>
    )
  }
} satisfies Story

export const Ex003DisabledItem = {
  name: 'EX-003 - Disabled Item',
  render: () => (
    <RailsFrame>
      <Rails.Root defaultValue={['available']}>
        <Rails.List>
          <Rails.Item value="available">
            <Rails.Header>
              <Rails.Rail>Available</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Available panel</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item disabled value="locked">
            <Rails.Header>
              <Rails.Rail>Locked</Rails.Rail>
            </Rails.Header>
            <Rails.Panel keepMounted>
              <div className="p-4">Locked panel</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </RailsFrame>
  )
} satisfies Story

export const Ex004ReactRouterLinkRail = {
  name: 'EX-004 - React Router Link Rail',
  render: () => (
    <RailsFrame>
      <Rails.Root defaultValue={['programs']}>
        <Rails.List>
          <Rails.Item value="programs">
            <Rails.Header>
              <Rails.Rail nativeButton={false} render={<StoryRouterLink to="/programs" />}>
                Programs
              </Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Programs navigation panel</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="athletes">
            <Rails.Header>
              <Rails.Rail nativeButton={false} render={<StoryRouterLink to="/athletes" />}>
                Athletes
              </Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Athletes navigation panel</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </RailsFrame>
  )
} satisfies Story

export const Ex005UnevenRailWidths = {
  name: 'EX-005 - Uneven Rail Widths',
  render: () => (
    <RailsFrame>
      <Rails.Root defaultValue={['wide']}>
        <Rails.List>
          <Rails.Item value="narrow">
            <Rails.Header>
              <Rails.Rail>Narrow</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Narrow rail panel</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="wide">
            <Rails.Header>
              <Rails.Rail className="w-14">Wide</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Wide rail panel</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </RailsFrame>
  )
} satisfies Story

export const Ex007RailBordersTitlesAndStableMotion = {
  name: 'EX-007 - Rail Borders, Titles, And Stable Motion',
  render: () => (
    <RailsFrame>
      <Rails.Root defaultValue={['training']}>
        <Rails.List className="[--rails-border-width:3px]">
          <Rails.Item value="overview">
            <Rails.Header>
              <Rails.Rail>Overview</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Overview content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="training">
            <Rails.Header>
              <Rails.Rail className="w-14">Training</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Training content</div>
            </Rails.Panel>
          </Rails.Item>

          <Rails.Item value="nutrition">
            <Rails.Header>
              <Rails.Rail>Nutrition</Rails.Rail>
            </Rails.Header>
            <Rails.Panel>
              <div className="p-4">Nutrition content</div>
            </Rails.Panel>
          </Rails.Item>
        </Rails.List>
      </Rails.Root>
    </RailsFrame>
  )
} satisfies Story

export const Ex008ConsumerControlledPanelMounting = {
  name: 'EX-008 - Consumer-Controlled Panel Mounting',
  render: () => {
    const [value, setValue] = useState<string[]>(['programs'])
    const [keepMounted, setKeepMounted] = useState(false)
    const [hiddenUntilFound, setHiddenUntilFound] = useState(false)
    const [keepProgramsMounted, setKeepProgramsMounted] = useState(false)
    const [mounted, setMounted] = useState<Record<string, boolean>>({})

    const setPanelMounted = useCallback((name: string, nextMounted: boolean) => {
      setMounted((current) => ({ ...current, [name]: nextMounted }))
    }, [])

    return (
      <div className="grid gap-3 text-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="border border-foreground px-3 py-1"
            type="button"
            onClick={() => setValue(['programs'])}
          >
            open programs
          </button>
          <button
            className="border border-foreground px-3 py-1"
            type="button"
            onClick={() => setValue(['athletes'])}
          >
            open athletes
          </button>
          <button
            className="border border-foreground px-3 py-1"
            type="button"
            onClick={() => setValue([])}
          >
            collapse all
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={keepMounted}
              onChange={(event) => setKeepMounted(event.currentTarget.checked)}
            />
            keep all Panels mounted
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={keepProgramsMounted}
              onChange={(event) => setKeepProgramsMounted(event.currentTarget.checked)}
            />
            keep Programs mounted
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hiddenUntilFound}
              onChange={(event) => setHiddenUntilFound(event.currentTarget.checked)}
            />
            make closed Panels findable
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <output className="border border-foreground/30 px-2 py-1">
            Programs mounted: {mounted.programs ? 'yes' : 'no'}
          </output>
          <output className="border border-foreground/30 px-2 py-1">
            Athletes mounted: {mounted.athletes ? 'yes' : 'no'}
          </output>
        </div>

        <RailsFrame>
          <Rails.Root
            hiddenUntilFound={hiddenUntilFound}
            keepMounted={keepMounted}
            onValueChange={setValue}
            orientation="horizontal"
            value={value}
          >
            <Rails.List>
              <Rails.Item value="programs">
                <Rails.Header>
                  <Rails.Rail>Programs</Rails.Rail>
                </Rails.Header>
                <Rails.Panel keepMounted={keepProgramsMounted}>
                  <PanelMountProbe name="programs" onMountedChange={setPanelMounted}>
                    Programs findable content
                  </PanelMountProbe>
                </Rails.Panel>
              </Rails.Item>

              <Rails.Item value="athletes">
                <Rails.Header>
                  <Rails.Rail>Athletes</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>
                  <PanelMountProbe name="athletes" onMountedChange={setPanelMounted}>
                    Athletes unique findable content
                  </PanelMountProbe>
                </Rails.Panel>
              </Rails.Item>
            </Rails.List>
          </Rails.Root>
        </RailsFrame>
      </div>
    )
  }
} satisfies Story

export const Ex009HorizontalRails = {
  name: 'EX-009 - Horizontal Rails',
  render: () => {
    const [value, setValue] = useState<string[]>(['training'])

    return (
      <div className="flex flex-col gap-2 text-foreground">
        <div className="flex flex-col gap-2">
          <button
            className="border border-foreground px-3 py-1"
            type="button"
            onClick={() => setValue([])}
          >
            collapse all
          </button>
          <button
            className="border border-foreground px-3 py-1"
            type="button"
            onClick={() => setValue(['programs'])}
          >
            open programs
          </button>
          <output className="border border-foreground/30 px-2 py-1">
            Active Rail: {value[0] ?? 'none'}
          </output>
        </div>

        <RailsFrame>
          <Rails.Root orientation="horizontal" value={value} onValueChange={setValue}>
            <Rails.List className="[--rails-border-width:3px]">
              <Rails.Item value="overview">
                <Rails.Header>
                  <Rails.Rail>Overview</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>
                  <div className="p-4">Overview content keeps its final layout</div>
                </Rails.Panel>
              </Rails.Item>

              <Rails.Item value="training">
                <Rails.Header>
                  <Rails.Rail className="h-14">Training</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>
                  <div className="p-4">Training content keeps its final layout</div>
                </Rails.Panel>
              </Rails.Item>

              <Rails.Item value="programs">
                <Rails.Header>
                  <Rails.Rail>Programs</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>
                  <div className="p-4">Programs content keeps its final layout</div>
                </Rails.Panel>
              </Rails.Item>
            </Rails.List>
          </Rails.Root>
        </RailsFrame>
      </div>
    )
  }
} satisfies Story

export const Ex010HorizontalRailsWithNoRemainingPanelHeight = {
  name: 'EX-010 - Horizontal Rails At The Collapsed-Border Allowance',
  render: () => (
    <div className="grid gap-3 text-foreground">
      <output className="border border-foreground/30 px-2 py-1">
        Expected open Panel height: 2px
      </output>
      <div className="w-100 border-8 border-muted">
        <div className="h-30 w-full">
          <Rails.Root orientation="horizontal" defaultValue={['overview']}>
            <Rails.List>
              <Rails.Item value="overview">
                <Rails.Header>
                  <Rails.Rail>Overview</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>
                  <div className="p-4">This content is clipped from view</div>
                </Rails.Panel>
              </Rails.Item>

              <Rails.Item value="training">
                <Rails.Header>
                  <Rails.Rail>Training</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>Training content</Rails.Panel>
              </Rails.Item>

              <Rails.Item value="nutrition">
                <Rails.Header>
                  <Rails.Rail>Nutrition</Rails.Rail>
                </Rails.Header>
                <Rails.Panel>Nutrition content</Rails.Panel>
              </Rails.Item>
            </Rails.List>
          </Rails.Root>
        </div>
      </div>
    </div>
  )
} satisfies Story
