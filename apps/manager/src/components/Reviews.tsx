import type React from 'react'

import { useRosterFeature } from '@/src/features'

export function Reviews(): React.ReactElement {
  const { activatedAthlete } = useRosterFeature()

  return (
    <div>
      {activatedAthlete
        ? `Reviews content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Reviews content'}
    </div>
  )
}
