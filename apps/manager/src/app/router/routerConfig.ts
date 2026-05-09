import { type RouterConfig } from '@/core'
import { ExercisesRouterPath } from '@/modules/exercises'

const ATHLETE_INDEX = '/:athleteSlug'
const EXERCISES_INDEX = '/exercise'

export const routerConfig: RouterConfig = {
  Exercises: {
    Index: EXERCISES_INDEX,
    New: `${EXERCISES_INDEX}/${ExercisesRouterPath.New}`
  },
  Home: {
    AthleteRoot: ATHLETE_INDEX,
    Index: '/'
  },
  Metrics: {
    AthleteRoot: `${ATHLETE_INDEX}/metrics`,
    Index: '/metrics'
  },
  Notes: {
    AthleteRoot: `${ATHLETE_INDEX}/notes`,
    Index: '/notes'
  },
  Programs: {
    AthleteRoot: `${ATHLETE_INDEX}/programs`,
    Index: '/programs'
  },
  Reviews: {
    AthleteRoot: `${ATHLETE_INDEX}/reviews`,
    Index: '/reviews'
  }
}
