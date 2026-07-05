import { mergeProps } from '@base-ui/react/merge-props'
import {
  cloneElement,
  createElement,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactElement,
  type Ref
} from 'react'

import { composeRailsRefs } from './composeRailsRefs'

export type RailsRenderProp<TState> =
  | ReactElement
  | ((props: Record<string, unknown>, state: TState) => ReactElement)
  | undefined

export function renderRailsElement<TElement extends ElementType, TState>(
  fallbackElement: TElement,
  render: RailsRenderProp<TState>,
  props: ComponentPropsWithRef<TElement>,
  state: TState,
  enforcedProps?: ComponentPropsWithRef<TElement>
): ReactElement {
  const incomingProps = (
    enforcedProps ? mergeProps<TElement>(props, enforcedProps) : props
  ) as ComponentPropsWithRef<TElement>

  if (typeof render === 'function') {
    return render(incomingProps as Record<string, unknown>, state)
  }

  if (render) {
    const renderedElement = render as ReactElement<ComponentPropsWithRef<TElement>>
    const elementProps = renderedElement.props

    const renderedProps = enforcedProps
      ? mergeProps<TElement>(incomingProps, elementProps, enforcedProps, {
          ref: composeRailsRefs(elementProps.ref as Ref<unknown>, incomingProps.ref as Ref<unknown>)
        } as ComponentPropsWithRef<TElement>)
      : mergeProps<TElement>(incomingProps, elementProps, {
          ref: composeRailsRefs(elementProps.ref as Ref<unknown>, incomingProps.ref as Ref<unknown>)
        } as ComponentPropsWithRef<TElement>)

    return cloneElement(renderedElement, renderedProps)
  }

  return createElement(fallbackElement, incomingProps)
}
