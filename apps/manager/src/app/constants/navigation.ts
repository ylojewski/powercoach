import { type NavigationState } from '@/core'
import { exercisesNavigation } from '@/modules/exercises'
import { homeNavigation } from '@/modules/home'
import { metricsNavigation } from '@/modules/metrics'
import { notesNavigation } from '@/modules/notes'
import { programsNavigation } from '@/modules/programs'
import { reviewsNavigation } from '@/modules/reviews'

function join(...paths: string[]): string {
  return paths.filter(Boolean).join('/')
}

export const navigationState = {
  athleteIndex: '/:athleteSlug',
  exerciseIndex: join('/exercises', exercisesNavigation.exerciseIndex()),
  homeIndex: join('/:athleteSlug?', homeNavigation.homeIndex()),
  index: '/',
  metricsIndex: join('/:athleteSlug?/metrics', metricsNavigation.metricsIndex()),
  newExercise: join('/exercises', exercisesNavigation.newExercise()),
  notesIndex: join('/:athleteSlug?/notes', notesNavigation.notesIndex()),
  programsIndex: join('/:athleteSlug?/programs', programsNavigation.programsIndex()),
  reviewsIndex: join('/:athleteSlug?/reviews', reviewsNavigation.reviewsIndex())
} as const satisfies NavigationState
