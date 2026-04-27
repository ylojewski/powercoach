import type React from 'react'

import { useRosterFeature } from '@/roster'

export function Programs(): React.ReactElement {
  const { activatedAthlete } = useRosterFeature()

  return (
    <div>
      {activatedAthlete
        ? `Programs content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Programs content'}
    </div>
  )
}
