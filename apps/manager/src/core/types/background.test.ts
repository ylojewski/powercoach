import { isBackgroundState } from './background'

describe('isBackgroundState', () => {
  const location = {
    hash: '',
    key: 'home',
    pathname: '/',
    search: '',
    state: null
  }

  it.each([
    null,
    'background',
    {},
    { location: null, params: {} },
    { location: '/', params: {} },
    { location: {}, params: {} },
    { location, params: undefined },
    { location, params: null },
    { location, params: [] }
  ])('rejects invalid background state', (state) => {
    expect(isBackgroundState(state)).toBe(false)
  })

  it('accepts a location and its route params', () => {
    expect(isBackgroundState({ location, params: {} })).toBe(true)
  })
})
