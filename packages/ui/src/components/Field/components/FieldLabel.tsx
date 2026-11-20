import { Field as BaseUiField } from '@base-ui/react/field'
import {
  use,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type RefAttributes
} from 'react'

import { Heading } from '../../Heading'
import { type ToneOrIntentProps } from '../../types/ToneOrIntentProps'
import { fieldRequiredContext } from '../constants/fieldRequiredContext'

export type FieldLabelState = BaseUiField.Label.State & {
  required: boolean
}

export type FieldLabelHeadingProps = ToneOrIntentProps

type FieldLabelBaseRender = Exclude<BaseUiField.Label.Props['render'], ReactElement | undefined>

type FieldLabelClassNameCallback = ((state: FieldLabelState) => string | undefined) &
  {
    bivarianceHack(state: BaseUiField.Label.State): string | undefined
  }['bivarianceHack']

type FieldLabelRenderCallback = ((
  props: ComponentPropsWithRef<'label'>,
  state: FieldLabelState
) => ReactElement) &
  {
    bivarianceHack(
      props: Parameters<FieldLabelBaseRender>[0],
      state: BaseUiField.Label.State
    ): ReactElement
  }['bivarianceHack']

type FieldLabelStyleCallback = ((state: FieldLabelState) => CSSProperties | undefined) &
  {
    bivarianceHack(state: BaseUiField.Label.State): CSSProperties | undefined
  }['bivarianceHack']

export interface FieldLabelProps
  extends Omit<BaseUiField.Label.Props, 'className' | 'render' | 'style'> {
  className?: string | FieldLabelClassNameCallback
  headingProps?: FieldLabelHeadingProps
  render?: ReactElement | FieldLabelRenderCallback
  style?: CSSProperties | FieldLabelStyleCallback
}

interface FieldLabelComponentProps
  extends Omit<FieldLabelProps, 'ref'>,
    RefAttributes<HTMLElement> {}

export function FieldLabel(props: FieldLabelProps | FieldLabelComponentProps): ReactElement {
  const { children, className, headingProps, render, style, ...remainingProps } =
    props as FieldLabelComponentProps
  const { required } = use(fieldRequiredContext)
  const { intent, tone } = headingProps ?? {}

  return (
    <BaseUiField.Label
      {...remainingProps}
      className={
        typeof className === 'function' ? (state) => className({ ...state, required }) : className
      }
      data-required={required ? '' : undefined}
      render={(renderProps, state) => (
        <Heading
          {...renderProps}
          {...(intent === undefined ? { tone } : { intent })}
          render={
            typeof render === 'function'
              ? (headingRenderProps) => render(headingRenderProps, { ...state, required })
              : (render ?? <label />)
          }
          size="sm"
        />
      )}
      style={typeof style === 'function' ? (state) => style({ ...state, required }) : style}
    >
      {children}
      {required ? <span aria-hidden="true">*</span> : null}
    </BaseUiField.Label>
  )
}
