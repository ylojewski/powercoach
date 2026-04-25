import { render, screen } from '@testing-library/react'

import { RosterSidebarAvatar } from './RosterSidebarAvatar'

describe('RosterSidebarAvatar', () => {
  it('renders the avatar label and initials', () => {
    render(<RosterSidebarAvatar initials="KF" label="Kiro Flux" />)

    expect(screen.getByRole('img', { name: 'Kiro Flux' })).toHaveAttribute('title', 'Kiro Flux')
    expect(screen.getByText('KF')).toBeInTheDocument()
  })

  it('applies the roster avatar styles', () => {
    render(<RosterSidebarAvatar initials="PC" label="Powercoach" />)

    const avatar = screen.getByRole('img', { name: 'Powercoach' })

    expect(avatar).toHaveClass('size-8')
    expect(avatar).toHaveClass('rounded-none')
    expect(avatar).toHaveClass('border')
  })
})
