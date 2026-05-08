import { type ReactElement } from 'react'

export function NewExercise(): ReactElement {
  return (
    <section className="flex flex-col gap-2" data-testid="exercise-catalog-new">
      <p>New catalog exercise</p>
    </section>
  )
}
