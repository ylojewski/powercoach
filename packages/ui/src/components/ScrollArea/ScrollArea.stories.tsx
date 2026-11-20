import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState } from 'react'

import { ScrollArea, type ScrollAreaProps } from '../..'

interface ScrollAreaStoryArgs extends ScrollAreaProps {
  reducedMotion: 'no-preference' | 'reduce'
}

const meta: Meta<ScrollAreaStoryArgs> = {
  args: {
    children: null,
    overflowEdgeThreshold: 0,
    reducedMotion: 'no-preference'
  },
  argTypes: {
    children: {
      control: false
    },
    className: {
      control: false
    },
    overflowEdgeThreshold: {
      control: {
        min: 0,
        step: 1,
        type: 'number'
      }
    },
    reducedMotion: {
      control: 'inline-radio',
      name: 'Reduced-motion media',
      options: ['no-preference', 'reduce']
    },
    render: {
      control: false
    },
    style: {
      control: false
    }
  },
  component: ScrollArea,
  title: 'Components/ScrollArea'
}

export default meta

type Story = StoryObj<typeof meta>

export const Ex001NativeVerticalScrolling = {
  name: 'EX-001 - Native Vertical Scrolling',
  render: ({ overflowEdgeThreshold }) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [focusState, setFocusState] = useState('outside')
    const [pointerState, setPointerState] = useState('outside')
    const [scrollState, setScrollState] = useState('idle')

    useEffect(() => {
      const root = rootRef.current

      if (!root) {
        return
      }

      const observer = new MutationObserver(() => {
        setScrollState(root.hasAttribute('data-scrolling') ? 'scrolling' : 'idle')
      })

      observer.observe(root, { attributeFilter: ['data-scrolling'], attributes: true })
      return () => observer.disconnect()
    }, [])

    const sessions = Array.from({ length: 20 }, (_, index) => `Session ${index + 1}`)

    return (
      <div className="grid gap-3 text-foreground">
        <ScrollArea
          className="h-48 w-80 border border-foreground"
          onBlur={() => setFocusState('outside')}
          onFocus={() => setFocusState('viewport')}
          onPointerEnter={() => setPointerState('inside')}
          onPointerLeave={() => setPointerState('outside')}
          overflowEdgeThreshold={overflowEdgeThreshold}
          ref={rootRef}
        >
          <ol className="m-0 grid list-decimal gap-3 p-4 pl-10">
            {sessions.map((session) => (
              <li key={session}>{session}</li>
            ))}
          </ol>
        </ScrollArea>
        <output className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <span>Pointer: {pointerState}</span>
          <span>Viewport focus: {focusState}</span>
          <span>Scroll state: {scrollState}</span>
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex002DualAxisOverlayScrollbars = {
  name: 'EX-002 - Dual-Axis Overlay Scrollbars',
  render: ({ overflowEdgeThreshold }) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [overflowState, setOverflowState] = useState('measuring')
    const [scrollState, setScrollState] = useState('idle')

    useEffect(() => {
      const root = rootRef.current

      if (!root) {
        return
      }

      const updateProbe = () => {
        const axes = [
          root.hasAttribute('data-has-overflow-x') ? 'horizontal' : null,
          root.hasAttribute('data-has-overflow-y') ? 'vertical' : null
        ].filter(Boolean)

        setOverflowState(axes.length > 0 ? axes.join(' + ') : 'none')
        setScrollState(root.hasAttribute('data-scrolling') ? 'scrolling or dragging' : 'idle')
      }
      const observer = new MutationObserver(updateProbe)

      updateProbe()
      observer.observe(root, {
        attributeFilter: ['data-has-overflow-x', 'data-has-overflow-y', 'data-scrolling'],
        attributes: true
      })
      return () => observer.disconnect()
    }, [])

    return (
      <div className="grid gap-3 text-foreground">
        <ScrollArea
          className="h-64 w-80 border border-foreground"
          overflowEdgeThreshold={overflowEdgeThreshold}
          ref={rootRef}
        >
          <div className="grid h-[40rem] w-[48rem] grid-cols-8 grid-rows-8 gap-px bg-foreground">
            {Array.from({ length: 64 }, (_, index) => (
              <div className="flex items-center justify-center bg-background" key={index}>
                {index + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
        <output className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
          <span>Overflow axes: {overflowState}</span>
          <span>Interaction: {scrollState}</span>
          <span>Overlay tracks: 24 px transparent</span>
          <span>Structural corner: 24 × 24 px transparent</span>
        </output>
      </div>
    )
  }
} satisfies Story

export const Ex003ReducedMotionScrollbarVisibility = {
  args: {
    reducedMotion: 'reduce'
  },
  name: 'EX-003 - Reduced-Motion Scrollbar Visibility',
  render: ({ overflowEdgeThreshold, reducedMotion }) => (
    <div
      className={`grid gap-3 text-foreground ${reducedMotion === 'reduce' ? '[&_*]:transition-none' : ''}`}
    >
      <ScrollArea
        className="h-40 w-72 border border-foreground"
        overflowEdgeThreshold={overflowEdgeThreshold}
      >
        <div className="grid gap-3 p-4">
          {Array.from({ length: 16 }, (_, index) => (
            <p className="m-0" key={index}>
              Training entry {index + 1}
            </p>
          ))}
        </div>
      </ScrollArea>
      <output className="grid gap-1 border border-foreground/30 p-2 font-sans text-xs">
        <span>Reduced-motion media: {reducedMotion}</span>
        <span>
          Opacity transition: {reducedMotion === 'reduce' ? 'immediate' : '150 ms linear'}
        </span>
      </output>
    </div>
  )
} satisfies Story
