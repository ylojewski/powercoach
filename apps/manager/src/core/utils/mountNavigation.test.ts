import { type NavigationState } from '../types'
import { mountNavigation } from './mountNavigation'

describe('mountNavigation', () => {
  it('mounts app and module navigation with route or explicit params', () => {
    const state = {
      homeDrawer: '/drawer',
      homeIndex: '/home',
      index: '/:section'
    } satisfies NavigationState
    const navigation = mountNavigation(state, { section: 'fallback' })
    const navigateToIndex = navigation.index as unknown as (
      params?: Readonly<Record<string, unknown>>
    ) => string

    expect(navigation.homeIndex()).toBe('/home')
    expect(navigateToIndex()).toBe('/fallback')
    expect(navigateToIndex({ section: 'explicit' })).toBe('/explicit')
  })
})
