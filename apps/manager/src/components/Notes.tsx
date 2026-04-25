import type React from 'react'

import { useRosterFeature } from '@/src/features'

export function Notes(): React.ReactElement {
  const { activatedAthlete } = useRosterFeature()

  return (
    <div>
      {activatedAthlete
        ? `Notes content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Notes content'}
    </div>
  )
}
