import { type RouteObject } from 'react-router'

import { NewCatalogExerciseDrawer } from './components/NewCatalogExerciseDrawer'

export enum ExercisesRoute {
  Catalog = '',
  NewCatalogExercise = 'new'
}

export const exercisesMainRoutes = [
  { index: true },
  { path: ExercisesRoute.NewCatalogExercise }
] satisfies RouteObject[]

export const exercisesDrawerRoutes = [
  { element: <NewCatalogExerciseDrawer />, path: ExercisesRoute.NewCatalogExercise }
] satisfies RouteObject[]
