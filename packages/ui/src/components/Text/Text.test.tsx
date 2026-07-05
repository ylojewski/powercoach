import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, type ComponentPropsWithRef, type ReactElement, type Ref } from 'react'
import { expectTypeOf } from 'vitest'

import {
  type Intent,
  type TextProps as PublicTextProps,
  type Tone,
  type ToneOrIntentProps
} from '../..'
import * as PackageExports from '../..'
import textStoriesMeta, {
  Ex001DefaultInlineText,
  Ex004ElementFormRenderReplacement
} from './Text.stories'

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

type TextContractProps = ComponentPropsWithRef<'span'> &
  ToneOrIntentProps & {
    render?:
      | ReactElement
      | ((props: ComponentPropsWithRef<'span'>, state: Record<string, never>) => ReactElement)
    size?: TextSize
  }

type TextComponent = (props: TextContractProps) => ReactElement | null

interface TextPackageContract {
  Components: typeof PackageExports.Components & {
    Text: TextComponent
  }
  Text: TextComponent
  Ui: typeof PackageExports.Ui & {
    Components: typeof PackageExports.Components & {
      Text: TextComponent
    }
  }
}

interface InspectableTextStory {
  args?: Partial<TextContractProps>
  render?: (args: TextContractProps) => ReactElement
}

const PACKAGE_EXPORTS = PackageExports as typeof PackageExports & TextPackageContract
const Text = PACKAGE_EXPORTS.Text

describe('Text', () => {
  it('UC-001 / UC-002 / UC-003 / EX-001 - renders native inline text with the default classic treatment', () => {
    render(<Text>Recovery between sets</Text>)

    const text = screen.getByText('Recovery between sets')

    expect(text.tagName).toBe('SPAN')
    expect(text).toHaveTextContent('Recovery between sets')
    expect(text).toHaveClass('font-sans', 'text-foreground', 'tracking-wide', 'text-md')
    expect(text).not.toHaveAttribute('role')
  })

  it('UC-001 / UC-003 / EX-002 - maps every documented size to its public treatment', () => {
    const cases = [
      { expectedClassNames: ['tracking-wide', 'text-xs'], size: 'xs' },
      { expectedClassNames: ['tracking-wide', 'text-sm'], size: 'sm' },
      { expectedClassNames: ['tracking-wide', 'text-md'], size: 'md' },
      { expectedClassNames: ['text-lg'], size: 'lg' },
      { expectedClassNames: ['text-xl', 'tracking-tight'], size: 'xl' },
      { expectedClassNames: ['text-2xl', 'tracking-tight'], size: '2xl' },
      { expectedClassNames: ['text-3xl', 'tracking-tight'], size: '3xl' }
    ] as const

    for (const testCase of cases) {
      const { unmount } = render(
        <Text data-testid={`text-${testCase.size}`} size={testCase.size}>
          Documented size
        </Text>
      )
      const text = screen.getByTestId(`text-${testCase.size}`)

      expect(text).toHaveClass('font-sans', 'text-foreground', ...testCase.expectedClassNames)

      unmount()
    }
  })

  it('UC-001 / UC-004 / EX-003 - lets consumer size and color utilities override conflicting defaults', () => {
    render(
      <Text tone="primary" className="text-4xl text-muted-foreground">
        Consumer override
      </Text>
    )

    const text = screen.getByText('Consumer override')

    expect(text).toHaveClass('font-sans', 'tracking-wide', 'text-4xl', 'text-muted-foreground')
    expect(text).not.toHaveClass('text-md', 'text-foreground')
    expect(text).not.toHaveClass('text-primary')
  })

  it('UC-001 / UC-008 / UC-009 / EX-006 - maps the complete shared semantic appearance scale without adding semantics', () => {
    const cases = [
      { expectedClassName: 'text-foreground', label: 'Implicit default', props: {} },
      {
        expectedClassName: 'text-foreground',
        label: 'Default tone',
        props: { tone: 'default' }
      },
      {
        expectedClassName: 'text-primary',
        label: 'Primary tone',
        props: { tone: 'primary' }
      },
      {
        expectedClassName: 'text-secondary-foreground',
        label: 'Secondary tone',
        props: { tone: 'secondary' }
      },
      {
        expectedClassName: 'text-muted-foreground',
        label: 'Muted tone',
        props: { tone: 'muted' }
      },
      {
        expectedClassName: 'text-accent-foreground',
        label: 'Accent tone',
        props: { tone: 'accent' }
      },
      {
        expectedClassName: 'text-info-foreground',
        label: 'Informational message',
        props: { intent: 'info' }
      },
      {
        expectedClassName: 'text-success-foreground',
        label: 'Session saved',
        props: { intent: 'success' }
      },
      {
        expectedClassName: 'text-warning-foreground',
        label: 'Session data is incomplete',
        props: { intent: 'warning' }
      },
      {
        expectedClassName: 'text-destructive-foreground',
        label: 'Unable to save the session',
        props: { intent: 'destructive' }
      }
    ] as const satisfies readonly {
      expectedClassName: string
      label: string
      props: ToneOrIntentProps
    }[]

    for (const testCase of cases) {
      const { unmount } = render(<Text {...testCase.props}>{testCase.label}</Text>)
      const text = screen.getByText(testCase.label)

      expect(text).toHaveClass('font-sans', 'tracking-wide', 'text-md', testCase.expectedClassName)
      expect(text).not.toHaveAttribute('tone')
      expect(text).not.toHaveAttribute('intent')
      expect(text).not.toHaveAttribute('data-tone')
      expect(text).not.toHaveAttribute('data-intent')
      expect(text).not.toHaveAttribute('role')
      expect(text).not.toHaveAttribute('aria-live')

      unmount()
    }
  })

  it('UC-010 - exports the canonical mutually exclusive appearance types and composes TextProps from them', () => {
    expectTypeOf<Tone>().toEqualTypeOf<'default' | 'primary' | 'secondary' | 'muted' | 'accent'>()
    expectTypeOf<Intent>().toEqualTypeOf<'info' | 'success' | 'warning' | 'destructive'>()
    expectTypeOf<Record<string, never>>().toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ tone: 'muted' }>().toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ intent: 'warning' }>().toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ tone: 'muted'; intent: 'warning' }>().not.toMatchTypeOf<ToneOrIntentProps>()
    expectTypeOf<{ tone: 'muted' }>().toMatchTypeOf<PublicTextProps>()
    expectTypeOf<{ intent: 'warning' }>().toMatchTypeOf<PublicTextProps>()
    expectTypeOf<{ tone: 'muted'; intent: 'warning' }>().not.toMatchTypeOf<PublicTextProps>()
    expectTypeOf<PublicTextProps>().toMatchTypeOf<ToneOrIntentProps>()
  })

  it('UC-004 - lets consumer font and tracking utilities override conflicting defaults', () => {
    render(
      <Text className="font-mono tracking-tight uppercase" size="sm">
        Fully customized typography
      </Text>
    )

    const text = screen.getByText('Fully customized typography')

    expect(text).toHaveClass(
      'font-mono',
      'tracking-tight',
      'uppercase',
      'text-sm',
      'text-foreground'
    )
    expect(text).not.toHaveClass('font-sans', 'tracking-wide')
  })

  it('UC-005 - forwards native attributes, handlers, consumer attributes, style, and ref', () => {
    const ref = createRef<HTMLSpanElement>()
    const onClick = vi.fn()

    render(
      <Text
        ref={ref}
        aria-label="Recovery instruction"
        data-text-purpose="instruction"
        dir="ltr"
        lang="en"
        onClick={onClick}
        style={{ paddingInline: '4px' }}
        tabIndex={0}
        title="Recovery detail"
      >
        Keep breathing steadily
      </Text>
    )

    const text = screen.getByLabelText('Recovery instruction')

    fireEvent.click(text)

    expect(text).toHaveTextContent('Keep breathing steadily')
    expect(text).toHaveAttribute('data-text-purpose', 'instruction')
    expect(text).toHaveAttribute('dir', 'ltr')
    expect(text).toHaveAttribute('lang', 'en')
    expect(text).toHaveAttribute('tabindex', '0')
    expect(text).toHaveAttribute('title', 'Recovery detail')
    expect(text).toHaveStyle({ paddingInline: '4px' })
    expect(ref.current).toBe(text)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('UC-005 / EX-001 / QA-001 - visibly proves native handler and ARIA forwarding in Storybook', () => {
    const story = Ex001DefaultInlineText as InspectableTextStory
    const Story = story.render

    expect(Story).toBeTypeOf('function')

    if (!Story) throw new Error('Expected EX-001 to provide an inspectable render function')

    render(<Story {...textStoriesMeta.args} {...story.args} />)

    const text = screen.getByLabelText('Recovery instruction')

    expect(screen.getByText('aria-label: Recovery instruction')).toBeVisible()
    expect(screen.getByText('native clicks: 0')).toBeVisible()

    fireEvent.click(text)

    expect(screen.getByText('native clicks: 1')).toBeVisible()
  })

  it('UC-001 / UC-005 / UC-006 / UC-007 / EX-004 - composes an element-form replacement with native semantics', () => {
    const ref = createRef<HTMLSpanElement>()
    const onRenderElementClick = vi.fn()
    const onTextClick = vi.fn()

    render(
      <Text
        ref={ref}
        className="text-muted-foreground"
        data-text-purpose="recovery"
        onClick={onTextClick}
        render={
          <strong
            className="uppercase"
            data-rendered-element="strong"
            onClick={onRenderElementClick}
            style={{ paddingInline: '2px' }}
          />
        }
        style={{ marginInline: '3px' }}
        title="Emphasized recovery instruction"
      >
        Keep breathing steadily
      </Text>
    )

    const text = screen.getByText('Keep breathing steadily')

    fireEvent.click(text)

    expect(text.tagName).toBe('STRONG')
    expect(text).not.toHaveAttribute('role')
    expect(text).toHaveClass(
      'font-sans',
      'tracking-wide',
      'text-md',
      'text-muted-foreground',
      'uppercase'
    )
    expect(text).not.toHaveClass('text-foreground')
    expect(text).toHaveAttribute('data-rendered-element', 'strong')
    expect(text).toHaveAttribute('data-text-purpose', 'recovery')
    expect(text).toHaveAttribute('title', 'Emphasized recovery instruction')
    expect(text).toHaveStyle({ marginInline: '3px', paddingInline: '2px' })
    expect(ref.current).toBe(text)
    expect(onRenderElementClick).toHaveBeenCalledOnce()
    expect(onTextClick).toHaveBeenCalledOnce()
  })

  it('UC-006 / EX-004 / QA-002 - visibly proves render-element className and style composition in Storybook', () => {
    const Story = Ex004ElementFormRenderReplacement.render

    expect(Story).toBeTypeOf('function')

    if (!Story) throw new Error('Expected EX-004 to provide an inspectable render function')

    render(<Story {...textStoriesMeta.args} {...Ex004ElementFormRenderReplacement.args} />)

    const text = screen.getByText('Keep breathing steadily')

    expect(text.tagName).toBe('STRONG')
    expect(text).toHaveClass('uppercase', 'text-muted-foreground')
    expect(text).toHaveStyle({ marginInline: '3px', paddingInline: '2px' })
    expect(screen.getByText('render class: uppercase')).toBeVisible()
    expect(screen.getByText('render padding-inline: 2px')).toBeVisible()
    expect(screen.getByText('consumer margin-inline: 3px')).toBeVisible()
  })

  it('UC-006 / UC-007 - preserves element-specific props owned by a replacement', () => {
    render(<Text render={<a href="/recovery" />}>Read recovery guidance</Text>)

    const link = screen.getByRole('link', { name: 'Read recovery guidance' })

    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/recovery')
    expect(link).toHaveClass('font-sans', 'text-foreground', 'tracking-wide', 'text-md')
  })

  it('UC-005 / UC-006 / UC-007 - composes props and a ref through a conforming custom replacement', () => {
    const ref = createRef<HTMLSpanElement>()

    function CustomText(props: ComponentPropsWithRef<'mark'>) {
      return <mark {...props} />
    }

    render(
      <Text
        ref={ref}
        aria-label="Marked recovery guidance"
        data-text-purpose="custom-component"
        render={<CustomText data-component="custom-text" />}
      >
        Keep the final repetition controlled
      </Text>
    )

    const text = screen.getByLabelText('Marked recovery guidance')

    expect(text.tagName).toBe('MARK')
    expect(text).toHaveTextContent('Keep the final repetition controlled')
    expect(text).toHaveAttribute('data-component', 'custom-text')
    expect(text).toHaveAttribute('data-text-purpose', 'custom-component')
    expect(text).toHaveClass('font-sans', 'text-foreground', 'tracking-wide', 'text-md')
    expect(ref.current).toBe(text)
  })

  it('UC-001 / UC-005 / UC-006 / UC-007 / EX-005 - gives a render callback complete props, empty state, and the final ref', () => {
    const ref = createRef<HTMLSpanElement>()
    let callbackRef: Ref<HTMLSpanElement> | undefined
    let stateKeys: string[] | undefined

    render(
      <Text
        ref={ref}
        aria-label="Brace instruction"
        className="consumer-callback-class"
        data-text-purpose="instruction"
        render={(props, state) => {
          callbackRef = props.ref
          stateKeys = Object.keys(state)

          return (
            <span {...props}>
              {props.children} · state keys: {Object.keys(state).length}
            </span>
          )
        }}
        title="Callback recovery instruction"
      >
        Brace before the repetition
      </Text>
    )

    const text = screen.getByLabelText('Brace instruction')

    expect(text.tagName).toBe('SPAN')
    expect(text).toHaveTextContent('Brace before the repetition · state keys: 0')
    expect(text).toHaveAttribute('data-text-purpose', 'instruction')
    expect(text).toHaveAttribute('title', 'Callback recovery instruction')
    expect(text).toHaveClass(
      'font-sans',
      'text-foreground',
      'tracking-wide',
      'text-md',
      'consumer-callback-class'
    )
    expect(callbackRef).toBeDefined()
    expect(stateKeys).toEqual([])
    expect(ref.current).toBe(text)
  })

  it('UC-007 - leaves callback prop application under consumer control', () => {
    render(
      <Text
        aria-label="Intentionally omitted label"
        data-text-purpose="intentionally-omitted"
        render={(props) => <em>{props.children}</em>}
      >
        Consumer-owned callback output
      </Text>
    )

    const text = screen.getByText('Consumer-owned callback output')

    expect(text.tagName).toBe('EM')
    expect(text).not.toHaveAttribute('aria-label')
    expect(text).not.toHaveAttribute('data-text-purpose')
    expect(text).not.toHaveAttribute('class')
  })

  it('UC-001 / EX-001 / EX-002 / EX-003 / EX-004 / EX-005 - exposes Text as the single public component through package assemblies', () => {
    expect(PACKAGE_EXPORTS.Text).toBeTypeOf('function')
    expect(PACKAGE_EXPORTS.Components.Text).toBe(PACKAGE_EXPORTS.Text)
    expect(PACKAGE_EXPORTS.Ui.Components).toBe(PACKAGE_EXPORTS.Components)
    expect(PACKAGE_EXPORTS.Ui.Components.Text).toBe(PACKAGE_EXPORTS.Text)
    expect(PACKAGE_EXPORTS.Text).not.toHaveProperty('Root')
    expect(PACKAGE_EXPORTS).not.toHaveProperty('TextRoot')
  })
})
