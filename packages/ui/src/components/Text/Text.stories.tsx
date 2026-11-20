import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useCallback, useState } from 'react'

import { Text } from '../..'
import { TEXT_SIZE_NAMES } from './constants/textVariants'

const meta = {
  args: {
    children: 'Recovery between sets',
    size: 'md'
  },
  argTypes: {
    children: {
      control: 'text'
    },
    className: {
      control: 'text'
    },
    intent: {
      control: 'select',
      options: ['info', 'success', 'warning', 'destructive']
    },
    render: {
      control: false
    },
    size: {
      control: 'select',
      options: TEXT_SIZE_NAMES
    },
    tone: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'muted', 'accent']
    }
  },
  component: Text,
  title: 'Components/Text'
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultInlineText = {
  name: 'EX-001 - Default Inline Text',
  render: (args) => {
    const [ariaLabel, setAriaLabel] = useState('none')
    const [nativeClicks, setNativeClicks] = useState(0)
    const setTextElement = useCallback((element: HTMLSpanElement | null) => {
      setAriaLabel(element?.getAttribute('aria-label') ?? 'none')
    }, [])

    return (
      <div className="grid gap-2">
        <Text
          {...args}
          ref={setTextElement}
          aria-label="Recovery instruction"
          onClick={() => setNativeClicks((current) => current + 1)}
        />
        <output className="grid font-sans text-xs text-muted-foreground">
          <span>aria-label: {ariaLabel}</span>
          <span>native clicks: {nativeClicks}</span>
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex002CompleteSizeScale = {
  name: 'EX-002 - Complete Size Scale',
  render: () => (
    <div className="grid gap-2">
      <Text size="xs">Extra small text</Text>
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra large text</Text>
      <Text size="2xl">Two extra large text</Text>
      <Text size="3xl">Three extra large text</Text>
    </div>
  )
} satisfies Story

export const Ex003DeterministicClassNameOverride = {
  args: {
    children: 'Consumer override',
    className: 'text-4xl text-muted-foreground',
    tone: 'primary'
  },
  name: 'EX-003 - Deterministic ClassName Override'
} satisfies Story

export const Ex004ElementFormRenderReplacement = {
  args: {
    children: 'Keep breathing steadily',
    className: 'text-muted-foreground',
    render: (
      <strong
        className="uppercase"
        data-rendered-element="strong"
        style={{ paddingInline: '2px' }}
      />
    ),
    style: { marginInline: '3px' },
    title: 'Emphasized recovery instruction'
  },
  argTypes: {
    render: {
      control: false,
      table: {
        disable: true
      }
    }
  },
  name: 'EX-004 - Element-Form Render Replacement',
  render: (args) => {
    const [probe, setProbe] = useState({
      finalClassName: 'none',
      marginInline: 'none',
      paddingInline: 'none',
      renderClassName: 'none',
      tagName: 'none'
    })
    const setTextElement = useCallback((element: HTMLSpanElement | null) => {
      setProbe({
        finalClassName: element?.className || 'none',
        marginInline: element?.style.marginInline || 'none',
        paddingInline: element?.style.paddingInline || 'none',
        renderClassName: element?.classList.contains('uppercase') ? 'uppercase' : 'none',
        tagName: element?.tagName.toLowerCase() ?? 'none'
      })
    }, [])

    return (
      <div className="grid gap-2">
        <Text {...args} ref={setTextElement} />
        <output className="grid font-sans text-xs text-muted-foreground">
          <span>rendered element: {probe.tagName}</span>
          <span>render class: {probe.renderClassName}</span>
          <span>final classes: {probe.finalClassName}</span>
          <span>render padding-inline: {probe.paddingInline}</span>
          <span>consumer margin-inline: {probe.marginInline}</span>
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex005CallbackFormRenderReplacement = {
  name: 'EX-005 - Callback-Form Render Replacement And Ref Probe',
  render: () => {
    const [tagName, setTagName] = useState('none')
    const setElement = useCallback((element: HTMLSpanElement | null) => {
      setTagName(element?.tagName.toLowerCase() ?? 'none')
    }, [])

    return (
      <div className="grid gap-2">
        <Text
          ref={setElement}
          data-text-purpose="instruction"
          render={(props, state) => (
            <span {...props}>
              {props.children} · state keys: {Object.keys(state).length}
            </span>
          )}
        >
          Brace before the repetition
        </Text>
        <output className="font-sans text-xs text-muted-foreground">ref element: {tagName}</output>
      </div>
    )
  }
} satisfies Story

export const Ex006SharedSemanticAppearanceScale = {
  name: 'EX-006 - Shared Semantic Appearance Scale',
  render: () => (
    <div className="grid gap-2">
      <Text>Implicit default</Text>
      <Text tone="default">Default tone</Text>
      <Text tone="primary">Primary tone</Text>
      <Text tone="secondary">Secondary tone</Text>
      <Text tone="muted">Muted tone</Text>
      <Text tone="accent">Accent tone</Text>
      <Text intent="info">Informational message</Text>
      <Text intent="success">Session saved</Text>
      <Text intent="warning">Session data is incomplete</Text>
      <Text intent="destructive">Unable to save the session</Text>
    </div>
  )
} satisfies Story
