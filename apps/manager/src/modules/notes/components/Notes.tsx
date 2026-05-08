import { type ReactElement } from 'react'

import { useRoster } from '@/modules/roster'

export function Notes(): ReactElement {
  const { activatedAthlete } = useRoster()

  return (
    <div>
      {activatedAthlete
        ? `Notes content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Notes content'}
    </div>
  )
}
