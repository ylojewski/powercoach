import { type ReactElement } from 'react'

import { BackgroundLink, useNavigation } from '@/core'

export function Home(): ReactElement {
  const navigation = useNavigation()

  return (
    <main className="min-h-screen bg-background">
      <BackgroundLink to={navigation.homeDrawer()}>Hello world</BackgroundLink>
    </main>
  )
}
