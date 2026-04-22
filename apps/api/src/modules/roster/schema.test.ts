import { parseOrganizationId, type RosterQuerystring } from './schemas'

describe('parseOrganizationId', () => {
  it('returns undefined when organizationId is missing', () => {
    expect(parseOrganizationId({})).toBeUndefined()
  })
  it('parses organizationId when it is provided', () => {
    const query: RosterQuerystring = { organizationId: '42' }
    expect(parseOrganizationId(query)).toBe(42)
  })
})
