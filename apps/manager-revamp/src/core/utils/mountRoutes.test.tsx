import { type ModuleRouteObject } from '../types'
import { mountRoutes } from './mountRoutes'

function Probe() {
  return <div>probe</div>
}

describe('mountRoutes', () => {
  it('mounts root paths, nested paths and pathless routes', () => {
    const routes = [
      {
        children: [
          {
            element: <div>child</div>,
            path: 'child'
          },
          {
            children: [
              {
                Component: Probe
              }
            ]
          }
        ],
        Component: Probe,
        drawer: <div>drawer</div>,
        fallback: '/fallback',
        path: 'root'
      }
    ] satisfies ModuleRouteObject[]

    expect(mountRoutes('/base', routes)).toMatchObject([
      {
        children: [
          {
            element: <div>child</div>,
            path: 'child'
          },
          {
            children: [
              {
                Component: Probe
              }
            ],
            element: null
          }
        ],
        Component: Probe,
        path: '/base/root'
      }
    ])
  })
})
