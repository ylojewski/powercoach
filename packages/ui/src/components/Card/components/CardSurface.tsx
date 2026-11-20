import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from 'react'

import { RevealAnimation } from '../../../animations'
import { cardVariants } from '../constants/cardVariants'
import { useCardContext } from '../hooks/useCardContext'
import { type CardSize } from '../types/CardTypes'

export interface CardSurfaceState {
  disabled: boolean
  readOnly: boolean
  selectable: boolean
  selected: boolean
  size: CardSize
}

export type CardSurfaceProps = Omit<
  useRender.ComponentProps<'div', CardSurfaceState>,
  'className' | 'id' | 'ref' | 'style'
> & {
  children?: ReactNode
  className?: string | ((state: CardSurfaceState) => string | undefined)
  style?: CSSProperties | ((state: CardSurfaceState) => CSSProperties | undefined)
}

export function CardSurface({
  children,
  className,
  render,
  style,
  ...props
}: CardSurfaceProps): ReactElement | null {
  const { disabled, readOnly, selectable, selected, size } = useCardContext()
  const state = { disabled, readOnly, selectable, selected, size } satisfies CardSurfaceState
  const resolvedClassName = typeof className === 'function' ? className(state) : className
  const resolvedStyle = typeof style === 'function' ? style(state) : style
  const surface = useRender<CardSurfaceState & Record<string, unknown>, HTMLDivElement>({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cardVariants.surface({ selected })
      },
      {
        className: resolvedClassName,
        style: resolvedStyle
      },
      props,
      {
        children
      },
      {
        'data-disabled': disabled ? '' : undefined,
        'data-readonly': readOnly ? '' : undefined,
        'data-selectable': selectable ? '' : undefined,
        'data-selected': selected ? '' : undefined,
        'data-size': size
      } as ComponentPropsWithRef<'div'>
    ) as Record<string, unknown>,
    render,
    state: state as CardSurfaceState & Record<string, unknown>
  })

  if (surface === null) {
    return null
  }

  const surfaceChildren = (surface.props as { children?: ReactNode }).children

  return (
    <RevealAnimation
      contentMode="flow"
      direction="diagonal-45-to-135"
      render={surface}
      reveal={selected}
      scale={1}
    >
      {surfaceChildren}
    </RevealAnimation>
  )
}
