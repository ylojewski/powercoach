import { type ModuleRouteObject } from '@/core'

import { ExercisesDrawer, NewExerciseDrawer } from '../components'
import { ExercisesNavigationPath } from './navigation'

/* eslint-disable sort-keys */
export const exercisesRoutes = [
  {
    drawer: <ExercisesDrawer />,
    path: ExercisesNavigationPath.Index,
    children: [
      {
        drawer: <NewExerciseDrawer />,
        path: ExercisesNavigationPath.New
      }
    ]
  }
] as const satisfies ModuleRouteObject[]
