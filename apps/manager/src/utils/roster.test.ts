import { getInitials } from './roster'

describe('getInitials', () => {
  it('uses the first and last words for multi-word names', () => {
    expect(getInitials('Orbit Foundry')).toBe('OF')
  })

  it('uses the first two letters for single-word names', () => {
    expect(getInitials('Solo')).toBe('SO')
  })

  it('drops the email domain before computing initials', () => {
    expect(getInitials('astra.quill@example.test')).toBe('AQ')
  })

  it('removes apostrophes before computing initials', () => {
    expect(getInitials("O'Connor")).toBe('OC')
  })

  it('supports unicode letters', () => {
    expect(getInitials('Élodie Durand')).toBe('ÉD')
  })

  it('returns an empty string when no letters are available', () => {
    expect(getInitials('@42')).toBe('')
  })
})
