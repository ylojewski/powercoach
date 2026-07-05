import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type CSSProperties, useLayoutEffect, useRef } from 'react'

import { Hint } from '../..'

const meta = {
  args: {
    hints: [],
    waitingContent: 'Choose an input to see contextual guidance.',
    waitingKey: 'waiting'
  },
  argTypes: {
    className: {
      control: 'text'
    },
    hints: {
      control: false
    },
    render: {
      control: false
    },
    stripesOptions: {
      control: false
    },
    style: {
      control: false
    },
    switchAnimationOptions: {
      control: false
    },
    textProps: {
      control: 'object'
    },
    waitingContent: {
      control: 'text'
    },
    waitingKey: {
      control: 'text'
    }
  },
  component: Hint,
  title: 'Components/Hint'
} satisfies Meta<typeof Hint>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001WaitingUntilFulfilled = {
  name: 'EX-001 - Show Waiting Content Until Fulfilled',
  render: (args) => {
    const [longEffort, setLongEffort] = useState(false)

    return (
      <div className="grid max-w-xl gap-3 text-foreground">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={longEffort}
            onChange={(event) => setLongEffort(event.currentTarget.checked)}
          />
          effort longer than 30 seconds
        </label>
        <Hint
          {...args}
          hints={[
            {
              condition: longEffort,
              content: 'Add enough recovery to preserve rep quality.',
              key: 'long-effort'
            }
          ]}
        />
        <output className="text-xs text-muted-foreground">
          Active content: {longEffort ? 'long effort hint' : 'waiting'}
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex002FirstFulfilledPriority = {
  name: 'EX-002 - Resolve Overlapping Conditions',
  render: (args) => {
    const [conditioning, setConditioning] = useState(false)
    const [strength, setStrength] = useState(false)
    const active = strength ? 'strength' : conditioning ? 'conditioning' : 'waiting'

    return (
      <div className="grid max-w-xl gap-3 text-foreground">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={strength}
            onChange={(event) => setStrength(event.currentTarget.checked)}
          />
          strength condition fulfilled
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={conditioning}
            onChange={(event) => setConditioning(event.currentTarget.checked)}
          />
          conditioning condition fulfilled
        </label>
        <Hint
          {...args}
          waitingContent="Select a training condition."
          hints={[
            {
              condition: strength,
              content: 'Keep the main lift first in the session.',
              key: 'strength'
            },
            {
              condition: conditioning,
              content: 'Keep the work-to-rest ratio repeatable.',
              key: 'conditioning'
            }
          ]}
        />
        <output className="text-xs text-muted-foreground">Active selection: {active}</output>
      </div>
    )
  }
} satisfies Story

export const Ex003InteractiveReactContent = {
  name: 'EX-003 - Switch Interactive React Content',
  render: (args) => {
    const [advanced, setAdvanced] = useState(false)
    const [focusProbe, setFocusProbe] = useState('No transferred focus yet')

    return (
      <div className="grid max-w-xl gap-3 text-foreground">
        <Hint
          {...args}
          onFocus={() => {
            if (advanced) setFocusProbe('Progression hint focused')
          }}
          waitingKey="basic"
          waitingContent={
            <section className="grid gap-2 p-2">
              <strong>Start with one working set.</strong>
              <button
                type="button"
                className="border border-foreground px-2 py-1"
                onClick={() => setAdvanced(true)}
              >
                show progression hint
              </button>
            </section>
          }
          hints={[
            {
              condition: advanced,
              content: (
                <section className="p-2">
                  Add load only after every target rep is controlled.
                </section>
              ),
              key: 'advanced'
            }
          ]}
        />
        <output className="text-xs text-muted-foreground">{focusProbe}</output>
      </div>
    )
  }
} satisfies Story

export const Ex004CompositionOverrides = {
  name: 'EX-004 - Override Text, Stripe And Switch Options',
  render: (args) => {
    const [fulfilled, setFulfilled] = useState(false)
    const [records, setRecords] = useState<string[]>([])
    const switchStyle = {
      '--switch-animation-distance': '24px',
      '--switch-animation-duration': '260ms',
      '--switch-animation-stagger': '70ms'
    } as CSSProperties
    const outputRef = useRef<HTMLOutputElement>(null)

    useLayoutEffect(() => {
      if (!outputRef.current) return
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }, [records.length])

    return (
      <div className="grid max-w-xl gap-3 text-foreground">
        <button
          type="button"
          className="w-fit border border-foreground px-2 py-1 text-sm"
          onClick={() => setFulfilled((value) => !value)}
        >
          switch hint
        </button>
        <Hint
          {...args}
          textProps={{
            className: 'font-semibold',
            size: 'lg',
            style: { textTransform: 'uppercase' },
            tone: 'accent'
          }}
          waitingContent="Waiting for the constraint."
          hints={[
            {
              condition: fulfilled,
              content: 'The constraint is fulfilled.',
              key: 'fulfilled'
            }
          ]}
          stripesOptions={{
            angle: '45deg',
            className: 'text-muted-foreground',
            color: 'currentColor',
            gap: '6px',
            width: '2px'
          }}
          switchAnimationOptions={{
            direction: 'right',
            onSwitchChange: (details) =>
              setRecords((current) => [...current, `change ${details.replacementId}`]),
            onSwitchComplete: (details) =>
              setRecords((current) => [
                ...current,
                `complete ${details.replacementId} ${details.status}`
              ]),
            onSwitchStart: (details) =>
              setRecords((current) => [...current, `start ${details.replacementId}`]),
            style: switchStyle
          }}
        />
        <output
          className="flex h-30 w-100 flex-col overflow-auto text-xs text-muted-foreground"
          ref={outputRef}
        >
          {records.length
            ? records.map((record, i) => <div key={i}>{record}</div>)
            : 'No replacement records yet'}
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex005LabeledWrapperReplacement = {
  args: {
    'aria-label': 'Workout guidance',
    className: 'w-full',
    render: <section />,
    waitingContent: 'Add an exercise to see guidance.'
  },
  argTypes: {
    render: {
      control: false,
      table: {
        disable: true
      }
    }
  },
  name: 'EX-005 - Replace And Label The Public Wrapper',
  render: (args) => (
    <div className="grid max-w-xl gap-3 text-foreground">
      <Hint {...args} data-context="workout-builder" />
      <dl className="grid gap-1 border border-foreground/30 p-2 text-xs">
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">wrapper</dt>
          <dd>section</dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-2">
          <dt className="text-muted-foreground">aria-label</dt>
          <dd>{args['aria-label']}</dd>
        </div>
      </dl>
    </div>
  )
} satisfies Story

export const Ex006RapidZeroMotionReplacements = {
  name: 'EX-006 - Observe Rapid Zero-Motion Replacements By Generation',
  render: (args) => {
    const [fulfilled, setFulfilled] = useState(false)
    const [records, setRecords] = useState<string[]>([])

    function append(record: string) {
      setRecords((current) => [...current, record])
    }

    function runRapidSequence() {
      setFulfilled(true)
      window.setTimeout(() => setFulfilled(false), 0)
    }

    return (
      <div className="grid max-w-xl gap-3 text-foreground">
        <button
          type="button"
          className="w-fit border border-foreground px-2 py-1 text-sm"
          onClick={runRapidSequence}
        >
          run waiting → fulfilled → waiting
        </button>
        <Hint
          {...args}
          waitingContent="Waiting for the constraint."
          hints={[
            {
              condition: fulfilled,
              content: 'The constraint is fulfilled.',
              key: 'fulfilled'
            }
          ]}
          switchAnimationOptions={{
            onSwitchChange: (details) =>
              append(
                `change ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)}`
              ),
            onSwitchComplete: (details) =>
              append(
                `complete ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)} ${details.status}`
              ),
            onSwitchStart: (details) =>
              append(
                `start ${details.replacementId} ${String(details.previousKey)} → ${String(details.nextKey)}`
              ),
            style: {
              '--switch-animation-duration': '0ms',
              '--switch-animation-stagger': '0ms'
            } as CSSProperties
          }}
        />
        <output className="text-xs text-muted-foreground">
          Active selection: {fulfilled ? 'fulfilled' : 'waiting'}
        </output>
        <ol aria-label="Replacement lifecycle records" className="list-decimal ps-5 text-xs">
          {records.map((record, index) => (
            <li key={`${record}-${index}`}>{record}</li>
          ))}
        </ol>
      </div>
    )
  }
} satisfies Story
