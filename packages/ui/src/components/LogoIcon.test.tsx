import { render, screen } from '@testing-library/react'

import { LogoIcon } from './LogoIcon'

describe('LogoIcon', () => {
  it('renders the logo icon with the default variant styles', () => {
    render(<LogoIcon />)

    const logoIcon = screen.getByTestId('logo-icon')
    const className = logoIcon.getAttribute('class') ?? ''

    expect(logoIcon).toBeTruthy()
    expect(className).toContain('[&_.container]:fill-foreground')
  })

  it('applies the white variant and forwards svg props', () => {
    render(
      <LogoIcon
        aria-label="Powercoach icon"
        className="custom-class"
        data-testid="logo-icon"
        variant="foreground"
      />
    )

    const logoIcon = screen.getByTestId('logo-icon')
    const className = logoIcon.getAttribute('class') ?? ''

    expect(logoIcon.getAttribute('aria-label')).toBe('Powercoach icon')
    expect(className).toContain('custom-class')
    expect(className).toContain('[&_.container]:fill-foreground custom-class')
  })

  it('applies the background variant styles', () => {
    render(<LogoIcon variant="background" />)

    const logoIcon = screen.getByTestId('logo-icon')
    const className = logoIcon.getAttribute('class') ?? ''

    expect(className).toContain('[&_.container]:fill-background')
  })
})
