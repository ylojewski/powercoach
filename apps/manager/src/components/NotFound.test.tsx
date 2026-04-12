import { render, screen } from '@testing-library/react'

import { NotFound } from './NotFound'

describe('NotFound', () => {
  it('displays the not found content', () => {
    render(<NotFound />)
    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })
})
