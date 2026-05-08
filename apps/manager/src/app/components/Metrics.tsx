import type React from 'react'

import { useRosterFeature } from '@/modules/roster'

export function Metrics(): React.ReactElement {
  const { activatedAthlete } = useRosterFeature()

  return (
    <div>
      {activatedAthlete
        ? `Metrics content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Metrics content'}
    </div>
  )
}
