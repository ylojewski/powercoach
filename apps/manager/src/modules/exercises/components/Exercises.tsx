import { Button } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { RouterPath, RoutedDrawerLink } from '@/app'

export function Exercises(): ReactElement {
  return (
    <section className="flex flex-col gap-2" data-testid="exercise-catalog">
      <p>Exercise catalog</p>
      <Button render={<RoutedDrawerLink to={RouterPath.ExerciseNew} />}>New exercise</Button>
    </section>
  )
}
