import { resolveAvatarMenuClassName } from './resolveAvatarMenuClassName'

describe('resolveAvatarMenuClassName', () => {
  it('resolves callback conflicts after defaults', () => {
    expect(resolveAvatarMenuClassName(() => 'flex-row', {}, 'flex-col')).toBe('flex-row')
  })

  it('keeps protected safety conflicts last', () => {
    expect(
      resolveAvatarMenuClassName('pointer-events-auto', undefined, undefined, 'pointer-events-none')
    ).toBe('pointer-events-none')
  })
})
