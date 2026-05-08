import { type ReactElement } from 'react'

import { useRoster } from '@/modules/roster'

export function Home(): ReactElement {
  const { activatedAthlete } = useRoster()

  return (
    <section className="min-h-screen border-l border-gray-200 dark:border-gray-700">
      {activatedAthlete
        ? `Home content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Home content'}
    </section>
  )
}
