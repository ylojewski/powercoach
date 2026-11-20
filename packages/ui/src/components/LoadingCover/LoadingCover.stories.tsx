import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'

import { Button, LoadingCover } from '../..'

const meta = {
  args: {
    fullscreen: false,
    loading: false
  },
  argTypes: {
    'aria-label': {
      control: 'text'
    },
    children: {
      control: false
    },
    className: {
      control: 'text'
    },
    fullscreen: {
      control: 'boolean'
    },
    loading: {
      control: 'boolean'
    },
    logo: {
      control: false
    },
    ref: {
      control: false
    },
    render: {
      control: false
    },
    revealAnimationProps: {
      control: false
    },
    style: {
      control: false
    }
  },
  component: LoadingCover.Root,
  title: 'Components/LoadingCover'
} satisfies Meta<typeof LoadingCover.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Ex001DefaultLocalLoadingCycle = {
  args: {
    className: 'min-h-64 border border-foreground'
  },
  name: 'EX-001 - Default Local Loading Cycle',
  render: ({ className, fullscreen }) => {
    const [loading, setLoading] = useState(false)
    const [phase, setPhase] = useState('hidden')

    return (
      <div className="grid w-96 gap-4">
        <Button type="button" onClick={() => setLoading((value) => !value)}>
          {loading ? 'finish loading' : 'start loading'}
        </Button>

        <LoadingCover.Root
          className={className}
          fullscreen={fullscreen}
          loading={loading}
          revealAnimationProps={{
            onRevealComplete: (revealed) => setPhase(revealed ? 'revealed' : 'hidden'),
            onRevealStart: (revealed) => setPhase(revealed ? 'revealing' : 'unrevealing')
          }}
        >
          <section className="p-6">athlete training plan</section>
        </LoadingCover.Root>

        <output aria-live="polite">cover phase: {phase}</output>
      </div>
    )
  }
} satisfies Story

export const Ex002DefaultReplacementAndRemovedLogo = {
  args: {
    loading: true
  },
  name: 'EX-002 - Default, Replacement, and Removed Logo',
  render: ({ loading }) => (
    <div className="grid w-[48rem] grid-cols-3 gap-4">
      <LoadingCover.Root loading={loading} className="h-40 border border-foreground" />
      <LoadingCover.Root
        loading={loading}
        className="h-40 border border-foreground"
        logo={
          <span aria-hidden className="font-bold" data-custom-loading-logo="initials">
            PC
          </span>
        }
      />
      <LoadingCover.Root loading={loading} className="h-40 border border-foreground" logo={null} />
    </div>
  )
} satisfies Story

export const Ex003ConfiguredRevealAnimation = {
  name: 'EX-003 - Configured RevealAnimation',
  render: () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('hidden')

    return (
      <div className="grid w-96 gap-4">
        <Button type="button" onClick={() => setLoading((value) => !value)}>
          toggle loading
        </Button>
        <LoadingCover.Root
          loading={loading}
          className="min-h-48 border border-foreground"
          revealAnimationProps={{
            alignX: 'start',
            direction: 'top-to-bottom',
            offsetX: 8,
            onRevealChange: (revealed) =>
              setMessage(revealed ? 'target revealed' : 'target hidden'),
            onRevealComplete: (revealed) =>
              setMessage(revealed ? 'entry complete' : 'exit complete'),
            onRevealStart: (revealed) => setMessage(revealed ? 'entry started' : 'exit started')
          }}
        >
          <section className="p-6">configured loading content</section>
        </LoadingCover.Root>
        <output aria-live="polite">lifecycle: {message}</output>
      </div>
    )
  }
} satisfies Story

export const Ex004ParentWaitsForNestedRoot = {
  name: 'EX-004 - Parent Waits for a Nested Root',
  render: () => {
    const [pageLoading, setPageLoading] = useState(true)
    const [panelLoading, setPanelLoading] = useState(true)

    return (
      <div className="grid w-[36rem] gap-4">
        <div className="flex gap-2">
          <Button type="button" onClick={() => setPageLoading((value) => !value)}>
            toggle page
          </Button>
          <Button type="button" onClick={() => setPanelLoading((value) => !value)}>
            toggle panel
          </Button>
        </div>

        <LoadingCover.Cascade>
          <LoadingCover.Root
            aria-label="Loading page"
            loading={pageLoading}
            className="min-h-72 border border-foreground"
          >
            <main className="p-6">
              <LoadingCover.Root
                aria-label="Loading panel"
                loading={panelLoading}
                className="min-h-40 border border-foreground"
              >
                <section className="p-4">panel data</section>
              </LoadingCover.Root>
            </main>
          </LoadingCover.Root>
        </LoadingCover.Cascade>
      </div>
    )
  }
} satisfies Story

export const Ex005RecursiveAndRemovableCascades = {
  name: 'EX-005 - Recursive and Removable Cascades',
  render: () => {
    const [detailsLoading, setDetailsLoading] = useState(true)
    const [pageLoading, setPageLoading] = useState(true)
    const [showDetails, setShowDetails] = useState(true)
    const [summaryLoading, setSummaryLoading] = useState(true)

    return (
      <div className="grid w-[42rem] gap-4">
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => setPageLoading((value) => !value)}>
            toggle page
          </Button>
          <Button type="button" onClick={() => setSummaryLoading((value) => !value)}>
            toggle summary
          </Button>
          <Button type="button" onClick={() => setShowDetails((value) => !value)}>
            {showDetails ? 'remove details' : 'add details'}
          </Button>
          <Button type="button" onClick={() => setDetailsLoading((value) => !value)}>
            toggle details
          </Button>
        </div>

        <LoadingCover.Cascade
          render={(props, state) => (
            <div {...props}>
              <output>outer cascade: {state.resolved ? 'resolved' : 'pending'}</output>
              {props.children}
            </div>
          )}
        >
          <LoadingCover.Root loading={pageLoading} className="min-h-72 border border-foreground">
            <LoadingCover.Cascade
              render={(props, state) => (
                <section {...props}>
                  <output>inner cascade: {state.resolved ? 'resolved' : 'pending'}</output>
                  {props.children}
                </section>
              )}
            >
              <LoadingCover.Root
                loading={summaryLoading}
                className="min-h-32 border border-foreground"
              >
                <div className="p-4">summary</div>
              </LoadingCover.Root>
              {showDetails ? (
                <LoadingCover.Root
                  loading={detailsLoading}
                  className="min-h-32 border border-foreground"
                >
                  <div className="p-4">details</div>
                </LoadingCover.Root>
              ) : null}
            </LoadingCover.Cascade>
          </LoadingCover.Root>
        </LoadingCover.Cascade>

        <LoadingCover.Root loading={detailsLoading} className="min-h-20 border border-foreground">
          <div className="p-4">independent content</div>
        </LoadingCover.Root>
      </div>
    )
  }
} satisfies Story

export const Ex006MixedLocalAndFullscreenPlacement = {
  name: 'EX-006 - Mixed Local and Fullscreen Placement',
  render: () => {
    const [dialogLoading, setDialogLoading] = useState(false)
    const [message, setMessage] = useState('idle')
    const [pageLoading, setPageLoading] = useState(false)

    return (
      <div className="grid w-96 gap-4">
        <Button
          type="button"
          onClick={() => {
            setMessage('local page entering')
            setPageLoading(true)

            window.setTimeout(() => {
              setMessage('fullscreen descendant entering')
              setPageLoading(false)
              setDialogLoading(true)
            }, 400)

            window.setTimeout(() => {
              setMessage('fullscreen descendant leaving')
              setDialogLoading(false)
            }, 1200)
          }}
        >
          run mixed placement
        </Button>
        <output aria-live="polite">sequence: {message}</output>

        <LoadingCover.Cascade>
          <LoadingCover.Root
            aria-label="Loading page"
            loading={pageLoading}
            className="min-h-64 border border-foreground"
          >
            <main className="p-6">
              <LoadingCover.Root
                aria-label="Loading workout editor"
                fullscreen
                loading={dialogLoading}
              >
                <section>workout editor</section>
              </LoadingCover.Root>
            </main>
          </LoadingCover.Root>
        </LoadingCover.Cascade>
      </div>
    )
  }
} satisfies Story

export const Ex007StateAwareRenderComposition = {
  name: 'EX-007 - State-Aware Render Composition',
  render: () => {
    const [rootElement, setRootElement] = useState<HTMLElement | null>(null)

    return (
      <div className="grid w-96 gap-2">
        <LoadingCover.Cascade
          render={(props, state) => (
            <section
              {...props}
              data-visible-cascade-state={state.resolved ? 'resolved' : 'pending'}
            >
              <output>cascade: {state.resolved ? 'resolved' : 'pending'}</output>
              {props.children}
            </section>
          )}
        >
          <LoadingCover.Root
            ref={setRootElement}
            loading={false}
            className={(state) => (state.busy ? 'outline-2 outline-foreground' : 'outline-0')}
            render={(props, state) => (
              <article {...props} data-visible-root-state={state.visualState}>
                {props.children}
                <output>root: {state.visualState}</output>
              </article>
            )}
            style={(state) => ({ borderWidth: state.busy ? 2 : 1 })}
          >
            <div className="min-h-40 p-6">composed content</div>
          </LoadingCover.Root>
        </LoadingCover.Cascade>
        <output>ref element: {rootElement?.tagName ?? 'unmounted'}</output>
      </div>
    )
  }
} satisfies Story

export const Ex008ReducedMotionOrdering = {
  name: 'EX-008 - Reduced-Motion Ordering',
  render: () => {
    const [completions, setCompletions] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)')
      const updatePreference = () => setReducedMotion(query.matches)

      updatePreference()
      query.addEventListener('change', updatePreference)

      return () => query.removeEventListener('change', updatePreference)
    }, [])

    return (
      <div className="grid w-96 gap-4">
        <Button type="button" onClick={() => setLoading((value) => !value)}>
          toggle loading
        </Button>
        <LoadingCover.Root
          loading={loading}
          className="min-h-48 border border-foreground"
          revealAnimationProps={{
            onRevealComplete: (revealed) =>
              setCompletions((values) => [...values, revealed ? 'revealed' : 'hidden'])
          }}
        >
          <div className="p-6">reduced-motion content</div>
        </LoadingCover.Root>
        <output>reduced-motion media: {reducedMotion ? 'reduce' : 'no preference'}</output>
        <output>completed targets: {completions.join(', ') || 'none'}</output>
      </div>
    )
  }
} satisfies Story
