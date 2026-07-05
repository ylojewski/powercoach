import { Button as BaseButton } from '@base-ui/react/button'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState, type CSSProperties, type Key } from 'react'

import {
  SwitchAnimation,
  type SwitchAnimationCompleteDetails,
  type SwitchAnimationDirection,
  type SwitchAnimationReplacementDetails
} from '../..'

const SWITCH_ANIMATION_DIRECTIONS = [
  'down',
  'up',
  'left',
  'right'
] as const satisfies readonly SwitchAnimationDirection[]

const meta = {
  args: {
    children: <div key="storybook">storybook content</div>,
    contentMode: 'flow',
    direction: 'down'
  },
  argTypes: {
    children: {
      control: false
    },
    contentMode: {
      control: 'inline-radio',
      options: ['flow', 'phrasing']
    },
    direction: {
      control: 'select',
      options: SWITCH_ANIMATION_DIRECTIONS
    },
    onSwitchChange: {
      control: false
    },
    onSwitchComplete: {
      control: false
    },
    onSwitchStart: {
      control: false
    },
    render: {
      control: false
    }
  },
  component: SwitchAnimation,
  title: 'Animations/SwitchAnimation'
} satisfies Meta<typeof SwitchAnimation>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DifferentStableSizes = {
  name: 'EX-001 - Replace Flow Content With Different Stable Sizes',
  render: () => {
    const [view, setView] = useState<'details' | 'summary'>('summary')

    return (
      <div className="grid w-[32rem] gap-3 font-sans text-foreground">
        <button
          className="w-fit border border-foreground bg-background px-3 py-2 text-sm"
          onClick={() => setView((value) => (value === 'summary' ? 'details' : 'summary'))}
          type="button"
        >
          switch content
        </button>
        <p className="text-sm text-muted-foreground">Before the animated slot.</p>
        <SwitchAnimation>
          {view === 'summary' ? (
            <div className="border border-foreground p-3" key="summary">
              <strong>Strength block</strong>
            </div>
          ) : (
            <section
              aria-label="Workout details"
              className="grid gap-2 border border-foreground p-5"
              key="details"
            >
              <h3 className="font-heading text-xl lowercase">Strength block</h3>
              <p>Four movements, three working sets, and two accessory rounds.</p>
            </section>
          )}
        </SwitchAnimation>
        <p className="text-sm text-muted-foreground">After the animated slot.</p>
        <output className="border border-foreground/30 p-2 text-sm">Active key: {view}</output>
      </div>
    )
  }
} satisfies Story

export const Ex002DirectionsAndMotionVariables = {
  name: 'EX-002 - Four Directions And Custom Motion Variables',
  render: () => {
    const [alternate, setAlternate] = useState(false)
    const motionStyle = {
      '--switch-animation-distance': '24px',
      '--switch-animation-duration': '260ms',
      '--switch-animation-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
      '--switch-animation-stagger': '70ms'
    } as CSSProperties

    return (
      <div className="grid gap-4 font-sans text-foreground">
        <button
          className="w-fit border border-foreground bg-background px-3 py-2 text-sm"
          onClick={() => setAlternate((value) => !value)}
          type="button"
        >
          switch every direction
        </button>
        <div className="grid grid-cols-2 gap-3">
          {SWITCH_ANIMATION_DIRECTIONS.map((direction) => (
            <div className="border border-foreground/30 p-3" key={direction}>
              <SwitchAnimation contentMode="phrasing" direction={direction} style={motionStyle}>
                <span key={alternate ? `${direction}-second` : `${direction}-first`}>
                  {direction}: {alternate ? 'second' : 'first'}
                </span>
              </SwitchAnimation>
            </div>
          ))}
        </div>
        <output className="text-xs text-muted-foreground">
          260ms · 70ms stagger · 24px · cubic-bezier(0.4, 0, 0.2, 1)
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex003BaseUiButtonComposition = {
  name: 'EX-003 - Base UI Button Render Composition',
  render: () => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [refTarget, setRefTarget] = useState('pending')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
      setRefTarget(buttonRef.current?.tagName ?? 'missing')
    }, [])

    return (
      <div className="grid w-fit gap-2 font-sans text-foreground">
        <BaseButton
          ref={buttonRef}
          aria-label="Save workout"
          className="border border-foreground bg-background px-4 py-2 text-sm"
          onClick={() => setSaving((value) => !value)}
          render={
            <SwitchAnimation contentMode="phrasing" render={<button type="button" />}>
              <span key={saving ? 'saving' : 'save'}>{saving ? 'saving…' : 'save workout'}</span>
            </SwitchAnimation>
          }
        />
        <output aria-label="Merged ref target" className="text-xs text-muted-foreground">
          Merged ref target: {refTarget}
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex004FocusTransfer = {
  name: 'EX-004 - Transfer Focus To Incoming Content',
  render: () => {
    const [focusProbe, setFocusProbe] = useState('No transferred focus yet')
    const [view, setView] = useState<'editor' | 'summary'>('editor')

    return (
      <div className="grid w-80 gap-3 font-sans text-foreground">
        <SwitchAnimation>
          {view === 'editor' ? (
            <section
              aria-label="Workout editor"
              className="grid gap-3 border border-foreground p-4"
              key="editor"
              onFocus={(event) => {
                if (event.currentTarget === event.target) setFocusProbe('Editor root focused')
              }}
              tabIndex={-1}
            >
              <h3 className="font-heading text-xl lowercase">Edit workout</h3>
              <button
                className="border border-foreground px-3 py-2 text-sm"
                onClick={() => setView('summary')}
                type="button"
              >
                show summary
              </button>
            </section>
          ) : (
            <section
              aria-label="Workout summary"
              className="grid gap-3 border border-foreground p-4"
              key="summary"
              onFocus={(event) => {
                if (event.currentTarget === event.target) setFocusProbe('Summary root focused')
              }}
              tabIndex={-1}
            >
              <h3 className="font-heading text-xl lowercase">Workout summary</h3>
              <button
                className="border border-foreground px-3 py-2 text-sm"
                onClick={() => setView('editor')}
                type="button"
              >
                edit workout
              </button>
            </section>
          )}
        </SwitchAnimation>
        <output className="border border-foreground/30 p-2 text-sm">{focusProbe}</output>
      </div>
    )
  }
} satisfies Story

export const Ex005OverlappingLifecycleProbe = {
  name: 'EX-005 - Observe Overlapping Replacement Lifecycles',
  render: () => {
    const [activeKey, setActiveKey] = useState<'a' | 'b' | 'c'>('a')
    const [direction, setDirection] = useState<SwitchAnimationDirection>('down')
    const [duration, setDuration] = useState(200)
    const [pending, setPending] = useState<number[]>([])
    const [reducedMotion, setReducedMotion] = useState(false)
    const [rows, setRows] = useState<
      {
        direction: SwitchAnimationDirection
        name: 'change' | 'complete' | 'start'
        nextKey: Key
        previousKey: Key
        replacementId: number
        status?: 'finished' | 'interrupted'
      }[]
    >([])
    const [stagger, setStagger] = useState(50)
    const timersRef = useRef<number[]>([])

    useEffect(() => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)')
      const update = () => setReducedMotion(query.matches)

      update()
      query.addEventListener('change', update)
      return () => {
        query.removeEventListener('change', update)
        for (const timer of timersRef.current) window.clearTimeout(timer)
      }
    }, [])

    const record = (
      name: 'change' | 'complete' | 'start',
      details: SwitchAnimationReplacementDetails | SwitchAnimationCompleteDetails
    ) => {
      setRows((current) => [
        ...current,
        {
          direction: details.direction,
          name,
          nextKey: details.nextKey,
          previousKey: details.previousKey,
          replacementId: details.replacementId,
          status: 'status' in details ? details.status : undefined
        }
      ])

      if (name === 'change') {
        setPending((current) => [...current, details.replacementId])
      } else if (name === 'complete') {
        setPending((current) => current.filter((id) => id !== details.replacementId))
      }
    }

    const motionStyle = {
      '--switch-animation-duration': `${duration}ms`,
      '--switch-animation-stagger': `${stagger}ms`
    } as CSSProperties

    return (
      <div className="grid w-[42rem] gap-4 font-sans text-foreground">
        <div className="flex flex-wrap gap-2">
          {(['a', 'b', 'c'] as const).map((key) => (
            <button
              className="border border-foreground px-3 py-2 text-sm"
              key={key}
              onClick={() => setActiveKey(key)}
              type="button"
            >
              show {key.toUpperCase()}
            </button>
          ))}
          <button
            className="border border-foreground bg-foreground px-3 py-2 text-sm text-background"
            onClick={() => {
              setActiveKey('a')
              timersRef.current = [
                window.setTimeout(() => setActiveKey('b'), 20),
                window.setTimeout(() => setActiveKey('c'), 60),
                window.setTimeout(() => setActiveKey('a'), 100)
              ]
            }}
            type="button"
          >
            run A → B → C → A
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <label className="grid gap-1">
            direction
            <select
              className="border border-foreground bg-background p-2"
              onChange={(event) =>
                setDirection(event.currentTarget.value as SwitchAnimationDirection)
              }
              value={direction}
            >
              {SWITCH_ANIMATION_DIRECTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            duration in ms
            <input
              className="border border-foreground bg-background p-2"
              min="0"
              onChange={(event) => setDuration(event.currentTarget.valueAsNumber)}
              type="number"
              value={duration}
            />
          </label>
          <label className="grid gap-1">
            stagger in ms
            <input
              className="border border-foreground bg-background p-2"
              min="0"
              onChange={(event) => setStagger(event.currentTarget.valueAsNumber)}
              type="number"
              value={stagger}
            />
          </label>
        </div>
        <div className="border border-foreground p-5">
          <SwitchAnimation
            direction={direction}
            onSwitchChange={(details) => record('change', details)}
            onSwitchComplete={(details) => record('complete', details)}
            onSwitchStart={(details) => record('start', details)}
            style={motionStyle}
          >
            <div key={activeKey}>Content {activeKey.toUpperCase()}</div>
          </SwitchAnimation>
        </div>
        <div className="grid grid-cols-3 gap-2 border border-foreground/30 p-3 text-xs">
          <p>Current key: {activeKey}</p>
          <p>Reduced motion: {reducedMotion ? 'reduce' : 'no preference'}</p>
          <p>Pending IDs: {pending.join(', ') || 'none'}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="border border-foreground px-3 py-2 text-sm"
            onClick={() => {
              setPending([])
              setRows([])
            }}
            type="button"
          >
            clear records
          </button>
          <output className="self-center text-xs text-muted-foreground">
            change {rows.filter((row) => row.name === 'change').length} · start{' '}
            {rows.filter((row) => row.name === 'start').length} · complete{' '}
            {rows.filter((row) => row.name === 'complete').length} · interrupted{' '}
            {rows.filter((row) => row.status === 'interrupted').length}
          </output>
        </div>
        <div className="max-h-52 overflow-auto border border-foreground/30">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-foreground/30">
                <th className="p-2">event</th>
                <th className="p-2">ID</th>
                <th className="p-2">previous</th>
                <th className="p-2">next</th>
                <th className="p-2">direction</th>
                <th className="p-2">status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  className="border-b border-foreground/15"
                  key={`${row.replacementId}-${row.name}-${index}`}
                >
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.replacementId}</td>
                  <td className="p-2">{String(row.previousKey)}</td>
                  <td className="p-2">{String(row.nextKey)}</td>
                  <td className="p-2">{row.direction}</td>
                  <td className="p-2">{row.status ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
} satisfies Story

export const Ex006ConsumerOwnedClipping = {
  name: 'EX-006 - Consumer-Owned Clipping',
  render: () => {
    const [alternate, setAlternate] = useState(false)
    const content = alternate ? 'longer incoming label' : 'short label'
    const key = alternate ? 'long' : 'short'

    return (
      <div className="grid gap-4 font-sans text-foreground">
        <button
          className="w-fit border border-foreground px-3 py-2 text-sm"
          onClick={() => setAlternate((value) => !value)}
          type="button"
        >
          switch labels
        </button>
        <div className="grid grid-cols-2 gap-8">
          <section className="grid gap-2 border border-dashed border-foreground/30 p-4">
            <h3 className="text-sm font-bold">Visible overflow</h3>
            <SwitchAnimation contentMode="phrasing" direction="right">
              <span key={key}>{content}</span>
            </SwitchAnimation>
          </section>
          <section className="grid gap-2 border border-dashed border-foreground/30 p-4">
            <h3 className="text-sm font-bold">Consumer-owned clipping</h3>
            <span className="inline-block overflow-clip">
              <SwitchAnimation contentMode="phrasing" direction="right">
                <span key={key}>{content}</span>
              </SwitchAnimation>
            </span>
          </section>
        </div>
      </div>
    )
  }
} satisfies Story
