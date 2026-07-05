import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'

import { AspectRatio, Components, Ui } from '../..'

const SESSION_IMAGE_SRC =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 480%22%3E%3Crect width=%22320%22 height=%22480%22 fill=%22%23171717%22/%3E%3Cpath d=%22M0 360L110 215l68 68L320 95v385H0z%22 fill=%22%23f97316%22/%3E%3Ccircle cx=%22110%22 cy=%22120%22 r=%2242%22 fill=%22%23ffedd5%22/%3E%3Cpath d=%22M98 166l-34 112m50-94l70 54m-78-36l-34 80m46-66l72 94%22 fill=%22none%22 stroke=%22white%22 stroke-width=%2218%22 stroke-linecap=%22square%22/%3E%3C/svg%3E' as const

const meta = {
  args: {
    fit: 'cover',
    ratio: 16 / 9
  },
  argTypes: {
    children: {
      control: false
    },
    className: {
      control: 'text'
    },
    fit: {
      control: 'inline-radio',
      options: ['contain', 'cover']
    },
    ratio: {
      control: { min: 0.25, step: 0.25, type: 'number' }
    },
    render: {
      control: false
    },
    style: {
      control: false
    }
  },
  component: AspectRatio,
  title: 'Components/AspectRatio'
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultCroppedMediaSurface = {
  args: {
    className: 'w-80 bg-muted'
  },
  name: 'EX-001 - Default Cropped Media Surface',
  render: (args) => (
    <AspectRatio {...args}>
      <img src={SESSION_IMAGE_SRC} alt="Athlete starting a sprint" />
    </AspectRatio>
  )
} satisfies Story

export const Ex002ContainedDirectMedia = {
  args: {
    className: 'size-64 bg-muted',
    fit: 'contain',
    ratio: 1
  },
  name: 'EX-002 - Contained Direct Media',
  render: (args) => (
    <AspectRatio {...args}>
      <svg viewBox="0 0 160 100" role="img" aria-label="Three sprint phases">
        <rect width="160" height="100" fill="currentColor" opacity="0.1" />
        <path d="M16 76 L64 38 L104 60 L144 20" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    </AspectRatio>
  )
} satisfies Story

export const Ex003ReplacementFigureWithConsumerOverlay = {
  args: {
    className: 'w-72 bg-muted',
    ratio: 4 / 3
  },
  name: 'EX-003 - Replacement Figure With Consumer Overlay',
  render: (args) => (
    <AspectRatio {...args} render={<figure aria-labelledby="session-caption" />}>
      <img src={SESSION_IMAGE_SRC} alt="" />
      <figcaption id="session-caption" className="absolute inset-x-0 bottom-0 bg-background/80 p-2">
        Afternoon sprint session
      </figcaption>
    </AspectRatio>
  )
} satisfies Story

export const Ex004CallbackRenderWithVisibleCompositionProbe = {
  args: {
    ratio: 3 / 2
  },
  name: 'EX-004 - Callback Render With Visible Composition Probe',
  render: (args) => {
    const finalElement = useRef<Element | null>(null)
    const [probe, setProbe] = useState('Activate the preview')

    return (
      <div className="grid w-72 gap-2">
        <AspectRatio
          {...args}
          aria-label="Open afternoon session"
          className="bg-muted"
          ref={(node) => {
            finalElement.current = node
          }}
          onClick={() => {
            setProbe(finalElement.current?.tagName ?? 'Missing element')
          }}
          render={(props, state) => (
            <button
              {...props}
              type="button"
              onClick={(event) => {
                props.onClick?.(event)
                setProbe(`${finalElement.current?.tagName} / ${Object.keys(state).length}`)
              }}
            />
          )}
        >
          <img src={SESSION_IMAGE_SRC} alt="" />
        </AspectRatio>
        <output aria-live="polite" className="font-sans text-xs text-muted-foreground">
          Final element / state fields: {probe}
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex005ConsumerRatioOverrideAndNestedContent = {
  args: {
    className: 'w-96 bg-muted',
    ratio: 1
  },
  name: 'EX-005 - Consumer Ratio Override And Nested Content',
  render: (args) => (
    <AspectRatio {...args} style={{ aspectRatio: '3 / 1' }}>
      <div className="grid h-full grid-cols-3 items-center gap-3 p-3">
        <img
          className="size-16 object-cover"
          src={SESSION_IMAGE_SRC}
          alt="Sprint session thumbnail"
        />
        <span className="col-span-2">Afternoon sprint session</span>
      </div>
    </AspectRatio>
  )
} satisfies Story

export const Ex006NamespaceAccess = {
  name: 'EX-006 - Namespace Access',
  render: () => (
    <div className="grid w-96 grid-cols-2 gap-4">
      <Components.AspectRatio ratio={1} className="bg-muted">
        <img src={SESSION_IMAGE_SRC} alt="Athlete stretching" />
      </Components.AspectRatio>
      <Ui.Components.AspectRatio ratio={1} fit="contain" className="bg-muted">
        <img src={SESSION_IMAGE_SRC} alt="Athlete lifting a barbell" />
      </Ui.Components.AspectRatio>
    </div>
  )
} satisfies Story
