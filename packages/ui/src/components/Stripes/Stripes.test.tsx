import { fireEvent, render, screen } from '@testing-library/react'
import {
  isValidElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement
} from 'react'

import * as PackageExports from '../..'
import stripesStoriesMeta, { Ex004PhrasingPlacementWithRender } from './Stripes.stories'

type StripesCssVariable =
  | '--stripes-angle'
  | '--stripes-gap'
  | '--stripes-width'
  | '--stripes-color'

type StripesCssProperties = CSSProperties & Partial<Record<StripesCssVariable, string>>

type StripesRenderProps = ComponentPropsWithRef<'div'>

type StripesRenderState = Record<string, never>

interface StripesProps extends ComponentPropsWithRef<'div'> {
  angle?: string
  color?: string
  gap?: string
  render?: ReactElement | ((props: StripesRenderProps, state: StripesRenderState) => ReactElement)
  width?: string
}

type StripesComponent = (props: StripesProps) => ReactElement | null

type StripesStoryArgTypes = Partial<Record<keyof StripesProps, { control?: unknown }>>

interface StripesStoryControlsContract {
  argTypes?: StripesStoryArgTypes
  args?: Partial<StripesProps>
}

interface StripesPackageContract {
  Components: typeof PackageExports.Components & {
    Stripes: StripesComponent
  }
  Stripes: StripesComponent
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Stripes: StripesComponent
    }
  }
}

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & StripesPackageContract
const Stripes = PACKAGE_EXPORTS.Stripes

const DEFAULT_STRIPES_FALLBACKS = {
  '--stripes-angle': 'var(--stripes-angle, 135deg)',
  '--stripes-color': 'var(--stripes-color, var(--muted))',
  '--stripes-gap': 'var(--stripes-gap, 3px)',
  '--stripes-width': 'var(--stripes-width, 4px)'
} as const satisfies Record<StripesCssVariable, string>

function getStripesVariable(element: HTMLElement, variableName: StripesCssVariable): string {
  return getComputedStyle(element).getPropertyValue(variableName).trim()
}

function expectStripesVariables(
  element: HTMLElement,
  expectedVariables: Partial<Record<StripesCssVariable, string>>
) {
  for (const [variableName, variableValue] of Object.entries(expectedVariables)) {
    expect(getStripesVariable(element, variableName as StripesCssVariable)).toBe(variableValue)
  }
}

function expectStripedBackground(element: HTMLElement) {
  const background = element.style.backgroundImage || element.style.background

  expect(background).toContain('repeating-linear-gradient')
  expect(background).toContain('var(--stripes-angle')
  expect(background).toContain('var(--stripes-color')
  expect(background).toContain('var(--stripes-width')
  expect(background).toContain('var(--stripes-gap')
}

function expectDefaultStripedBackgroundFallbacks(element: HTMLElement) {
  const background = element.style.backgroundImage || element.style.background

  expect(background).toContain(DEFAULT_STRIPES_FALLBACKS['--stripes-angle'])
  expect(background).toContain(DEFAULT_STRIPES_FALLBACKS['--stripes-color'])
  expect(background).toContain(DEFAULT_STRIPES_FALLBACKS['--stripes-width'])
  expect(background).toContain(DEFAULT_STRIPES_FALLBACKS['--stripes-gap'])
}

describe('Stripes', () => {
  it('UC-001 / UC-002 / UC-006 / EX-001 / QA-002 - renders the default decorative striped support surface', () => {
    render(
      <Stripes className="border border-foreground/30 p-4">Drop a reference image here</Stripes>
    )

    const surface = screen.getByText('Drop a reference image here')

    expect(surface.tagName).toBe('DIV')
    expect(surface).toHaveTextContent('Drop a reference image here')
    expect(surface).toHaveClass('border', 'border-foreground/30', 'p-4')
    expect(surface).not.toHaveAttribute('role')
    expect(surface).not.toHaveAccessibleName()
    expectStripedBackground(surface)
    expectDefaultStripedBackgroundFallbacks(surface)
  })

  it('UC-001 / UC-003 / UC-006 / EX-002 - lets named props override default and consumer CSS variables', () => {
    const consumerVariables = {
      '--stripes-angle': '60deg',
      '--stripes-color': 'red',
      '--stripes-gap': '8px',
      '--stripes-width': '1px',
      color: 'rgb(1, 2, 3)'
    } as StripesCssProperties

    render(
      <Stripes
        angle="45deg"
        className="p-4 text-muted-foreground"
        color="currentColor"
        gap="6px"
        style={consumerVariables}
        width="2px"
      >
        Coach feedback is still being generated.
      </Stripes>
    )

    const surface = screen.getByText('Coach feedback is still being generated.')

    expect(surface).toHaveClass('p-4', 'text-muted-foreground')
    expect(surface.style.color).toBe('rgb(1, 2, 3)')
    expectStripesVariables(surface, {
      '--stripes-angle': '45deg',
      '--stripes-color': 'currentColor',
      '--stripes-gap': '6px',
      '--stripes-width': '2px'
    })
    expectStripedBackground(surface)
  })

  it('UC-001 / UC-004 / UC-006 / EX-003 - uses consumer CSS variable overrides when matching props are omitted', () => {
    const stripesVariables = {
      '--stripes-angle': '60deg',
      '--stripes-color': 'color-mix(in oklab, currentColor 22%, transparent)',
      '--stripes-gap': '8px',
      '--stripes-width': '1px'
    } as StripesCssProperties

    render(
      <Stripes className="p-4 text-muted-foreground" style={stripesVariables}>
        Add one clear constraint before creating the workout.
      </Stripes>
    )

    const surface = screen.getByText('Add one clear constraint before creating the workout.')

    expect(surface).toHaveClass('p-4', 'text-muted-foreground')
    expectStripesVariables(surface, stripesVariables)
    expectStripedBackground(surface)
  })

  it('UC-001 / UC-004 / UC-006 - uses className CSS variable overrides when matching props are omitted', () => {
    const stripesVariables = {
      '--stripes-angle': '72deg',
      '--stripes-color': 'rgb(12, 34, 56)',
      '--stripes-gap': '10px',
      '--stripes-width': '5px'
    } as const satisfies Record<StripesCssVariable, string>

    render(
      <>
        <style>
          {`
            .class-variable-stripes {
              --stripes-angle: ${stripesVariables['--stripes-angle']};
              --stripes-gap: ${stripesVariables['--stripes-gap']};
              --stripes-width: ${stripesVariables['--stripes-width']};
              --stripes-color: ${stripesVariables['--stripes-color']};
            }
          `}
        </style>
        <Stripes className="class-variable-stripes">Class variables control the stripes.</Stripes>
      </>
    )

    const surface = screen.getByText('Class variables control the stripes.')

    expect(surface).toHaveClass('class-variable-stripes')
    expectStripesVariables(surface, stripesVariables)
    expectStripedBackground(surface)
  })

  it('UC-001 / UC-005 / UC-006 / UC-007 / UC-008 / EX-004 - replaces the rendered element for phrasing placement', () => {
    const onClick = vi.fn()

    render(
      <p>
        Your{' '}
        <Stripes
          className="px-1"
          data-phase="pending"
          onClick={onClick}
          render={<span data-testid="inline-stripes" />}
          title="Estimated macros"
        >
          estimated macros
        </Stripes>{' '}
        are pending.
      </p>
    )

    const surface = screen.getByText('estimated macros')

    fireEvent.click(surface)

    expect(surface).toBe(screen.getByTestId('inline-stripes'))
    expect(surface.tagName).toBe('SPAN')
    expect(surface).toHaveTextContent('estimated macros')
    expect(surface).toHaveClass('px-1')
    expect(surface).toHaveAttribute('data-phase', 'pending')
    expect(surface).toHaveAttribute('title', 'Estimated macros')
    expect(surface).not.toHaveAttribute('role')
    expect(surface).toHaveAccessibleName('Estimated macros')
    expectStripedBackground(surface)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('EX-004 / QA-001 - exposes phrasing placement args for Storybook controls', () => {
    const story = Ex004PhrasingPlacementWithRender as StripesStoryControlsContract
    const argTypes = {
      ...stripesStoriesMeta.argTypes,
      ...story.argTypes
    } as StripesStoryArgTypes
    const renderReplacement = story.args?.render

    expect(story.args).toEqual(
      expect.objectContaining({
        children: 'estimated macros',
        className: 'px-1',
        title: 'Estimated macros'
      })
    )
    expect(isValidElement(renderReplacement)).toBe(true)

    if (isValidElement(renderReplacement)) {
      expect(renderReplacement.type).toBe('span')
    }

    expect(argTypes.children).toEqual(expect.objectContaining({ control: 'text' }))
    expect(argTypes.className).toEqual(expect.objectContaining({ control: 'text' }))
    expect(argTypes.title).toEqual(expect.objectContaining({ control: 'text' }))
  })

  it('UC-006 / UC-007 / UC-008 - preserves consumer-provided naming and rendered element semantics', () => {
    render(
      <div>
        <span id="stripes-label">Macro estimate status</span>
        <Stripes aria-labelledby="stripes-label" data-phase="pending" role="group">
          estimated macros
        </Stripes>
      </div>
    )

    const surface = screen.getByRole('group', { name: 'Macro estimate status' })

    expect(surface).toHaveTextContent('estimated macros')
    expect(surface).toHaveAttribute('aria-labelledby', 'stripes-label')
    expect(surface).toHaveAttribute('data-phase', 'pending')
    expect(surface).toHaveAttribute('role', 'group')
    expect(surface).not.toHaveAttribute('aria-hidden')
  })

  it('UC-005 / UC-007 - forwards Base UI render callback props without documented state fields', () => {
    let renderStateKeys: string[] | undefined

    render(
      <Stripes
        className="consumer-class"
        data-source="callback"
        render={(props, state) => {
          renderStateKeys = Object.keys(state)

          return <section {...props} aria-label="feedback status" data-testid="callback-stripes" />
        }}
        title="callback title"
      >
        Callback surface
      </Stripes>
    )

    const surface = screen.getByRole('region', { name: 'feedback status' })

    expect(surface).toBe(screen.getByTestId('callback-stripes'))
    expect(surface.tagName).toBe('SECTION')
    expect(surface).toHaveTextContent('Callback surface')
    expect(surface).toHaveAttribute('data-source', 'callback')
    expect(surface).toHaveAttribute('title', 'callback title')
    expect(surface).toHaveClass('consumer-class')
    expect(renderStateKeys).toEqual([])
  })

  it('UC-001 / EX-001 / EX-002 / EX-003 / EX-004 - exposes Stripes as the single public component through package assemblies', () => {
    expect(PACKAGE_EXPORTS.Stripes).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.Components.Stripes).toBe(PACKAGE_EXPORTS.Stripes)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Stripes).toBe(PACKAGE_EXPORTS.Stripes)
    expect(PACKAGE_EXPORTS.Stripes).not.toHaveProperty('Root')
    expect(PACKAGE_EXPORTS).not.toHaveProperty('StripesRoot')
  })
})
