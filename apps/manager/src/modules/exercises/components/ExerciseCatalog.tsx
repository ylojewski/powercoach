import { Button } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { RoutedDrawerLink } from '@/shared/components'

import { ExercisesRoute } from '../router'

export function ExerciseCatalog(): ReactElement {
  return (
    <section className="flex flex-col gap-2" data-testid="exercise-catalog">
      <p>Exercise catalog</p>
      <Button render={<RoutedDrawerLink to={ExercisesRoute.NewCatalogExercise} />}>
        New exercise
      </Button>
    </section>
  )
}
