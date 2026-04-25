import { type ReactElement } from 'react'

import { useRosterFeature } from '@/src/features'

export function Home(): ReactElement {
  const { activatedAthlete } = useRosterFeature()

  return (
    <section className="min-h-screen border-l border-gray-200 dark:border-gray-700">
      {activatedAthlete
        ? `Home content for ${activatedAthlete.firstName} ${activatedAthlete.lastName}`
        : 'Home content'}
    </section>
  )
}
