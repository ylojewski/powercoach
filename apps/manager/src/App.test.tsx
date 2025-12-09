import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

import { App } from './App'
import { theme } from './theme'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({ apiProperty: true })
      })) as unknown as typeof fetch
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('displays the logo', async () => {
    render(
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    )
    await screen.findByText(/apiProperty/i)
  })
})
