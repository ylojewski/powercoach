import { api } from '@/core'

import { createStore } from './store'

describe('createStore', () => {
  it('wires the core reducer into a fresh store', () => {
    const store = createStore()
    expect(store.getState()).toMatchObject({
      [api.reducerPath]: expect.any(Object),
      navigation: {
        homeDrawer: '/drawer',
        homeIndex: '/',
        index: '/'
      }
    })
  })

  it('returns isolated store instances', () => {
    const firstStore = createStore()
    const secondStore = createStore()
    expect(firstStore).not.toBe(secondStore)
  })
})
