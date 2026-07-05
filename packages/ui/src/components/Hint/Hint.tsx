import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { type CSSProperties, type Key, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { SwitchAnimation, type SwitchAnimationProps } from '../../animations/SwitchAnimation'
import { Stripes, type StripesProps } from '../Stripes'
import { Text, type TextProps } from '../Text'
import { type ToneOrIntentProps } from '../types/ToneOrIntentProps'

export type HintContent = string | ReactElement

export interface HintItem {
  readonly condition: boolean
  readonly content: HintContent
  readonly key: Key
}

export type HintStripesOptions = Pick<
  StripesProps,
  'angle' | 'className' | 'color' | 'gap' | 'style' | 'width'
>

export type HintSwitchAnimationOptions = Pick<
  SwitchAnimationProps,
  'className' | 'direction' | 'onSwitchChange' | 'onSwitchComplete' | 'onSwitchStart' | 'style'
>

export type HintTextProps = Pick<TextProps, 'className' | 'size' | 'style'> & ToneOrIntentProps

export interface HintProps
  extends Omit<useRender.ComponentProps<'div', Record<string, never>>, 'children'> {
  hints: readonly HintItem[]
  stripesOptions?: HintStripesOptions
  switchAnimationOptions?: HintSwitchAnimationOptions
  textProps?: HintTextProps
  waitingContent: HintContent
  waitingKey: Key
}

export function Hint({
  hints,
  render,
  stripesOptions,
  switchAnimationOptions,
  textProps,
  waitingContent,
  waitingKey,
  ...props
}: HintProps): ReactElement | null {
  const selectedHint = hints.find((hint) => hint.condition)
  const selectedContent = selectedHint?.content ?? waitingContent
  const selectedKey = selectedHint?.key ?? waitingKey
  const {
    angle,
    className: stripesClassName,
    color,
    gap,
    style: stripesStyle,
    width
  } = stripesOptions ?? {}
  const {
    className: switchClassName,
    direction,
    onSwitchChange,
    onSwitchComplete,
    onSwitchStart,
    style: switchStyle
  } = switchAnimationOptions ?? {}
  const {
    className: textClassName,
    intent: textIntent,
    size: textSize = 'xs',
    style: textStyle,
    tone: textTone
  } = textProps ?? {}
  const textAppearanceProps: ToneOrIntentProps =
    textIntent === undefined ? { tone: textTone ?? 'muted' } : { intent: textIntent }
  const resolvedTextStyle = textStyle === undefined ? undefined : { ...textStyle }

  if (resolvedTextStyle !== undefined) {
    delete resolvedTextStyle.background
    delete resolvedTextStyle.backgroundColor
    delete resolvedTextStyle.font
    delete resolvedTextStyle.fontFamily
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(props, {
      children: (
        <Stripes
          angle={angle}
          className={stripesClassName}
          color={color}
          gap={gap}
          style={
            mergeProps<'div'>(
              { style: stripesStyle },
              {
                style: {
                  overflow: 'clip',
                  paddingBlockEnd: '2.5rem',
                  paddingBlockStart: '0.5rem',
                  paddingInlineEnd: '0.5rem',
                  paddingInlineStart: 0
                }
              }
            ).style as CSSProperties
          }
          width={width}
        >
          <SwitchAnimation
            className={switchClassName}
            contentMode="flow"
            direction={direction}
            onSwitchChange={onSwitchChange}
            onSwitchComplete={onSwitchComplete}
            onSwitchStart={onSwitchStart}
            style={switchStyle}
          >
            <Text
              key={selectedKey}
              {...textAppearanceProps}
              className={twMerge(textClassName, 'bg-background font-[inherit]')}
              render={<div />}
              size={textSize}
              style={resolvedTextStyle}
              tabIndex={-1}
            >
              {selectedContent}
            </Text>
          </SwitchAnimation>
        </Stripes>
      )
    }),
    render,
    state: {}
  })
}
