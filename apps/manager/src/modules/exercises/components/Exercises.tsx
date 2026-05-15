import { Button } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { BackgroundLink, useNavigation } from '@/core'

export function Exercises(): ReactElement {
  const navigation = useNavigation()

  return (
    <section className="flex flex-col gap-2" data-testid="exercise-catalog">
      <p>Exercise catalog</p>
      <Button render={<BackgroundLink to={navigation.newExercise()} />}>New exercise</Button>
    </section>
  )
}
