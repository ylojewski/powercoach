import { useContext, type ContextType, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { Card, type CardRootProps, type CardRootState, type CardSurfaceProps } from '../../Card'
import { cardPickerContext } from '../constants/cardPickerContext'
import {
  type CardPickerCardHint,
  type CardPickerSelectorProps,
  type CardPickerValue
} from '../types/CardPickerTypes'
import { resolveCardPickerClassName } from '../utils/resolveCardPickerClassName'

export type CardPickerCardProps<TValue extends CardPickerValue = string> = Omit<
  CardRootProps,
  'children'
> & {
  children: ReactElement<CardSurfaceProps>
  hint: CardPickerCardHint
  selectorProps: CardPickerSelectorProps<TValue>
  value: TValue
}

export function CardPickerCard<
  TValue extends CardPickerValue = string,
  TSelectorProps extends CardPickerSelectorProps<TValue> = CardPickerSelectorProps<TValue>
>({
  children,
  className,
  hint: _hint,
  selectorProps,
  value,
  ...props
}: Omit<CardPickerCardProps<TValue>, 'selectorProps'> & {
  selectorProps: TSelectorProps
}): ReactElement {
  const context = useContext(cardPickerContext) as NonNullable<
    ContextType<typeof cardPickerContext>
  >
  const selected = context.value === value

  return (
    <Card.Root
      {...props}
      className={(state: CardRootState) =>
        twMerge(
          `z-[var(--card-picker-card-z-index,${selected ? '1' : '0'})]`,
          resolveCardPickerClassName(className, state)
        )
      }
    >
      <Card.Selector {...selectorProps} value={value} />
      {children}
    </Card.Root>
  )
}
