import { type ReactElement, useEffect, useState } from 'react'

import logo from '@/src/assets/logo.svg'

interface UserProfile {
  email: string
  id: string
}

export function App(): ReactElement {
  const [health, setHealth] = useState<string>('loading')
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function fetchHealth() {
      const [healthResponse, userResponse] = await Promise.all([
        fetch('/api/v1/health'),
        fetch('/api/v1/user')
      ])

      setHealth(await healthResponse.text())
      setUser(await userResponse.json())
    }
    void fetchHealth()
  }, [])

  return (
    <main style={{ display: 'flex' }}>
      <img alt="logo" src={logo} width={80} />
      <h1>
        Powercoach Manager #55
        <br />
        {health}
      </h1>
      <p>{user ? `${user.email} (${user.id})` : 'loading user'}</p>
    </main>
  )
}
