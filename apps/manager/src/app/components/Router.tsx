import { type ReactElement } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { mountRouteDrawers, mountRoutes, RouteDrawerShell } from '@/core'
import { exercisesRoutes } from '@/modules/exercises'
import { homeRoutes } from '@/modules/home'
import { metricsRoutes } from '@/modules/metrics'
import { notesRoutes } from '@/modules/notes'
import { programsRoutes } from '@/modules/programs'
import { reviewsRoutes } from '@/modules/reviews'

import { Layout } from './Layout'
import { ModuleLoader } from './ModuleLoader'
import { NotFound } from './NotFound'

/* eslint-disable sort-keys */
const router = createBrowserRouter([
  {
    element: <ModuleLoader />,
    children: [
      {
        element: (
          <RouteDrawerShell routeDrawers={[...mountRouteDrawers('/exercises', exercisesRoutes)]} />
        ),
        children: [
          {
            element: <Layout />,
            children: [
              ...mountRoutes('/', homeRoutes),
              ...mountRoutes('/programs', programsRoutes),
              ...mountRoutes('/reviews', reviewsRoutes),
              ...mountRoutes('/metrics', metricsRoutes),
              ...mountRoutes('/notes', notesRoutes),
              ...mountRoutes('/:athleteSlug', homeRoutes),
              ...mountRoutes('/:athleteSlug/programs', programsRoutes),
              ...mountRoutes('/:athleteSlug/reviews', reviewsRoutes),
              ...mountRoutes('/:athleteSlug/metrics', metricsRoutes),
              ...mountRoutes('/:athleteSlug/notes', notesRoutes),
              ...mountRoutes('/exercises', exercisesRoutes)
            ]
          }
        ]
      },
      {
        element: <NotFound />,
        path: '*'
      }
    ]
  }
])

export function Router(): ReactElement {
  return <RouterProvider router={router} />
}
