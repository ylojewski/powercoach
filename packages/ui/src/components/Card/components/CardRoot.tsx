import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  useCallback,
  useMemo,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement
} from 'react'

import {
  cardContext,
  type CardContextValue,
  type CardSelectorMirrorState
} from '../constants/cardContext'
import { cardVariants } from '../constants/cardVariants'
import { type CardSize } from '../types/CardTypes'

export interface CardRootState {
  disabled: boolean
  readOnly: boolean
  selectable: boolean
  selected: boolean
  size: CardSize
}

export interface CardRootProps
  extends Omit<useRender.ComponentProps<'div', CardRootState>, 'className' | 'style'> {
  className?: string | ((state: CardRootState) => string | undefined)
  size?: CardSize
  style?: CSSProperties | ((state: CardRootState) => CSSProperties | undefined)
}

export function CardRoot({
  className,
  render,
  size = 'md',
  style,
  ...props
}: CardRootProps): ReactElement | null {
  const [disabled, setDisabled] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [selectable, setSelectable] = useState(false)
  const [selected, setSelected] = useState(false)
  const onSelectorStateChange = useCallback((state: CardSelectorMirrorState) => {
    setDisabled(state.disabled)
    setReadOnly(state.readOnly)
    setSelectable(true)
    setSelected(state.checked)
  }, [])
  const onSelectorUnmount = useCallback(() => {
    setDisabled(false)
    setReadOnly(false)
    setSelectable(false)
    setSelected(false)
  }, [])
  const contextValue = useMemo<CardContextValue>(
    () => ({
      disabled,
      onSelectorStateChange,
      onSelectorUnmount,
      readOnly,
      selectable,
      selected,
      size
    }),
    [disabled, onSelectorStateChange, onSelectorUnmount, readOnly, selectable, selected, size]
  )
  const state = useMemo<CardRootState>(
    () => ({ disabled, readOnly, selectable, selected, size }),
    [disabled, readOnly, selectable, selected, size]
  )
  const resolvedClassName = typeof className === 'function' ? className(state) : className
  const resolvedStyle = typeof style === 'function' ? style(state) : style
  const element = useRender<CardRootState & Record<string, unknown>, HTMLDivElement>({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cardVariants.root({ selectable, selected })
      },
      {
        className: resolvedClassName,
        style: resolvedStyle
      },
      props,
      {
        'data-disabled': disabled ? '' : undefined,
        'data-readonly': readOnly ? '' : undefined,
        'data-selectable': selectable ? '' : undefined,
        'data-selected': selected ? '' : undefined,
        'data-size': size
      } as ComponentPropsWithRef<'div'>
    ) as Record<string, unknown>,
    render,
    state: state as CardRootState & Record<string, unknown>
  })

  return <cardContext.Provider value={contextValue}>{element}</cardContext.Provider>
}
