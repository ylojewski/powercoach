import { type ReactElement } from 'react'

import { useRoster } from '@/modules/roster'

export function Reviews(): ReactElement {
  const { activatedAthlete } = useRoster()

  return (
    <div>
      {activatedAthlete
        ? `Reviews content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Reviews content'}
    </div>
  )
}
