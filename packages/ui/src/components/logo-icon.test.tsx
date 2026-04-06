import { render, screen } from '@testing-library/react'

import { LogoIcon } from './logo-icon'

describe('LogoIcon', () => {
  it('renders the logo icon with the default variant styles', () => {
    render(<LogoIcon data-testid="logo-icon" />)

    const logoIcon = screen.getByTestId('logo-icon')
    const className = logoIcon.getAttribute('class') ?? ''

    expect(logoIcon).toBeTruthy()
    expect(className).toContain('[&_.container]:fill-black')
    expect(className).toContain('dark:[&_.container]:fill-white')
  })

  it('applies the white variant and forwards svg props', () => {
    render(
      <LogoIcon
        aria-label="Powercoach icon"
        className="custom-class"
        data-testid="logo-icon"
        variant="white"
      />
    )

    const logoIcon = screen.getByTestId('logo-icon')
    const className = logoIcon.getAttribute('class') ?? ''

    expect(logoIcon.getAttribute('aria-label')).toBe('Powercoach icon')
    expect(className).toContain('custom-class')
    expect(className).toContain('[&_.container]:fill-white')
    expect(className).toContain('dark:[&_.container]:fill-black')
  })
})
