import { useRender } from '@base-ui/react/use-render'
import {
  cloneElement,
  isValidElement,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode
} from 'react'

import { type TabsTabProps, type TabsTabState } from './TabsTab'

export interface TabsRenderedTabSurfaceProps extends ComponentPropsWithRef<'button'> {
  children?: ReactNode
  render?: TabsTabProps['render']
  state: TabsTabState
}

export function TabsRenderedTabSurface({
  render,
  state,
  ...props
}: TabsRenderedTabSurfaceProps): ReactElement {
  const sanitizeOverlayProps = (inputProps: Record<string, unknown>) => {
    const sanitizedProps = { ...inputProps }

    for (const propName of Object.keys(sanitizedProps)) {
      if (
        propName.startsWith('aria-') ||
        propName.startsWith('on') ||
        [
          'autoFocus',
          'disabled',
          'download',
          'form',
          'formAction',
          'formEncType',
          'formMethod',
          'formNoValidate',
          'formTarget',
          'href',
          'id',
          'name',
          'ref',
          'role',
          'target'
        ].includes(propName)
      ) {
        sanitizedProps[propName] = undefined
      }
    }

    sanitizedProps.tabIndex = -1

    return sanitizedProps
  }

  const isOverlaySurface = 'data-reveal-overlay-surface' in props
  const surfaceProps = isOverlaySurface ? sanitizeOverlayProps(props) : props
  const surfaceRender = isOverlaySurface
    ? typeof render === 'function'
      ? (renderProps: Record<string, unknown>, renderState: TabsTabState) => {
          const renderedElement = render(renderProps, renderState)

          return cloneElement(
            renderedElement,
            sanitizeOverlayProps(renderedElement.props as Record<string, unknown>)
          )
        }
      : isValidElement(render)
        ? cloneElement(render, sanitizeOverlayProps(render.props as Record<string, unknown>))
        : render
    : render

  return useRender({
    defaultTagName: 'button',
    props: surfaceProps,
    render: surfaceRender as useRender.RenderProp<TabsTabState & Record<string, unknown>>,
    state: state as TabsTabState & Record<string, unknown>
  })
}
