import { render, screen } from '@testing-library/react'

import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the logo with the default variant styles', () => {
    render(<Logo data-testid="logo" />)

    const logo = screen.getByTestId('logo')
    const className = logo.getAttribute('class') ?? ''

    expect(logo).toBeTruthy()
    expect(className).toContain('[&_.power]:fill-amber-500')
    expect(className).toContain('[&_.plate-left]:fill-amber-500')
    expect(className).toContain('[&_.extrusion]:fill-black')
    expect(className).toContain('[&_.coach]:fill-black')
    expect(className).toContain('[&_.plate-right]:fill-black')
  })

  it('applies the white variant and forwards svg props', () => {
    render(
      <Logo aria-label="Powercoach" className="custom-class" data-testid="logo" variant="white" />
    )

    const logo = screen.getByTestId('logo')
    const className = logo.getAttribute('class') ?? ''

    expect(logo.getAttribute('aria-label')).toBe('Powercoach')
    expect(className).toContain('custom-class')
    expect(className).toContain('[&_.coach]:fill-white')
    expect(className).toContain('[&_.plate-right]:fill-white')
    expect(className).toContain('dark:[&_.coach]:fill-black')
    expect(className).toContain('dark:[&_.plate-right]:fill-black')
  })
})
