import type React from 'react'

import { useRosterFeature } from '@/src/features'

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
