import { type ReactElement } from 'react'

import managerLogoUrl from '@/src/assets/manager-logo.svg'

export function App(): ReactElement {
  return (
    <main>
      <h1>Console Manager</h1>
      <img alt="logo" src={managerLogoUrl} width={100} />
    </main>
  )
}
