import { useMediaQuery } from '@powercoach/ui'
import { render } from '@testing-library/react'
import { type MockedFunction } from 'vitest'

import { SystemTheme } from './SystemTheme'

vi.mock('@powercoach/ui', () => ({
  useMediaQuery: vi.fn()
}))

const useMediaQueryMock = useMediaQuery as MockedFunction<typeof useMediaQuery>

describe('SystemTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    useMediaQueryMock.mockReset()
  })

  it('syncs the dark class from the system color scheme', () => {
    useMediaQueryMock.mockReturnValue(true)

    const { rerender } = render(<SystemTheme />)

    expect(document.documentElement.classList.contains('dark')).toBe(true)

    useMediaQueryMock.mockReturnValue(false)

    rerender(<SystemTheme />)

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
