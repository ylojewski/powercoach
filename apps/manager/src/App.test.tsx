import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

import { App } from './App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        text: async () => 'ok'
      })) as unknown as typeof fetch
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the logo', async () => {
    render(<App />)

    expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument()
    await screen.findByText(/ok/i)
  })
})
