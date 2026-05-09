import { Route } from 'react-router'

import { ExercisesDrawer } from './components'
import { ExercisesRouterPath } from './constants'

export const exercisesRoutes = (
  <>
    <Route index />
    <Route path={ExercisesRouterPath.New} />
  </>
)

export const exercisesDrawers = (
  <>
    <ExercisesDrawer />
  </>
)
