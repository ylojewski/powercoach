import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useMemo, useState, type CSSProperties } from 'react'

import { Card, CardPicker, Text } from '../..'

const meta = {
  args: {
    children: null
  },
  argTypes: {
    children: {
      control: false
    },
    className: {
      control: false
    },
    disabled: {
      control: 'boolean'
    },
    inputRef: {
      control: false
    },
    onValueChange: {
      control: false
    },
    placement: {
      control: 'inline-radio',
      options: ['block-start', 'block-end', 'inline-start', 'inline-end']
    },
    readOnly: {
      control: 'boolean'
    },
    render: {
      control: false
    },
    required: {
      control: 'boolean'
    },
    style: {
      control: false
    }
  },
  component: CardPicker.Root,
  title: 'Components/CardPicker'
} satisfies Meta<typeof CardPicker.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001SelectFromWaitingState = {
  args: {
    disabled: false,
    placement: 'block-start',
    readOnly: false,
    required: false
  },
  name: 'EX-001 - Select A Card From The Waiting State',
  render: ({ disabled, placement, readOnly, required }) => {
    const [observedValue, setObservedValue] = useState('none')

    return (
      <div className="grid max-w-4xl gap-4">
        <Text render={<output />}>selected: {observedValue}</Text>

        <CardPicker.Root
          disabled={disabled}
          onValueChange={(value) => setObservedValue(String(value))}
          placement={placement}
          readOnly={readOnly}
          required={required}
        >
          <CardPicker.Group aria-label="Exercise creation method">
            <CardPicker.Card
              hint={{ content: 'Create every exercise setting yourself.' }}
              selectorProps={{ 'aria-label': 'From Scratch' }}
              value="from-scratch"
              className="min-w-64"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title render={<h2 />}>From Scratch</Card.Title>
                  <Card.Description render={<p />}>Start from an empty exercise.</Card.Description>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>

            <CardPicker.Card
              hint={{ content: 'Begin with a structure that is already configured.' }}
              selectorProps={{ 'aria-label': 'Template' }}
              value="template"
              className="min-w-64"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title render={<h2 />}>Template</Card.Title>
                  <Card.Description render={<p />}>
                    Start from a reusable structure.
                  </Card.Description>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>

          <CardPicker.Hint waitingContent="Choose a method to see more information." />
        </CardPicker.Root>
      </div>
    )
  }
} satisfies Story

export const Ex002ControlledEmptySelectionAndOverrides = {
  name: 'EX-002 - Controlled Empty Selection And Composed Overrides',
  render: () => {
    const [method, setMethod] = useState<string | null>(null)

    return (
      <div className="grid max-w-5xl gap-4">
        <button
          className="w-fit border border-foreground px-3 py-2"
          type="button"
          onClick={() => setMethod(null)}
        >
          reset selection
        </button>
        <Text render={<output />}>controlled value: {method ?? 'none'}</Text>

        <CardPicker.Root<string>
          className="gap-6"
          data-picker="controlled"
          onValueChange={setMethod}
          placement="inline-start"
          render={<section aria-label="Controlled creation picker" />}
          value={method}
        >
          <CardPicker.Group
            aria-label="Controlled creation method"
            className="gap-3"
            data-group="methods"
          >
            <CardPicker.Card
              className="min-w-72"
              data-card="guided"
              hint={{ content: 'Follow a guided configuration sequence.' }}
              selectorProps={{
                'aria-label': 'Guided setup',
                'data-selector': 'guided'
              }}
              size="xl"
              value="guided"
            >
              <Card.Surface className="min-h-64">
                <Card.Header>
                  <Card.Title render={<h2 />}>Guided setup</Card.Title>
                  <Card.Description render={<p />}>
                    Answer a short sequence of questions.
                  </Card.Description>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>

            <CardPicker.Card
              className="min-w-72"
              data-card="manual"
              hint={{ content: 'Configure every value directly.' }}
              selectorProps={{
                'aria-label': 'Manual setup',
                'data-selector': 'manual'
              }}
              size="xl"
              value="manual"
            >
              <Card.Surface className="min-h-64">
                <Card.Header>
                  <Card.Title render={<h2 />}>Manual setup</Card.Title>
                  <Card.Description render={<p />}>
                    Enter each training parameter yourself.
                  </Card.Description>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>

          <CardPicker.Hint
            className="min-w-64"
            data-hint="method-help"
            stripesOptions={{ gap: '6px', width: '2px' }}
            textProps={{ size: 'sm', tone: 'accent' }}
            waitingContent="Select guided or manual setup."
          />
        </CardPicker.Root>
      </div>
    )
  }
} satisfies Story

export const Ex003EveryLogicalPlacementInRtl = {
  name: 'EX-003 - Every Logical Placement In RTL',
  render: () => {
    const placements = ['block-start', 'block-end', 'inline-start', 'inline-end'] as const
    const choices = [
      {
        hint: 'Prioritize controlled force production.',
        title: 'Strength',
        value: 'strength'
      },
      {
        hint: 'Prioritize repeatable work and recovery.',
        title: 'Conditioning',
        value: 'conditioning'
      }
    ] as const

    return (
      <div className="grid gap-8" dir="rtl">
        {placements.map((placement) => (
          <section key={placement} className="grid gap-2 border border-border p-4">
            <Text render={<h2 />}>{placement}</Text>

            <CardPicker.Root defaultValue="strength" placement={placement}>
              <CardPicker.Group aria-label={`${placement} training focus`}>
                {choices.map((choice) => (
                  <CardPicker.Card
                    key={choice.value}
                    className="w-48"
                    hint={{ content: choice.hint }}
                    selectorProps={{ 'aria-label': choice.title }}
                    value={choice.value}
                  >
                    <Card.Surface>
                      <Card.Header>
                        <Card.Title>{choice.title}</Card.Title>
                      </Card.Header>
                    </Card.Surface>
                  </CardPicker.Card>
                ))}
              </CardPicker.Group>

              <CardPicker.Hint className="min-w-56" waitingContent="Choose a training focus." />
            </CardPicker.Root>
          </section>
        ))}
      </div>
    )
  }
} satisfies Story

export const Ex004DynamicDirectCardsAndRetainedSelection = {
  name: 'EX-004 - Dynamic Direct Cards And Retained Selection',
  render: () => {
    const [detailed, setDetailed] = useState(false)
    const [method, setMethod] = useState<string | null>('template')
    const [showTemplate, setShowTemplate] = useState(true)
    const permanentChoices = [
      {
        hint: 'Build every section yourself.',
        title: 'From Scratch',
        value: 'from-scratch'
      }
    ] as const
    const visibleHelp =
      method === 'template' && showTemplate
        ? detailed
          ? 'Template detail'
          : 'Template summary'
        : method === 'from-scratch'
          ? 'From Scratch'
          : 'Waiting'

    return (
      <div className="grid max-w-4xl gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            className="border border-foreground px-3 py-2"
            type="button"
            onClick={() => setMethod('template')}
          >
            retain template value
          </button>
          <button
            className="border border-foreground px-3 py-2"
            type="button"
            onClick={() => setShowTemplate((current) => !current)}
          >
            {showTemplate ? 'remove' : 'reinsert'} template Card
          </button>
          <button
            className="border border-foreground px-3 py-2"
            type="button"
            onClick={() => setDetailed((current) => !current)}
          >
            change template help
          </button>
        </div>

        <Text render={<output />}>
          retained value: {method ?? 'none'} · visible help: {visibleHelp}
        </Text>

        <CardPicker.Root className="gap-4" onValueChange={setMethod} value={method}>
          <CardPicker.Group aria-label="Dynamic creation method" className="gap-3">
            {permanentChoices.map((choice) => (
              <CardPicker.Card
                key={choice.value}
                className="min-w-64"
                hint={{ content: choice.hint }}
                selectorProps={{ 'aria-label': choice.title }}
                value={choice.value}
              >
                <Card.Surface>
                  <Card.Header>
                    <Card.Title>{choice.title}</Card.Title>
                  </Card.Header>
                </Card.Surface>
              </CardPicker.Card>
            ))}

            {showTemplate && (
              <CardPicker.Card
                key="template-card"
                className="min-w-64"
                hint={{
                  content: detailed
                    ? 'Use the detailed template configuration and review every preset.'
                    : 'Begin with a preconfigured template.'
                }}
                selectorProps={{ 'aria-label': 'Template' }}
                value="template"
              >
                <Card.Surface>
                  <Card.Header>
                    <Card.Title>Template</Card.Title>
                  </Card.Header>
                </Card.Surface>
              </CardPicker.Card>
            )}
          </CardPicker.Group>

          <CardPicker.Hint waitingContent="The retained value has no current Card." />
        </CardPicker.Root>
      </div>
    )
  }
} satisfies Story

export const Ex005CancellableFormSelection = {
  name: 'EX-005 - Cancellable Uncontrolled Form Selection',
  render: () => {
    const [accepted, setAccepted] = useState('none')
    const [attempted, setAttempted] = useState('none')
    const [submitted, setSubmitted] = useState('not submitted')

    return (
      <form
        className="grid max-w-4xl gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setSubmitted(String(data.get('creationMethod') ?? 'missing'))
        }}
      >
        <CardPicker.Root
          name="creationMethod"
          onValueChange={(value, eventDetails) => {
            setAttempted(value)

            if (value === 'from-scratch') {
              eventDetails.cancel()
              return
            }

            setAccepted(value)
          }}
          required
          className="gap-4"
        >
          <CardPicker.Group aria-label="Permitted creation method" className="gap-3">
            <CardPicker.Card
              className="min-w-64"
              hint={{ content: 'This method is temporarily unavailable.' }}
              selectorProps={{ 'aria-label': 'From Scratch' }}
              value="from-scratch"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>From Scratch</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>

            <CardPicker.Card
              className="min-w-64"
              hint={{ content: 'Template is ready to submit.' }}
              selectorProps={{ 'aria-label': 'Template' }}
              value="template"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Template</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>

          <CardPicker.Hint waitingContent="Choose an available method." />
        </CardPicker.Root>

        <button className="w-fit border border-foreground px-3 py-2" type="submit">
          submit method
        </button>
        <Text render={<output />}>
          attempted: {attempted} · accepted: {accepted} · submitted: {submitted}
        </Text>
      </form>
    )
  }
} satisfies Story

export const Ex006UnavailableRootStates = {
  name: 'EX-006 - Disabled And Read-Only Selection',
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="grid gap-2">
        <Text id="disabled-picker-label">Disabled picker</Text>
        <CardPicker.Root className="gap-4" defaultValue="locked" disabled>
          <CardPicker.Group aria-labelledby="disabled-picker-label" className="gap-3">
            <CardPicker.Card
              hint={{ content: 'The locked method remains selected.' }}
              selectorProps={{ 'aria-label': 'Locked method' }}
              value="locked"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Locked method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
            <CardPicker.Card
              hint={{ content: 'The alternate method cannot be selected.' }}
              selectorProps={{ 'aria-label': 'Alternate disabled method' }}
              value="alternate"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Alternate method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint waitingContent="No disabled method is selected." />
        </CardPicker.Root>
      </section>

      <section className="grid gap-2">
        <Text id="readonly-picker-label">Read-only picker</Text>
        <CardPicker.Root className="gap-4" defaultValue="fixed" readOnly>
          <CardPicker.Group aria-labelledby="readonly-picker-label" className="gap-3">
            <CardPicker.Card
              hint={{ content: 'The fixed method remains selected.' }}
              selectorProps={{ 'aria-label': 'Fixed method' }}
              value="fixed"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Fixed method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
            <CardPicker.Card
              hint={{ content: 'Read-only state prevents this selection.' }}
              selectorProps={{ 'aria-label': 'Alternate read-only method' }}
              value="alternate"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Alternate method</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>
          <CardPicker.Hint waitingContent="No read-only method is selected." />
        </CardPicker.Root>
      </section>
    </div>
  )
} satisfies Story

export const Ex007InteractiveHelpFocusTransfer = {
  name: 'EX-007 - Interactive Help Focus Transfer',
  render: () => {
    const [focusProbe, setFocusProbe] = useState('No transferred focus yet')
    const [method, setMethod] = useState<'advanced' | 'basic'>('basic')
    const [records, setRecords] = useState<string[]>([])
    const advancedHintContent = useMemo(
      () => (
        <section>
          <strong>Advanced configuration</strong>
          <p>Review load, tempo, and recovery together.</p>
        </section>
      ),
      []
    )
    const basicHintContent = useMemo(
      () => (
        <section className="grid gap-2">
          <strong>Basic configuration</strong>
          <button
            className="w-fit border border-foreground px-3 py-2"
            type="button"
            onClick={() => setMethod('advanced')}
          >
            continue to advanced help
          </button>
        </section>
      ),
      []
    )
    const append = (record: string) => {
      setRecords((current) => [...current, record])
    }

    return (
      <div className="grid max-w-4xl gap-4">
        <CardPicker.Root className="gap-4" onValueChange={setMethod} value={method}>
          <CardPicker.Group aria-label="Configuration depth" className="gap-3">
            <CardPicker.Card
              className="min-w-64"
              hint={{ content: basicHintContent }}
              selectorProps={{ 'aria-label': 'Basic configuration' }}
              value="basic"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Basic</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>

            <CardPicker.Card
              className="min-w-64"
              hint={{ content: advancedHintContent }}
              selectorProps={{ 'aria-label': 'Advanced configuration' }}
              value="advanced"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Advanced</Card.Title>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>

          <CardPicker.Hint
            onFocus={() => setFocusProbe(`Hint focus after ${method} selection`)}
            switchAnimationOptions={{
              onSwitchComplete: (details) =>
                append(`complete ${details.replacementId} ${details.status}`),
              onSwitchStart: (details) => append(`start ${details.replacementId}`)
            }}
            waitingContent="Choose a configuration depth."
          />
        </CardPicker.Root>

        <Text render={<output />}>selection: {method}</Text>
        <Text render={<output />}>{focusProbe}</Text>
        <Text render={<output />}>{records.join(', ') || 'No replacement records yet'}</Text>
      </div>
    )
  }
} satisfies Story

export const Ex008OverrideCardStackingAndLayoutGaps = {
  name: 'EX-008 - Override Card Stacking And Layout Gaps',
  render: () => {
    const [method, setMethod] = useState<'ordinary' | 'priority'>('ordinary')
    const priorityStackStyle = {
      '--card-picker-card-z-index': 2
    } as CSSProperties

    return (
      <div className="grid max-w-4xl gap-4">
        <Text render={<output />}>selected: {method}</Text>
        <Text>Root gap: gap-8 · Card gap: gap-1 · Priority stack: 2</Text>

        <CardPicker.Root
          className="gap-8"
          onValueChange={setMethod}
          placement="inline-start"
          value={method}
        >
          <CardPicker.Group aria-label="Stacking priority" className="gap-1">
            <CardPicker.Card
              className="w-56"
              hint={{ content: 'Uses automatic stack levels zero and one.' }}
              selectorProps={{ 'aria-label': 'Ordinary stacking' }}
              value="ordinary"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Ordinary</Card.Title>
                  <Card.Description>Automatic selected ordering</Card.Description>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>

            <CardPicker.Card
              className="w-56"
              hint={{ content: 'Keeps explicit stack level two in every state.' }}
              selectorProps={{ 'aria-label': 'Priority stacking' }}
              style={priorityStackStyle}
              value="priority"
            >
              <Card.Surface>
                <Card.Header>
                  <Card.Title>Priority</Card.Title>
                  <Card.Description>Explicit stack-level override</Card.Description>
                </Card.Header>
              </Card.Surface>
            </CardPicker.Card>
          </CardPicker.Group>

          <CardPicker.Hint waitingContent="Choose a stacking treatment." />
        </CardPicker.Root>
      </div>
    )
  }
} satisfies Story
