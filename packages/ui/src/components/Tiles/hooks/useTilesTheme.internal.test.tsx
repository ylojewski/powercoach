import { render } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import { useTilesTheme } from './useTilesTheme'

describe('useTilesTheme', () => {
  afterEach(() => {
    document.body.classList.remove('dark')
  })

  it('inverts an initially dark body for a detached theme boundary', () => {
    const container = document.createElement('div')

    document.body.classList.add('dark')

    function ThemeProbe() {
      const ref = useRef<HTMLDivElement>(null)
      const theme = useTilesTheme(ref, 'inverse')

      return (
        <div className={theme} ref={ref}>
          {theme}
        </div>
      )
    }

    const rendered = render(<ThemeProbe />, { container })

    expect(rendered.getByText('light')).toHaveClass('light')
  })
})
