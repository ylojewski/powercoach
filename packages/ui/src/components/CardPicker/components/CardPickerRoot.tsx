import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type Key,
  type ReactElement,
  type ReactNode,
  type Ref
} from 'react'
import { twMerge } from 'tailwind-merge'

import { CardPickerCard, type CardPickerCardProps } from './CardPickerCard'
import { CardPickerGroup, type CardPickerGroupProps } from './CardPickerGroup'
import { CardPickerHint, type CardPickerHintProps } from './CardPickerHint'
import { type CardGroupChangeEventDetails, type CardGroupChangeEventReason } from '../../Card'
import { type HintContent, type HintItem } from '../../Hint'
import { cardPickerContext, type CardPickerContextValue } from '../constants/cardPickerContext'
import { type CardPickerPlacement, type CardPickerValue } from '../types/CardPickerTypes'
import { resolveCardPickerClassName } from '../utils/resolveCardPickerClassName'

export interface CardPickerRootState<TValue extends CardPickerValue = string> {
  disabled: boolean
  placement: CardPickerPlacement
  readOnly: boolean
  required: boolean
  value: TValue | null
}

export type CardPickerRootChangeEventReason = CardGroupChangeEventReason

export type CardPickerRootChangeEventDetails = CardGroupChangeEventDetails

export type CardPickerRootProps<TValue extends CardPickerValue = string> = Omit<
  useRender.ComponentProps<'div', CardPickerRootState<TValue>>,
  'children' | 'className' | 'style'
> & {
  children: ReactNode
  className?: string | ((state: CardPickerRootState<TValue>) => string | undefined)
  defaultValue?: TValue
  disabled?: boolean
  form?: string
  inputRef?: Ref<HTMLInputElement>
  name?: string
  onValueChange?: (value: TValue, eventDetails: CardPickerRootChangeEventDetails) => void
  placement?: CardPickerPlacement
  readOnly?: boolean
  required?: boolean
  style?: CSSProperties | ((state: CardPickerRootState<TValue>) => CSSProperties | undefined)
  value?: TValue | null
}

export function CardPickerRoot<TValue extends CardPickerValue = string>({
  children,
  className,
  defaultValue,
  disabled = false,
  form,
  inputRef,
  name,
  onValueChange,
  placement = 'block-start',
  readOnly = false,
  render,
  required = false,
  style,
  value,
  ...props
}: CardPickerRootProps<TValue>): ReactElement | null {
  const generatedId = useId()
  const [uncontrolledValue, setUncontrolledValue] = useState<TValue | null>(defaultValue ?? null)
  const hintGenerationsRef = useRef(new Map<CardPickerValue, { content: HintContent; key: Key }>())
  const nextHintGenerationRef = useRef(0)
  const previousEffectiveValueRef = useRef<CardPickerValue | null>(null)
  const waitingKeyRef = useRef<Key>(`${generatedId}-waiting-0`)
  const retainedValue = value !== undefined ? value : uncontrolledValue
  const directRootChildren = Children.toArray(children)
  const groupElement = directRootChildren.find(
    (child) => isValidElement(child) && child.type === CardPickerGroup
  ) as ReactElement<CardPickerGroupProps>
  const hintElement = directRootChildren.find(
    (child) => isValidElement(child) && child.type === CardPickerHint
  ) as ReactElement<CardPickerHintProps>
  const directCards = Children.toArray(groupElement.props.children).filter(
    (child) => isValidElement(child) && child.type === CardPickerCard
  ) as ReactElement<CardPickerCardProps<CardPickerValue>>[]
  const effectiveCard = directCards.find((card) => card.props.value === retainedValue)
  const effectiveValue = (effectiveCard?.props.value ?? null) as TValue | null
  const activeValueChanged = previousEffectiveValueRef.current !== effectiveValue
  const currentHintGenerations = new Map<CardPickerValue, { content: HintContent; key: Key }>()
  const hints = directCards.map((card) => {
    const previousGeneration = hintGenerationsRef.current.get(card.props.value)
    const isActive = card.props.value === effectiveValue
    const generation =
      previousGeneration !== undefined &&
      Object.is(previousGeneration.content, card.props.hint.content) &&
      !(isActive && activeValueChanged)
        ? previousGeneration
        : {
            content: card.props.hint.content,
            key: `${generatedId}-card-help-${(nextHintGenerationRef.current += 1)}`
          }

    currentHintGenerations.set(card.props.value, generation)

    return {
      condition: isActive,
      content: card.props.hint.content,
      key: generation.key
    } satisfies HintItem
  })

  if (effectiveValue === null && activeValueChanged) {
    waitingKeyRef.current = `${generatedId}-waiting-${(nextHintGenerationRef.current += 1)}`
  }

  hintGenerationsRef.current = currentHintGenerations
  previousEffectiveValueRef.current = effectiveValue
  const hintId = hintElement.props.id ?? `${generatedId}-hint`
  const state = {
    disabled,
    placement,
    readOnly,
    required,
    value: effectiveValue
  } satisfies CardPickerRootState<TValue>
  const resolvedClassName = resolveCardPickerClassName(className, state)
  const resolvedStyle = typeof style === 'function' ? style(state) : style
  const axisClassName = placement.startsWith('block-') ? 'flex flex-col' : 'flex flex-row'
  const mergedClassName = twMerge(axisClassName, 'gap-4', resolvedClassName)
  const cardsFirst = placement.endsWith('-start')
  const orderedChildren = cardsFirst ? [groupElement, hintElement] : [hintElement, groupElement]
  const contextValue = {
    disabled,
    form,
    hintId,
    hints,
    inputRef,
    name,
    onValueChange: (nextValue: CardPickerValue, eventDetails: CardGroupChangeEventDetails) => {
      onValueChange?.(nextValue as TValue, eventDetails)

      if (value === undefined && !eventDetails.isCanceled) {
        setUncontrolledValue(nextValue as TValue)
      }
    },
    placement,
    readOnly,
    required,
    value: retainedValue,
    waitingKey: waitingKeyRef.current
  } satisfies CardPickerContextValue
  const element = useRender<CardPickerRootState<TValue> & Record<string, unknown>, HTMLDivElement>({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: mergedClassName,
        style: resolvedStyle
      },
      props,
      {
        children: orderedChildren,
        'data-placement': placement,
        'data-selected': effectiveValue === null ? undefined : ''
      } as ComponentPropsWithRef<'div'>
    ) as Record<string, unknown>,
    render,
    state: state as CardPickerRootState<TValue> & Record<string, unknown>,
    stateAttributesMapping: {
      disabled: () => null,
      placement: () => null,
      readOnly: () => null,
      required: () => null,
      value: () => null
    }
  })

  return <cardPickerContext.Provider value={contextValue}>{element}</cardPickerContext.Provider>
}
