import { type ReactElement } from 'react'

const exercises = [
  {
    category: 'Strength',
    name: 'Back squat',
    pattern: 'Squat'
  },
  {
    category: 'Strength',
    name: 'Romanian deadlift',
    pattern: 'Hinge'
  },
  {
    category: 'Conditioning',
    name: 'Assault bike intervals',
    pattern: 'Cyclic'
  },
  {
    category: 'Mobility',
    name: 'Half-kneeling hip flexor stretch',
    pattern: 'Mobility'
  }
]

export function ExerciseCatalog(): ReactElement {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {exercises.map((exercise) => (
        <article
          className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm"
          key={exercise.name}
        >
          <div className="text-muted-foreground text-xs font-medium">{exercise.category}</div>
          <h3 className="mt-2 text-base font-semibold">{exercise.name}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{exercise.pattern}</p>
        </article>
      ))}
    </div>
  )
}
