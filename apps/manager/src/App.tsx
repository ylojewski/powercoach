import { type ReactElement } from 'react'

import logo from '@/src/assets/logo.svg'

export function App(): ReactElement {
  return (
    <main>
      <h1>Console Manager</h1>
      <img alt="logo" src={logo} width={100} />
    </main>
  )
}
