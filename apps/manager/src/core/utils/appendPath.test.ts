import { appendPath } from './appendPath'

describe('appendPath', () => {
  it('returns the parent path when the route path is missing', () => {
    expect(appendPath('/exercises')).toBe('/exercises')
  })

  it('returns the parent path when the route path is empty', () => {
    expect(appendPath('/exercises', '')).toBe('/exercises')
  })

  it('appends a relative route path', () => {
    expect(appendPath('/exercises', 'new')).toBe('/exercises/new')
  })

  it('appends to the root path without duplicating slashes', () => {
    expect(appendPath('/', 'exercises')).toBe('/exercises')
  })

  it('keeps absolute route paths unchanged', () => {
    expect(appendPath('/exercises', '/settings')).toBe('/settings')
  })
})
