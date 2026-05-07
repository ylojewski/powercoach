import { type RouteObject } from 'react-router'

import { ExerciseDrawer, exercisesDrawerRoutes, exercisesMainRoutes } from '@/modules/exercises'
import { metricsMainRoutes } from '@/modules/metrics'
import { notesMainRoutes } from '@/modules/notes'
import { programsMainRoutes } from '@/modules/programs'
import { reviewsMainRoutes } from '@/modules/reviews'

import { Layout } from './components/Layout'
import { RouterPath } from './constants'

export const mainRoutes = [
  { element: <Layout />, path: RouterPath.Home },
  { children: metricsMainRoutes, element: <Layout />, path: RouterPath.Metrics },
  { children: notesMainRoutes, element: <Layout />, path: RouterPath.Notes },
  { children: reviewsMainRoutes, element: <Layout />, path: RouterPath.Reviews },
  { children: programsMainRoutes, element: <Layout />, path: RouterPath.Programs },
  { element: <Layout />, path: RouterPath.AthleteHome },
  { children: metricsMainRoutes, element: <Layout />, path: RouterPath.AthleteMetrics },
  { children: notesMainRoutes, element: <Layout />, path: RouterPath.AthleteNotes },
  { children: reviewsMainRoutes, element: <Layout />, path: RouterPath.AthleteReviews },
  { children: programsMainRoutes, element: <Layout />, path: RouterPath.AthletePrograms },
  { children: exercisesMainRoutes, element: <Layout />, path: RouterPath.Exercise }
] satisfies RouteObject[]

export const drawerRoutes = [
  { children: exercisesDrawerRoutes, element: <ExerciseDrawer />, path: RouterPath.Exercise }
] satisfies RouteObject[]
