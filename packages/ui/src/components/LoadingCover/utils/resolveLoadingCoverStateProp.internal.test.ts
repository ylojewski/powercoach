import { describe, expect, it } from 'vitest'

import { resolveLoadingCoverStateProp } from './resolveLoadingCoverStateProp'

describe('resolveLoadingCoverStateProp', () => {
  it('returns literal values unchanged', () => {
    expect(resolveLoadingCoverStateProp('literal', { active: false })).toBe('literal')
  })

  it('resolves callback values from state', () => {
    expect(
      resolveLoadingCoverStateProp((state: { active: boolean }) => state.active, {
        active: true
      })
    ).toBe(true)
  })
})
