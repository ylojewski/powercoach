import { PRIMARY_ATHLETE_RESPONSE } from '@powercoach/util-fixture'

import { Athlete } from '@/src/api'

import { getAthleteSlug } from './getAthleteSlug'

describe('getAthleteSlug', () => {
  it('slugifies an athlete full name', () => {
    expect(getAthleteSlug(PRIMARY_ATHLETE_RESPONSE)).toBe('kiro-flux')
  })

  it('normalizes accents and punctuation', () => {
    expect(getAthleteSlug({ firstName: 'Élodie', lastName: "O'Connor" } as Athlete)).toBe(
      'elodie-o-connor'
    )
  })
})
