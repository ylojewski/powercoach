import { useRender, type HTMLProps } from '@base-ui/react/use-render'
import { useContext, useLayoutEffect, type ReactElement } from 'react'

import { type CardSelectorState } from './CardSelector'
import { cardContext } from '../constants/cardContext'

export interface CardSelectorRenderedProps {
  elementProps: HTMLProps
  render: CardSelectorRenderedRender
  state: CardSelectorState
}

export type CardSelectorRenderedRender =
  | ReactElement
  | ((props: HTMLProps, state: CardSelectorState) => ReactElement)
  | undefined

export function CardSelectorRendered({
  elementProps,
  render,
  state
}: CardSelectorRenderedProps): ReactElement | null {
  const { onSelectorStateChange, onSelectorUnmount } = useContext(cardContext)

  useLayoutEffect(() => {
    onSelectorStateChange(state)
  }, [onSelectorStateChange, state])

  useLayoutEffect(() => onSelectorUnmount, [onSelectorUnmount])

  return useRender<CardSelectorState & Record<string, unknown>, HTMLButtonElement>({
    defaultTagName: 'button',
    props: elementProps as Record<string, unknown>,
    render,
    state: state as CardSelectorState & Record<string, unknown>
  })
}
