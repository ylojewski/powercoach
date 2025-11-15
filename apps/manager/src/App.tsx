import { type ReactElement, useEffect, useState } from 'react'

import logo from '@/src/assets/logo.svg'

export function App(): ReactElement {
  const [health, setHealth] = useState<string>('loading')

  useEffect(() => {
    async function fetchHealth() {
      const response = await fetch('/api/v1/health')
      setHealth(await response.text())
    }
    void fetchHealth()
  }, [])

  return (
    <main style={{ display: 'flex' }}>
      <img alt="logo" src={logo} width={80} />
      <h1>
        Console Maaaaanager
        <br />
        {health}
      </h1>
    </main>
  )
}
