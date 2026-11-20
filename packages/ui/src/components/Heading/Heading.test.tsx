import { fireEvent, render, screen } from '@testing-library/react'
import {
  createRef,
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  type Ref
} from 'react'
import colors from 'tailwindcss/colors'
import { expectTypeOf } from 'vitest'

import {
  type HeadingProps as PublicHeadingProps,
  type Intent,
  type Tone,
  type ToneOrIntentProps
} from '../..'
import * as PackageExports from '../..'
import { Heading as HeadingImplementation } from './Heading'
import headingStoriesMeta, { Ex002SemanticDocumentHeading } from './Heading.stories'

type HeadingContractProps = Omit<ComponentProps<'span'>, 'ref'> &
  ToneOrIntentProps & {
    ref?: Ref<HTMLElement>
    render?:
      | ReactElement
      | ((
          props: HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> },
          state: Record<string, never>
        ) => ReactElement)
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  }

const Heading = PackageExports.Heading as (props: HeadingContractProps) => ReactElement | null

describe('Heading', () => {
  it('UC-001 / UC-002 / UC-005 / EX-001 / CR-002 - renders emphasized text with the default span treatment', () => {
    render(<Heading>Workout Focus</Heading>)

    const heading = screen.getByText('Workout Focus')

    expect(heading.tagName).toBe('SPAN')
    expect(heading).toHaveTextContent('Workout Focus')
    expect(screen.queryByRole('heading', { name: 'Workout Focus' })).toBeNull()
    expect(heading).toHaveClass(
      'font-heading',
      'text-foreground',
      'text-xl',
      'tracking-wide',
      'lowercase'
    )
  })

  it('UC-002 / UC-003 / UC-006 / EX-002 - replaces the default span with one semantic heading', () => {
    render(
      <Heading render={<h2 />} size="xl">
        Session Recap
      </Heading>
    )

    const heading = screen.getByRole('heading', { level: 2, name: 'Session Recap' })

    expect(heading.tagName).toBe('H2')
    expect(heading).toHaveClass('font-heading', 'text-4xl', 'tracking-tight', 'lowercase')
    expect(screen.getAllByText('Session Recap')).toHaveLength(1)
  })

  it('UC-002 - maps every documented size to its public treatment', () => {
    const cases = [
      { expectedClassNames: ['tracking-wide'], size: 'xs' },
      { expectedClassNames: ['text-lg', 'tracking-wide'], size: 'sm' },
      { expectedClassNames: ['text-xl', 'tracking-wide'], size: 'md' },
      { expectedClassNames: ['text-2xl'], size: 'lg' },
      { expectedClassNames: ['text-4xl', 'tracking-tight'], size: 'xl' },
      { expectedClassNames: ['text-6xl', 'tracking-tight'], size: '2xl' },
      { expectedClassNames: ['text-9xl', 'tracking-tight'], size: '3xl' }
    ] as const

    for (const testCase of cases) {
      const { unmount } = render(
        <Heading data-testid={`heading-${testCase.size}`} size={testCase.size}>
          Display Size
        </Heading>
      )
      const heading = screen.getByTestId(`heading-${testCase.size}`)

      expect(heading).toHaveClass(...testCase.expectedClassNames)

      unmount()
    }
  })

  it('UC-001 / UC-002 / UC-007 / UC-008 / EX-004 - maps the complete shared semantic appearance scale without adding semantics', () => {
    const cases = [
      { expectedClassName: 'text-foreground', label: 'Implicit Default', props: {} },
      {
        expectedClassName: 'text-foreground',
        label: 'Default Tone',
        props: { tone: 'default' }
      },
      {
        expectedClassName: 'text-primary',
        label: 'Primary Tone',
        props: { tone: 'primary' }
      },
      {
        expectedClassName: 'text-secondary-foreground',
        label: 'Secondary Tone',
        props: { tone: 'secondary' }
      },
      {
        expectedClassName: 'text-muted-foreground',
        label: 'Muted Tone',
        props: { tone: 'muted' }
      },
      {
        expectedClassName: 'text-accent-foreground',
        label: 'Accent Tone',
        props: { tone: 'accent' }
      },
      {
        expectedClassName: 'text-info-foreground',
        label: 'Informational Message',
        props: { intent: 'info' }
      },
      {
        expectedClassName: 'text-success-foreground',
        label: 'Session Saved',
        props: { intent: 'success' }
      },
      {
        expectedClassName: 'text-warning-foreground',
        label: 'Incomplete Session Data',
        props: { intent: 'warning' }
      },
      {
        expectedClassName: 'text-destructive-foreground',
        label: 'Unable To Save',
        props: { intent: 'destructive' }
      }
    ] as const satisfies readonly {
      expectedClassName: string
      label: string
      props: ToneOrIntentProps
    }[]

    for (const testCase of cases) {
      const { unmount } = render(<Heading {...testCase.props}>{testCase.label}</Heading>)
      const heading = screen.getByText(testCase.label)

      expect(heading).toHaveClass(
        'font-heading',
        'text-xl',
        'tracking-wide',
        'lowercase',
        testCase.expectedClassName
      )
      expect(heading).not.toHaveAttribute('tone')
      expect(heading).not.toHaveAttribute('intent')
      expect(heading).not.toHaveAttribute('data-tone')
      expect(heading).not.toHaveAttribute('data-intent')
      expect(heading).not.toHaveAttribute('role')
      expect(heading).not.toHaveAttribute('aria-live')

      unmount()
    }
  })

  it('UC-009 - exports the canonical mutually exclusive appearance types and composes HeadingProps from them', () => {
    expectTypeOf<Tone>().toEqualTypeOf<'default' | 'primary' | 'secondary' | 'muted' | 'accent'>()
    expectTypeOf<Intent>().toEqualTypeOf<'info' | 'success' | 'warning' | 'destructive'>()
    expectTypeOf<Record<string, never>>().toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ tone: 'muted' }>().toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ intent: 'warning' }>().toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ tone: 'muted'; intent: 'warning' }>().not.toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ tone: 'muted' }>().toMatchTypeOf<PublicHeadingProps>()
    expectTypeOf<{ intent: 'warning' }>().toMatchTypeOf<PublicHeadingProps>()
    expectTypeOf<{ tone: 'muted'; intent: 'warning' }>().not.toMatchTypeOf<PublicHeadingProps>()
    expectTypeOf<PublicHeadingProps>().toMatchTypeOf<ToneOrIntentProps>()
  })

  it('UC-010 / CR-002 - lets supported consumer typography utilities override conflicting Heading treatments', () => {
    render(
      <Heading className="font-mono text-4xl tracking-tight" size="sm">
        Consumer typography override
      </Heading>
    )

    const heading = screen.getByText('Consumer typography override')

    expect(heading).toHaveClass(
      'font-mono',
      'text-4xl',
      'tracking-tight',
      'lowercase',
      'text-foreground'
    )
    expect(heading).not.toHaveClass('font-heading', 'text-lg', 'tracking-wide')
  })

  it('UC-003 / UC-005 / UC-006 / EX-002 - merges element props, events, styles, classes, and refs', () => {
    const headingRef = createRef<HTMLElement>()
    const renderRef = createRef<HTMLHeadingElement>()
    const onHeadingClick = vi.fn()
    const onRenderClick = vi.fn()

    render(
      <Heading
        className="consumer-class"
        data-source="heading"
        onClick={onHeadingClick}
        ref={headingRef}
        render={
          <h2
            className="render-class"
            data-source="render"
            onClick={onRenderClick}
            ref={renderRef}
            style={{ color: colors.white }}
          />
        }
        style={{ backgroundColor: colors.black, color: colors.black }}
      >
        Session Recap
      </Heading>
    )

    const heading = screen.getByRole('heading', { level: 2, name: 'Session Recap' })

    fireEvent.click(heading)

    expect(heading).toHaveAttribute('data-source', 'render')
    expect(heading).toHaveClass('font-heading', 'consumer-class', 'render-class')
    expect(heading).toHaveStyle({
      backgroundColor: 'rgb(0, 0, 0)',
      color: 'rgb(255, 255, 255)'
    })
    expect(onHeadingClick).toHaveBeenCalledOnce()
    expect(onRenderClick).toHaveBeenCalledOnce()
    expect(headingRef.current).toBe(heading)
    expect(renderRef.current).toBe(heading)
    expect(screen.getAllByText('Session Recap')).toHaveLength(1)
  })

  it('UC-003 / UC-006 / EX-002 / QA-001 - visibly proves element-render merging and precedence in Storybook', () => {
    const Story = Ex002SemanticDocumentHeading.render

    expect(Story).toBeTypeOf('function')

    if (!Story) throw new Error('Expected EX-002 to provide an inspectable render function')

    render(<Story {...headingStoriesMeta.args} {...Ex002SemanticDocumentHeading.args} />)

    fireEvent.click(screen.getByRole('heading', { level: 2, name: 'Session Recap' }))

    expect(screen.getByText('heading class merged: yes')).toBeVisible()
    expect(screen.getByText('render class merged: yes')).toBeVisible()
    expect(screen.getByText('background style merged: yes')).toBeVisible()
    expect(screen.getByText('render color precedence: yes')).toBeVisible()
    expect(screen.getByText('collision source: render')).toBeVisible()
    expect(screen.getByText('heading clicks: 1')).toBeVisible()
    expect(screen.getByText('render clicks: 1')).toBeVisible()
    expect(screen.getByText('content occurrences: 1')).toBeVisible()
    expect(screen.getByText('heading ref matches root: yes')).toBeVisible()
    expect(screen.getByText('render ref matches root: yes')).toBeVisible()
  })

  it('UC-004 / UC-005 / UC-006 / EX-003 / CR-003 - passes complete props and empty state to callback render', () => {
    const headingRef = createRef<HTMLElement>()
    const onClick = vi.fn()
    const renderCallbackSpy = vi.fn(
      (
        props: HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> },
        _state: Record<string, never>
      ) => <strong {...props} />
    )
    function renderHeading(
      props: HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> },
      state: Record<string, never>
    ) {
      return renderCallbackSpy(props, state)
    }

    render(
      <Heading
        aria-label="Personal Record"
        className="text-muted-foreground"
        data-state="featured"
        intent="warning"
        onClick={onClick}
        ref={headingRef}
        render={renderHeading}
        size="sm"
        style={{ color: colors.black }}
        title="Personal Record title"
      >
        Personal Record
      </Heading>
    )

    const heading = screen.getByText('Personal Record')
    const callbackCall = renderCallbackSpy.mock.calls[0]

    if (callbackCall === undefined) {
      throw new Error('Expected Heading to invoke the render callback')
    }

    const [receivedProps, receivedState] = callbackCall

    fireEvent.click(heading)

    expect(heading.tagName).toBe('STRONG')
    expect(heading).toHaveAccessibleName('Personal Record')
    expect(heading).toHaveAttribute('aria-label', 'Personal Record')
    expect(heading).toHaveAttribute('data-state', 'featured')
    expect(heading).toHaveAttribute('title', 'Personal Record title')
    expect(heading).toHaveClass(
      'font-heading',
      'text-lg',
      'tracking-wide',
      'lowercase',
      'text-muted-foreground'
    )
    expect(heading).not.toHaveClass('text-warning-foreground')
    expect(heading).not.toHaveAttribute('intent')
    expect(heading).toHaveStyle({ color: 'rgb(0, 0, 0)' })
    expect(receivedProps.children).toBe('Personal Record')
    expect(receivedProps.ref).toBeDefined()
    expect(receivedState).toEqual({})
    expect(Object.keys(receivedState)).toHaveLength(0)
    expect(headingRef.current).toBe(heading)
    expect(screen.getAllByText('Personal Record')).toHaveLength(1)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-001 / EX-001 / EX-002 / EX-003 - exposes Heading as the single public component through package assemblies', () => {
    expect(PackageExports.Heading).toBe(HeadingImplementation)
    expect(PackageExports.Components.Heading).toBe(HeadingImplementation)
    expect(PackageExports.Ui.Components).toBe(PackageExports.Components)
    expect(PackageExports.Ui.Components.Heading).toBe(HeadingImplementation)
    expect(HeadingImplementation).toBeTypeOf('function')
    expect(HeadingImplementation).not.toHaveProperty('Root')
    expect(PackageExports).not.toHaveProperty('HeadingRoot')
  })
})
