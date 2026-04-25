import { PRIMARY_ATHLETE_RESPONSE } from '@powercoach/util-fixture'

import { createStore } from '@/src/store'

import { activateAthlete, rosterReducer, selectActivatedAthlete } from './roster'

describe('roster', () => {
  it('initializes with no activated athlete', () => {
    expect(rosterReducer(undefined, { type: 'unknown' })).toStrictEqual({
      activatedAthlete: null
    })
  })

  it('stores the activated athlete when requested', () => {
    expect(rosterReducer(undefined, activateAthlete(PRIMARY_ATHLETE_RESPONSE))).toStrictEqual({
      activatedAthlete: PRIMARY_ATHLETE_RESPONSE
    })
  })

  it('clears the activated athlete when null is provided', () => {
    const state = rosterReducer(
      { activatedAthlete: PRIMARY_ATHLETE_RESPONSE },
      activateAthlete(null)
    )

    expect(state).toStrictEqual({ activatedAthlete: null })
  })

  it('selects the activated athlete from the store', () => {
    const store = createStore()

    store.dispatch(activateAthlete(PRIMARY_ATHLETE_RESPONSE))

    expect(selectActivatedAthlete(store.getState())).toStrictEqual(PRIMARY_ATHLETE_RESPONSE)
  })
})
