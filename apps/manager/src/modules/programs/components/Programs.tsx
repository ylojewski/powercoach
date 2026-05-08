import { type ReactElement } from 'react'

import { useRoster } from '@/modules/roster'

export function Programs(): ReactElement {
  const { activatedAthlete } = useRoster()

  return (
    <div>
      {activatedAthlete
        ? `Programs content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Programs content'}
    </div>
  )
}
