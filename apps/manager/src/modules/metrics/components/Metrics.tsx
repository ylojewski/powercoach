import { type ReactElement } from 'react'

import { useRoster } from '@/modules/roster'

export function Metrics(): ReactElement {
  const { activatedAthlete } = useRoster()

  return (
    <div>
      {activatedAthlete
        ? `Metrics content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Metrics content'}
    </div>
  )
}
