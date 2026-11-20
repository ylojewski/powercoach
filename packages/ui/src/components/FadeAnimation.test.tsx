import { render, screen, waitFor } from '@testing-library/react'

import { FadeAnimation } from './FadeAnimation'

describe('FadeAnimation', () => {
  it('mounts visible content and removes it after the exit transition', async () => {
    const { rerender } = render(
      <FadeAnimation className="inline-flex" show>
        Saved
      </FadeAnimation>
    )

    expect(screen.getByText('Saved')).toHaveClass('inline-flex')

    await waitFor(() => expect(screen.getByText('Saved')).toHaveStyle({ opacity: '1' }))

    rerender(<FadeAnimation show={false}>Saved</FadeAnimation>)

    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument())
  })

  it('starts hidden and accepts an explicit transition duration', async () => {
    const { rerender } = render(
      <FadeAnimation duration={0} show={false}>
        Saved
      </FadeAnimation>
    )

    expect(screen.queryByText('Saved')).not.toBeInTheDocument()

    rerender(
      <FadeAnimation duration={0} show>
        Saved
      </FadeAnimation>
    )

    await waitFor(() => expect(screen.getByText('Saved')).toHaveStyle({ opacity: '1' }))
  })
})
