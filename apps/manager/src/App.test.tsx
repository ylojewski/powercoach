import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

import { App } from './App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = input.toString()

        if (url.endsWith('/health')) {
          return {
            text: async () => 'ok'
          }
        }

        return {
          json: async () => ({
            email: 'manager@power.coach',
            id: '00000000-0000-4000-8000-000000000000'
          })
        }
      }) as unknown as typeof fetch
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the logo', async () => {
    render(<App />)

    expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument()
    await screen.findByText(/ok/i)
    await screen.findByText(/manager@power.coach/i)
  })
})
