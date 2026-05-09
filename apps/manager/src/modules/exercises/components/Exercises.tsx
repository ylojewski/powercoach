import { Button } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { useRouterConfig, RoutedDrawerLink } from '@/core'

export function Exercises(): ReactElement {
  const RouterConfig = useRouterConfig()

  return (
    <section className="flex flex-col gap-2" data-testid="exercise-catalog">
      <p>Exercise catalog</p>
      <Button render={<RoutedDrawerLink to={RouterConfig.Exercises.New} />}>New exercise</Button>
    </section>
  )
}
