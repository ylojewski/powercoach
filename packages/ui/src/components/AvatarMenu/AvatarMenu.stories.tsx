import { type Meta, type StoryObj } from '@storybook/react-vite'
import {
  CalendarDays,
  CircleHelp,
  Dumbbell,
  Home,
  MessageSquareText,
  Settings,
  Star
} from 'lucide-react'
import {
  forwardRef,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement
} from 'react'

import { Avatar, AvatarMenu, Button } from '../..'

const meta = {
  argTypes: {
    children: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    value: { control: false }
  },
  component: AvatarMenu.Root,
  title: 'Components/AvatarMenu'
} satisfies Meta<typeof AvatarMenu.Root>

export default meta

type Story = StoryObj<typeof meta>

interface HorizontalAvatarMenuStoryArgs {
  direction: 'ltr' | 'rtl'
}

interface AvatarMenuShellProps {
  children: ReactElement | ReactElement[]
  keepMounted?: boolean
}

function AvatarMenuShell({ children, keepMounted }: AvatarMenuShellProps): ReactElement {
  return (
    <>
      {children}
      <AvatarMenu.Portal keepMounted={keepMounted}>
        <AvatarMenu.Positioner>
          <AvatarMenu.Popup>
            <AvatarMenu.Viewport />
          </AvatarMenu.Popup>
        </AvatarMenu.Positioner>
      </AvatarMenu.Portal>
    </>
  )
}

function DefaultAvatarMenu(): ReactElement {
  const athletes = [
    {
      fullName: 'Yann Lojewski',
      id: 'yann',
      image: '/athletes/yann.jpg',
      initials: 'YA',
      name: 'Yann'
    },
    { fullName: 'Amina Diallo', id: 'amina', image: undefined, initials: 'AM', name: 'Amina' },
    { fullName: 'Leo Martin', id: 'leo', image: undefined, initials: 'LE', name: 'Leo' }
  ] as const
  const links = [
    { href: 'home', Icon: Home, label: 'Home' },
    { href: 'programs', Icon: Dumbbell, label: 'Programs' },
    { href: 'reviews', Icon: Star, label: 'Reviews' },
    { href: 'settings', Icon: Settings, label: 'Settings' }
  ] as const

  return (
    <AvatarMenu.Root>
      <AvatarMenuShell>
        <AvatarMenu.List className="grid gap-2">
          {athletes.map((athlete) => (
            <AvatarMenu.Item key={athlete.id} value={athlete.id}>
              <AvatarMenu.Trigger aria-label={`Open ${athlete.name} navigation`}>
                {athlete.image ? <Avatar.Image alt="" src={athlete.image} /> : null}
                <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
              </AvatarMenu.Trigger>
              <AvatarMenu.Content>
                <AvatarMenu.Group>
                  <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                  {links.map(({ href, Icon, label }) => (
                    <AvatarMenu.Link href={href} icon={<Icon />} key={href}>
                      {label}
                    </AvatarMenu.Link>
                  ))}
                </AvatarMenu.Group>
              </AvatarMenu.Content>
            </AvatarMenu.Item>
          ))}
        </AvatarMenu.List>
      </AvatarMenuShell>
    </AvatarMenu.Root>
  )
}

function ControlledAvatarMenu(): ReactElement {
  const [value, setValue] = useState<string | null>('amina')
  const [reason, setReason] = useState('none')
  const [phase, setPhase] = useState('open')
  const athletes = [
    { fullName: 'Amina Diallo', id: 'amina', initials: 'AM' },
    { fullName: 'Yann Lojewski', id: 'yann', initials: 'YA' }
  ]

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setValue('amina')} type="button">
          open Amina
        </Button>
        <Button onClick={() => setValue('yann')} type="button">
          open Yann
        </Button>
        <Button onClick={() => setValue(null)} type="button">
          close
        </Button>
      </div>
      <AvatarMenu.Root
        onOpenChangeComplete={(open) => setPhase(open ? 'open' : 'closed')}
        onValueChange={(nextValue, details) => {
          setReason(details.reason)
          setValue(nextValue)
        }}
        value={value}
      >
        <AvatarMenuShell keepMounted>
          <AvatarMenu.List className="grid gap-2">
            {athletes.map((athlete) => (
              <AvatarMenu.Item key={athlete.id} value={athlete.id}>
                <AvatarMenu.Trigger
                  active={athlete.id === 'amina'}
                  aria-label={`Open ${athlete.id} navigation`}
                >
                  <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                    <AvatarMenu.Link href={`${athlete.id}/home`} icon={<Home />}>
                      Home for {athlete.id === 'amina' ? 'Amina' : 'Yann'}
                    </AvatarMenu.Link>
                    <AvatarMenu.Link active href={`${athlete.id}/programs`} icon={<Dumbbell />}>
                      Programs for {athlete.id === 'amina' ? 'Amina' : 'Yann'}
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            ))}
          </AvatarMenu.List>
        </AvatarMenuShell>
      </AvatarMenu.Root>
      <output>
        value: {value ?? 'closed'}; reason: {reason}; phase: {phase}
      </output>
    </div>
  )
}

function HorizontalAvatarMenu({ direction }: HorizontalAvatarMenuStoryArgs): ReactElement {
  const athletes = [
    { fullName: 'Amina Diallo', id: 'amina', initials: 'AM' },
    { fullName: 'Yann Lojewski', id: 'yann', initials: 'YA' },
    { fullName: 'Leo Martin', id: 'leo', initials: 'LE' }
  ] as const
  const lastNonNullValueRef = useRef<string>('amina')
  const [{ activationDirection, value }, setMenuState] = useState<{
    activationDirection: 'left' | 'none' | 'right'
    value: string | null
  }>({ activationDirection: 'none', value: 'amina' })
  const setMenuValue = (nextValue: string | null) => {
    const previousValue = lastNonNullValueRef.current

    if (nextValue === null || previousValue === nextValue) {
      setMenuState((currentState) => ({ ...currentState, value: nextValue }))
      return
    }

    const previousIndex = athletes.findIndex((athlete) => athlete.id === previousValue)
    const nextIndex = athletes.findIndex((athlete) => athlete.id === nextValue)
    const movesForward = nextIndex > previousIndex

    lastNonNullValueRef.current = nextValue
    setMenuState({
      activationDirection:
        direction === 'ltr' ? (movesForward ? 'right' : 'left') : movesForward ? 'left' : 'right',
      value: nextValue
    })
  }

  return (
    <div className="grid gap-4 p-16" dir={direction}>
      <div aria-label="External Avatar controls" className="flex flex-wrap gap-2" role="group">
        <Button onClick={() => setMenuValue('amina')} type="button">
          Open Amina externally
        </Button>
        <Button onClick={() => setMenuValue('yann')} type="button">
          Open Yann externally
        </Button>
      </div>
      <output aria-label="Horizontal movement status">
        direction: {direction}; preferred side: bottom; align: start; activation direction:{' '}
        {activationDirection}
      </output>
      <AvatarMenu.Root onValueChange={setMenuValue} orientation="horizontal" value={value}>
        <AvatarMenuShell>
          <AvatarMenu.List className="gap-2">
            {athletes.map((athlete) => (
              <AvatarMenu.Item
                className="relative before:pointer-events-none before:absolute before:top-0 before:left-0 before:size-9 before:border before:border-dashed before:border-muted-foreground before:content-['']"
                key={athlete.id}
                value={athlete.id}
              >
                <AvatarMenu.Trigger aria-label={`Open ${athlete.id} navigation`}>
                  <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                    <AvatarMenu.Link href={`${athlete.id}/home`} icon={<Home />}>
                      Home for {athlete.fullName}
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            ))}
          </AvatarMenu.List>
        </AvatarMenuShell>
      </AvatarMenu.Root>
    </div>
  )
}

const RouterLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'> & { to: string }>(
  function RouterLink({ to, ...props }, ref) {
    return <a {...props} href={to} ref={ref} />
  }
)

export const Ex001DefaultAvatarNavigation = {
  name: 'EX-001 - Default Avatar navigation',
  render: () => <DefaultAvatarMenu />
} satisfies Story

export const Ex002ControlledOpenAvatarAndActiveRoutes = {
  name: 'EX-002 - Controlled open Avatar and active routes',
  render: () => <ControlledAvatarMenu />
} satisfies Story

export const Ex003UncontrolledDefaultAndConfigurableCloseDelay = {
  name: 'EX-003 - Uncontrolled default and configurable close delay',
  render: () => (
    <AvatarMenu.Root closeDelay={120} defaultValue="amina">
      <AvatarMenuShell>
        <AvatarMenu.List className="grid gap-2">
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <Avatar.Fallback>AM</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link href="reviews" icon={<Star />}>
                  Reviews
                </AvatarMenu.Link>
                <AvatarMenu.Link closeOnClick={false} href="help" icon={<CircleHelp />}>
                  Help
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
      </AvatarMenuShell>
    </AvatarMenu.Root>
  )
} satisfies Story

export const Ex004RouterCompatibleLinkRender = {
  name: 'EX-004 - Router-compatible Link render',
  render: () => (
    <AvatarMenu.Root defaultValue="yann">
      <AvatarMenuShell>
        <AvatarMenu.List className="grid gap-2">
          <AvatarMenu.Item value="yann">
            <AvatarMenu.Trigger aria-label="Open Yann navigation">
              <Avatar.Fallback>YA</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                <AvatarMenu.Link
                  href="programs"
                  icon={<Dumbbell />}
                  render={<RouterLink to="programs" />}
                >
                  Programs
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
      </AvatarMenuShell>
    </AvatarMenu.Root>
  )
} satisfies Story

export const Ex005DynamicAvatarToAvatarMovement = {
  name: 'EX-005 - Dynamic Avatar-to-Avatar movement',
  render: () => (
    <AvatarMenu.Root defaultValue="amina">
      <AvatarMenuShell>
        <AvatarMenu.List className="grid gap-2">
          <AvatarMenu.Item value="amina">
            <AvatarMenu.Trigger aria-label="Open Amina navigation">
              <Avatar.Fallback>AM</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Amina Diallo</AvatarMenu.GroupLabel>
                <AvatarMenu.Link href="home" icon={<Home />}>
                  Home
                </AvatarMenu.Link>
                <AvatarMenu.Link href="calendar" icon={<CalendarDays />}>
                  Competition calendar
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
          <AvatarMenu.Item value="yann">
            <AvatarMenu.Trigger aria-label="Open Yann navigation">
              <Avatar.Fallback>YA</Avatar.Fallback>
            </AvatarMenu.Trigger>
            <AvatarMenu.Content>
              <AvatarMenu.Group>
                <AvatarMenu.GroupLabel>Yann Lojewski</AvatarMenu.GroupLabel>
                <AvatarMenu.Link href="programs" icon={<Dumbbell />}>
                  Programs
                </AvatarMenu.Link>
                <AvatarMenu.Link href="reviews" icon={<MessageSquareText />}>
                  Reviews
                </AvatarMenu.Link>
              </AvatarMenu.Group>
            </AvatarMenu.Content>
          </AvatarMenu.Item>
        </AvatarMenu.List>
      </AvatarMenuShell>
    </AvatarMenu.Root>
  )
} satisfies Story

export const Ex006RtlCollisionKeyboardAndReducedMotionProbes = {
  name: 'EX-006 - RTL collision, keyboard, and reduced-motion probes',
  render: () => {
    const athletes = [
      { fullName: 'Amina Diallo', id: 'amina' },
      { fullName: 'Yann Lojewski', id: 'yann' }
    ] as const

    return (
      <div className="w-56 overflow-hidden p-8" dir="rtl">
        <AvatarMenu.Root>
          <AvatarMenu.List className="grid gap-2">
            {athletes.map((athlete) => (
              <AvatarMenu.Item key={athlete.id} value={athlete.id}>
                <AvatarMenu.Trigger aria-label={`Open ${athlete.id} navigation`}>
                  <Avatar.Fallback>{athlete.id.slice(0, 2)}</Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group>
                    <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                    <AvatarMenu.Link href="home" icon={<Home />}>
                      Home
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            ))}
          </AvatarMenu.List>
          <AvatarMenu.Portal>
            <AvatarMenu.Positioner collisionAvoidance={{ align: 'shift', side: 'flip' }}>
              <AvatarMenu.Popup>
                <AvatarMenu.Viewport />
              </AvatarMenu.Popup>
            </AvatarMenu.Positioner>
          </AvatarMenu.Portal>
        </AvatarMenu.Root>
      </div>
    )
  }
} satisfies Story

export const Ex007ConfigureOrRemoveGroupStripes = {
  name: 'EX-007 - Configure or remove Group Stripes',
  render: () => {
    const athletes = [
      {
        fullName: 'Amina Diallo',
        id: 'amina',
        initials: 'AM',
        stripesProps: undefined
      },
      {
        fullName: 'True Stripes',
        id: 'true',
        initials: 'TS',
        stripesProps: true
      },
      {
        fullName: 'Yann Lojewski',
        id: 'yann',
        initials: 'YA',
        stripesProps: {
          angle: '45deg',
          className: 'text-muted-foreground',
          color: 'currentColor',
          gap: '6px',
          width: '2px'
        }
      },
      { fullName: 'Leo Martin', id: 'leo', initials: 'LE', stripesProps: false }
    ] as const

    return (
      <AvatarMenu.Root>
        <AvatarMenuShell>
          <AvatarMenu.List className="grid gap-2">
            {athletes.map((athlete) => (
              <AvatarMenu.Item key={athlete.id} value={athlete.id}>
                <AvatarMenu.Trigger aria-label={`Open ${athlete.id} navigation`}>
                  <Avatar.Fallback>{athlete.initials}</Avatar.Fallback>
                </AvatarMenu.Trigger>
                <AvatarMenu.Content>
                  <AvatarMenu.Group stripesProps={athlete.stripesProps}>
                    <AvatarMenu.GroupLabel>{athlete.fullName}</AvatarMenu.GroupLabel>
                    <AvatarMenu.Link href="home" icon={<Home />}>
                      Home
                    </AvatarMenu.Link>
                  </AvatarMenu.Group>
                </AvatarMenu.Content>
              </AvatarMenu.Item>
            ))}
          </AvatarMenu.List>
        </AvatarMenuShell>
      </AvatarMenu.Root>
    )
  }
} satisfies Story

export const Ex008HorizontalOrientationAndAxisMovement = {
  args: {
    direction: 'ltr'
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['ltr', 'rtl']
    }
  },
  name: 'EX-008 - Horizontal orientation and axis movement',
  render: (args) => <HorizontalAvatarMenu direction={args.direction} />
} satisfies StoryObj<HorizontalAvatarMenuStoryArgs>
