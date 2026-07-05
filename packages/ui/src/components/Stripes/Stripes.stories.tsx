import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type CSSProperties } from 'react'

import { Stripes } from '../..'

const meta = {
  args: {
    angle: undefined,
    children: 'Drop a reference image here',
    color: undefined,
    gap: undefined,
    width: undefined
  },
  argTypes: {
    angle: {
      control: 'text'
    },
    children: {
      control: 'text'
    },
    className: {
      control: 'text'
    },
    color: {
      control: 'text'
    },
    gap: {
      control: 'text'
    },
    render: {
      control: false
    },
    style: {
      control: false
    },
    title: {
      control: 'text'
    },
    width: {
      control: 'text'
    }
  },
  component: Stripes,
  title: 'Components/Stripes'
} satisfies Meta<typeof Stripes>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultSupportSurface = {
  args: {
    children: 'Drop a reference image here',
    className: 'border border-foreground/30 p-4'
  },
  name: 'EX-001 - Default Support Surface',
  render: (args) => (
    <div className="grid gap-3 text-foreground">
      <Stripes {...args} />
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">surface element</dt>
          <dd>div</dd>
        </div>
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">default color hook</dt>
          <dd>--stripes-color</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex002NamedStripeOverrides = {
  args: {
    angle: '45deg',
    children: 'Coach feedback is still being generated.',
    className: 'p-4 text-muted-foreground',
    color: 'currentColor',
    gap: '6px',
    width: '2px'
  },
  name: 'EX-002 - Named Stripe Overrides',
  render: (args) => (
    <div className="grid gap-3 text-foreground">
      <Stripes {...args} />
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">angle</dt>
          <dd>{args.angle}</dd>
        </div>
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">gap</dt>
          <dd>{args.gap}</dd>
        </div>
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">width</dt>
          <dd>{args.width}</dd>
        </div>
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">color</dt>
          <dd>{args.color}</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex003CssVariableOverrides = {
  args: {
    children: 'Add one clear constraint before creating the workout.',
    className: 'p-4 text-muted-foreground'
  },
  name: 'EX-003 - CSS Variable Overrides',
  render: (args) => {
    const stripesVariables = {
      '--stripes-angle': '60deg',
      '--stripes-color': 'color-mix(in oklab, currentColor 22%, transparent)',
      '--stripes-gap': '8px',
      '--stripes-width': '1px'
    } as CSSProperties

    return (
      <div className="grid gap-3 text-foreground">
        <Stripes {...args} style={stripesVariables} />
        <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <div className="grid grid-cols-[12rem_1fr] gap-2">
            <dt className="text-muted-foreground">--stripes-angle</dt>
            <dd>60deg</dd>
          </div>
          <div className="grid grid-cols-[12rem_1fr] gap-2">
            <dt className="text-muted-foreground">--stripes-gap</dt>
            <dd>8px</dd>
          </div>
          <div className="grid grid-cols-[12rem_1fr] gap-2">
            <dt className="text-muted-foreground">--stripes-width</dt>
            <dd>1px</dd>
          </div>
          <div className="grid grid-cols-[12rem_1fr] gap-2">
            <dt className="text-muted-foreground">--stripes-color</dt>
            <dd>color-mix()</dd>
          </div>
        </dl>
      </div>
    )
  }
} satisfies Story

export const Ex004PhrasingPlacementWithRender = {
  args: {
    children: 'estimated macros',
    className: 'px-1',
    render: <span />,
    title: 'Estimated macros'
  },
  argTypes: {
    render: {
      control: false,
      table: {
        disable: true
      }
    }
  },
  name: 'EX-004 - Phrasing Placement With Render',
  render: (args) => (
    <div className="grid gap-3 text-foreground">
      <p>
        Your <Stripes {...args} /> are pending.
      </p>
      <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">surface element</dt>
          <dd>span</dd>
        </div>
        <div className="grid grid-cols-[10rem_1fr] gap-2">
          <dt className="text-muted-foreground">title</dt>
          <dd>{args.title}</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story
