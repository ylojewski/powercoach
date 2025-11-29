import * as db from '@powercoach/db'
import { describe, expect, it, vi } from 'vitest'

import { getUserProfile } from './service'

describe('getUserProfile', () => {
  const user = {
    email: 'user@power.coach',
    id: '11111111-1111-4111-8111-111111111111'
  }

  it('returns the first available user', async () => {
    vi.spyOn(db, 'fetchFirstUser').mockResolvedValue(user)

    await expect(getUserProfile()).resolves.toStrictEqual(user)
  })

  it('falls back to a demo user on error', async () => {
    vi.spyOn(db, 'fetchFirstUser').mockRejectedValue(new Error('no db'))

    await expect(getUserProfile()).resolves.toStrictEqual(db.fallbackUser)
  })
})
