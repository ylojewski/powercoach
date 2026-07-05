import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useCallback, useRef, useState } from 'react'

import { Heading } from '../..'
import { HEADING_SIZE_NAMES } from './constants/headingVariants'

const meta = {
  args: {
    children: 'Workout Focus',
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
    size: {
      control: 'select',
      options: HEADING_SIZE_NAMES
    },
    tone: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'muted', 'accent']
    }
  },
  component: Heading,
  title: 'Components/Heading'
} satisfies Meta<typeof Heading>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultEmphasizedText = {
  args: {
    children: 'Workout Focus'
  },
  name: 'EX-001 - Default Emphasized Text'
} satisfies Story

export const Ex002SemanticDocumentHeading = {
  args: {
    children: 'Session Recap',
    size: 'xl'
  },
  name: 'EX-002 - Semantic Document Heading',
  render: (args) => {
    const headingRef = useRef<HTMLSpanElement | null>(null)
    const renderRef = useRef<HTMLHeadingElement | null>(null)
    const [headingClicks, setHeadingClicks] = useState(0)
    const [renderClicks, setRenderClicks] = useState(0)
    const [probe, setProbe] = useState({
      backgroundColor: 'pending',
      color: 'pending',
      contentOccurrenceCount: 0,
      finalClassName: 'pending',
      headingRefRoot: 'pending',
      refsShareRoot: false,
      renderRefRoot: 'pending',
      replacementSource: 'pending'
    })
    const captureFinalElement = useCallback(
      (element: HTMLElement) => {
        setProbe((currentProbe) => ({
          ...currentProbe,
          backgroundColor: element.style.backgroundColor || 'none',
          color: element.style.color || 'none',
          contentOccurrenceCount: Array.from(element.childNodes).filter(
            (node) => node.textContent === args.children
          ).length,
          finalClassName: element.className,
          replacementSource: element.dataset.source ?? 'none'
        }))
      },
      [args.children]
    )
    const setHeadingElement = useCallback(
      (element: HTMLSpanElement | null) => {
        headingRef.current = element

        if (!element) {
          return
        }

        captureFinalElement(element)
        setProbe((currentProbe) => ({
          ...currentProbe,
          headingRefRoot: element.tagName.toLowerCase(),
          refsShareRoot: element === renderRef.current
        }))
      },
      [captureFinalElement]
    )
    const setRenderElement = useCallback(
      (element: HTMLHeadingElement | null) => {
        renderRef.current = element

        if (!element) {
          return
        }

        captureFinalElement(element)
        setProbe((currentProbe) => ({
          ...currentProbe,
          refsShareRoot: element === headingRef.current,
          renderRefRoot: element.tagName.toLowerCase()
        }))
      },
      [captureFinalElement]
    )

    return (
      <div className="grid gap-3 text-foreground">
        <Heading
          {...args}
          className="consumer-class"
          data-source="heading"
          onClick={() => setHeadingClicks((currentClicks) => currentClicks + 1)}
          ref={setHeadingElement}
          render={
            <h2
              className="render-class"
              data-source="render"
              onClick={() => setRenderClicks((currentClicks) => currentClicks + 1)}
              ref={setRenderElement}
              style={{ color: 'white' }}
            />
          }
          style={{ backgroundColor: 'black', color: 'black' }}
        />
        <output className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <span>
            heading class merged: {probe.finalClassName.includes('consumer-class') ? 'yes' : 'no'}
          </span>
          <span>
            render class merged: {probe.finalClassName.includes('render-class') ? 'yes' : 'no'}
          </span>
          <span>background style merged: {probe.backgroundColor === 'black' ? 'yes' : 'no'}</span>
          <span>render color precedence: {probe.color === 'white' ? 'yes' : 'no'}</span>
          <span>collision source: {probe.replacementSource}</span>
          <span>heading clicks: {headingClicks}</span>
          <span>render clicks: {renderClicks}</span>
          <span>content occurrences: {probe.contentOccurrenceCount}</span>
          <span>
            heading ref matches root:{' '}
            {probe.headingRefRoot === 'h2' && probe.refsShareRoot ? 'yes' : 'no'}
          </span>
          <span>
            render ref matches root:{' '}
            {probe.renderRefRoot === 'h2' && probe.refsShareRoot ? 'yes' : 'no'}
          </span>
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex003CallbackRenderWithNativeAttributes = {
  args: {
    'aria-label': 'Personal Record',
    children: 'Personal Record',
    className: 'text-muted-foreground',
    intent: 'warning',
    size: 'sm',
    title: 'Personal Record title'
  },
  name: 'EX-003 - Callback Render With Native Attributes',
  render: (args) => {
    const callbackStateKeyCount = useRef(0)
    const [probe, setProbe] = useState({
      contentOccurrenceCount: 0,
      resolvedRootTagName: 'pending',
      stateKeyCount: 0
    })
    const setHeadingElement = useCallback(
      (element: HTMLSpanElement | null) => {
        if (!element) {
          return
        }

        setProbe({
          contentOccurrenceCount: Array.from(element.childNodes).filter(
            (node) => node.textContent === args.children
          ).length,
          resolvedRootTagName: element.tagName.toLowerCase(),
          stateKeyCount: callbackStateKeyCount.current
        })
      },
      [args.children]
    )

    return (
      <div className="grid gap-3 text-foreground">
        <Heading
          {...args}
          data-example="EX-003"
          ref={setHeadingElement}
          render={(props, state) => {
            callbackStateKeyCount.current = Object.keys(state).length

            return <strong {...props} />
          }}
        />
        <dl className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">callback state keys</dt>
            <dd>{probe.stateKeyCount}</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">resolved ref root</dt>
            <dd>{probe.resolvedRootTagName}</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">content occurrences</dt>
            <dd>{probe.contentOccurrenceCount}</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">aria-label</dt>
            <dd>{args['aria-label']}</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">title</dt>
            <dd>{args.title}</dd>
          </div>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <dt className="text-muted-foreground">className</dt>
            <dd>{args.className}</dd>
          </div>
        </dl>
      </div>
    )
  }
} satisfies Story

export const Ex004SharedSemanticAppearanceScale = {
  name: 'EX-004 - Shared Semantic Appearance Scale',
  render: () => (
    <div className="grid gap-2">
      <Heading>Implicit Default</Heading>
      <Heading tone="default">Default Tone</Heading>
      <Heading tone="primary">Primary Tone</Heading>
      <Heading tone="secondary">Secondary Tone</Heading>
      <Heading tone="muted">Muted Tone</Heading>
      <Heading tone="accent">Accent Tone</Heading>
      <Heading intent="info">Informational Message</Heading>
      <Heading intent="success">Session Saved</Heading>
      <Heading intent="warning">Incomplete Session Data</Heading>
      <Heading intent="destructive">Unable To Save</Heading>
    </div>
  )
} satisfies Story
