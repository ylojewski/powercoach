import { Children, isValidElement, type ReactElement } from 'react'

import { type ModuleRouteObject } from '../types'
import { mountRouteDrawers } from './mountRouteDrawers'

describe('mountRouteDrawers', () => {
  it('returns nested drawer elements with the right fallback paths', () => {
    const routes = [
      {
        children: [
          {
            drawer: <div>child drawer</div>,
            path: 'child'
          }
        ],
        path: 'plain'
      },
      {
        children: [
          {
            drawer: <div>nested drawer</div>,
            path: 'nested'
          }
        ],
        drawer: <div>parent drawer</div>,
        path: 'parent'
      },
      {
        drawer: <div>custom drawer</div>,
        fallback: '/custom',
        path: 'custom'
      }
    ] satisfies ModuleRouteObject[]

    const drawers = mountRouteDrawers('/base', routes, { fallback: '/default' })
    const [childDrawer, parentDrawer, customDrawer] = drawers

    if (!childDrawer || !parentDrawer || !customDrawer) {
      throw new Error('Expected every drawer to be mounted')
    }

    const nestedDrawer = Children.toArray(parentDrawer.props.children)[0]

    if (!isValidElement(nestedDrawer)) {
      throw new Error('Expected the nested drawer to be mounted as a child')
    }

    const nestedRouteDrawer = nestedDrawer as ReactElement<{
      fallbackPath: string
      path: string
    }>

    expect(drawers).toHaveLength(3)
    expect(childDrawer.props.path).toBe('/base/plain/child')
    expect(childDrawer.props.fallbackPath).toBe('/default')
    expect(parentDrawer.props.path).toBe('/base/parent')
    expect(parentDrawer.props.fallbackPath).toBe('/default')
    expect(nestedRouteDrawer.props.path).toBe('/base/parent/nested')
    expect(nestedRouteDrawer.props.fallbackPath).toBe('/base/parent')
    expect(customDrawer.props.path).toBe('/base/custom')
    expect(customDrawer.props.fallbackPath).toBe('/custom')
  })
})
