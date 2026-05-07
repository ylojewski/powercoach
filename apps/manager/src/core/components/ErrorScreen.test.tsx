import { render, screen } from '@testing-library/react'

import { ErrorScreen } from './ErrorScreen'

describe('ErrorScreen', () => {
  it('displays the startup error content', () => {
    render(<ErrorScreen />)

    expect(screen.getByLabelText('failed to load powercoach')).toBeInTheDocument()
    expect(screen.getByText('failed to load powercoach')).toBeInTheDocument()
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument()
  })
})
