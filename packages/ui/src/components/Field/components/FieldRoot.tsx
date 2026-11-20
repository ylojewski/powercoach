import { Field as BaseUiField } from '@base-ui/react/field'
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  useCallback,
  useImperativeHandle,
  useRef
} from 'react'

import { fieldRequiredContext } from '../constants/fieldRequiredContext'

export type FieldRootState = BaseUiField.Root.State & {
  required: boolean
}

export type FieldRootActions = BaseUiField.Root.Actions

type FieldRootBaseRender = Exclude<BaseUiField.Root.Props['render'], ReactElement | undefined>

type FieldRootClassNameCallback = ((state: FieldRootState) => string | undefined) &
  {
    bivarianceHack(state: BaseUiField.Root.State): string | undefined
  }['bivarianceHack']

type FieldRootRenderCallback = ((
  props: ComponentPropsWithRef<'div'>,
  state: FieldRootState
) => ReactElement) &
  {
    bivarianceHack(
      props: Parameters<FieldRootBaseRender>[0],
      state: BaseUiField.Root.State
    ): ReactElement
  }['bivarianceHack']

type FieldRootStyleCallback = ((state: FieldRootState) => CSSProperties | undefined) &
  {
    bivarianceHack(state: BaseUiField.Root.State): CSSProperties | undefined
  }['bivarianceHack']

export interface FieldRootProps
  extends Omit<BaseUiField.Root.Props, 'className' | 'render' | 'style'> {
  className?: string | FieldRootClassNameCallback
  render?: ReactElement | FieldRootRenderCallback
  required?: boolean
  style?: CSSProperties | FieldRootStyleCallback
}

export function FieldRoot(props: FieldRootProps): ReactElement {
  const {
    actionsRef,
    className,
    render,
    required = false,
    style,
    validate,
    ...remainingProps
  } = props
  const baseActionsRef = useRef<FieldRootActions | null>(null)
  const controlRef = useRef<HTMLElement | null>(null)
  const ownedValidationMessageRef = useRef<string | null>(null)
  const validationGenerationRef = useRef(0)
  const invalidateValidationOwnership = useCallback(() => {
    validationGenerationRef.current += 1
  }, [])

  const trackedValidate =
    validate === undefined
      ? undefined
      : (...args: Parameters<NonNullable<FieldRootProps['validate']>>) => {
          validationGenerationRef.current += 1

          const validationGeneration = validationGenerationRef.current
          const validationResult = validate(...args)
          const trackValidationResult = (result: string | string[] | null) => {
            const message = Array.isArray(result) ? result.join('\n') : result

            if (validationGeneration === validationGenerationRef.current) {
              ownedValidationMessageRef.current = message
            } else if (controlRef.current instanceof HTMLInputElement) {
              const control = controlRef.current
              const generationAtResolution = validationGenerationRef.current
              const messageBeforeCommit = control.validationMessage
              const resolvedMessage = message ?? ''

              queueMicrotask(() => {
                queueMicrotask(() => {
                  if (
                    generationAtResolution === validationGenerationRef.current &&
                    messageBeforeCommit !== resolvedMessage &&
                    control.validationMessage === resolvedMessage
                  ) {
                    ownedValidationMessageRef.current = message
                  }
                })
              })
            }

            return result
          }

          return validationResult instanceof Promise
            ? validationResult.then(trackValidationResult)
            : trackValidationResult(validationResult)
        }

  useImperativeHandle(actionsRef, () => ({
    validate() {
      validationGenerationRef.current += 1

      if (
        controlRef.current instanceof HTMLInputElement &&
        ownedValidationMessageRef.current !== null &&
        controlRef.current.validationMessage === ownedValidationMessageRef.current
      ) {
        controlRef.current.setCustomValidity('')
      }

      ownedValidationMessageRef.current = null

      const baseActions = baseActionsRef.current as FieldRootActions

      baseActions.validate()
    }
  }))

  return (
    <fieldRequiredContext.Provider value={{ controlRef, invalidateValidationOwnership, required }}>
      <BaseUiField.Root
        {...remainingProps}
        actionsRef={baseActionsRef}
        className={
          typeof className === 'function' ? (state) => className({ ...state, required }) : className
        }
        data-required={required ? '' : undefined}
        render={
          typeof render === 'function'
            ? (renderProps, state) => render(renderProps, { ...state, required })
            : render
        }
        style={typeof style === 'function' ? (state) => style({ ...state, required }) : style}
        validate={trackedValidate}
      />
    </fieldRequiredContext.Provider>
  )
}
