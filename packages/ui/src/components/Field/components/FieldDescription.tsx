import { Field as BaseUiField } from '@base-ui/react/field'
import { type useRender } from '@base-ui/react/use-render'
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type Key,
  type ReactElement,
  type RefAttributes
} from 'react'

import {
  Hint,
  type HintContent,
  type HintStripesOptions,
  type HintSwitchAnimationOptions,
  type HintTextProps
} from '../../Hint'

export type FieldDescriptionState = BaseUiField.Description.State

export type FieldDescriptionTextProps = Pick<HintTextProps, 'className' | 'size' | 'style'>

export type FieldDescriptionStripesOptions = HintStripesOptions

export type FieldDescriptionSwitchAnimationOptions = HintSwitchAnimationOptions

export type FieldDescriptionGetErrorKey = (
  error: string,
  index: number,
  errors: readonly string[]
) => Key

export interface FieldDescriptionProps
  extends Omit<
      useRender.ComponentProps<'div', FieldDescriptionState>,
      'children' | 'className' | 'ref' | 'render' | 'style'
    >,
    RefAttributes<HTMLElement> {
  className?: string | ((state: FieldDescriptionState) => string | undefined)
  getErrorKey?: FieldDescriptionGetErrorKey
  render?:
    | ReactElement
    | ((props: ComponentPropsWithRef<'div'>, state: FieldDescriptionState) => ReactElement)
  stripesOptions?: FieldDescriptionStripesOptions
  style?: CSSProperties | ((state: FieldDescriptionState) => CSSProperties | undefined)
  switchAnimationOptions?: FieldDescriptionSwitchAnimationOptions
  textProps?: FieldDescriptionTextProps
  waitingContent: HintContent
  waitingKey: Key
}

export function FieldDescription({
  children: _children,
  getErrorKey,
  hints: _hints,
  intent: _intent,
  render,
  stripesOptions,
  switchAnimationOptions,
  textProps,
  tone: _tone,
  waitingContent,
  waitingKey,
  ...props
}: FieldDescriptionProps & {
  children?: unknown
  hints?: unknown
  intent?: unknown
  tone?: unknown
}): ReactElement {
  const { className, size, style } = textProps ?? {}

  return (
    <BaseUiField.Description
      {...(props as BaseUiField.Description.Props)}
      render={render ?? <div />}
    >
      <BaseUiField.Validity>
        {(state) => {
          const occurrences = new Map<string, number>()
          const hints = state.errors.map((error, index, errors) => {
            const occurrence = occurrences.get(error) ?? 0

            occurrences.set(error, occurrence + 1)

            return {
              condition: true,
              content: error,
              key:
                getErrorKey?.(error, index, errors) ??
                `field-description-error:${JSON.stringify(error)}:${occurrence}`
            }
          })
          const hasError = hints.length > 0

          return (
            <Hint
              hints={hints}
              stripesOptions={stripesOptions}
              switchAnimationOptions={switchAnimationOptions}
              textProps={
                hasError
                  ? { className, intent: 'destructive', size, style }
                  : { className, size, style, tone: 'muted' }
              }
              waitingContent={waitingContent}
              waitingKey={waitingKey}
            />
          )
        }}
      </BaseUiField.Validity>
    </BaseUiField.Description>
  )
}
