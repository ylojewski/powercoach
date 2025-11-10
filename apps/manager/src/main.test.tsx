import { render, screen } from '@testing-library/react'
import { createRoot } from 'react-dom/client'
import { type MockedFunction } from 'vitest'

const createRootMock = createRoot as MockedFunction<typeof createRoot>
const renderMock = vi.fn()

vi.mock('react-dom/client', () => {
  const _createRoot = vi.fn().mockImplementation(() => ({
    render: renderMock
  }))
  return {
    createRoot: _createRoot,
    default: { createRoot: _createRoot }
  }
})

describe('main', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('boots app in #root with StrictMode enabled', async () => {
    render(<div id="root" data-testid="root"></div>)

    await import('./main')

    expect(createRootMock).toHaveBeenCalledExactlyOnceWith(await screen.findByTestId('root'))
    expect(renderMock).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        type: Symbol.for('react.strict_mode')
      })
    )
  })

  it('throws if #root is missing', async () => {
    render(<div></div>)

    await expect(import('./main')).rejects.toThrow(/Root element not found/i)
  })
})
