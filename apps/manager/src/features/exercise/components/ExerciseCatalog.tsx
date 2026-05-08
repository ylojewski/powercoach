import { Button } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Link } from 'react-router'

import { RouterPath, useBackgroundLocationState } from '@/app'

export function ExerciseCatalog(): ReactElement {
  const state = useBackgroundLocationState()
  return (
    <section className="flex flex-col gap-2" data-testid="exercise-catalog">
      <p>Exercise catalog</p>
      <Button render={<Link state={state ?? undefined} to={RouterPath.ExerciseNew} />}>
        New exercise
      </Button>
    </section>
  )
}
